import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Work from './pages/Work.jsx';
import Login from './pages/Login.jsx';
import Admin from './pages/Admin.jsx';
import { useAuth } from './context/AuthContext.jsx';

function Protected({ children }) {
  const { isAuthed } = useAuth();
  if (!isAuthed) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/work" element={<Work />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/admin"
        element={
          <Protected>
            <Admin />
          </Protected>
        }
      />
    </Routes>
  );
}
