import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Nav from '../components/Nav.jsx';
import Footer from '../components/Footer.jsx';
import { api } from '../api.js';

const DEFAULT_CONFIG = {
  hero: {
    eyebrow: 'SB — 01 / portfolio',
    tagline: 'Reverse-engineers problems until they give up.',
    sub: 'Ran a Discord community of 13k people before I could drive. Built and sold a dev agency by 20. Now going deep on systems, security, and the fundamentals I skipped the first time.',
    badges: [
      { label: 'Delhi, India', color: 'purple' },
      { label: 'BCA · GGSIPU', color: 'cyan' },
      { label: 'Open to work', color: 'pink' }
    ]
  },
  about: {
    paragraphs: [
      "Started with a Discord bot idea. It scaled to 13k members before I had a plan — which meant learning systems design by fire, not by book. I shipped, it broke, I fixed it. Repeat until good.",
      "Pivoted that into PayCode — a dev agency that delivered 600+ projects in a year. What I actually learned: writing specs, managing scope creep, and that most technical problems are just communication problems in disguise.",
      "These days I'm going deeper into the stack. Networks, security, the guts of systems. The stuff that makes the difference between someone who can code and someone who understands what's actually happening."
    ],
    sidebar: [
      { key: 'Currently', value: 'BCA, final year' },
      { key: 'Previously', value: 'Founder, PayCode' },
      { key: 'Reading', value: 'Networks & security' },
      { key: 'Tools', value: 'Python, Linux, Docker' }
    ]
  },
  stack: [
    { category: 'Languages', color: 'purple', items: [
      { name: 'Python', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
      { name: 'JavaScript', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
      { name: 'HTML & CSS', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
      { name: 'C', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg' }
    ] },
    { category: 'Libraries', color: 'cyan', items: [
      { name: 'pandas, numpy', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg' },
      { name: 'matplotlib', logo: '' },
      { name: 'requests, pillow', logo: '' },
      { name: 'opencv', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/opencv/opencv-original.svg' }
    ] },
    { category: 'Infra & tools', color: 'pink', items: [
      { name: 'Git, Docker', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
      { name: 'SQL, SQLite', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg' },
      { name: 'NoSQL', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
      { name: 'GitHub Actions', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg' }
    ] },
    { category: 'Security & net', color: 'green', items: [
      { name: 'Wireshark', logo: '' },
      { name: 'Burp Suite', logo: '' },
      { name: 'Postman', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg' },
      { name: 'REST APIs', logo: '' }
    ] }
  ],
  contact: {
    lead: "If you're working on something interesting or just want to chat about bots, security, or running small businesses — the inbox is open.",
    email: 'shreekantbhama5@gmail.com',
    github: 'https://github.com/cheemzboi',
    phone: '+91 85729 97389'
  }
};

function mergeCfg(remote) {
  if (!remote) return DEFAULT_CONFIG;
  return {
    hero: {
      ...DEFAULT_CONFIG.hero,
      ...(remote.hero || {}),
      badges: remote.hero?.badges?.length ? remote.hero.badges : DEFAULT_CONFIG.hero.badges
    },
    about: {
      paragraphs: remote.about?.paragraphs?.length ? remote.about.paragraphs : DEFAULT_CONFIG.about.paragraphs,
      sidebar: remote.about?.sidebar?.length ? remote.about.sidebar : DEFAULT_CONFIG.about.sidebar
    },
    stack: remote.stack?.length ? remote.stack : DEFAULT_CONFIG.stack,
    contact: { ...DEFAULT_CONFIG.contact, ...(remote.contact || {}) }
  };
}

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const els = ref.current.querySelectorAll('.reveal');
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.15 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
  return ref;
}

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [cfg, setCfg] = useState(DEFAULT_CONFIG);
  const rootRef = useReveal();
  const loc = useLocation();
  const nav = useNavigate();

  useEffect(() => {
    api.getProjects().then(setProjects).catch(() => setProjects([]));
    api.getConfig().then((c) => setCfg(mergeCfg(c))).catch(() => setCfg(DEFAULT_CONFIG));
  }, []);

  // Scroll to section if Nav pushed us here with a scrollTo target,
  // or if there's a hash on the URL.
  useEffect(() => {
    const target = loc.state?.scrollTo || (loc.hash ? loc.hash.replace('#', '') : null);
    if (!target) return;
    // small delay so the page has rendered the section
    const t = setTimeout(() => {
      const el = document.getElementById(target);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // clear router state so a back-and-forward doesn't keep re-scrolling
      if (loc.state?.scrollTo) nav(loc.pathname, { replace: true, state: {} });
    }, 150);
    return () => clearTimeout(t);
  }, [loc.state, loc.hash, loc.pathname, nav]);

  const firstName = 'Shrikant';
  const lastName = 'Bhama.';

  return (
    <div ref={rootRef}>
      <Nav />

      <header className="hero">
        <div className="wrap">
          <div className="label">{cfg.hero.eyebrow}</div>
          <h1>
            <span className="glitch" data-text={firstName}>{firstName}</span>
            <br />
            <span className="accent">{lastName}</span>
          </h1>
          <div className="tagline">{cfg.hero.tagline}</div>
          <p className="sub">{cfg.hero.sub}</p>
          <div className="badges">
            {cfg.hero.badges.map((b, i) => (
              <span key={i} className={`badge ${b.color !== 'purple' ? b.color : ''}`}>{b.label}</span>
            ))}
          </div>
        </div>
      </header>

      <section className="block reveal">
        <div className="wrap">
          <div className="section-head">
            <h2>About</h2>
            <span className="num">02 / who</span>
          </div>
          <div className="about-grid">
            <aside className="aside">
              {cfg.about.sidebar.map((s, i) => (
                <div key={i}>
                  <strong>{s.key}</strong>
                  <span>{s.value}</span>
                </div>
              ))}
            </aside>
            <div className="body">
              {cfg.about.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </div>
        </div>
      </section>

      <section id="skills" className="block reveal">
        <div className="wrap">
          <div className="section-head">
            <h2>Stack</h2>
            <span className="num">03 / tools</span>
          </div>
          <div className="skills-grid">
            {cfg.stack.map((cat, i) => (
              <div key={i} className={`skill-cell c-${cat.color}`}>
                <h4>{cat.category}</h4>
                <ul>
                  {cat.items.map((it, j) => {
                    const name = typeof it === 'string' ? it : it?.name || '';
                    const logo = typeof it === 'string' ? '' : it?.logo || '';
                    return (
                      <li key={j}>
                        {logo && <img src={logo} alt="" className="skill-logo" loading="lazy" />}
                        <span>{name}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="block reveal">
        <div className="wrap">
          <div className="section-head">
            <h2>Selected work</h2>
            <span className="num">04 / projects</span>
          </div>
          <div className="proj-list">
            {projects.length === 0 && (
              <p style={{ color: 'var(--muted)', fontStyle: 'italic' }}>Loading…</p>
            )}
            {projects.slice(0, 4).map((p, i) => (
              <Link to="/work" key={p._id} className="proj-row">
                <span className="idx">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{p.title}</h3>
                  <div className="tag">{p.tagline}</div>
                </div>
                <span className="arrow">→ view</span>
              </Link>
            ))}
          </div>
          {projects.length > 4 && (
            <div style={{ marginTop: 30 }}>
              <Link to="/work" style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--cyan)' }}>
                see everything →
              </Link>
            </div>
          )}
        </div>
      </section>

      <section id="contact" className="block reveal">
        <div className="wrap">
          <div className="section-head">
            <h2>Get in touch</h2>
            <span className="num">05 / contact</span>
          </div>
          <div className="contact-grid">
            <p className="lead">{cfg.contact.lead}</p>
            <div className="contact-list">
              {cfg.contact.email && <a href={`mailto:${cfg.contact.email}`}>{cfg.contact.email} →</a>}
              {cfg.contact.github && <a href={cfg.contact.github} target="_blank" rel="noreferrer">github →</a>}
              {cfg.contact.phone && <a href={`tel:${cfg.contact.phone.replace(/\s+/g, '')}`}>{cfg.contact.phone} →</a>}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
