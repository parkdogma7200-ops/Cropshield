import "../css/Reports.css";

const Reports = () => {

  const reports = [
    {
      id: "CS-2025-004",
      date: "October 18, 2025",
      crop: "Wheat",
      location: "North Field",
      cause: "Drought",
      loss: 32,
      area: 14.5,
      status: "Documented",
    },
    {
      id: "CS-2025-003",
      date: "September 06, 2025",
      crop: "Corn",
      location: "East Field",
      cause: "Storm",
      loss: 18,
      area: 8.2,
      status: "Documented",
    },
    {
      id: "CS-2025-002",
      date: "July 22, 2025",
      crop: "Soybean",
      location: "South Field",
      cause: "Pest Damage",
      loss: 24,
      area: 11.8,
      status: "Documented",
    },
    {
      id: "CS-2025-001",
      date: "May 11, 2025",
      crop: "Wheat",
      location: "West Field",
      cause: "Flood",
      loss: 41,
      area: 6.4,
      status: "Documented",
    },
  ];


  return (
    <main className="reports-page">

      <div className="reports-container">

        {/* Header */}
        <div className="reports-header">

          <div>

            <span className="reports-label">
              REPORT HISTORY
            </span>

            <h1>Reports</h1>

            <p>
              Review previously documented crop loss reports
              and their recorded details.
            </p>

          </div>


          <button
            className="new-report-button"
            onClick={() => {
              window.location.href = "/log-loss";
            }}
          >
            + New Report
          </button>

        </div>


        {/* Summary */}
        <div className="report-summary">

          <div className="summary-card">

            <span className="summary-icon">
              📋
            </span>

            <div>
              <span className="summary-label">
                Total Reports
              </span>

              <strong>
                4
              </strong>
            </div>

          </div>


          <div className="summary-card">

            <span className="summary-icon">
              🌾
            </span>

            <div>
              <span className="summary-label">
                Affected Area
              </span>

              <strong>
                40.9 acres
              </strong>
            </div>

          </div>


          <div className="summary-card">

            <span className="summary-icon">
              📉
            </span>

            <div>
              <span className="summary-label">
                Average Loss
              </span>

              <strong>
                28.8%
              </strong>
            </div>

          </div>

        </div>


        {/* Filters */}
        <div className="reports-toolbar">

          <div className="report-search">

            <span>
              🔎
            </span>

            <input
              type="text"
              placeholder="Search reports..."
            />

          </div>


          <select
            className="report-filter"
            defaultValue="all"
          >
            <option value="all">
              All Crops
            </option>

            <option value="wheat">
              Wheat
            </option>

            <option value="corn">
              Corn
            </option>

            <option value="soybean">
              Soybean
            </option>
          </select>

        </div>


        {/* Reports Table */}
        <section className="reports-card">

          <div className="reports-card-header">

            <div>

              <h2>
                Previous Reports
              </h2>

              <p>
                Your documented crop loss history
              </p>

            </div>

          </div>


          <div className="reports-table-wrapper">

            <table className="reports-table">

              <thead>

                <tr>
                  <th>Report</th>
                  <th>Date</th>
                  <th>Crop</th>
                  <th>Cause</th>
                  <th>Loss</th>
                  <th>Area</th>
                  <th>Status</th>
                  <th></th>
                </tr>

              </thead>


              <tbody>

                {reports.map((report) => (
                  <tr key={report.id}>

                    <td>
                      <span className="report-id">
                        {report.id}
                      </span>

                      <span className="report-location">
                        {report.location}
                      </span>
                    </td>

                    <td>
                      {report.date}
                    </td>

                    <td>
                      {report.crop}
                    </td>

                    <td>
                      {report.cause}
                    </td>

                    <td>
                      <span className="loss-value">
                        {report.loss}%
                      </span>
                    </td>

                    <td>
                      {report.area} ac
                    </td>

                    <td>
                      <span className="report-status">
                        {report.status}
                      </span>
                    </td>

                    <td>

                      <button
                        className="view-report-button"
                        onClick={() =>
                          alert(
                            `Demo only: ${report.id} would open here.`
                          )
                        }
                      >
                        View
                      </button>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </section>


        {/* Notice */}
        <div className="reports-notice">

          <span>ⓘ</span>

          <p>
            <strong>Demo reports:</strong>{" "}
            The reports displayed here are hardcoded example
            data. They will eventually be replaced with reports
            retrieved from MongoDB.
          </p>

        </div>

      </div>

    </main>
  );
};

export default Reports;