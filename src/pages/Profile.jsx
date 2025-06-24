import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import PostCard from "../components/PostCard";
import axios from "axios";
import { Edit, Save, Camera, X } from "lucide-react";
import { toast } from "react-hot-toast";

const CLOUD_NAME = "dheekay11";
const UPLOAD_PRESET = "blooger_posts";

export default function Profile({ allPosts = [] }) {
  const { username } = useParams();
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState("");
  const [preview, setPreview] = useState("");
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [updating, setUpdating] = useState(false);

  const [showBioModal, setShowBioModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

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

        const token = localStorage.getItem("token");
        if (token) {
          const payload = JSON.parse(atob(token.split(".")[1]));

          console.log("Token payload ID:", payload.id);
          console.log("Profile user ID:", res.data._id);

          if (payload.id === res.data._id) {
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

  const handleUpdateProfile = async () => {
    setUpdating(true);
    let imageUrl = image;

    try {
      if (preview && preview !== image && typeof preview !== "string") {
        const formData = new FormData();
        formData.append("file", preview);
        formData.append("upload_preset", UPLOAD_PRESET);

        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
          method: "POST",
          body: formData
        });

        const data = await res.json();
        imageUrl = data.secure_url;
      }

      const token = localStorage.getItem("token");
      const res = await axios.put(
        "http://localhost:5050/api/users/update-profile",
        { bio, image: imageUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setProfileUser(res.data);
      setShowBioModal(false);
      setShowImageModal(false);
      toast.success("Profile updated")
    } catch (err) {
      alert("Failed to update profile.");
      console.error(err);
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
        {/* Profile Picture and Bio */}
        <div className="flex items-start gap-4 mb-6">
          <div className="relative">
            <img
              src={
                typeof preview === "string"
                  ? preview
                  : URL.createObjectURL(preview)
              }
              alt={profileUser.name}
              className="w-20 h-20 rounded-full object-cover border"
            />
            {isCurrentUser && (
              <button
                onClick={() => setShowImageModal(true)}
                className="absolute bottom-0 right-0 bg-white dark:bg-gray-700 p-1 rounded-full shadow hover:bg-blue-100 dark:hover:bg-blue-800"
              >
                <Camera className="w-4 h-4 text-gray-700 dark:text-white" />
              </button>
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              {profileUser.name}
            </h1>
            <div className="flex items-start gap-2 mt-1">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {profileUser.bio || "No bio provided."}
              </p>
              {isCurrentUser && (
                <button
                  onClick={() => setShowBioModal(true)}
                  className="hover:text-blue-500"
                >
                  <Edit className="w-4 h-4 text-gray-500" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bio Edit Modal */}
        {showBioModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded shadow max-w-md w-full space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">Edit Bio</h2>
                <button onClick={() => setShowBioModal(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="w-full border px-3 py-2 rounded dark:bg-gray-700"
              />
              <button
                onClick={handleUpdateProfile}
                disabled={updating}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {updating ? "Saving..." : "Save Bio"}
              </button>
            </div>
          </div>
        )}

        {/* Image Upload Modal */}
        {showImageModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded shadow max-w-md w-full space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">Update Profile Picture</h2>
                <button onClick={() => setShowImageModal(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) setPreview(file);
                }}
              />
              <button
                onClick={handleUpdateProfile}
                disabled={updating}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {updating ? "Uploading..." : "Update Picture"}
              </button>
            </div>
          </div>
        )}

        {/* Posts Section */}
        <h2 className="text-xl font-semibold mb-4 mt-12">Posts</h2>
        <div className="space-y-4">
          {userPosts?.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No posts yet.</p>
          ) : (
            userPosts.map((post, index) => <PostCard key={index} post={post} />)
          )}
        </div>
      </div>
    </div>
  );
}
