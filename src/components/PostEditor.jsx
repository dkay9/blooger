import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../styles/quillOverrides.css";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

export default function PostEditor({ onSave, currentUser }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

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

    const post = {
      title,
      content,
      thumbnail,
      excerpt,
      slug: slugify(title),
      createdAt: new Date().toISOString(),
      author: currentUser?.name || "Anonymous"
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
              value={content}
              onChange={setContent}
              theme="snow"
            />
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
