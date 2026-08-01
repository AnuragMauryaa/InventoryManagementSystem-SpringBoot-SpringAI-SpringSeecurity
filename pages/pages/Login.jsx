import { useState } from 'react';
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState(location.state?.username || '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Already signed in → send to where they were headed (or the dashboard).
  const from = location.state?.from?.pathname || '/';
  if (user) return <Navigate to={from} replace />;

  const submit = async (e) => {

    e.preventDefault();

    const res = await login(username, password);

    if (res.ok)
        navigate(from, { replace: true });
    else
        setError(res.error);

};

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-brand">📦 IMS</div>
        <h1>Sign in</h1>
        <p className="muted">Inventory Management System</p>

        <form onSubmit={submit} className="login-form">
          <div className="form-field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              autoComplete="username"
            />
          </div>
          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>
          {error && <div className="login-error">{error}</div>}
          {location.state?.message && <div className="login-success">{location.state.message}</div>}
          <button type="submit" style={{ width: '100%' }}>
            Sign in
          </button>
        </form>
        <p className="muted" style={{ marginTop: 16, textAlign: 'center' }}>
          New here? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
