import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../css/Home.css";

const Home = () => {
  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHomeSummary = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/crop-losses/home-summary"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load home page data."
          );
        }

        setHomeData(data);
      } catch (error) {
        console.error("Home summary error:", error);
        setError("Unable to load the latest CropShield data.");
      } finally {
        setLoading(false);
      }
    };

    fetchHomeSummary();
  }, []);

  const summary = homeData?.summary;
  const recentLoss = homeData?.recentLoss;
  const gpsLoss = homeData?.gpsLoss;

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatNumber = (number, decimals = 1) => {
    if (number === null || number === undefined) {
      return "0";
    }

    return Number(number).toFixed(decimals);
  };

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
                  <span className="small-label">
                    RECENT LOSS
                  </span>

                  <h3>
                    {loading
                      ? "Loading..."
                      : recentLoss?.cropType || "No reports yet"}
                  </h3>
                </div>

                <span className="status-badge">
                  {recentLoss ? "Documented" : "No Report"}
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

                  <strong>
                    {recentLoss?.cause || "—"}
                  </strong>
                </div>

                <div>
                  <span>AFFECTED</span>

                  <strong>
                    {recentLoss
                      ? `${formatNumber(
                          recentLoss.affectedArea
                        )} acres`
                      : "—"}
                  </strong>
                </div>

                <div>
                  <span>DATE</span>

                  <strong>
                    {formatDate(recentLoss?.lossDate)}
                  </strong>
                </div>

              </div>

              <div className="evidence-progress">

                <div className="evidence-progress-header">
                  <span>Evidence collected</span>

                  <strong>
                    {recentLoss
                      ? `${recentLoss.evidence?.length || 0} / 5`
                      : "0 / 5"}
                  </strong>
                </div>

                <div className="progress-bar">

                  <div
                    className="progress-fill"
                    style={{
                      width: `${
                        recentLoss
                          ? Math.min(
                              ((recentLoss.evidence?.length || 0) /
                                5) *
                                100,
                              100
                            )
                          : 0
                      }%`,
                    }}
                  ></div>

                </div>

              </div>

            </div>

            {/* GPS Floating Card */}
            <div className="floating-stat floating-stat-top">

              <span className="floating-icon">
                📍
              </span>

              <div>

                <strong>
                  {gpsLoss
                    ? "GPS captured"
                    : "GPS unavailable"}
                </strong>

                <small>
                  {gpsLoss?.coordinates?.latitude !== null &&
                  gpsLoss?.coordinates?.latitude !== undefined &&
                  gpsLoss?.coordinates?.longitude !== null &&
                  gpsLoss?.coordinates?.longitude !== undefined
                    ? `${Number(
                        gpsLoss.coordinates.latitude
                      ).toFixed(4)}° N, ${Number(
                        gpsLoss.coordinates.longitude
                      ).toFixed(4)}° E`
                    : "No GPS data available"}
                </small>

              </div>

            </div>

            {/* Evidence Floating Card */}
            <div className="floating-stat floating-stat-bottom">

              <span className="floating-icon">
                📷
              </span>

              <div>

                <strong>
                  {recentLoss?.evidence?.length || 0} photos
                </strong>

                <small>
                  {recentLoss
                    ? "Evidence attached"
                    : "No evidence attached"}
                </small>

              </div>

            </div>

          </div>

        </div>
      </section>


      {/* Stats Section */}
      <section className="home-stats-section">

        <div className="home-container stats-grid">

          <div className="home-stat">
            <strong>
              {loading
                ? "..."
                : summary?.totalReports || 0}
            </strong>

            <span>
              Previous reports
            </span>
          </div>


          <div className="home-stat">
            <strong>
              {loading
                ? "..."
                : formatNumber(
                    summary?.totalAffectedArea
                  )}
            </strong>

            <span>
              Acres affected
            </span>
          </div>


          <div className="home-stat">
            <strong>
              {loading
                ? "..."
                : `${formatNumber(
                    summary?.averageLossPercent
                  )}%`}
            </strong>

            <span>
              Average loss
            </span>
          </div>


          <div className="home-stat">
            <strong>
              {loading
                ? "..."
                : summary?.totalEvidence || 0}
            </strong>

            <span>
              Evidence items
            </span>
          </div>

        </div>


        {error && (
          <div
            style={{
              textAlign: "center",
              padding: "10px 20px 20px",
              color: "#b45f5f",
              fontSize: "12px",
            }}
          >
            {error}
          </div>
        )}

      </section>


      {/* How It Works */}
      <section className="how-section">
        <div className="home-container">

          <div className="section-heading">

            <span className="section-label">
              HOW IT WORKS
            </span>

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

              <div className="step-number">
                01
              </div>

              <div className="step-icon">
                📷
              </div>

              <h3>
                Document the damage
              </h3>

              <p>
                Record the affected crop, type of damage, estimated area,
                and supporting photographs.
              </p>

            </div>


            <div className="step-card">

              <div className="step-number">
                02
              </div>

              <div className="step-icon">
                📍
              </div>

              <h3>
                Capture the details
              </h3>

              <p>
                Keep important information such as the date, location,
                and description of the loss together.
              </p>

            </div>


            <div className="step-card">

              <div className="step-number">
                03
              </div>

              <div className="step-icon">
                📊
              </div>

              <h3>
                Review your reports
              </h3>

              <p>
                See crop-loss events recorded across CropShield and
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

            <Link
              to="/dashboard"
              className="text-link"
            >
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
                <h3>
                  Photo Evidence
                </h3>

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
                <h3>
                  Location Records
                </h3>

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
                <h3>
                  Loss Timeline
                </h3>

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
                <h3>
                  Claim Summaries
                </h3>

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


          <Link
            to="/log-loss"
            className="cta-button"
          >
            Record a Crop Loss
            <span>→</span>
          </Link>

        </div>

      </section>

    </div>
  );
};

export default Home;