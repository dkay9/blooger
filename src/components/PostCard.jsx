import { AuthorBadge } from "./AuthorBadge";
import { Link } from "react-router-dom";

export default function PostCard({ post }) {
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

  return (
    <div className="relative shadow-lg md:shadow-sm transition-shadow duration-300 min-h-[10rem] md:h-40 cursor-pointer mb-14 overflow-visible">
      <div className="flex flex-col md:flex-row md:items-center md:gap-x-6">
        {thumbnailSrc && (
          <Link
            to={post.slug ? `/post/${post.slug}` : "#"}
            className="w-full h-48 md:w-40 md:h-full flex-shrink-0"
          >
            <img
              src={thumbnailSrc}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </Link>
        )}

        <div className="p-4 flex flex-col justify-between flex-1">
          <Link to={post.slug ? `/post/${post.slug}` : "#"}>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white line-clamp-2">
              {post.title}
            </h2>
          </Link>

          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-3">
            {post.excerpt || "No preview available..."}
          </p>

          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 flex justify-between items-center relative">
            <div className="flex items-center gap-2 relative">
              {/* Wrap only the author in a group for hover */}
              <div className="relative group">
                <Link
                  to={`/profile/${authorSlug}`}
                  className="text-black dark:text-white hover:underline relative z-10"
                >
                  {post.author || "Anonymous"}
                </Link>

                {/* Show only on author name hover */}
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
