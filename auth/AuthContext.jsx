import { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "../api/api";

const AuthContext = createContext(null);

const TOKEN_KEY = "ims.auth.token";
const USER_KEY = "ims.auth.user";

const PERMISSIONS = {
  ADMIN: ["view", "create", "edit", "adjust", "manageUsers"],
  MANAGER: ["view", "create", "edit", "adjust"],
  STAFF: ["view"],
};

function normalizeRole(role) {
  if (!role) return "";

  return String(role)
    .replace(/^ROLE_/i, "")
    .toUpperCase();
}

function normalizeUser(data, username = "") {
  const source = data?.user || data || {};

  const resolvedUsername =
    source.username ||
    source.userName ||
    username;

  const role = normalizeRole(
    source.role ||
      source.roleType ||
      source.roleName ||
      source.authority
  );

  return {
    ...source,
    username: resolvedUsername,
    fullName:
      source.fullName ||
      source.full_name ||
      source.name ||
      resolvedUsername,
    name:
      source.name ||
      source.fullName ||
      source.full_name ||
      resolvedUsername,
    role,
  };
}

function readStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);

    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() =>
    localStorage.getItem(TOKEN_KEY)
  );

  const [user, setUser] = useState(
    readStoredUser
  );

  const [loading, setLoading] = useState(false);

  /*
   * Restore the locally stored session.
   *
   * We intentionally do not call /api/auth/me here because
   * that endpoint is not established in the current backend.
   *
   * The JWT is validated by Spring Security whenever a
   * protected API request is made.
   */
  useEffect(() => {
    const storedToken =
      localStorage.getItem(TOKEN_KEY);

    const storedUser =
      readStoredUser();

    if (!storedToken || !storedUser) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);

      setToken(null);
      setUser(null);
    }
  }, []);

  const login = async (
    username,
    password
  ) => {
    setLoading(true);

    try {
      const response =
        await authApi.login({
          username: username.trim(),
          password,
        });

      /*
       * Support the possible JWT property names
       * without changing the backend.
       */
      const receivedToken =
        response?.token ||
        response?.accessToken ||
        response?.jwt ||
        response?.access_token;

      if (!receivedToken) {
        return {
          ok: false,
          error:
            response?.message ||
            "Login succeeded but no JWT token was returned.",
        };
      }

      const loggedInUser =
        normalizeUser(
          response,
          username.trim()
        );

      localStorage.setItem(
        TOKEN_KEY,
        receivedToken
      );

      localStorage.setItem(
        USER_KEY,
        JSON.stringify(loggedInUser)
      );

      setToken(receivedToken);
      setUser(loggedInUser);

      return {
        ok: true,
        user: loggedInUser,
      };
    } catch (error) {
      console.error(
        "Login request failed:",
        error
      );

      return {
        ok: false,
        error:
          error?.message ||
          "Unable to connect to the backend.",
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    registrationData
  ) => {
    setLoading(true);

    try {
      const response =
        await authApi.register(
          registrationData
        );

      /*
       * Registration normally creates the user.
       * Some implementations may also return a JWT.
       */
      const receivedToken =
        response?.token ||
        response?.accessToken ||
        response?.jwt ||
        response?.access_token;

      if (receivedToken) {
        const registeredUser =
          normalizeUser(
            response,
            registrationData.username
          );

        localStorage.setItem(
          TOKEN_KEY,
          receivedToken
        );

        localStorage.setItem(
          USER_KEY,
          JSON.stringify(
            registeredUser
          )
        );

        setToken(receivedToken);
        setUser(registeredUser);

        return {
          ok: true,
          authenticated: true,
          user: registeredUser,
        };
      }

      return {
        ok: true,
        authenticated: false,
        message:
          response?.message ||
          "Registration successful. Please sign in.",
      };
    } catch (error) {
      console.error(
        "Registration request failed:",
        error
      );

      return {
        ok: false,
        error:
          error?.message ||
          "Unable to connect to the backend.",
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    setToken(null);
    setUser(null);
  };

  const can = (action) => {
    if (!user) return false;

    const role =
      normalizeRole(user.role);

    return (
      PERMISSIONS[role]?.includes(
        action
      ) ?? false
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: Boolean(token),
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
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  return context;
}
