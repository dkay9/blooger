import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const PostContext = createContext();

export const usePosts = () => {
  const context = useContext(PostContext);
  if (!context) {
    console.warn("usePosts must be used within a PostProvider");
    return { posts: [], addPost: () => {}, fetchPosts: () => {} };
  }
  return context;
};

export function PostProvider({ children }) {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://localhost:5050/api/posts");
      console.log("✅ Posts fetched:", res.data); // Debug log
      setPosts(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch posts:", err);
    }
  };

  const addPost = (post) => {
    console.log("➕ Adding post:", post); // Debug log
    setPosts((prev) => [post, ...prev]);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <PostContext.Provider value={{ posts, addPost, fetchPosts }}>
      {children}
    </PostContext.Provider>
  );
}
