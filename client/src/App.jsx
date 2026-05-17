import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Work from './pages/Work.jsx';
import Login from './pages/Login.jsx';
import Admin from './pages/Admin.jsx';
import Test from './pages/Test.jsx';
import { useAuth } from './context/AuthContext.jsx';

// Renders Login inline when not authenticated — no separate /login URL exists,
// so the only way in is to know the obscure /baapdada path.
function Protected({ children }) {
  const { isAuthed } = useAuth();
  if (!isAuthed) return <Login />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/work" element={<Work />} />
      <Route path="/test" element={<Test />} />
      <Route
        path="/baapdada"
        element={
          <Protected>
            <Admin />
          </Protected>
        }
      />
    </Routes>
  );
}
