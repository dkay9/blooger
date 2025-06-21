import Header from "../components/Header";
import PostCard from "../components/PostCard";
import { useState } from "react";

const categories = [
  "All",
  "Technology",
  "Business",
  "Lifestyle",
  "Health",
  "Education",
  "Travel",
  "Other"
];

export default function Home({ posts, currentUser }) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Filter posts by selected category
  const filteredPosts =
  selectedCategory === "All"
    ? posts || []
    : (posts || []).filter((post) => post.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <Header currentUser={currentUser} />

      <main className="max-w-3xl mx-auto p-4 space-y-6">
        <h1 className="text-2xl font-bold">Latest Posts</h1>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 my-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-sm border ${
                selectedCategory === cat
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {filteredPosts.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">No posts in this category.</p>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map((post, index) => (
              <PostCard key={index} post={post} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
