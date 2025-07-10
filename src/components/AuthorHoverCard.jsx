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

      <HoverCardContent className="bg-white dark:bg-gray-800 rounded-md shadow-md w-72 p-4 space-y-2">
        {/* Avatar and name */}
        <div className="flex items-center justify-between gap-3">
          <img
            src={author.image || "/default-avatar.png"}
            alt={author.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <button className="text-sm bg-transparent text-black dark:text-white border  px-3 py-1 rounded-xl hover:opacity-75">
            Follow
          </button>
        </div>
        <div>
            <p className="font-semibold text-black dark:text-white">{author.name}</p>
            {/* <p className="text-xs text-gray-500 dark:text-gray-400">
              @{author.username || "anonymous"}
            </p> */}
        </div>

        {/* Bio */}
        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
          {author.bio || "No bio available."}
        </p>

        
      </HoverCardContent>
    </HoverCard>
  );
}
