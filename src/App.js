import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Home from './pages/Home';
import Post from './pages/Post';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PostEditor from './components/PostEditor';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  const [posts, setPosts] = useState([]);

  const mockUser = {
    name: "Jane Doe",
    email: "jane@example.com",
    role: "writer"
  };

  const handleSavePost = (newPost) => {
    const slug = newPost.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    const createdAt = new Date().toISOString();
    const author = mockUser.name; // Replace with real user if available

    const post = {
      ...newPost,
      slug,
      createdAt,
      author,
    };

    setPosts((prev) => [post, ...prev]);
  };

  return (
    <Router>
      <ThemeProvider>
        <Routes>
          <Route path="/" element={<Home posts={posts} />} />
          <Route path="/editor" element={<PostEditor onSave={handleSavePost} currentUser={mockUser}/>} />
          <Route path="/post/:id" element={<Post />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </ThemeProvider>
    </Router>
  );
}

export default App;
