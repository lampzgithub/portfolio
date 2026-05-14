import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

const empty = {
  title: '',
  tagline: '',
  description: '',
  stack: '',
  period: '',
  role: '',
  highlights: '',
  link: '',
  github: '',
  order: 0
};

export default function Admin() {
  const { logout, user } = useAuth();
  const nav = useNavigate();
  const [projects, setProjects] = useState([]);
  const [editing, setEditing] = useState(null); // null | 'new' | id
  const [form, setForm] = useState(empty);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const load = () =>
    api.getProjects().then(setProjects).catch((e) => setErr(e.message));

  useEffect(() => {
    load();
  }, []);

  const startNew = () => {
    setEditing('new');
    setForm(empty);
    setMsg('');
    setErr('');
  };

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
      link: p.link || '',
      github: p.github || '',
      order: p.order || 0
    });
    setMsg('');
    setErr('');
  };

  const cancel = () => {
    setEditing(null);
    setForm(empty);
  };

  const save = async (e) => {
    e.preventDefault();
    setErr('');
    setMsg('');
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
      await load();
      setEditing(null);
      setForm(empty);
    } catch (e) {
      setErr(e.message);
    }
  };

  const remove = async (id) => {
    if (!confirm('delete this project?')) return;
    try {
      await api.deleteProject(id);
      await load();
    } catch (e) {
      setErr(e.message);
    }
  };

  const signOut = () => {
    logout();
    nav('/');
  };

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

      {err && <div className="error" style={{ marginBottom: 16 }}>{err}</div>}
      {msg && <div className="success" style={{ marginBottom: 16 }}>{msg}</div>}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
        <h2 style={{ fontSize: 22, fontWeight: 400, letterSpacing: '-0.01em' }}>
          Projects ({projects.length})
        </h2>
        {editing === null && (
          <button className="btn" onClick={startNew}>+ new project</button>
        )}
      </div>

      {editing !== null && (
        <div className="editor">
          <h3>{editing === 'new' ? 'New project' : 'Edit project'}</h3>
          <form onSubmit={save}>
            <div className="field">
              <label>title</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="field">
              <label>tagline (one-line summary)</label>
              <input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
            </div>
            <div className="field">
              <label>description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
              />
            </div>
            <div className="field">
              <label>highlights (one per line — what you did, results)</label>
              <textarea
                value={form.highlights}
                onChange={(e) => setForm({ ...form, highlights: e.target.value })}
              />
            </div>
            <div className="field">
              <label>stack / tech (comma separated)</label>
              <input value={form.stack} onChange={(e) => setForm({ ...form, stack: e.target.value })} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div className="field">
                <label>period (e.g. 2023 – 2024)</label>
                <input value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} />
              </div>
              <div className="field">
                <label>role</label>
                <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div className="field">
                <label>live link (optional)</label>
                <input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} />
              </div>
              <div className="field">
                <label>github (optional)</label>
                <input value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })} />
              </div>
            </div>
            <div className="field">
              <label>order (lower shows first)</label>
              <input
                type="number"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: e.target.value })}
              />
            </div>
            <div className="btn-row">
              <button className="btn" type="submit">
                {editing === 'new' ? 'create' : 'save changes'}
              </button>
              <button className="btn ghost" type="button" onClick={cancel}>cancel</button>
            </div>
          </form>
        </div>
      )}

      {editing === null && (
        <div>
          {projects.length === 0 && (
            <p style={{ color: 'var(--muted)', fontStyle: 'italic', padding: '40px 0' }}>
              No projects yet. Click "new project" above.
            </p>
          )}
          {projects.map((p, i) => (
            <div className="admin-row" key={p._id}>
              <span className="idx">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h4>{p.title}</h4>
                <div className="tag">{p.tagline || '—'}</div>
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
  );
}
