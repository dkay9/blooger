import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Post from './pages/Post';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PostEditor from './components/PostEditor';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Profile from './pages/Profile';
import { Toaster } from 'react-hot-toast';

function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  const { currentUser } = useAuth();

  const slugify = (str) =>
    str.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      <Route
        path="/editor"
        element={
          <ProtectedRoute>
            <PostEditor />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          currentUser ? (
            <Navigate to={`/profile/${slugify(currentUser.name)}`} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route path="/profile/:username" element={<Profile />} />
      <Route path="/post/:slug" element={<Post />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <Toaster position="top-right" />
          <AppRoutes />
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}
