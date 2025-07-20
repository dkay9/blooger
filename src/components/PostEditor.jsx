import React, { useState, useRef, useMemo } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../styles/quillOverrides.css";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import DOMPurify from "dompurify";
import axios from "axios";
import { usePosts } from "../context/PostContext";

const CLOUD_NAME = "dheekay11";
const UPLOAD_PRESET = "blooger_posts";

const categories = [
  "Technology",
  "Business",
  "Lifestyle",
  "Health",
  "Education",
  "Travel",
  "Other"
];

const formats = [
  "header", "bold", "italic", "underline", "strike",
  "list", "bullet", "blockquote", "code-block",
  "link", "image"
];

async function handleImageUpload(quillRef) {
  const input = document.createElement("input");
  input.setAttribute("type", "file");
  input.setAttribute("accept", "image/*");
  input.click();

  input.onchange = async () => {
    const file = input.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: "POST", body: formData }
    );

    const data = await res.json();
    const imageUrl = data.secure_url;

    const editor = quillRef.current.getEditor();
    const range = editor.getSelection(true);
    editor.insertEmbed(range.index, "image", imageUrl);
    editor.setSelection(range.index + 1);
  };
}

const getModules = (quillRef) => ({
  toolbar: {
    container: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["blockquote", "code-block"],
      ["link", "image"],
      ["clean"]
    ],
    handlers: {
      image: () => handleImageUpload(quillRef)
    }
  }
});

export default function PostEditor({ currentUser }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const quillRef = useRef(null);
  const modules = useMemo(() => getModules(quillRef), [quillRef]);
  const { addPost, fetchPosts } = usePosts(); 

  function stripHtml(html) {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }

  const slugify = (str) =>
  String(str || "")  // ensures str is a string, even if null/undefined
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");

  function handleThumbnailChange(e) {
    const file = e.target.files[0];
    setThumbnail(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  }

async function handleSubmit(e) {
  e.preventDefault();

  const newErrors = {};
  if (!title.trim()) newErrors.title = "Title is required.";
  if (!stripHtml(content).trim()) newErrors.content = "Content cannot be empty.";
  if (!thumbnail) newErrors.thumbnail = "Thumbnail is required.";
  if (!categories.includes(category)) newErrors.category = "Invalid category selected.";

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  setErrors({});
  setLoading(true);

  const excerpt = stripHtml(content).slice(0, 100) + "...";
  const safeContent = DOMPurify.sanitize(content);
  const slug = `${slugify(title)}-${Date.now()}`;
  const token = localStorage.getItem("token");

  let thumbnailUrl = "";
  if (thumbnail) {
    try {
      const formData = new FormData();
      formData.append("file", thumbnail);
      formData.append("upload_preset", UPLOAD_PRESET);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      thumbnailUrl = data.secure_url;
    } catch {
      setLoading(false);
      setErrors({ thumbnail: "Image upload failed." });
      return;
    }
  }

  try {
    const res = await axios.post(
      "http://localhost:5050/api/posts",
      {
        title,
        content: safeContent,
        slug,
        excerpt,
        thumbnail: thumbnailUrl,
        category
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    );
    console.log("currentUser in PostEditor:", currentUser);
    addPost(res.data);         // 1. update context
    await fetchPosts();        // 2. force fresh refetch
    navigate(`/profile/${currentUser?.username}`); // 3. redirect to profile page

  } catch (err) {
    setErrors({ submit: "Failed to create post. Please try again." });
    console.error("Post creation error:", err);
  } finally {
    setLoading(false);
  }
}

  return (
    <>
      <Header currentUser={currentUser} />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-8 px-4">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md max-w-3xl mx-auto"
        >
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded dark:border-gray-700 dark:bg-gray-700 dark:text-white"
          />
          {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}

          <div className="quill-wrapper bg-white dark:bg-gray-700 rounded">
            <ReactQuill
              ref={quillRef}
              value={content}
              onChange={setContent}
              theme="snow"
              modules={modules}
              formats={formats}
            />
          </div>
          {errors.content && <p className="text-sm text-red-500">{errors.content}</p>}

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded dark:border-gray-700 dark:bg-gray-700 dark:text-white"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Thumbnail
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
              className="block w-full text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer dark:text-gray-100 dark:bg-gray-700 dark:border-gray-600"
            />
            {preview && (
              <img
                src={preview}
                alt="Thumbnail preview"
                className="h-32 mt-2 rounded object-cover"
              />
            )}
            {errors.thumbnail && <p className="text-sm text-red-500">{errors.thumbnail}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`bg-blue-500 text-white px-4 py-2 rounded ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"}`}
          >
            {loading ? "Saving..." : "Save Post"}
          </button>
          {errors.submit && <p className="text-sm text-red-500 mt-2">{errors.submit}</p>}
        </form>
      </div>
    </>
  );
}
