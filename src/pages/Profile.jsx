import { useParams } from "react-router-dom";
import Header from "../components/Header";
import PostCard from "../components/PostCard";

export default function Profile({ allPosts }) {
  const { username } = useParams();

  // Mock author data
  const authorInfo = {
    "jane-doe": {
      name: "Jane Doe",
      bio: "Writer at MyBlog. Loves nature and code.",
      image: "https://i.pravatar.cc/100?u=jane"
    },
    "john-smith": {
      name: "John Smith",
      bio: "Tech enthusiast. Writes about startups and innovation.",
      image: "https://i.pravatar.cc/100?u=john"
    }
  };

  const author = authorInfo[username];
  const userPosts = allPosts?.filter((p) =>
  p.author?.toLowerCase().replace(/\s+/g, "-") === username
  );

  if (!author) {
    return <div className="p-8 text-center text-gray-500">Author not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <Header />
      <div className="max-w-3xl mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <img
            src={author.image}
            alt={author.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h1 className="text-2xl font-bold">{author.name}</h1>
            <p className="text-gray-600 dark:text-gray-400">{author.bio}</p>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4 mt-20">Posts</h2>
        <div className="space-y-4">
          {userPosts.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No posts yet.</p>
          ) : (
            userPosts.map((post, index) => (
              <div key={index} className="space-y-6">
                  {userPosts.map((post, index) => (
                  <PostCard key={index} post={post} />
                ))}

              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
