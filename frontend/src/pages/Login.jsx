import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "../css/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    // Frontend validation
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      // Send login request to backend
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      // Backend returned an error
      if (!response.ok) {
        setError(data.message || "Invalid email or password.");
        return;
      }

      // Save authenticated user and JWT
      // Remember Me decides localStorage vs sessionStorage
      login(data.user, data.token, rememberMe);

      // Go to dashboard
      navigate("/dashboard");

    } catch (error) {
      console.error("Login error:", error);

      setError(
        "Unable to connect to the server. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-container">

        {/* Left Side */}
        <div className="auth-brand-side">

          <Link to="/" className="auth-logo">
            <span className="auth-logo-icon">🌱</span>
            <span>CropShield</span>
          </Link>

          <div className="auth-brand-content">

            <span className="auth-label">
              WELCOME BACK
            </span>

            <h1>
              Your crop-loss
              <span> records, together.</span>
            </h1>

            <p>
              Sign in to access your CropShield dashboard and
              review your documented crop-loss history.
            </p>

            <div className="auth-benefits">

              <div className="auth-benefit">
                <span>✓</span>
                <p>Review previous reports</p>
              </div>

              <div className="auth-benefit">
                <span>✓</span>
                <p>Keep your evidence organized</p>
              </div>

              <div className="auth-benefit">
                <span>✓</span>
                <p>Track your crop-loss history</p>
              </div>

            </div>

          </div>

          <div className="auth-side-footer">
            CropShield · Farmer Crop-Loss Assistant
          </div>

        </div>


        {/* Right Side */}
        <div className="auth-form-side">

          <div className="auth-form-wrapper">

            <div className="mobile-auth-logo">
              <Link to="/" className="auth-logo">
                <span className="auth-logo-icon">🌱</span>
                <span>CropShield</span>
              </Link>
            </div>

            <div className="auth-form-header">

              <span className="auth-form-label">
                ACCOUNT LOGIN
              </span>

              <h2>Welcome back</h2>

              <p>
                Enter your details to access your account.
              </p>

            </div>


            <form
              className="auth-form"
              onSubmit={handleSubmit}
            >

              <div className="form-field">

                <label htmlFor="login-email">
                  Email Address
                </label>

                <input
                  id="login-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                />

              </div>


              <div className="form-field">

                <div className="form-label-row">

                  <label htmlFor="login-password">
                    Password
                  </label>

                </div>

                <input
                  id="login-password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                />

              </div>


              <label className="remember-me">

                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) =>
                    setRememberMe(event.target.checked)
                  }
                />

                <span>
                  Remember me
                </span>

              </label>


              {error && (
                <p className="auth-error">
                  {error}
                </p>
              )}


              <button
                type="submit"
                className="auth-submit-button"
                disabled={loading}
              >
                {loading ? "Logging In..." : "Log In"}

                {!loading && <span>→</span>}
              </button>

            </form>


            <div className="auth-divider">
              <span>OR</span>
            </div>


            <div className="auth-switch">

              <p>
                Don't have an account?
              </p>

              <Link to="/signup">
                Create an account
              </Link>

            </div>


            <p className="auth-demo-note">
              Your account is securely stored in the
              CropShield database.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Login;