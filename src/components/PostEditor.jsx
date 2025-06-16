import React, { useState, useRef, useMemo } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../styles/quillOverrides.css";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import DOMPurify from "dompurify";

const CLOUD_NAME = "dheekay11"; // e.g., dkay9
const UPLOAD_PRESET = "blooger_posts"; // e.g., blooger_preset

const categories = [
  "Technology",
  "Business",
  "Lifestyle",
  "Health",
  "Education",
  "Travel",
  "Other"
];

// Static formats
const formats = [
  "header", "bold", "italic", "underline", "strike",
  "list", "bullet", "blockquote", "code-block",
  "link", "image"
];

// Image upload handler (Cloudinary)
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

// Stable modules
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

export default function PostEditor({ onSave, currentUser }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  const quillRef = useRef(null);
  const modules = useMemo(() => getModules(quillRef), [quillRef]);

  function handleThumbnailChange(e) {
    const file = e.target.files[0];
    setThumbnail(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  }

  function stripHtml(html) {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }

  function slugify(text) {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
  }

  function handleSubmit(e) {
    e.preventDefault();

    const excerpt = stripHtml(content).slice(0, 100) + "...";
    const safeContent = DOMPurify.sanitize(content);

    const post = {
      title,
      content: safeContent,
      thumbnail,
      excerpt,
      slug: slugify(title),
      createdAt: new Date().toISOString(),
      author: {
        name: currentUser?.name || "Anonymous",
        bio: currentUser?.bio || "No bio available"
      },
      category
    };

    onSave(post);
    setTitle("");
    setContent("");
    setThumbnail(null);
    setPreview(null);
    navigate("/");
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
            required
          />

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
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
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
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Save Post
          </button>
        </form>
      </div>
    </>
  );
}
