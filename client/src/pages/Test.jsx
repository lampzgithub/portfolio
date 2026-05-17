import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import './test.css';

const FALLBACK_CFG = {
  hero: {
    eyebrow: '01 — portfolio · 2026',
    tagline: 'Builder of things on the internet.',
    sub: '',
    badges: [
      { label: 'Delhi, India', color: 'purple' },
      { label: 'BCA · GGSIPU', color: 'cyan' },
      { label: 'Open to work', color: 'pink' }
    ]
  },
  contact: { email: '', github: '', phone: '', lead: '' }
};

function mergeCfg(remote) {
  if (!remote) return FALLBACK_CFG;
  return {
    hero: { ...FALLBACK_CFG.hero, ...(remote.hero || {}),
      badges: remote.hero?.badges?.length ? remote.hero.badges : FALLBACK_CFG.hero.badges },
    contact: { ...FALLBACK_CFG.contact, ...(remote.contact || {}) }
  };
}

const MARQUEE_DEFAULTS = [
  'available for work, 2026',
  'delhi · india',
  'open to commissions',
  'building things that work'
];

export default function Test() {
  const [cfg, setCfg] = useState(FALLBACK_CFG);
  const [projects, setProjects] = useState([]);
  const rowsRef = useRef([]);

  useEffect(() => {
    api.getConfig().then((c) => setCfg(mergeCfg(c))).catch(() => {});
    api.getProjects().then(setProjects).catch(() => setProjects([]));
  }, []);

  // Marquee strip: build from config (badges + a couple of static phrases)
  const marquee = useMemo(() => {
    const fromBadges = (cfg.hero?.badges || []).map((b) => b.label).filter(Boolean);
    const items = fromBadges.length ? fromBadges.concat(MARQUEE_DEFAULTS) : MARQUEE_DEFAULTS;
    return [...items, ...items]; // double for seamless loop
  }, [cfg]);

  // Magnetic effect on project rows: pull toward the cursor on mouse move
  useEffect(() => {
    const rows = rowsRef.current.filter(Boolean);
    const handlers = rows.map((row) => {
      const onMove = (e) => {
        const r = row.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
        const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
        row.style.transform = `translate(${dx * 10}px, ${dy * 4}px)`;
      };
      const onLeave = () => { row.style.transform = ''; };
      row.addEventListener('mousemove', onMove);
      row.addEventListener('mouseleave', onLeave);
      return { row, onMove, onLeave };
    });
    return () => handlers.forEach(({ row, onMove, onLeave }) => {
      row.removeEventListener('mousemove', onMove);
      row.removeEventListener('mouseleave', onLeave);
    });
  }, [projects]);

  // Display project list: 4 max, with placeholder fill if fewer
  const items = projects.slice(0, 4);

  return (
    <div className="brutalist">
      <div className="b-grain" aria-hidden="true" />
      <div className="b-grid-rule" aria-hidden="true" />

      <nav className="b-nav">
        <Link to="/test" className="b-brand">
          Shrikant Bhama
          <sup>©</sup>
        </Link>
        <ul>
          <li><Link to="/test" className="b-active">— index</Link></li>
          <li><Link to="/work">work</Link></li>
          <li><Link to="/">cyber view</Link></li>
        </ul>
      </nav>

      <div className="b-marquee">
        <div className="b-marquee-track">
          {marquee.map((m, i) => (
            <span key={i}>{m}</span>
          ))}
        </div>
      </div>

      <section className="b-hero">
        <div className="b-eyebrow">{cfg.hero.eyebrow}</div>
        <h1>
          Shrikant<br />
          <span className="b-it">Bhama</span>, <span className="b-underline">builder</span><br />
          of things on the<br />
          internet.
        </h1>

        <div className="b-hero-meta">
          {(cfg.hero.badges || []).slice(0, 3).map((b, i) => (
            <div key={i}>
              <span className="b-meta-label">
                {i === 0 ? 'BASED IN' : i === 1 ? 'STUDYING' : 'STATUS'}
              </span>
              <strong>{b.label}</strong>
            </div>
          ))}
        </div>
      </section>

      <div className="b-section-title">
        <h2>Selected<br /><em>work</em> <span aria-hidden="true">↘</span></h2>
        <div className="b-num">02 / projects</div>
      </div>

      <div className="b-proj-list">
        {items.length === 0 && (
          <div className="b-proj-empty">loading…</div>
        )}
        {items.map((p, i) => (
          <Link
            key={p._id || i}
            to="/work"
            className="b-proj-row"
            ref={(el) => { rowsRef.current[i] = el; }}
          >
            <span className="b-idx">— {String(i + 1).padStart(2, '0')}</span>
            <div>
              <h3>{p.title}{p.tagline ? <em> · {p.tagline.split(',')[0]}</em> : null}</h3>
              <div className="b-tag">
                {(p.stack || []).slice(0, 3).join(' · ').toUpperCase()}
                {p.period && (p.stack?.length ? ' · ' : '') + p.period}
              </div>
            </div>
            <span className="b-arrow">↗</span>
          </Link>
        ))}
      </div>

      <div className="b-foot">
        © 2026 SHRIKANT BHAMA
        {cfg.contact.email && (
          <> · <a href={`mailto:${cfg.contact.email}`}>{cfg.contact.email}</a></>
        )}
        {' · DELHI, IN'}
      </div>
    </div>
  );
}
