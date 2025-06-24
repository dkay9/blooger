import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const PostContext = createContext();

export const usePosts = () => useContext(PostContext);

export function PostProvider({ children }) {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://localhost:5050/api/posts");
      setPosts(res.data);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    }
  };

  const addPost = (post) => {
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
