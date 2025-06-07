import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { Sun, Moon } from "lucide-react";
import { isLoggedIn, logout } from '../utils/auth';
import { useState } from "react";

export default function Header() {
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="bg-white dark:bg-black text-black dark:text-white shadow-sm shadow-white px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="flex justify-between items-center w-full sm:w-auto">
        <Link to="/" className="text-2xl font-bold">Blooger</Link>
        <button onClick={toggleTheme} className="sm:hidden text-gray-600 dark:text-yellow-300">
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      <form onSubmit={handleSearch} className="flex-1 max-w-md mx-auto w-full">
        <input
          type="text"
          placeholder="Search articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 rounded-md border dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </form>

      <nav className="flex items-center gap-4">
        <Link to="/" className="hover:text-blue-500">Home</Link>
        {loggedIn ? (
          <>
            <Link to="/dashboard" className="hover:text-blue-500">Dashboard</Link>
            <button onClick={() => navigate("/login")} className="text-red-600 hover:underline">Logout</button>
          </>
        ) : (
          <Link to="/login" className="hover:text-blue-500">Login</Link>
        )}
        <button onClick={toggleTheme} className="hidden sm:inline text-gray-600 dark:text-white">
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </nav>
    </header>
  );
}
