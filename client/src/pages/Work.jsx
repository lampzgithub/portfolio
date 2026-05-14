import { useEffect, useState } from 'react';
import Nav from '../components/Nav.jsx';
import Footer from '../components/Footer.jsx';
import { api } from '../api.js';

export default function Work() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getProjects()
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <Nav />

      <header className="hero wrap" style={{ paddingBottom: 60 }}>
        <div className="label">SB — work archive</div>
        <h1>
          Things I've built,<br />
          <em>shipped, or sold.</em>
        </h1>
        <p className="sub">
          The full list. Some made money, some didn't, some I'd do differently
          now. All taught me something.
        </p>
      </header>

      <section style={{ padding: '40px 0 80px' }}>
        <div className="wrap">
          {loading && <p style={{ color: 'var(--muted)' }}>Loading…</p>}
          {!loading && projects.length === 0 && (
            <p style={{ color: 'var(--muted)', fontStyle: 'italic' }}>
              Nothing here yet.
            </p>
          )}
          {projects.map((p, i) => (
            <article className="proj-detail" key={p._id}>
              <div className="head">
                <h2>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--muted)', marginRight: 14 }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {p.title}
                </h2>
                <div className="meta-block">
                  {p.period && <div><strong>When</strong> · {p.period}</div>}
                  {p.role && <div><strong>Role</strong> · {p.role}</div>}
                </div>
              </div>

              {p.tagline && (
                <p style={{ fontSize: 19, fontStyle: 'italic', color: 'var(--muted)', marginBottom: 22 }}>
                  {p.tagline}
                </p>
              )}

              <p className="desc">{p.description}</p>

              {p.highlights?.length > 0 && (
                <ul className="highlights">
                  {p.highlights.map((h, idx) => (
                    <li key={idx}>{h}</li>
                  ))}
                </ul>
              )}

              {p.stack?.length > 0 && (
                <div className="stack">
                  {p.stack.map((s, idx) => (
                    <span key={idx}>{s}</span>
                  ))}
                </div>
              )}

              {(p.link || p.github) && (
                <div className="links">
                  {p.link && (
                    <a href={p.link} target="_blank" rel="noreferrer">
                      visit →
                    </a>
                  )}
                  {p.github && (
                    <a href={p.github} target="_blank" rel="noreferrer">
                      source →
                    </a>
                  )}
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
