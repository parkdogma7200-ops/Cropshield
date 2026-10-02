import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/Signup.css";

const Signup = () => {
  const navigate = useNavigate();

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
      setError("Please accept the terms before continuing.");
      return;
    }

    try {
      setLoading(true);

      // Send signup request to backend
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
        setError(data.message || "Unable to create your account.");
        return;
      }

      // Account was created successfully
      navigate("/login", {
        state: {
          message: "Account created successfully. You can now log in.",
        },
      });

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

        <div className="signup-form-side">

          <div className="signup-form-wrapper">

            <div className="signup-form-header">

              <span className="signup-label">
                CREATE YOUR ACCOUNT
              </span>

              <h1>Join CropShield</h1>

              <p>
                Create your account to start using CropShield.
              </p>

            </div>

            <form
              className="signup-form"
              onSubmit={handleSubmit}
            >

              <div className="signup-field">

                <label>
                  Full name
                </label>

                <input
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  required
                />

              </div>


              <div className="signup-field">

                <label>
                  Email address
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value.trim())
                  }
                  required
                />

              </div>


              <div className="signup-field">

                <label>
                  Password
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  required
                />

              </div>


              <div className="signup-field">

                <label>
                  Confirm password
                </label>

                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  required
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
                  I agree to the terms and conditions.
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
                {loading
                  ? "Creating account..."
                  : "Create account"}
              </button>

            </form>


            <div className="signup-login-switch">

              <p>
                Already have an account?
              </p>

              <Link to="/login">
                Log in
              </Link>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Signup;
