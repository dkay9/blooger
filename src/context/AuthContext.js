import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // To prevent flickering

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return setCurrentUser(null);

    try {
      const res = await axios.get("http://localhost:5050/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrentUser(res.data);
    } catch {
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    fetchUser().finally(() => setLoading(false));
  }, []);

  const login = async ({ email, password }) => {
  const res = await axios.post("http://localhost:5050/api/auth/login", {
    email,
    password,
  });
  localStorage.setItem("token", res.data.token);
  await fetchUser();
};


  const logout = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, fetchUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
