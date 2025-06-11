import { Link } from "react-router-dom";

export default function PostCard({ post }) {
  const thumbnailSrc =
    typeof post.thumbnail === "string"
      ? post.thumbnail
      : post.thumbnail
      ? URL.createObjectURL(post.thumbnail)
      : null;

  const date = post.createdAt ? new Date(post.createdAt) : new Date();

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition duration-300 overflow-hidden">
      <div className="flex flex-col lg:flex-row">
        {/* Thumbnail (on left for lg, on top for mobile) */}
        {thumbnailSrc && (
          <Link
            to={post.slug ? `/post/${post.slug}` : "#"}
            className="lg:w-64 w-full h-48 lg:h-auto"
          >
            <img
              src={thumbnailSrc}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </Link>
        )}

        {/* Post Content */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <Link to={post.slug ? `/post/${post.slug}` : "#"}>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white hover:text-blue-500 dark:hover:text-blue-400">
              {post.title}
            </h2>
          </Link>

          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {post.excerpt || "No preview available..."}
          </p>

          {/* Metadata */}
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 flex justify-between items-center">
            <div>
              <span>By {post.author || "Anonymous"}</span>
              <span className="mx-2">·</span>
              <span>{date.toLocaleDateString()}</span>
            </div>
            {post.slug && (
              <Link
                to={`/post/${post.slug}`}
                className="text-blue-500 hover:underline"
              >
                Read more
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
