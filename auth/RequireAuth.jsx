import {
  Navigate,
  useLocation,
} from "react-router-dom";

import { useAuth } from "./AuthContext";

export default function RequireAuth({
  children,
}) {
  const {
    user,
    token,
    loading,
  } = useAuth();

  const location =
    useLocation();

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f4f6fa",
          color: "#6b7280",
          fontSize: "14px",
        }}
      >
        Loading...
      </div>
    );
  }

  if (!token || !user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  return children;
}
