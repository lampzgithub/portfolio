import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

const emptyProject = {
  title: '', tagline: '', description: '', stack: '', period: '', role: '',
  highlights: '', images: [], link: '', github: '', order: 0
};

const emptyCfg = {
  hero: { eyebrow: '', tagline: '', sub: '', badges: [] },
  about: { paragraphs: [], sidebar: [] },
  stack: [],
  contact: { lead: '', email: '', github: '', phone: '' }
};

export default function Admin() {
  const { logout, user } = useAuth();
  const nav = useNavigate();
  const [tab, setTab] = useState('projects');

  // projects state
  const [projects, setProjects] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyProject);
  const [urlInput, setUrlInput] = useState('');
  const [uploading, setUploading] = useState(false);

  // config state
  const [cfg, setCfg] = useState(emptyCfg);

  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const loadProjects = () => api.getProjects().then(setProjects).catch((e) => setErr(e.message));
  const loadConfig = () =>
    api.getConfig().then((c) => setCfg({
      hero: { eyebrow: '', tagline: '', sub: '', badges: [], ...(c.hero || {}) },
      about: {
        paragraphs: c.about?.paragraphs || [],
        sidebar: c.about?.sidebar || []
      },
      stack: c.stack || [],
      contact: { lead: '', email: '', github: '', phone: '', ...(c.contact || {}) }
    })).catch((e) => setErr(e.message));

  useEffect(() => {
    loadProjects();
    loadConfig();
  }, []);

  const clearMsg = () => { setMsg(''); setErr(''); };

  // ── PROJECTS ──
  const startNew = () => { setEditing('new'); setForm(emptyProject); clearMsg(); };
  const startEdit = (p) => {
    setEditing(p._id);
    setForm({
      title: p.title || '',
      tagline: p.tagline || '',
      description: p.description || '',
      stack: (p.stack || []).join(', '),
      period: p.period || '',
      role: p.role || '',
      highlights: (p.highlights || []).join('\n'),
      images: p.images || [],
      link: p.link || '',
      github: p.github || '',
      order: p.order || 0
    });
    clearMsg();
  };
  const cancel = () => { setEditing(null); setForm(emptyProject); };

  const addUrl = () => {
    const u = urlInput.trim();
    if (!u) return;
    setForm({ ...form, images: [...form.images, u] });
    setUrlInput('');
  };
  const removeImg = (idx) => setForm({ ...form, images: form.images.filter((_, i) => i !== idx) });
  const onFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploading(true);
    setErr('');
    try {
      const fd = new FormData();
      files.forEach((f) => fd.append('images', f));
      const { urls } = await api.uploadImages(fd);
      setForm((cur) => ({ ...cur, images: [...cur.images, ...urls] }));
    } catch (ex) {
      setErr(ex.message);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const saveProject = async (e) => {
    e.preventDefault();
    clearMsg();
    const payload = {
      ...form,
      stack: form.stack.split(',').map((s) => s.trim()).filter(Boolean),
      highlights: form.highlights.split('\n').map((s) => s.trim()).filter(Boolean),
      order: Number(form.order) || 0
    };
    try {
      if (editing === 'new') {
        await api.createProject(payload);
        setMsg('created');
      } else {
        await api.updateProject(editing, payload);
        setMsg('saved');
      }
      await loadProjects();
      setEditing(null);
      setForm(emptyProject);
    } catch (ex) { setErr(ex.message); }
  };
  const remove = async (id) => {
    if (!confirm('delete this project?')) return;
    try { await api.deleteProject(id); await loadProjects(); }
    catch (ex) { setErr(ex.message); }
  };

  // ── CONFIG ──
  const saveConfig = async () => {
    clearMsg();
    try {
      await api.updateConfig(cfg);
      setMsg('site content saved');
      await loadConfig();
    } catch (ex) { setErr(ex.message); }
  };

  const updHero = (k, v) => setCfg({ ...cfg, hero: { ...cfg.hero, [k]: v } });
  const updContact = (k, v) => setCfg({ ...cfg, contact: { ...cfg.contact, [k]: v } });

  const addBadge = () => updHero('badges', [...cfg.hero.badges, { label: '', color: 'purple' }]);
  const updBadge = (i, k, v) => updHero('badges', cfg.hero.badges.map((b, idx) => idx === i ? { ...b, [k]: v } : b));
  const rmBadge = (i) => updHero('badges', cfg.hero.badges.filter((_, idx) => idx !== i));

  const addPara = () => setCfg({ ...cfg, about: { ...cfg.about, paragraphs: [...cfg.about.paragraphs, ''] } });
  const updPara = (i, v) => setCfg({ ...cfg, about: { ...cfg.about, paragraphs: cfg.about.paragraphs.map((p, idx) => idx === i ? v : p) } });
  const rmPara = (i) => setCfg({ ...cfg, about: { ...cfg.about, paragraphs: cfg.about.paragraphs.filter((_, idx) => idx !== i) } });

  const addSidebar = () => setCfg({ ...cfg, about: { ...cfg.about, sidebar: [...cfg.about.sidebar, { key: '', value: '' }] } });
  const updSidebar = (i, k, v) => setCfg({ ...cfg, about: { ...cfg.about, sidebar: cfg.about.sidebar.map((s, idx) => idx === i ? { ...s, [k]: v } : s) } });
  const rmSidebar = (i) => setCfg({ ...cfg, about: { ...cfg.about, sidebar: cfg.about.sidebar.filter((_, idx) => idx !== i) } });

  const addCat = () => setCfg({ ...cfg, stack: [...cfg.stack, { category: '', color: 'purple', items: [] }] });
  const updCat = (i, k, v) => setCfg({ ...cfg, stack: cfg.stack.map((c, idx) => idx === i ? { ...c, [k]: v } : c) });
  const rmCat = (i) => setCfg({ ...cfg, stack: cfg.stack.filter((_, idx) => idx !== i) });

  const signOut = () => { logout(); nav('/'); };

  return (
    <div className="wrap" style={{ paddingBottom: 80 }}>
      <div className="admin-head">
        <div>
          <h1>Admin</h1>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>
            signed in as {user}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn ghost" onClick={() => nav('/')}>view site</button>
          <button className="btn ghost" onClick={signOut}>sign out</button>
        </div>
      </div>

      <div className="admin-tabs">
        {['projects', 'content', 'stack', 'contact'].map((t) => (
          <div key={t} className={`admin-tab ${tab === t ? 'active' : ''}`} onClick={() => { setTab(t); clearMsg(); }}>
            {t === 'content' ? 'site content' : t}
          </div>
        ))}
      </div>

      {err && <div className="error" style={{ marginBottom: 16 }}>{err}</div>}
      {msg && <div className="success" style={{ marginBottom: 16 }}>{msg}</div>}

      {/* ── PROJECTS TAB ── */}
      {tab === 'projects' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
            <h2 style={{ fontSize: 22, fontWeight: 500, letterSpacing: '-0.01em', color: 'var(--text)' }}>
              Projects ({projects.length})
            </h2>
            {editing === null && <button className="btn" onClick={startNew}>+ new project</button>}
          </div>

          {editing !== null && (
            <div className="editor">
              <h3>{editing === 'new' ? 'New project' : 'Edit project'}</h3>
              <form onSubmit={saveProject}>
                <div className="field"><label>title</label>
                  <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
                <div className="field"><label>tagline</label>
                  <input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} /></div>
                <div className="field"><label>description</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required /></div>
                <div className="field"><label>highlights (one per line)</label>
                  <textarea value={form.highlights} onChange={(e) => setForm({ ...form, highlights: e.target.value })} /></div>
                <div className="field"><label>stack (comma separated)</label>
                  <input value={form.stack} onChange={(e) => setForm({ ...form, stack: e.target.value })} /></div>

                <div className="field">
                  <label>images</label>
                  <div className="img-upload-zone">
                    <span className="lbl">Add by URL</span>
                    <div className="url-row">
                      <input
                        type="url"
                        placeholder="https://i.imgur.com/..."
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                      />
                      <button type="button" className="btn ghost" onClick={addUrl}>add url</button>
                    </div>
                    <span className="lbl">Or upload files (max 5MB each, up to 10)</span>
                    <input type="file" accept="image/*" multiple onChange={onFiles} disabled={uploading} />
                    {uploading && <div style={{ marginTop: 8, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--cyan)' }}>uploading…</div>}
                    <div className="img-chips">
                      {form.images.map((img, idx) => (
                        <span className="img-chip" key={idx}>
                          {img.length > 36 ? img.slice(0, 32) + '…' : img}
                          <button type="button" onClick={() => removeImg(idx)}>×</button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <div className="field"><label>period</label>
                    <input value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} /></div>
                  <div className="field"><label>role</label>
                    <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} /></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <div className="field"><label>live link</label>
                    <input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} /></div>
                  <div className="field"><label>github</label>
                    <input value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })} /></div>
                </div>
                <div className="field"><label>order</label>
                  <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} /></div>
                <div className="btn-row">
                  <button className="btn" type="submit">{editing === 'new' ? 'create' : 'save changes'}</button>
                  <button className="btn ghost" type="button" onClick={cancel}>cancel</button>
                </div>
              </form>
            </div>
          )}

          {editing === null && (
            <div>
              {projects.length === 0 && (
                <p style={{ color: 'var(--muted)', fontStyle: 'italic', padding: '40px 0' }}>
                  No projects yet.
                </p>
              )}
              {projects.map((p, i) => (
                <div className="admin-row" key={p._id}>
                  <span className="idx">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h4>{p.title}</h4>
                    <div className="tag">{p.tagline || '—'} · {p.images?.length || 0} image(s)</div>
                  </div>
                  <div className="actions">
                    <button onClick={() => startEdit(p)}>edit</button>
                    <button className="del" onClick={() => remove(p._id)}>delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── SITE CONTENT TAB ── */}
      {tab === 'content' && (
        <div className="editor">
          <h3>Site Content</h3>

          <div className="field"><label>hero eyebrow</label>
            <input value={cfg.hero.eyebrow} onChange={(e) => updHero('eyebrow', e.target.value)} /></div>
          <div className="field"><label>hero tagline</label>
            <input value={cfg.hero.tagline} onChange={(e) => updHero('tagline', e.target.value)} /></div>
          <div className="field"><label>hero sub-text</label>
            <textarea value={cfg.hero.sub} onChange={(e) => updHero('sub', e.target.value)} /></div>

          <div className="field">
            <label>hero badges</label>
            <div className="sub-list">
              {cfg.hero.badges.map((b, i) => (
                <div className="sub-row three" key={i}>
                  <input placeholder="label" value={b.label} onChange={(e) => updBadge(i, 'label', e.target.value)} />
                  <span style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>color</span>
                  <select value={b.color} onChange={(e) => updBadge(i, 'color', e.target.value)}>
                    <option value="purple">purple</option>
                    <option value="cyan">cyan</option>
                    <option value="pink">pink</option>
                  </select>
                  <button type="button" className="rm" onClick={() => rmBadge(i)}>×</button>
                </div>
              ))}
            </div>
            <button type="button" className="btn ghost" onClick={addBadge}>+ add badge</button>
          </div>

          <div className="field">
            <label>about paragraphs</label>
            <div className="sub-list">
              {cfg.about.paragraphs.map((p, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8 }}>
                  <textarea value={p} onChange={(e) => updPara(i, e.target.value)} />
                  <button type="button" className="rm" onClick={() => rmPara(i)}>×</button>
                </div>
              ))}
            </div>
            <button type="button" className="btn ghost" onClick={addPara}>+ add paragraph</button>
          </div>

          <div className="field">
            <label>about sidebar</label>
            <div className="sub-list">
              {cfg.about.sidebar.map((s, i) => (
                <div className="sub-row two" key={i}>
                  <input placeholder="key (e.g. Currently)" value={s.key} onChange={(e) => updSidebar(i, 'key', e.target.value)} />
                  <input placeholder="value" value={s.value} onChange={(e) => updSidebar(i, 'value', e.target.value)} />
                  <button type="button" className="rm" onClick={() => rmSidebar(i)}>×</button>
                </div>
              ))}
            </div>
            <button type="button" className="btn ghost" onClick={addSidebar}>+ add sidebar item</button>
          </div>

          <div className="btn-row">
            <button type="button" className="btn" onClick={saveConfig}>save site content</button>
          </div>
        </div>
      )}

      {/* ── STACK TAB ── */}
      {tab === 'stack' && (
        <div className="editor">
          <h3>Stack categories</h3>
          {cfg.stack.map((c, i) => (
            <div key={i} style={{ border: '1px solid var(--border)', padding: 16, marginBottom: 12 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px auto', gap: 8, marginBottom: 12 }}>
                <input placeholder="category name" value={c.category} onChange={(e) => updCat(i, 'category', e.target.value)} />
                <select value={c.color} onChange={(e) => updCat(i, 'color', e.target.value)}>
                  <option value="purple">purple</option>
                  <option value="cyan">cyan</option>
                  <option value="pink">pink</option>
                  <option value="green">green</option>
                </select>
                <button type="button" className="rm" onClick={() => rmCat(i)}>remove category</button>
              </div>
              <div className="field" style={{ marginBottom: 0 }}>
                <label>items (one per line)</label>
                <textarea
                  value={(c.items || []).join('\n')}
                  onChange={(e) => updCat(i, 'items', e.target.value.split('\n').map((s) => s.trim()).filter(Boolean))}
                />
              </div>
            </div>
          ))}
          <button type="button" className="btn ghost" onClick={addCat}>+ add category</button>
          <div className="btn-row">
            <button type="button" className="btn" onClick={saveConfig}>save stack</button>
          </div>
        </div>
      )}

      {/* ── CONTACT TAB ── */}
      {tab === 'contact' && (
        <div className="editor">
          <h3>Contact</h3>
          <div className="field"><label>lead text</label>
            <textarea value={cfg.contact.lead} onChange={(e) => updContact('lead', e.target.value)} /></div>
          <div className="field"><label>email</label>
            <input value={cfg.contact.email} onChange={(e) => updContact('email', e.target.value)} /></div>
          <div className="field"><label>github URL</label>
            <input value={cfg.contact.github} onChange={(e) => updContact('github', e.target.value)} /></div>
          <div className="field"><label>phone</label>
            <input value={cfg.contact.phone} onChange={(e) => updContact('phone', e.target.value)} /></div>
          <div className="btn-row">
            <button type="button" className="btn" onClick={saveConfig}>save contact</button>
          </div>
        </div>
      )}
    </div>
  );
}
