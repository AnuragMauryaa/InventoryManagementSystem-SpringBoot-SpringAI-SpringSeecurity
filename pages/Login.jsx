import { useState } from "react";
import {
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const { user, login } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || "/";

  if (user) {
    return <Navigate to={from} replace />;
  }

  const submit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const result = await login(username, password);

      if (result.ok) {
        navigate(from, { replace: true });
      } else {
        setError(result.error || "Login failed.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-brand">📦 IMS</div>

        <h1>Sign in</h1>

        <p className="muted">
          Inventory Management System
        </p>

        <form
          onSubmit={submit}
          className="login-form"
        >
          <div className="form-field">
            <label htmlFor="username">
              Username
            </label>

            <input
              id="username"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              placeholder="Enter username"
              autoComplete="username"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Enter password"
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            style={{ width: "100%" }}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
