import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'STAFF', // Default selection
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const update = (event) => {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setError('');

    if (values.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (values.password !== values.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSaving(true);

    const result = await register({
  fullName: values.fullName.trim(),
  username: values.username.trim(),
  email: values.email.trim(),
  phone: values.phone.trim() || null,
  password: values.password,
  role: values.role,
});
    setSaving(false);

    if (result.ok) {
  navigate("/login");
} else {
  setError(result.error);
}

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-brand">IMS</div>
        <h1>Create account</h1>
        <p className="muted">Select your role to determine your access level.</p>
        <form onSubmit={submit} className="login-form">
          <div className="form-field">
            <label htmlFor="fullName">Full name</label>
            <input id="fullName" name="fullName" value={values.fullName} onChange={update} required autoComplete="name" />
          </div>
          <div className="form-field">
            <label htmlFor="username">Username</label>
            <input id="username" name="username" value={values.username} onChange={update} required autoComplete="username" />
          </div>
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" value={values.email} onChange={update} required autoComplete="email" />
          </div>
          <div className="form-field">
            <label htmlFor="phone">Phone <span className="muted">(optional)</span></label>
            <input id="phone" name="phone" value={values.phone} onChange={update} autoComplete="tel" />
          </div>
          <div className="form-field">
            <label htmlFor="role">Role</label>
            <select id="role" name="role" value={values.role} onChange={update}>
              <option value="STAFF">Staff (View Only)</option>
              <option value="MANAGER">Manager (Manage Inventory)</option>
              <option value="ADMIN">Admin (Full Access)</option>
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" minLength="8" value={values.password} onChange={update} required autoComplete="new-password" />
          </div>
          <div className="form-field">
            <label htmlFor="confirmPassword">Confirm password</label>
            <input id="confirmPassword" name="confirmPassword" type="password" minLength="8" value={values.confirmPassword} onChange={update} required autoComplete="new-password" />
          </div>
          {error && <div className="login-error">{error}</div>}
          <button type="submit" style={{ width: '100%' }} disabled={saving}>
            {saving ? 'Creating account...' : 'Create account'}
          </button>
        </form>
        <p className="muted" style={{ marginTop: 16, textAlign: 'center' }}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
