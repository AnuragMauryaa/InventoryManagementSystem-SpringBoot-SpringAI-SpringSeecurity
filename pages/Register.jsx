import { useState } from "react";
import {
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../auth/AuthContext";

export default function Register() {
  const {
    user,
    register,
    loading,
  } = useAuth();

  const navigate =
    useNavigate();

  const [form, setForm] =
    useState({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      phone: "",
    });

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  if (user) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  const updateField = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const submit = async (
    event
  ) => {
    event.preventDefault();

    if (loading) return;

    setError("");
    setSuccess("");

    if (
      form.password !==
      form.confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );

      return;
    }

    if (form.password.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );

      return;
    }

    const payload = {
      username:
        form.username.trim(),

      email:
        form.email.trim(),

      password:
        form.password,

      fullName:
        form.fullName.trim(),

      phone:
        form.phone.trim(),
    };

    const result =
      await register(payload);

    if (!result?.ok) {
      setError(
        result?.error ||
          "Registration failed."
      );

      return;
    }

    if (result.authenticated) {
      navigate("/", {
        replace: true,
      });

      return;
    }

    setSuccess(
      result.message ||
        "Registration successful. Please sign in."
    );

    setTimeout(() => {
      navigate("/login", {
        replace: true,
      });
    }, 1000);
  };

  return (
    <div className="login-screen">
      <div
        className="login-card"
        style={{
          maxWidth: 440,
        }}
      >
        <div className="login-brand">
          <span>📦</span>
          <span>IMS</span>
        </div>

        <div className="login-heading">
          <h1>
            Create account
          </h1>

          <p>
            Inventory Management System
          </p>
        </div>

        <form
          className="login-form"
          onSubmit={submit}
        >
          <div className="form-field">
            <label htmlFor="fullName">
              Full name
            </label>

            <input
              id="fullName"
              name="fullName"
              value={form.fullName}
              onChange={updateField}
              placeholder="Enter full name"
              autoComplete="name"
              disabled={loading}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="username">
              Username
            </label>

            <input
              id="username"
              name="username"
              value={form.username}
              onChange={updateField}
              placeholder="Choose a username"
              autoComplete="username"
              disabled={loading}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={updateField}
              placeholder="Enter email"
              autoComplete="email"
              disabled={loading}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="phone">
              Phone
            </label>

            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={updateField}
              placeholder="Enter phone number"
              autoComplete="tel"
              disabled={loading}
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
              value={form.password}
              onChange={updateField}
              placeholder="Create password"
              autoComplete="new-password"
              disabled={loading}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="confirmPassword">
              Confirm password
            </label>

            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={
                form.confirmPassword
              }
              onChange={updateField}
              placeholder="Confirm password"
              autoComplete="new-password"
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

          {success && (
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 8,
                background:
                  "#dcfce7",
                color:
                  "#166534",
                fontSize: 13,
              }}
            >
              {success}
            </div>
          )}

          <button
            type="submit"
            className="login-submit"
            disabled={loading}
          >
            {loading
              ? "Creating account..."
              : "Create account"}
          </button>
        </form>

        <div className="login-register">
          <span>
            Already have an account?
          </span>

          <Link to="/login">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
