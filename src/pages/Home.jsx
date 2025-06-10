import { useState } from "react";
import Header from "../components/Header";
import PostEditor from "../components/PostEditor";
import PostCard from "../components/PostCard";

export default function Home() {
  const [posts, setPosts] = useState([]);

  const handleSavePost = (newPost) => {
    setPosts([newPost, ...posts]); // New post at the top
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <Header />
      <main className="max-w-3xl mx-auto p-4 space-y-6">
        <PostEditor onSave={handleSavePost} />
        <div className="space-y-4">
          {posts.map((post, index) => (
            <PostCard key={index} post={post} />
          ))}
        </div>
      </main>
    </div>
  );
}
