import { useParams } from "react-router-dom";
import Header from "../components/Header";

export default function Post({ posts }) {
  const { slug } = useParams();
  const post = posts.find(p => p.slug === slug);

  if (!post) {
    return <div className="p-8 text-center text-gray-500">Post not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        <Header />
        <div className="max-w-3xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold mb-4">{post.title}</h1>

            <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                <span>By {post.author || "Anonymous"}</span>
                <span className="mx-2">·</span>
                <span>
                {new Date(post.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                })}
                </span>
            </div>

            {post.thumbnail && (
                <img
                src={
                    typeof post.thumbnail === "string"
                    ? post.thumbnail
                    : URL.createObjectURL(post.thumbnail)
                }
                alt={post.title}
                className="w-full max-h-[20rem] object-cover rounded mb-6"
                />
            )}

            <div className="prose prose-lg dark:prose-invert">
                {post.content || "No content available."}
            </div>
        </div>
    </div>
  );
}
