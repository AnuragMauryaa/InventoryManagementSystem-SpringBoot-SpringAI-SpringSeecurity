import { useState } from "react";
import {
  useLocation,
  useNavigate,
  Navigate,
  Link,
} from "react-router-dom";

import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const {
    user,
    login,
    loading: authLoading,
  } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const from =
    location.state?.from?.pathname || "/";

  /*
   * Already authenticated.
   */
  if (user && !authLoading) {
    return (
      <Navigate
        to={from}
        replace
      />
    );
  }

  const submit = async (event) => {
    event.preventDefault();

    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const result = await login(
        username.trim(),
        password
      );

      if (result?.ok) {
        navigate(from, {
          replace: true,
        });

        return;
      }

      setError(
        result?.error ||
          "Invalid username or password."
      );
    } catch (err) {
      console.error(
        "Login failed:",
        err
      );

      setError(
        err?.message ||
          "Unable to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-screen">
      <div className="login-card">

        <div className="login-brand">
          <span className="login-brand-icon">
            📦
          </span>

          <span>IMS</span>
        </div>

        <div className="login-heading">
          <h1>Sign in</h1>

          <p>
            Inventory Management System
          </p>
        </div>

        <form
          className="login-form"
          onSubmit={submit}
        >
          <div className="form-field">
            <label htmlFor="username">
              Username
            </label>

            <input
              id="username"
              name="username"
              type="text"
              value={username}
              onChange={(event) =>
                setUsername(
                  event.target.value
                )
              }
              placeholder="Enter username"
              autoComplete="username"
              autoFocus
              disabled={loading}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
              placeholder="Enter password"
              autoComplete="current-password"
              disabled={loading}
              required
            />
          </div>

          {error && (
            <div
              className="login-error"
              role="alert"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            className="login-submit"
            disabled={
              loading ||
              !username.trim() ||
              !password
            }
          >
            {loading
              ? "Signing in..."
              : "Sign in"}
          </button>
        </form>

        <div className="login-register">
          <span>
            Don't have an account?
          </span>

          <Link to="/register">
            Create an account
          </Link>
        </div>

      </div>
    </div>
  );
}
