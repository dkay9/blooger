import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Home from './pages/Home';
import Post from './pages/Post';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PostEditor from './components/PostEditor';
import { ThemeProvider } from './context/ThemeContext';
import Profile from './pages/Profile';
import axios from 'axios';

function App() {
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // Load user from token on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:5050/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setCurrentUser(res.data))
        .catch(() => setCurrentUser(null));
    }
  }, []);

  const handleSavePost = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const slugify = (str) =>
    str.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");

  return (
    <Router>
      <ThemeProvider>
        <Routes>
          <Route path="/" element={<Home posts={posts} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protect the post editor: only logged-in users can access */}
          <Route
            path="/editor"
            element={
              currentUser ? (
                <PostEditor currentUser={currentUser} />
              ) : (
                <Navigate to="/login" replace />
              )
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

          <Route
            path="/profile/:username"
            element={<Profile allPosts={posts} />}
          />

          <Route path="/post/:slug" element={<Post posts={posts} />} />
        </Routes>
      </ThemeProvider>
    </Router>
  );
}

export default App;
