import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Home from './pages/Home';
import Post from './pages/Post';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PostEditor from './components/PostEditor';
import { ThemeProvider } from './context/ThemeContext';
import Profile from './pages/Profile';

function App() {
  const [posts, setPosts] = useState([]);

  const mockUser = {
    name: "Jane Doe",
    email: "jane@example.com",
    bio: "Writer and tech enthusiast"
  };

  const handleSavePost = (newPost) => {
    const slug = newPost.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    const createdAt = new Date().toISOString();
    const author = mockUser.name;

    const post = {
      ...newPost,
      slug,
      createdAt,
      author,
    };

    setPosts((prev) => [post, ...prev]);
  };

  // Helper to slugify username
  const slugify = (str) =>
    str.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");

  return (
    <Router>
      <ThemeProvider>
        <Routes>
          <Route path="/" element={<Home posts={posts} />} />
          <Route
            path="/editor"
            element={<PostEditor onSave={handleSavePost} currentUser={mockUser} />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />

          {/* 🔁 New redirect route for /profile */}
          <Route
            path="/profile"
            element={<Navigate to={`/profile/${slugify(mockUser.name)}`} replace />}
          />

          {/* Dynamic profile route */}
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
