import { useEffect, useState } from 'react';
import Nav from '../components/Nav.jsx';
import Footer from '../components/Footer.jsx';
import Lightbox from '../components/Lightbox.jsx';
import { api, API_BASE } from '../api.js';

function fullUrl(u) {
  if (!u) return '';
  if (u.startsWith('http://') || u.startsWith('https://')) return u;
  return `${API_BASE}${u}`;
}

export default function Work() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);
  const [lb, setLb] = useState({ open: false, images: [], index: 0 });

  useEffect(() => {
    api
      .getProjects()
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const openLightbox = (allImages, index) =>
    setLb({ open: true, images: allImages.map(fullUrl), index });
  const closeLb = () => setLb((s) => ({ ...s, open: false }));

  const active = projects[activeIdx];

  return (
    <>
      <Nav />

      <header className="hero" style={{ paddingBottom: 60 }}>
        <div className="wrap">
          <div className="label">SB — work archive</div>
          <h1>
            <span className="glitch" data-text="Things">Things</span>{' '}
            I've built,<br />
            <span className="accent">shipped, or sold.</span>
          </h1>
          <p className="sub" style={{ marginTop: 18 }}>
            The full list. Some made money, some didn't, some I'd do differently
            now. All taught me something.
          </p>
        </div>
      </header>

      <section style={{ padding: '24px 0 80px' }}>
        <div className="wrap">
          {loading && <p style={{ color: 'var(--muted)' }}>Loading…</p>}
          {!loading && projects.length === 0 && (
            <p style={{ color: 'var(--muted)', fontStyle: 'italic' }}>
              Nothing here yet.
            </p>
          )}

          {projects.length > 0 && (
            <div className="work-tabs" role="tablist">
              {projects.map((p, i) => (
                <button
                  key={p._id}
                  role="tab"
                  aria-selected={i === activeIdx}
                  className={`work-tab ${i === activeIdx ? 'active' : ''}`}
                  onClick={() => setActiveIdx(i)}
                >
                  <span className="work-tab-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="work-tab-title">{p.title}</span>
                </button>
              ))}
            </div>
          )}

          {active && (() => {
            const imageBlocks = (active.blocks || []).filter((b) => b.type === 'image').map((b) => b.content);
            const imageIndexInGallery = (idx) => {
              let count = 0;
              for (let k = 0; k < (active.blocks || []).length; k++) {
                if (active.blocks[k].type !== 'image') continue;
                if (k === idx) return count;
                count++;
              }
              return 0;
            };

            return (
              <article className="proj-detail" key={active._id}>
                <div className="head">
                  <h2>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--muted)', marginRight: 14 }}>
                      {String(activeIdx + 1).padStart(2, '0')}
                    </span>
                    {active.title}
                  </h2>
                  <div className="meta-block">
                    {active.period && <div><strong>When</strong> · {active.period}</div>}
                    {active.role && <div><strong>Role</strong> · {active.role}</div>}
                  </div>
                </div>

                {active.tagline && (
                  <p style={{ fontSize: 19, fontStyle: 'italic', color: 'var(--muted)', marginBottom: 22 }}>
                    {active.tagline}
                  </p>
                )}

                <p className="desc">{active.description}</p>

                {active.highlights?.length > 0 && (
                  <ul className="highlights">
                    {active.highlights.map((h, idx) => (
                      <li key={idx}>{h}</li>
                    ))}
                  </ul>
                )}

                {active.blocks?.length > 0 && (
                  <div className="post-body">
                    {active.blocks.map((bl, idx) => {
                      const size = bl.size || 'medium';
                      if (bl.type === 'text') {
                        return (
                          <p className={`post-text size-${size}`} key={idx}>
                            {bl.content}
                          </p>
                        );
                      }
                      if (bl.type === 'image' && bl.content) {
                        const galleryIdx = imageIndexInGallery(idx);
                        return (
                          <figure
                            className={`post-image size-${size}`}
                            key={idx}
                            onClick={() => openLightbox(imageBlocks, galleryIdx)}
                          >
                            <img src={fullUrl(bl.content)} alt="" />
                          </figure>
                        );
                      }
                      return null;
                    })}
                  </div>
                )}

                {active.stack?.length > 0 && (
                  <div className="stack">
                    {active.stack.map((s, idx) => (
                      <span key={idx}>{s}</span>
                    ))}
                  </div>
                )}

                {(active.link || active.github) && (
                  <div className="links">
                    {active.link && (
                      <a href={active.link} target="_blank" rel="noreferrer">
                        visit →
                      </a>
                    )}
                    {active.github && (
                      <a href={active.github} target="_blank" rel="noreferrer">
                        source →
                      </a>
                    )}
                  </div>
                )}
              </article>
            );
          })()}
        </div>
      </section>

      {lb.open && (
        <Lightbox
          images={lb.images}
          index={lb.index}
          onClose={closeLb}
          onChange={(i) => setLb((s) => ({ ...s, index: i }))}
        />
      )}

      <Footer />
    </>
  );
}
