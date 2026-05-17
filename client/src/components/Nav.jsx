import { useRef, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

function smoothScrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return false;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  return true;
}

function HashLink({ hash, children }) {
  const nav = useNavigate();
  const loc = useLocation();
  const onClick = (e) => {
    e.preventDefault();
    if (loc.pathname === '/') {
      smoothScrollToId(hash);
    } else {
      nav('/', { state: { scrollTo: hash } });
    }
  };
  return <a href={`/#${hash}`} onClick={onClick}>{children}</a>;
}

function Brand() {
  const [hover, setHover] = useState(false);
  const [clicked, setClicked] = useState(false);
  const timeoutRef = useRef(null);

  const onClick = (e) => {
    e.preventDefault();
    if (clicked) return;
    setClicked(true);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setClicked(false), 5000);
  };

  const stateKey = clicked ? 'cheems' : hover ? 'long' : 'short';

  return (
    <a
      href="/"
      className={`brand brand-state-${stateKey}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
      title={clicked ? '' : "psst — click me"}
    >
      {clicked ? (
        <span className="brand-cheems" key="cheems">
          <img className="brand-cheems-img" src="/cheems.png" alt="" />
          <span className="brand-cheems-text">HEMLO</span>
        </span>
      ) : (
        <span className="brand-text" key={hover ? 'long' : 'short'}>
          {hover ? (
            <>
              <span className="sb">Shrikant&nbsp;Bhama</span>
              <span className="brand-tail">&rsquo;s portfolio</span>
            </>
          ) : (
            <span className="sb">SB</span>
          )}
        </span>
      )}
    </a>
  );
}

export default function Nav() {
  return (
    <nav className="nav">
      <Brand />
      <ul>
        <li><NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : undefined)}>home</NavLink></li>
        <li><NavLink to="/work" className={({ isActive }) => (isActive ? 'active' : undefined)}>work</NavLink></li>
        <li><HashLink hash="skills">skills</HashLink></li>
        <li><HashLink hash="contact">contact</HashLink></li>
      </ul>
    </nav>
  );
}
