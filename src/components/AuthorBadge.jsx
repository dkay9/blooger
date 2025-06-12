export function AuthorBadge({ author }) {
  if (!author?.name) return null;

  return (
    <div className="absolute left-0 top-full z-20 mt-1 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-3 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
      <p className="font-semibold">{author.name}</p>
      <p className="text-gray-600 dark:text-gray-400">{author.bio || "No bio available."}</p>
    </div>
  );
}
