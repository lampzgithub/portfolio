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
      // navigate home and pass the target hash through router state;
      // Home reads it on mount and scrolls.
      nav('/', { state: { scrollTo: hash } });
    }
  };
  return (
    <a href={`/#${hash}`} onClick={onClick}>{children}</a>
  );
}

export default function Nav() {
  return (
    <nav className="nav">
      <NavLink to="/" className="brand">
        <span className="sb">SB</span> — portfolio
      </NavLink>
      <ul>
        <li><NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : undefined)}>home</NavLink></li>
        <li><NavLink to="/work" className={({ isActive }) => (isActive ? 'active' : undefined)}>work</NavLink></li>
        <li><HashLink hash="skills">skills</HashLink></li>
        <li><HashLink hash="contact">contact</HashLink></li>
      </ul>
    </nav>
  );
}
