import Header from "../components/Header";
import PostCard from "../components/PostCard";

export default function Home({ posts, currentUser }) {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <Header currentUser={currentUser} />
      <main className="max-w-3xl mx-auto p-4 space-y-6">
        {posts.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">No posts yet.</p>
        ) : (
          <div className="space-y-4">
            {posts.map((post, index) => (
              <PostCard key={index} post={post} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
