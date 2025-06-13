import { AuthorBadge } from "./AuthorBadge";
import { Link, useNavigate } from "react-router-dom";

export default function PostCard({ post }) {
  const navigate = useNavigate();

  const thumbnailSrc =
    typeof post.thumbnail === "string"
      ? post.thumbnail
      : post.thumbnail
      ? URL.createObjectURL(post.thumbnail)
      : null;

  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const slugify = (str) =>
    str?.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");

  const authorSlug = slugify(post.author || "anonymous");

  const handleCardClick = () => {
    if (post.slug) {
      navigate(`/post/${post.slug}`);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="relative shadow-lg md:shadow-sm transition-shadow duration-300 min-h-[10rem] md:h-40 cursor-pointer mb-14 overflow-visible"
    >
      <div className="flex flex-col md:flex-row md:items-center md:gap-x-6">
        {thumbnailSrc && (
          <div className="w-full h-48 md:w-40 md:h-full flex-shrink-0">
            <img
              src={thumbnailSrc}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-4 flex flex-col justify-between flex-1">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white line-clamp-2">
            {post.title}
          </h2>

          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-3">
            {post.excerpt || "No preview available..."}
          </p>

          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 flex justify-between items-center relative">
            <div className="flex items-center gap-2 relative">
              {/* Author link and hover badge */}
              <div
                className="relative group z-10"
                onClick={(e) => e.stopPropagation()} // prevent card click
              >
                <Link
                  to={`/profile/${authorSlug}`}
                  className="text-black dark:text-white hover:underline"
                >
                  {post.author || "Anonymous"}
                </Link>

                <AuthorBadge
                  author={{
                    name: post.author || "Anonymous",
                    bio: "A passionate writer",
                  }}
                />
              </div>

              <span className="mx-2">·</span>
              <span>{formattedDate}</span>
            </div>

            {/* Read more link */}
            {post.slug && (
              <Link
                to={`/post/${post.slug}`}
                className="text-blue-500 hover:underline z-10"
                onClick={(e) => e.stopPropagation()} // prevent card click
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
