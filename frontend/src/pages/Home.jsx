import { Link } from "react-router-dom";
import "../css/Home.css";

const Home = () => {
  return (
    <div className="home-page">

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">

          <div className="hero-content">
            <span className="hero-label">
              🌱 FARMER CROP-LOSS ASSISTANT
            </span>

            <h1>
              Document your loss.
              <span> Protect your claim.</span>
            </h1>

            <p className="hero-description">
              CropShield helps farmers organize crop-loss information,
              evidence, and reports in one simple place — making it easier
              to keep track of what happened when disaster strikes.
            </p>

            <div className="hero-actions">
              <Link to="/log-loss" className="primary-button">
                Record a Crop Loss
                <span>→</span>
              </Link>

              <Link to="/dashboard" className="secondary-button">
                View Dashboard
              </Link>
            </div>

            <div className="hero-trust">
              <div className="trust-item">
                <span>✓</span>
                <p>Organized evidence</p>
              </div>

              <div className="trust-item">
                <span>✓</span>
                <p>Location & date records</p>
              </div>

              <div className="trust-item">
                <span>✓</span>
                <p>Claim-ready reports</p>
              </div>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="hero-visual">
            <div className="hero-card-main">

              <div className="hero-card-header">
                <div>
                  <span className="small-label">RECENT LOSS</span>
                  <h3>Rice Field Damage</h3>
                </div>

                <span className="status-badge">
                  Documented
                </span>
              </div>

              <div className="field-visual">
                <div className="field-sky"></div>

                <div className="field">
                  <span>🌾</span>
                  <span>🌾</span>
                  <span>🌾</span>
                  <span>🌾</span>
                  <span>🌾</span>
                  <span>🌾</span>
                  <span>🌾</span>
                  <span>🌾</span>
                </div>
              </div>

              <div className="hero-card-details">
                <div>
                  <span>CAUSE</span>
                  <strong>Flood</strong>
                </div>

                <div>
                  <span>AFFECTED</span>
                  <strong>2.0 acres</strong>
                </div>

                <div>
                  <span>DATE</span>
                  <strong>18 Aug 2026</strong>
                </div>
              </div>

              <div className="evidence-progress">
                <div className="evidence-progress-header">
                  <span>Evidence collected</span>
                  <strong>4 / 4</strong>
                </div>

                <div className="progress-bar">
                  <div className="progress-fill"></div>
                </div>
              </div>

            </div>

            <div className="floating-stat floating-stat-top">
              <span className="floating-icon">📍</span>

              <div>
                <strong>GPS captured</strong>
                <small>23.8103° N, 90.4125° E</small>
              </div>
            </div>

            <div className="floating-stat floating-stat-bottom">
              <span className="floating-icon">📷</span>

              <div>
                <strong>4 photos</strong>
                <small>Evidence attached</small>
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* Stats Section */}
      <section className="home-stats-section">
        <div className="home-container stats-grid">

          <div className="home-stat">
            <strong>8</strong>
            <span>Previous reports</span>
          </div>

          <div className="home-stat">
            <strong>3.4</strong>
            <span>Acres affected</span>
          </div>

          <div className="home-stat">
            <strong>৳185K</strong>
            <span>Estimated losses</span>
          </div>

          <div className="home-stat">
            <strong>12</strong>
            <span>Evidence items</span>
          </div>

        </div>
      </section>


      {/* How It Works */}
      <section className="how-section">
        <div className="home-container">

          <div className="section-heading">
            <span className="section-label">HOW IT WORKS</span>

            <h2>
              From crop damage to
              <span> organized evidence.</span>
            </h2>

            <p>
              CropShield keeps the process simple. Record what happened,
              capture the important details, and keep everything together.
            </p>
          </div>

          <div className="steps-grid">

            <div className="step-card">
              <div className="step-number">01</div>

              <div className="step-icon">
                📷
              </div>

              <h3>Document the damage</h3>

              <p>
                Record the affected crop, type of damage, estimated area,
                and supporting photographs.
              </p>
            </div>


            <div className="step-card">
              <div className="step-number">02</div>

              <div className="step-icon">
                📍
              </div>

              <h3>Capture the details</h3>

              <p>
                Keep important information such as the date, location,
                and description of the loss together.
              </p>
            </div>


            <div className="step-card">
              <div className="step-number">03</div>

              <div className="step-icon">
                📊
              </div>

              <h3>Review your reports</h3>

              <p>
                See your previous crop-loss events in one dashboard and
                review the evidence associated with each report.
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* Feature Section */}
      <section className="features-section">
        <div className="home-container features-container">

          <div className="features-content">

            <span className="section-label">
              BUILT FOR FARMERS
            </span>

            <h2>
              Everything important,
              <span> in one place.</span>
            </h2>

            <p>
              When crop damage happens, important information can easily
              become scattered. CropShield gives farmers a central place
              to organize their loss documentation.
            </p>

            <Link to="/dashboard" className="text-link">
              Explore your dashboard
              <span>→</span>
            </Link>

          </div>


          <div className="features-list">

            <div className="feature-item">
              <div className="feature-icon">
                📸
              </div>

              <div>
                <h3>Photo Evidence</h3>
                <p>
                  Keep visual evidence associated with each loss event.
                </p>
              </div>
            </div>


            <div className="feature-item">
              <div className="feature-icon">
                📍
              </div>

              <div>
                <h3>Location Records</h3>
                <p>
                  Keep track of where crop damage occurred.
                </p>
              </div>
            </div>


            <div className="feature-item">
              <div className="feature-icon">
                📅
              </div>

              <div>
                <h3>Loss Timeline</h3>
                <p>
                  Review previous events by date and season.
                </p>
              </div>
            </div>


            <div className="feature-item">
              <div className="feature-icon">
                📄
              </div>

              <div>
                <h3>Claim Summaries</h3>
                <p>
                  Bring important loss information together for review.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* Final CTA */}
      <section className="cta-section">
        <div className="cta-container">

          <div>
            <span className="section-label">
              READY WHEN YOU ARE
            </span>

            <h2>
              Start documenting your crop losses today.
            </h2>

            <p>
              Keep your farm's history organized and your evidence
              easy to find.
            </p>
          </div>

          <Link to="/log-loss" className="cta-button">
            Record a Crop Loss
            <span>→</span>
          </Link>

        </div>
      </section>

    </div>
  );
};

export default Home;