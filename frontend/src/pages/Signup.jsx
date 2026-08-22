import { Link } from "react-router-dom";
import "../css/Signup.css";

const Signup = () => {
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
              onSubmit={(event) => event.preventDefault()}
            >

              <div className="signup-field">

                <label htmlFor="signup-name">
                  Full Name
                </label>

                <input
                  id="signup-name"
                  type="text"
                  placeholder="Enter your full name"
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
                />

              </div>


              <label className="signup-terms">

                <input type="checkbox" />

                <span>
                  I understand that CropShield is currently
                  a frontend demonstration and my information
                  will not be permanently stored.
                </span>

              </label>


              <button
                type="submit"
                className="signup-submit-button"
              >
                Create Account
                <span>→</span>
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
              Demo interface — account data is not currently saved.
            </p>

          </div>

        </div>


        {/* Right Side */}
        <div className="signup-brand-side">

          <Link to="/" className="signup-logo signup-brand-logo">
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