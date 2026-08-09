import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

const STORAGE_KEY = "ims.auth.user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = async (username, password) => {
    try {
      const response = await api.post("/auth/login", {
        username,
        password,
      });

      const data = response.data;

      /*
       * Your backend login response should contain the JWT.
       * Common possibilities:
       * { token: "..." }
       * or { accessToken: "..." }
       */

      const token = data.token || data.accessToken;

      if (!token) {
        return {
          ok: false,
          error: "Login succeeded but JWT token was not returned.",
        };
      }

      localStorage.setItem("token", token);

      const loggedInUser = {
        username: data.username || username,
        name: data.fullName || data.name || username,
        role: data.role || "Staff",
      };

      setUser(loggedInUser);

      return {
        ok: true,
        user: loggedInUser,
      };
    } catch (error) {
      console.error("Login error:", error);

      return {
        ok: false,
        error:
          error.response?.data?.message ||
          error.response?.data ||
          "Invalid username or password.",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const can = (action) => {
    if (!user) return false;

    const permissions = {
      Admin: ["view", "create", "edit", "adjust", "manageUsers"],
      Manager: ["view", "create", "edit", "adjust"],
      Staff: ["view"],
    };

    return permissions[user.role]?.includes(action) || false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
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
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return ctx;
}
