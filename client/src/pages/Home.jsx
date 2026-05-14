import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav.jsx';
import Footer from '../components/Footer.jsx';
import { api } from '../api.js';

export default function Home() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    api.getProjects().then(setProjects).catch(() => setProjects([]));
  }, []);

  return (
    <>
      <Nav />

      <header className="hero wrap">
        <div className="label">SB — 01 / portfolio</div>
        <h1>
          Shrikant Bhama.<br />
          Builds things on the internet, <em>sometimes for money,<br />sometimes just to see.</em>
        </h1>
        <p className="sub">
          Computer apps student in Delhi. Spent the last few years running a Discord
          bot that grew faster than I expected, and a small dev agency I eventually sold.
          Currently learning more about backend systems, security, and the boring parts
          of shipping software.
        </p>

        <div className="meta">
          <span>BASED IN<strong>Delhi, India</strong></span>
          <span>STUDYING<strong>BCA, GGSIPU</strong></span>
          <span>STATUS<strong>Open to work</strong></span>
        </div>
      </header>

      <section className="block">
        <div className="wrap">
          <div className="section-head">
            <h2>About</h2>
            <span className="num">02 / who</span>
          </div>
          <div className="about-grid">
            <aside className="aside">
              <div><strong>Currently</strong>BCA, final year</div>
              <div><strong>Previously</strong>Founder, PayCode</div>
              <div><strong>Reading</strong>About networks &amp; sec</div>
              <div><strong>Tools</strong>Python, Linux, Docker</div>
            </aside>
            <div className="body">
              <p>
                I started writing code because I wanted to make a Discord bot do something
                stupid. That bot ended up with 13,000 members and 800 daily users, and somewhere
                along the way I learned how to actually ship software people pay for.
              </p>
              <p>
                After that I ran a small dev agency, PayCode, for about a year — delivered
                600+ projects, hired three people, then sold it. It taught me more about
                writing clearly, scoping work, and saying no than any class has.
              </p>
              <p>
                Right now I'm finishing my BCA and going deeper into things I skipped past
                the first time: proper databases, networking, system design, security. Less
                hustle, more fundamentals.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <div className="section-head">
            <h2>Stack</h2>
            <span className="num">03 / tools</span>
          </div>
          <div className="skills-grid">
            <div className="skill-cell">
              <h4>Languages</h4>
              <ul>
                <li>Python</li>
                <li>JavaScript</li>
                <li>HTML &amp; CSS</li>
                <li>C</li>
              </ul>
            </div>
            <div className="skill-cell">
              <h4>Libraries</h4>
              <ul>
                <li>pandas, numpy</li>
                <li>matplotlib</li>
                <li>requests, pillow</li>
                <li>opencv</li>
              </ul>
            </div>
            <div className="skill-cell">
              <h4>Infra &amp; tools</h4>
              <ul>
                <li>Git, Docker</li>
                <li>SQL, SQLite</li>
                <li>NoSQL</li>
                <li>GitHub Actions</li>
              </ul>
            </div>
            <div className="skill-cell">
              <h4>Security &amp; net</h4>
              <ul>
                <li>Wireshark</li>
                <li>Burp Suite</li>
                <li>Postman</li>
                <li>REST APIs</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="block">
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
                <span className="arrow">→ read</span>
              </Link>
            ))}
          </div>
          {projects.length > 4 && (
            <div style={{ marginTop: 30 }}>
              <Link to="/work" style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>
                see everything →
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <div className="section-head">
            <h2>Get in touch</h2>
            <span className="num">05 / contact</span>
          </div>
          <div className="contact-grid">
            <p className="lead">
              If you're working on something interesting <em>or just want to chat about
              bots, security, or running small businesses</em> — the inbox is open.
            </p>
            <div className="contact-list">
              <a href="mailto:shreekantbhama5@gmail.com">shreekantbhama5@gmail.com →</a>
              <a href="https://github.com/cheemzboi" target="_blank" rel="noreferrer">github / cheemzboi →</a>
              <a href="tel:+918572997389">+91 85729 97389 →</a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
