import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import PostCard from "../components/PostCard";
import axios from "axios";

export default function Profile({ allPosts }) {
  const { username } = useParams();
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const slugify = (str) =>
    str?.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:5050/api/users/${username}`);
        setProfileUser(res.data);
      } catch (err) {
        setError("User not found or server error.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [username]);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;
  if (error || !profileUser)
    return <div className="p-8 text-center text-red-500">{error}</div>;

  const userPosts = allPosts?.filter(
    (p) => slugify(p.author) === slugify(profileUser.name)
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <Header />
      <div className="max-w-3xl mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <img
            src={`https://i.pravatar.cc/100?u=${profileUser._id}`}
            alt={profileUser.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h1 className="text-2xl font-bold">{profileUser.name}</h1>
            <p className="text-gray-600 dark:text-gray-400">
              {profileUser.bio || "No bio provided."}
            </p>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4 mt-20">Posts</h2>
        <div className="space-y-4">
          {userPosts.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No posts yet.</p>
          ) : (
            userPosts.map((post, index) => <PostCard key={index} post={post} />)
          )}
        </div>
      </div>
    </div>
  );
}
