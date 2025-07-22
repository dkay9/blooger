import { useEffect, useRef } from "react";
import Skeleton from "./ui/Skeleton";
import { Link } from "react-router-dom";

export default function CommentSidebar({
  isOpen,
  onClose,
  comments = [],
  commentText,
  setCommentText,
  onSubmit,
  userLoggedIn,
  loading = false,
}) {
  const sidebarRef = useRef();

  useEffect(() => {
    function handleClickOutside(e) {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    console.log("Loaded comments:", comments);
  }, [comments]);

  const handleGuestAttempt = () => {
    // Show toast (optional)
    toast("Login to like or comment");

    // Open login modal
    setShowLoginModal(true);

    // Optional: save current page for redirect after login
    localStorage.setItem("returnTo", window.location.pathname);
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-40 dark:bg-opacity-60" />

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`absolute right-0 top-0 h-full w-full sm:w-[400px] bg-white dark:bg-gray-900 shadow-lg transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold">Comments</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500"
          >
            ✕
          </button>
        </div>

        <div className="p-4 overflow-y-auto h-[calc(100%-4rem)] space-y-4">
          {/* Comments */}
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-start gap-2">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-3 w-1/3" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))
          ) : comments.length > 0 ? (
            comments.map((comment, index) => (
              <div key={index} className="text-sm border-b pb-2 flex gap-2">
                <img
                  src={comment.userId?.image || "/default-avatar.png"}
                  alt="avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-700 dark:text-gray-300">
                    {comment.userId?.name ? (
                    <Link
                        to={`/profile/${comment.userId.name
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                        className="hover:underline"
                    >
                        {comment.userId.name}
                    </Link>
                    ) : (
                    <span className="text-gray-400">Anonymous</span>
                    )}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">{comment.text}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No comments yet.</p>
          )}

         <form onSubmit={userLoggedIn ? onSubmit : handleGuestAttempt} className="mt-4">
          <textarea
            value={commentText}
            onChange={(e) => {
              if (!userLoggedIn) {
                handleGuestAttempt(); // show modal
                return;
              }
              setCommentText(e.target.value);
            }}
            placeholder={
              userLoggedIn ? "Write a comment..." : "Login to write a comment"
            }
            rows={3}
            disabled={!userLoggedIn}
            onFocus={() => {
              if (!userLoggedIn) handleGuestAttempt();
            }}
            className={`w-full px-3 py-2 border rounded-md text-sm ${
              userLoggedIn
                ? "dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                : "bg-gray-100 text-gray-500 cursor-not-allowed"
            }`}
          />
          <button
            type="submit"
            disabled={!userLoggedIn}
            className={`mt-2 px-4 py-1 rounded ${
              userLoggedIn
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Post Comment
          </button>
         </form>
         {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
        </div>
      </div>
    </div>
  );
}
