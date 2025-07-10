import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "./ui/hover-card";
import { MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function AuthorHoverCard({ author }) {
  if (!author || typeof author !== "object") {
    return <span className="text-gray-400">Anonymous</span>;
  }

  const authorSlug = author.name?.toLowerCase().replace(/\s+/g, "-");

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Link
          to={`/profile/${authorSlug}`}
          className="font-medium hover:underline text-black dark:text-white"
          onClick={(e) => e.stopPropagation()}
        >
          {author.name}
        </Link>
      </HoverCardTrigger>

      <HoverCardContent className="bg-white dark:bg-gray-800 rounded-md border shadow-md w-72 p-4 space-y-2">
        {/* Avatar and name */}
        <div className="flex items-center gap-3">
          <img
            src={author.image || "/default-avatar.png"}
            alt={author.name}
            className="w-12 h-12 rounded-full object-cover border"
          />
          <div>
            <p className="font-semibold">{author.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              @{author.username || "anonymous"}
            </p>
          </div>
        </div>

        {/* Bio */}
        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
          {author.bio || "No bio available."}
        </p>

        {/* Actions */}
        <div className="flex justify-between items-center mt-3">
          <button className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
            Follow
          </button>
          <button className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-500">
            <MessageCircle size={18} />
          </button>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
