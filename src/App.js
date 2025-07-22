import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { PostProvider } from './context/PostContext';

import Home from './pages/Home';
import Post from './pages/Post';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PostEditor from './components/PostEditor';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Profile from './pages/Profile';
import { Toaster } from 'react-hot-toast';
// import LoginModal from './components/LoginModal';
import { ModalProvider, useModal } from './context/ModalContext';
import LoginModalWrapper from './components/LoginModalWrapper';

function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" replace />;
}

function AppRoutes({ allPosts }) {
  const { currentUser } = useAuth();

  const slugify = (str) =>
    str.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");

  return (
    <Routes>
      <Route path="/" element={<Home allPosts={allPosts} />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/editor"
        element={
          <ProtectedRoute>
            <PostEditor currentUser={currentUser} />
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

      <Route path="/profile/:username" element={<Profile allPosts={allPosts} />} />
      <Route path="/post/:slug" element={<Post posts={allPosts} />} />
    </Routes>
  );
}

export default function App() {
  const [allPosts, setAllPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get('http://localhost:5050/api/posts');
        setAllPosts(res.data);
      } catch (err) {
        console.error("Failed to fetch posts", err);
      }
    };

    fetchPosts();
  }, []);

  return (
    <Router>
      <AuthProvider>
        <ModalProvider>
          <PostProvider>
            <ThemeProvider>
              <Toaster position="top-right" />
              <LoginModalWrapper />
              <AppRoutes allPosts={allPosts} />
            </ThemeProvider>
          </PostProvider>
        </ModalProvider>
      </AuthProvider>
    </Router>
  );
}
