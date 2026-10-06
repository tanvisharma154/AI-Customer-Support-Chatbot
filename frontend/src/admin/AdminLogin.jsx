
import { useState } from "react";
import { ShieldCheck, Lock, User, Eye, EyeOff, ArrowRight } from "lucide-react";
import "./AdminLogin.css";

function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!username || !password) {
      setError("Please enter username and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/admin/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Invalid username or password"
        );
      }

      // Login successful
      onLogin();

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">

      <div className="admin-login-card">

        {/* Logo */}
        <div className="admin-logo">
          <ShieldCheck size={30} />
        </div>

        <h1>Admin Portal</h1>

        <p className="admin-subtitle">
          Sign in to manage your AI customer support system.
        </p>

        <form onSubmit={handleLogin}>

          {/* Username */}
          <div className="admin-field">

            <label>Username</label>

            <div className="admin-input-wrapper">

              <User size={18} />

              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

            </div>

          </div>

          {/* Password */}
          <div className="admin-field">

            <label>Password</label>

            <div className="admin-input-wrapper">

              <Lock size={18} />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>

            </div>

          </div>

          {/* Error */}
          {error && (
            <div className="admin-error">
              {error}
            </div>
          )}

          {/* Login button */}
          <button
            type="submit"
            className="admin-login-btn"
            disabled={loading}
          >
            {loading ? (
              "Signing in..."
            ) : (
              <>
                Sign In
                <ArrowRight size={18} />
              </>
            )}
          </button>

        </form>

        <div className="admin-security">
          <ShieldCheck size={15} />
          <span>Secure Admin Access</span>
        </div>

      </div>

    </div>
  );
}

export default AdminLogin;
