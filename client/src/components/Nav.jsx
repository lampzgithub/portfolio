import { NavLink } from 'react-router-dom';

export default function Nav() {
  return (
    <nav className="nav">
      <NavLink to="/" className="brand">
        <span className="sb">SB</span> — portfolio
      </NavLink>
      <ul>
        <li><NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : undefined)}>home</NavLink></li>
        <li><NavLink to="/work" className={({ isActive }) => (isActive ? 'active' : undefined)}>work</NavLink></li>
      </ul>
    </nav>
  );
}
