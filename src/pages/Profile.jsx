import { useEffect, useState } from "react";
import Header from "../components/Header";
import PostCard from "../components/PostCard";

export default function Profile({ currentUser, allPosts }) {
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    if (currentUser && Array.isArray(allPosts)) {
      const filtered = allPosts.filter(
        (post) => post.author === currentUser.name
      );
      setUserPosts(filtered);
    }
  }, [currentUser, allPosts]);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-300">
          You need to log in to view your profile.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <Header currentUser={currentUser} />

      <main className="max-w-3xl mx-auto p-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow mb-6">
          <h1 className="text-2xl font-bold mb-2">{currentUser.name}</h1>
          {currentUser.email && (
            <p className="text-gray-600 dark:text-gray-400">{currentUser.email}</p>
          )}
        </div>

        <h2 className="text-xl font-semibold mb-4">Your Posts</h2>
        {userPosts.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            You haven’t posted anything yet.
          </p>
        ) : (
          <div className="space-y-4">
            {userPosts.map((post, index) => (
              <PostCard key={index} post={post} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
