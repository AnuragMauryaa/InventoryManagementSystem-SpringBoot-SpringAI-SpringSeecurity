import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/auth/me");
        setUser(response.data);
      } catch (error) {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await api.post("/auth/login", {
        username,
        password,
      });

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      setUser(user);

      return {
        ok: true,
        user,
      };
    } catch (error) {
      return {
        ok: false,
        error:
          error.response?.data?.message ||
          error.response?.data ||
          "Invalid username or password.",
      };
    }
  };

  const register = async (registrationData) => {
    try {
      await api.post("/auth/register", registrationData);

      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error:
          error.response?.data?.message ||
          error.response?.data ||
          "Registration failed.",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const can = (action) => {
    if (!user) return false;

    const role =
      user.role?.roleType ||
      user.role?.name ||
      user.role;

    const permissions = {
      Admin: [
        "view",
        "create",
        "edit",
        "adjust",
        "manageUsers",
      ],

      Manager: [
        "view",
        "create",
        "edit",
        "adjust",
      ],

      Staff: [
        "view",
      ],
    };

    return permissions[role]?.includes(action) || false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        can,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error(
      "useAuth must be used within an AuthProvider"
    );
  }

  return ctx;
}
