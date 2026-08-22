import { Link } from "react-router-dom";
import "../css/About.css";

const About = () => {
  return (
    <div className="about-page">

      {/* Hero */}
      <section className="about-hero">
        <div className="about-container about-hero-content">

          <div className="about-hero-text">
            <span className="about-label">
              ABOUT CROPSHIELD
            </span>

            <h1>
              Turning crop loss
              <span> into organized evidence.</span>
            </h1>

            <p>
              CropShield is a farmer-focused platform designed to make
              documenting crop damage simpler, clearer, and more organized.
              It brings important loss information together so farmers can
              keep a reliable record of what happened on their farms.
            </p>
          </div>

          <div className="about-hero-card">

            <div className="about-card-top">
              <span>THE CROPSHIELD APPROACH</span>
              <span className="about-card-dot"></span>
            </div>

            <div className="about-flow">

              <div className="about-flow-item">
                <div className="about-flow-icon">🌾</div>

                <div>
                  <strong>Crop Damage</strong>
                  <span>A loss occurs</span>
                </div>
              </div>

              <div className="about-flow-line"></div>

              <div className="about-flow-item">
                <div className="about-flow-icon">📷</div>

                <div>
                  <strong>Documentation</strong>
                  <span>Evidence is recorded</span>
                </div>
              </div>

              <div className="about-flow-line"></div>

              <div className="about-flow-item">
                <div className="about-flow-icon">📊</div>

                <div>
                  <strong>Organized Report</strong>
                  <span>Information stays together</span>
                </div>
              </div>

            </div>

            <div className="about-card-footer">
              <span>Simple</span>
              <span>Organized</span>
              <span>Farmer-focused</span>
            </div>

          </div>

        </div>
      </section>


      {/* Mission */}
      <section className="about-mission">
        <div className="about-container mission-grid">

          <div className="mission-heading">
            <span className="about-section-label">
              OUR PURPOSE
            </span>

            <h2>
              Crop damage can be
              <span> difficult to document.</span>
            </h2>
          </div>

          <div className="mission-text">
            <p>
              When crops are damaged by floods, droughts, storms, pests,
              or other events, farmers may need to remember many different
              details about the loss.
            </p>

            <p>
              Photographs, dates, locations, affected crops, damaged areas,
              and estimated losses can easily become scattered or forgotten.
            </p>

            <p>
              CropShield is designed around a simple idea:
              <strong> make those records easier to organize.</strong>
            </p>
          </div>

        </div>
      </section>


      {/* What CropShield Does */}
      <section className="about-features">
        <div className="about-container">

          <div className="about-section-heading">
            <span className="about-section-label">
              WHAT CROPSHIELD DOES
            </span>

            <h2>
              A clearer way to keep
              <span> track of crop losses.</span>
            </h2>

            <p>
              CropShield brings the important parts of a crop-loss record
              together into one straightforward interface.
            </p>
          </div>


          <div className="about-feature-grid">

            <div className="about-feature-card">
              <div className="about-feature-number">01</div>

              <div className="about-feature-icon">
                📷
              </div>

              <h3>Document Damage</h3>

              <p>
                Record what happened to your crops and attach supporting
                visual evidence to the loss report.
              </p>
            </div>


            <div className="about-feature-card">
              <div className="about-feature-number">02</div>

              <div className="about-feature-icon">
                📍
              </div>

              <h3>Record Important Details</h3>

              <p>
                Keep information such as location, date, affected area,
                crop type, and cause of damage together.
              </p>
            </div>


            <div className="about-feature-card">
              <div className="about-feature-number">03</div>

              <div className="about-feature-icon">
                📊
              </div>

              <h3>Review Your History</h3>

              <p>
                Use the dashboard to see previous reports and understand
                the history of documented crop losses.
              </p>
            </div>


            <div className="about-feature-card">
              <div className="about-feature-number">04</div>

              <div className="about-feature-icon">
                📄
              </div>

              <h3>Keep Records Organized</h3>

              <p>
                Give every loss event its own organized record so important
                information is easier to find when needed.
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* Values */}
      <section className="about-values">
        <div className="about-container">

          <div className="about-section-heading values-heading">
            <span className="about-section-label">
              OUR PRINCIPLES
            </span>

            <h2>
              Designed around the
              <span> farmer's experience.</span>
            </h2>
          </div>


          <div className="values-grid">

            <div className="value-card">
              <div className="value-icon">
                ◎
              </div>

              <h3>Simplicity</h3>

              <p>
                Information should be easy to understand and the process
                should not feel unnecessarily complicated.
              </p>
            </div>


            <div className="value-card">
              <div className="value-icon">
                ✓
              </div>

              <h3>Clarity</h3>

              <p>
                A good record should clearly show what happened, when it
                happened, and what was affected.
              </p>
            </div>


            <div className="value-card">
              <div className="value-icon">
                ◇
              </div>

              <h3>Organization</h3>

              <p>
                Important evidence and information should stay connected
                to the report they belong to.
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* How It Fits Together */}
      <section className="about-process">
        <div className="about-container process-grid">

          <div className="process-text">

            <span className="about-section-label">
              THE BIGGER PICTURE
            </span>

            <h2>
              From an event on the farm
              <span> to a documented record.</span>
            </h2>

            <p>
              CropShield is intended to provide a clear starting point
              for managing crop-loss information.
            </p>

            <p>
              The frontend you are seeing now represents the experience
              farmers would use to document and review their reports.
              Future versions can connect this interface to a secure
              backend and database for persistent data storage.
            </p>

          </div>


          <div className="process-steps">

            <div className="process-step">
              <span className="process-step-number">01</span>

              <div>
                <strong>Experience a loss</strong>
                <p>
                  A crop is affected by an event.
                </p>
              </div>
            </div>


            <div className="process-step">
              <span className="process-step-number">02</span>

              <div>
                <strong>Record the event</strong>
                <p>
                  Important information and evidence are documented.
                </p>
              </div>
            </div>


            <div className="process-step">
              <span className="process-step-number">03</span>

              <div>
                <strong>Review the report</strong>
                <p>
                  The documented event becomes part of the loss history.
                </p>
              </div>
            </div>


            <div className="process-step">
              <span className="process-step-number">04</span>

              <div>
                <strong>Build a history</strong>
                <p>
                  Previous reports remain organized for future reference.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* CTA */}
      <section className="about-cta">
        <div className="about-container about-cta-content">

          <div>
            <span className="about-section-label">
              EXPLORE CROPSHIELD
            </span>

            <h2>
              See how crop-loss records
              are organized.
            </h2>

            <p>
              Explore the dashboard or start a new loss report.
            </p>
          </div>

          <div className="about-cta-actions">

            <Link
              to="/dashboard"
              className="about-primary-button"
            >
              View Dashboard →
            </Link>

            <Link
              to="/log-loss"
              className="about-secondary-button"
            >
              Record a Loss
            </Link>

          </div>

        </div>
      </section>

    </div>
  );
};

export default About;