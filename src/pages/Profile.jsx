import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import PostCard from "../components/PostCard";
import axios from "axios";
import toast from "react-hot-toast";

const CLOUD_NAME = "dheekay11";
const UPLOAD_PRESET = "blooger_posts";

export default function Profile({ allPosts }) {
  const { username } = useParams();
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState("");
  const [preview, setPreview] = useState("");
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [updating, setUpdating] = useState(false);

  const slugify = (str) =>
    str?.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:5050/api/users/${username}`);
        setProfileUser(res.data);
        setBio(res.data.bio || "");
        setImage(res.data.image || "");
        setPreview(res.data.image || "");

        // Check if this is the logged-in user
        const token = localStorage.getItem("token");
        if (token) {
          const payload = JSON.parse(atob(token.split(".")[1]));
          if (slugify(payload.name) === slugify(res.data.name)) {
            setIsCurrentUser(true);
          }
        }
      } catch (err) {
        setError("User not found or server error.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [username]);

  const handleUpdateProfile = async (e) => {
  e.preventDefault();
  setUpdating(true);
  let imageUrl = image;

  try {
    if (preview && preview !== image && typeof preview !== "string") {
      const formData = new FormData();
      formData.append("file", preview);
      formData.append("upload_preset", UPLOAD_PRESET);

      const uploadToast = toast.loading("Uploading image...");
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: formData,
      });
      toast.dismiss(uploadToast);

      const data = await res.json();
      imageUrl = data.secure_url;
    }

    const token = localStorage.getItem("token");
    const res = await axios.put(
      "http://localhost:5050/api/users/update-profile",
      { bio, image: imageUrl },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setProfileUser(res.data);
    // setEditingBio(false);
    toast.success("Profile updated successfully!");
  } catch (err) {
    console.error(err);
    toast.error("Failed to update profile.");
  } finally {
    setUpdating(false);
  }
};

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
            src={
              typeof preview === "string"
                ? preview
                : URL.createObjectURL(preview)
            }
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

        {isCurrentUser && (
          <form onSubmit={handleUpdateProfile} className="space-y-4 mb-12">
            <div>
              <label className="block text-sm mb-1">Update Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full border px-3 py-2 rounded dark:bg-gray-800"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Update Profile Picture</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) setPreview(file);
                }}
              />
            </div>

            <button
              type="submit"
              disabled={updating}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {updating ? "Updating..." : "Save Changes"}
            </button>
          </form>
        )}

        <h2 className="text-xl font-semibold mb-4 mt-12">Posts</h2>
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
