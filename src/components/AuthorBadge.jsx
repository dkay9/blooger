export function AuthorBadge({ name, bio }) {
  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 z-50 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-xl rounded-lg p-4 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 pointer-events-none">
      <div className="text-sm leading-snug">
        <p className="font-semibold">{name}</p>
        <p className="text-gray-600 dark:text-gray-400 mt-1">{bio || "No bio available."}</p>
      </div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full w-3 h-3 bg-white dark:bg-gray-800 rotate-45 shadow-md" />
    </div>
  );
}
