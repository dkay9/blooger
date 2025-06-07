import { Link, useNavigate } from "react-router-dom";
import { isLoggedIn, logout } from "../utils/auth"; 

export default function Header() {
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-black">Blooger</Link>

      <nav className="space-x-4">
        <Link to="/" className="text-gray-700 hover:text-blue-500">Home</Link>
        {loggedIn ? (
          <>
            <Link to="/dashboard" className="text-gray-700 hover:text-blue-500">Dashboard</Link>
            <button onClick={handleLogout} className="text-red-600 hover:underline">Logout</button>
          </>
        ) : (
          <Link to="/login" className="text-gray-700 hover:text-blue-500">Login</Link>
        )}
      </nav>
    </header>
  );
}
