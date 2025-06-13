import { Link } from "react-router-dom";

export function AuthorBadge({ author }) {
  const slugify = (str) =>
    str?.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");

  return (
    <Link
      to={`/profile/${slugify(author.name)}`}
      className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 shadow-md rounded px-3 py-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50 w-64 pointer-events-auto"
    >
      <div className="font-semibold">{author.name}</div>
      <div className="text-xs text-gray-500 dark:text-gray-400">{author.bio}</div>
    </Link>
  );
}
