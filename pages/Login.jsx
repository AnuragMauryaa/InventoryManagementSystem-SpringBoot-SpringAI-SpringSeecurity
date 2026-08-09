import { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { useAuth, DEMO_USERS } from "../auth/AuthContext";

export default function Login() {
  const { user, login } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const from = location.state?.from?.pathname || "/";

  if (user) {
    return <Navigate to={from} replace />;
  }

  const submit = (e) => {
    e.preventDefault();

    setError("");

    const result = login(username, password);

    if (result.ok) {
      navigate(from, { replace: true });
    } else {
      setError(result.error);
    }
  };

  const pickDemoUser = (demoUser) => {
    setUsername(demoUser.username);
    setPassword("demo");
    setError("");
  };

  return (
    <div className="login-screen">
      <div className="login-card">

        <div className="login-brand">
          📦 <span>IMS</span>
        </div>

        <div className="login-heading">
          <h1>Sign in</h1>
          <p>Inventory Management System</p>
        </div>

        <form onSubmit={submit} className="login-form">

          <div className="form-field">
            <label htmlFor="username">
              Username
            </label>

            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
              onChange={(e) => setPassword(e.target.value)}
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
            className="login-submit"
          >
            Sign in
          </button>
        </form>

        <div className="login-demo">
          <p>
            Demo accounts
            <span>
              {" "}
              (password: <code>demo</code>)
            </span>
          </p>

          <div className="login-roles">
            {DEMO_USERS.map((demoUser) => (
              <button
                key={demoUser.username}
                type="button"
                className="secondary"
                onClick={() => pickDemoUser(demoUser)}
              >
                {demoUser.role}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
