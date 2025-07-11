import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MessageCircle, ThumbsUp } from "lucide-react";
import axios from "axios";
import { isLoggedIn } from "../utils/auth";
import AuthorHoverCard from "./AuthorHoverCard";
import CommentSidebar from "./CommentSidebar";

export default function PostCard({ post }) {
  const navigate = useNavigate();
  const userLoggedIn = isLoggedIn();

  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [liked, setLiked] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentCount, setCommentCount] = useState(post.comments?.length || 0);
  const [showCommentSidebar, setShowCommentSidebar] = useState(false);
  const [postComments, setPostComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);

  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const slugify = (str) =>
    str?.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");

  const author = post.author || {};
  const authorName = typeof author === "object" ? author.name : author;
  const authorSlug = slugify(authorName || "anonymous");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && post.likes?.some((like) => like.userId === userLoggedIn?.id)) {
      setLiked(true);
    }
  }, [post.likes, userLoggedIn]);

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!userLoggedIn) return alert("Login to like posts");

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5050/api/likes",
        { postId: post._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLiked(res.data.liked);
      setLikesCount((prev) => prev + (res.data.liked ? 1 : -1));
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!userLoggedIn) return alert("Login to comment");

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5050/api/comments",
        { postId: post._id, text: commentText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPostComments((prev) => [...prev, res.data]);
      setCommentText("");
      setCommentCount((prev) => prev + 1);
    } catch (err) {
      console.error("Comment error:", err);
    }
  };

  const handleOpenComments = async (e) => {
    e.stopPropagation();
    setShowCommentSidebar(true);
    setLoadingComments(true);
    try {
      const res = await axios.get(`http://localhost:5050/api/comments/${post._id}`);
      setPostComments(res.data);
    } catch (err) {
      console.error("Fetch comments error:", err);
    } finally {
      setLoadingComments(false);
    }
  };

  return (
    <div className="relative shadow-lg md:shadow-sm transition-shadow duration-300 min-h-[10rem] md:h-40 cursor-default mb-14 overflow-visible">
      <div className="flex flex-col md:flex-row md:items-center md:gap-x-6">
        {post.thumbnail && (
          <div className="w-full h-48 md:w-40 md:h-full flex-shrink-0">
            <img
              src={post.thumbnail}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-4 flex flex-col justify-between flex-1">
          <h2
            onClick={() => navigate(`/post/${post.slug}`)}
            className="text-xl font-semibold text-gray-900 dark:text-white line-clamp-2 capitalize cursor-pointer"
          >
            {post.title}
          </h2>

          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-3">
            {post.excerpt || "No preview available..."}
          </p>

          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 flex justify-between items-center">
            <div className="flex items-center gap-2 relative">
              <AuthorHoverCard author={post.author} />
              <span className="mx-2">·</span>
              <span>{formattedDate}</span>
            </div>

            <Link
              to={`/post/${post.slug}`}
              className="text-blue-500 hover:underline z-10"
              onClick={(e) => e.stopPropagation()}
            >
              Read more
            </Link>
          </div>

          <div className="mt-4 flex gap-4 items-center z-0">
            <button
              onClick={handleLike}
              className="flex items-center gap-1 text-gray-500 hover:text-blue-500"
            >
              <ThumbsUp className={liked ? "text-blue-500" : ""} size={16} />
              <span>{likesCount}</span>
            </button>

            <button
              onClick={handleOpenComments}
              className="flex items-center gap-1 text-gray-500 hover:text-blue-500"
            >
              <MessageCircle size={16} />
              <span>{commentCount}</span>
            </button>
          </div>
        </div>
      </div>

      <CommentSidebar
        isOpen={showCommentSidebar}
        onClose={() => setShowCommentSidebar(false)}
        comments={postComments}
        commentText={commentText}
        setCommentText={setCommentText}
        onSubmit={handleCommentSubmit}
        userLoggedIn={userLoggedIn}
        loading={loadingComments}
      />
    </div>
  );
}
