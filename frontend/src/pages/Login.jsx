import { Link } from "react-router-dom";
import "../css/Login.css";

const Login = () => {
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
              onSubmit={(event) => event.preventDefault()}
            >

              <div className="form-field">

                <label htmlFor="login-email">
                  Email Address
                </label>

                <input
                  id="login-email"
                  type="email"
                  placeholder="you@example.com"
                />

              </div>


              <div className="form-field">

                <div className="form-label-row">
                  <label htmlFor="login-password">
                    Password
                  </label>

                  <button
                    type="button"
                    className="forgot-password"
                  >
                    Forgot password?
                  </button>
                </div>

                <input
                  id="login-password"
                  type="password"
                  placeholder="Enter your password"
                />

              </div>


              <label className="remember-me">

                <input
                  type="checkbox"
                />

                <span>
                  Remember me
                </span>

              </label>


              <button
                type="submit"
                className="auth-submit-button"
              >
                Log In
                <span>→</span>
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
              Demo interface — account data is not currently saved.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Login;