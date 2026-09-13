import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "../css/Signup.css";

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    // Frontend validation
    if (!name || !email || !password || !confirmPassword) {
      setError("Please complete all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!acceptedTerms) {
      setError("Please accept the terms before creating your account.");
      return;
    }

    try {
      setLoading(true);

      // Send signup information to backend
      const response = await fetch(
        "http://localhost:5000/api/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      // Backend returned an error
      if (!response.ok) {
        setError(data.message || "Unable to create account.");
        return;
      }

      // Save authenticated user and JWT
      login(data.user, data.token);

      // Go to dashboard
      navigate("/dashboard");

    } catch (error) {
      console.error("Signup error:", error);

      setError(
        "Unable to connect to the server. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">

      <div className="signup-container">

        {/* Left Side */}
        <div className="signup-form-side">

          <div className="signup-form-wrapper">

            <div className="signup-mobile-logo">
              <Link to="/" className="signup-logo">
                <span>🌱</span>
                CropShield
              </Link>
            </div>

            <div className="signup-form-header">

              <span className="signup-label">
                CREATE YOUR ACCOUNT
              </span>

              <h1>Join CropShield</h1>

              <p>
                Create an account to start organizing your
                crop-loss records.
              </p>

            </div>


            <form
              className="signup-form"
              onSubmit={handleSubmit}
            >

              <div className="signup-field">

                <label htmlFor="signup-name">
                  Full Name
                </label>

                <input
                  id="signup-name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />

              </div>


              <div className="signup-field">

                <label htmlFor="signup-email">
                  Email Address
                </label>

                <input
                  id="signup-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />

              </div>


              <div className="signup-field">

                <label htmlFor="signup-password">
                  Password
                </label>

                <input
                  id="signup-password"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />

              </div>


              <div className="signup-field">

                <label htmlFor="signup-confirm-password">
                  Confirm Password
                </label>

                <input
                  id="signup-confirm-password"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                />

              </div>


              <label className="signup-terms">

                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(event) =>
                    setAcceptedTerms(event.target.checked)
                  }
                />

                <span>
                  I understand that my account information
                  will be securely stored by CropShield.
                </span>

              </label>


              {error && (
                <p className="signup-error">
                  {error}
                </p>
              )}


              <button
                type="submit"
                className="signup-submit-button"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create Account"}
                {!loading && <span>→</span>}
              </button>

            </form>


            <div className="signup-divider">
              <span>OR</span>
            </div>


            <div className="signup-login-switch">

              <p>
                Already have an account?
              </p>

              <Link to="/login">
                Log in
              </Link>

            </div>


            <p className="signup-demo-note">
              Your account information is securely stored
              in the CropShield database.
            </p>

          </div>

        </div>


        {/* Right Side */}
        <div className="signup-brand-side">

          <Link
            to="/"
            className="signup-logo signup-brand-logo"
          >
            <span>🌱</span>
            CropShield
          </Link>


          <div className="signup-brand-content">

            <span className="signup-brand-label">
              YOUR FARM. YOUR RECORDS.
            </span>

            <h2>
              Keep your crop-loss
              <span> history organized.</span>
            </h2>

            <p>
              CropShield gives you a simple place to document
              crop damage and keep important information together.
            </p>


            <div className="signup-preview">

              <div className="signup-preview-header">
                <span>YOUR FARM RECORD</span>

                <span className="signup-preview-status">
                  ACTIVE
                </span>
              </div>


              <div className="signup-preview-main">

                <div className="signup-preview-icon">
                  🌾
                </div>

                <div>
                  <strong>Crop-loss history</strong>
                  <span>All your reports in one place</span>
                </div>

              </div>


              <div className="signup-preview-stats">

                <div>
                  <strong>08</strong>
                  <span>Reports</span>
                </div>

                <div>
                  <strong>16</strong>
                  <span>Evidence</span>
                </div>

                <div>
                  <strong>3.4</strong>
                  <span>Acres</span>
                </div>

              </div>

            </div>

          </div>


          <div className="signup-brand-footer">
            CropShield · Farmer Crop-Loss Assistant
          </div>

        </div>

      </div>

    </div>
  );
};

export default Signup;

