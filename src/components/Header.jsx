import { Link, useNavigate } from "react-router-dom";
import {
  Sun,
  Moon,
  PencilLine,
  Bell,
  Menu,
  X,
  LogIn,
  LogOut,
  User,
  Home,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const slugify = (str) =>
  str?.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");


  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="relative bg-white dark:bg-gray-800 text-black dark:text-white shadow px-4 md:px-20 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold whitespace-nowrap">
          Blooger
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex-grow max-w-md mx-2">
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 rounded-md border dark:border-gray-700 dark:bg-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </form>

        {/* Hamburger / Desktop Nav */}
        <div className="flex items-center gap-3">
          {/* Mobile Hamburger */}
          <button className="sm:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Desktop Nav */}
          <nav className="hidden sm:flex items-center gap-4">
            {currentUser ? (
              <>
                <Link to="/" title="Home" className="hover:text-blue-500">
                  <Home className="w-5 h-5" />
                </Link>
                <Link to="/editor" title="New Post" className="hover:text-blue-500">
                  <PencilLine className="w-5 h-5" />
                </Link>
                <Link to="/notifications" title="Notifications" className="hover:text-blue-500">
                  <Bell className="w-5 h-5" />
                </Link>
                <Link to={`/profile/${slugify(currentUser.name)}`} title="Profile" className="hover:text-blue-500">
                  <User className="w-5 h-5" />
                </Link>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="text-red-600 hover:text-red-700"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <Link to="/login" className="hover:text-blue-500">
                Login
              </Link>
            )}
            <button
              onClick={toggleTheme}
              className="text-gray-600 dark:text-white"
              title="Toggle Theme"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          </nav>
        </div>
      </div>

      {/* Mobile dropdown menu with icons */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 w-full z-50 bg-white dark:bg-gray-800 p-4 shadow-md border-t dark:border-gray-700"
          >
            <div className="flex flex-col gap-3 text-sm">
              {currentUser ? (
                <>
                  <Link
                    to="/"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2"
                  >
                    <Home className="w-4 h-4" />
                    Home
                  </Link>
                  <Link
                    to="/editor"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2"
                  >
                    <PencilLine className="w-4 h-4" />
                    Write Post
                  </Link>
                  <Link
                    to={`/profile/${slugify(currentUser.name)}`}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2"
                  >
                    <User className="w-5 h-5" />
                    Profile
                  </Link>
                  <Link
                    to="/notifications"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2"
                  >
                    <Bell className="w-4 h-4" />
                    Notifications
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="flex items-center gap-2 text-red-600"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>
              )}

              <button
                onClick={() => {
                  toggleTheme();
                  setMenuOpen(false);
                }}
                className="flex items-center gap-2 text-gray-600 dark:text-white"
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
                Toggle Theme
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
