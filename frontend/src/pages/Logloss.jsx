import "../css/LogCropLoss.css";

const LogCropLoss = () => {
  const handleSubmit = (event) => {
    event.preventDefault();

    alert(
      "Demo only: this crop loss report has not been saved."
    );
  };

  return (
    <main className="log-loss-page">

      <div className="log-loss-container">

        {/* Header */}
        <div className="log-loss-header">

          <span className="log-loss-label">
            CROP LOSS REPORT
          </span>

          <h1>Log Crop Loss</h1>

          <p>
            Document crop damage and loss details to create a
            structured record for your farm.
          </p>

        </div>


        {/* Form */}
        <form
          className="loss-form"
          onSubmit={handleSubmit}
        >

          {/* Crop Information */}
          <section className="form-card">

            <div className="form-card-header">

              <div className="form-card-icon">
                🌾
              </div>

              <div>
                <h2>Crop Information</h2>

                <p>
                  Tell us about the affected crop.
                </p>
              </div>

            </div>


            <div className="form-grid">

              <div className="form-field">

                <label htmlFor="cropName">
                  Crop Name
                </label>

                <select id="cropName" defaultValue="">
                  <option value="" disabled>
                    Select crop
                  </option>

                  <option value="wheat">
                    Wheat
                  </option>

                  <option value="rice">
                    Rice
                  </option>

                  <option value="corn">
                    Corn
                  </option>

                  <option value="cotton">
                    Cotton
                  </option>

                  <option value="soybean">
                    Soybean
                  </option>

                  <option value="other">
                    Other
                  </option>
                </select>

              </div>


              <div className="form-field">

                <label htmlFor="lossDate">
                  Date of Loss
                </label>

                <input
                  id="lossDate"
                  type="date"
                />

              </div>


              <div className="form-field">

                <label htmlFor="farmLocation">
                  Farm Location
                </label>

                <input
                  id="farmLocation"
                  type="text"
                  placeholder="e.g. North Field"
                />

              </div>


              <div className="form-field">

                <label htmlFor="cropArea">
                  Affected Area
                </label>

                <div className="input-with-unit">

                  <input
                    id="cropArea"
                    type="number"
                    placeholder="0.00"
                  />

                  <span>acres</span>

                </div>

              </div>

            </div>

          </section>


          {/* Loss Details */}
          <section className="form-card">

            <div className="form-card-header">

              <div className="form-card-icon">
                📉
              </div>

              <div>
                <h2>Loss Details</h2>

                <p>
                  Describe the extent and cause of the damage.
                </p>
              </div>

            </div>


            <div className="form-grid">

              <div className="form-field">

                <label htmlFor="lossPercentage">
                  Estimated Crop Loss
                </label>

                <div className="input-with-unit">

                  <input
                    id="lossPercentage"
                    type="number"
                    min="0"
                    max="100"
                    placeholder="0"
                  />

                  <span>%</span>

                </div>

              </div>


              <div className="form-field">

                <label htmlFor="lossCause">
                  Primary Cause
                </label>

                <select
                  id="lossCause"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select cause
                  </option>

                  <option value="drought">
                    Drought
                  </option>

                  <option value="flood">
                    Flood
                  </option>

                  <option value="storm">
                    Storm
                  </option>

                  <option value="pest">
                    Pest Damage
                  </option>

                  <option value="disease">
                    Crop Disease
                  </option>

                  <option value="fire">
                    Fire
                  </option>

                  <option value="other">
                    Other
                  </option>
                </select>

              </div>

            </div>


            <div className="form-field">

              <label htmlFor="lossDescription">
                Description
              </label>

              <textarea
                id="lossDescription"
                rows="5"
                placeholder="Describe what happened and the extent of the damage..."
              />

            </div>

          </section>


          {/* Evidence */}
          <section className="form-card">

            <div className="form-card-header">

              <div className="form-card-icon">
                📷
              </div>

              <div>
                <h2>Evidence</h2>

                <p>
                  Add supporting evidence for your report.
                </p>
              </div>

            </div>


            <div className="upload-area">

              <div className="upload-icon">
                ↑
              </div>

              <h3>Upload Photos</h3>

              <p>
                Drag photos here or click to browse
              </p>

              <span>
                JPG, PNG up to 10MB
              </span>

              <input
                type="file"
                accept="image/png,image/jpeg"
                multiple
              />

            </div>

          </section>


          {/* Notice */}
          <div className="form-notice">

            <span>ⓘ</span>

            <p>
              <strong>Frontend demonstration:</strong>{" "}
              This report will not be permanently saved.
              Backend and database storage will be added later.
            </p>

          </div>


          {/* Actions */}
          <div className="form-actions">

            <button
              type="button"
              className="secondary-button"
              onClick={() => window.history.back()}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button"
            >
              Create Loss Report
            </button>

          </div>

        </form>

      </div>

    </main>
  );
};

export default LogCropLoss;