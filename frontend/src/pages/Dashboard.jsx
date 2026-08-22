import "../css/Dashboard.css";

const Dashboard = () => {
  const recentReports = [
    {
      id: "CS-2025-004",
      crop: "Wheat",
      date: "October 18, 2025",
      cause: "Drought",
      loss: 32,
    },
    {
      id: "CS-2025-003",
      crop: "Corn",
      date: "September 06, 2025",
      cause: "Storm",
      loss: 18,
    },
    {
      id: "CS-2025-002",
      crop: "Soybean",
      date: "July 22, 2025",
      cause: "Pest Damage",
      loss: 24,
    },
  ];

  return (
    <main className="dashboard-page">

      <div className="dashboard-container">

        {/* =====================================
            Dashboard Header
        ====================================== */}

        <section className="dashboard-header">

          <div>
            <span className="dashboard-label">
              FARM OVERVIEW
            </span>

            <h1>Dashboard</h1>

            <p>
              Here's an overview of your farm's crop loss
              activity and recent reports.
            </p>
          </div>

          <a
            href="/log-loss"
            className="dashboard-primary-button"
          >
            + Log Crop Loss
          </a>

        </section>


        {/* =====================================
            Statistics
        ====================================== */}

        <section className="dashboard-stats">

          <div className="dashboard-stat-card">

            <div className="stat-icon">
              📋
            </div>

            <div className="stat-content">

              <span className="stat-label">
                Total Reports
              </span>

              <strong>4</strong>

              <span className="stat-description">
                Reports documented
              </span>

            </div>

          </div>


          <div className="dashboard-stat-card">

            <div className="stat-icon">
              📉
            </div>

            <div className="stat-content">

              <span className="stat-label">
                Average Crop Loss
              </span>

              <strong>28.8%</strong>

              <span className="stat-description">
                Across all reports
              </span>

            </div>

          </div>


          <div className="dashboard-stat-card">

            <div className="stat-icon">
              🌾
            </div>

            <div className="stat-content">

              <span className="stat-label">
                Affected Area
              </span>

              <strong>40.9 ac</strong>

              <span className="stat-description">
                Total affected acreage
              </span>

            </div>

          </div>


          <div className="dashboard-stat-card">

            <div className="stat-icon">
              🌱
            </div>

            <div className="stat-content">

              <span className="stat-label">
                Most Affected Crop
              </span>

              <strong>Wheat</strong>

              <span className="stat-description">
                2 recorded incidents
              </span>

            </div>

          </div>

        </section>


        {/* =====================================
            Main Dashboard Grid
        ====================================== */}

        <section className="dashboard-main-grid">


          {/* Loss Overview */}

          <div className="dashboard-card loss-overview-card">

            <div className="dashboard-card-header">

              <div>
                <h2>
                  Crop Loss Overview
                </h2>

                <p>
                  Recorded loss across recent reports
                </p>
              </div>

              <span className="card-period">
                2025
              </span>

            </div>


            {/* Fake chart - frontend only */}

            <div className="loss-chart">

              <div className="chart-y-axis">

                <span>50%</span>
                <span>40%</span>
                <span>30%</span>
                <span>20%</span>
                <span>10%</span>
                <span>0%</span>

              </div>


              <div className="chart-area">

                <div className="chart-grid-line line-50"></div>
                <div className="chart-grid-line line-40"></div>
                <div className="chart-grid-line line-30"></div>
                <div className="chart-grid-line line-20"></div>
                <div className="chart-grid-line line-10"></div>
                <div className="chart-grid-line line-0"></div>


                <div className="chart-bars">

                  <div className="chart-column">

                    <div
                      className="chart-bar"
                      style={{ height: "64%" }}
                    ></div>

                    <span>May</span>

                  </div>


                  <div className="chart-column">

                    <div
                      className="chart-bar"
                      style={{ height: "38%" }}
                    ></div>

                    <span>Jul</span>

                  </div>


                  <div className="chart-column">

                    <div
                      className="chart-bar"
                      style={{ height: "48%" }}
                    ></div>

                    <span>Sep</span>

                  </div>


                  <div className="chart-column">

                    <div
                      className="chart-bar"
                      style={{ height: "80%" }}
                    ></div>

                    <span>Oct</span>

                  </div>

                </div>

              </div>

            </div>

          </div>


          {/* Quick Actions */}

          <div className="dashboard-card quick-actions-card">

            <div className="dashboard-card-header">

              <div>
                <h2>
                  Quick Actions
                </h2>

                <p>
                  Common tasks
                </p>
              </div>

            </div>


            <div className="quick-actions">

              <a
                href="/log-loss"
                className="quick-action"
              >

                <span className="quick-action-icon">
                  📉
                </span>

                <span>
                  <strong>
                    Log Crop Loss
                  </strong>

                  <small>
                    Document a new incident
                  </small>
                </span>

                <span className="action-arrow">
                  →
                </span>

              </a>


              <a
                href="/farm-baseline"
                className="quick-action"
              >

                <span className="quick-action-icon">
                  🚜
                </span>

                <span>
                  <strong>
                    Farm Baseline
                  </strong>

                  <small>
                    Update farm conditions
                  </small>
                </span>

                <span className="action-arrow">
                  →
                </span>

              </a>


              <a
                href="/reports"
                className="quick-action"
              >

                <span className="quick-action-icon">
                  📋
                </span>

                <span>
                  <strong>
                    View Reports
                  </strong>

                  <small>
                    Browse report history
                  </small>
                </span>

                <span className="action-arrow">
                  →
                </span>

              </a>

            </div>

          </div>


        </section>


        {/* =====================================
            Bottom Grid
        ====================================== */}

        <section className="dashboard-bottom-grid">


          {/* Recent Reports */}

          <div className="dashboard-card recent-reports-card">

            <div className="dashboard-card-header">

              <div>
                <h2>
                  Recent Reports
                </h2>

                <p>
                  Your latest documented incidents
                </p>
              </div>

              <a href="/reports">
                View all
              </a>

            </div>


            <div className="recent-reports-list">

              {recentReports.map((report) => (
                <div
                  className="recent-report"
                  key={report.id}
                >

                  <div className="recent-report-icon">
                    🌾
                  </div>


                  <div className="recent-report-info">

                    <strong>
                      {report.crop}
                    </strong>

                    <span>
                      {report.cause} · {report.date}
                    </span>

                  </div>


                  <div className="recent-report-loss">

                    <strong>
                      {report.loss}%
                    </strong>

                    <span>
                      loss
                    </span>

                  </div>

                </div>
              ))}

            </div>

          </div>


          {/* Farm Status */}

          <div className="dashboard-card farm-status-card">

            <div className="dashboard-card-header">

              <div>
                <h2>
                  Farm Status
                </h2>

                <p>
                  Current baseline information
                </p>
              </div>

            </div>


            <div className="farm-status-content">

              <div className="farm-status-icon">
                🚜
              </div>

              <h3>
                Baseline Established
              </h3>

              <p>
                Your farm baseline is currently configured
                with basic crop and farming information.
              </p>

              <a
                href="/farm-baseline"
                className="farm-status-button"
              >
                View Farm Baseline
              </a>

            </div>

          </div>


        </section>


        {/* =====================================
            Demo Notice
        ====================================== */}

        <div className="dashboard-notice">

          <span>ⓘ</span>

          <p>
            <strong>Frontend demonstration:</strong>{" "}
            The statistics, chart, and reports shown on this
            dashboard are hardcoded example data. MongoDB
            integration will replace this data later.
          </p>

        </div>

      </div>

    </main>
  );
};

export default Dashboard;