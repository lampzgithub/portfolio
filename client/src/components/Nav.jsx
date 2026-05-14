import { NavLink } from 'react-router-dom';

export default function Nav() {
  return (
    <nav className="nav">
      <NavLink to="/" className="brand">Shrikant Bhama</NavLink>
      <ul>
        <li><NavLink to="/" end>index</NavLink></li>
        <li><NavLink to="/work">work</NavLink></li>
        <li><a href="mailto:shreekantbhama5@gmail.com">contact</a></li>
      </ul>
    </nav>
  );
}
