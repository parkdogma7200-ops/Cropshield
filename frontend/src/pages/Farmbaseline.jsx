import "../css/Farmbaseline.css";

const FarmBaseline = () => {
  const handleSubmit = (event) => {
    event.preventDefault();

    alert(
      "Demo only: your farm baseline has not been saved."
    );
  };

  return (
    <main className="baseline-page">

      <div className="baseline-container">

        {/* Header */}
        <div className="baseline-header">

          <span className="baseline-label">
            FARM PROFILE
          </span>

          <h1>Farm Baseline</h1>

          <p>
            Establish your farm's normal conditions so future
            reports can be compared against a baseline.
          </p>

        </div>


        <form
          className="baseline-form"
          onSubmit={handleSubmit}
        >

          {/* Farm Details */}
          <section className="baseline-card">

            <div className="baseline-card-header">

              <div className="baseline-card-icon">
                🚜
              </div>

              <div>
                <h2>Farm Details</h2>

                <p>
                  Basic information about your farm.
                </p>
              </div>

            </div>


            <div className="baseline-grid">

              <div className="baseline-field">

                <label htmlFor="farmName">
                  Farm Name
                </label>

                <input
                  id="farmName"
                  type="text"
                  placeholder="Enter farm name"
                />

              </div>


              <div className="baseline-field">

                <label htmlFor="farmLocation">
                  Farm Location
                </label>

                <input
                  id="farmLocation"
                  type="text"
                  placeholder="City, State / Region"
                />

              </div>


              <div className="baseline-field">

                <label htmlFor="farmSize">
                  Total Farm Size
                </label>

                <div className="baseline-unit-input">

                  <input
                    id="farmSize"
                    type="number"
                    placeholder="0.00"
                  />

                  <span>acres</span>

                </div>

              </div>


              <div className="baseline-field">

                <label htmlFor="soilType">
                  Soil Type
                </label>

                <select
                  id="soilType"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select soil type
                  </option>

                  <option value="clay">
                    Clay
                  </option>

                  <option value="loam">
                    Loam
                  </option>

                  <option value="sandy">
                    Sandy
                  </option>

                  <option value="silt">
                    Silt
                  </option>

                  <option value="mixed">
                    Mixed
                  </option>
                </select>

              </div>

            </div>

          </section>


          {/* Farming Conditions */}
          <section className="baseline-card">

            <div className="baseline-card-header">

              <div className="baseline-card-icon">
                💧
              </div>

              <div>
                <h2>Farming Conditions</h2>

                <p>
                  Describe your usual farming conditions.
                </p>
              </div>

            </div>


            <div className="baseline-grid">

              <div className="baseline-field">

                <label htmlFor="irrigation">
                  Irrigation Type
                </label>

                <select
                  id="irrigation"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select irrigation
                  </option>

                  <option value="rainfed">
                    Rain-fed
                  </option>

                  <option value="drip">
                    Drip Irrigation
                  </option>

                  <option value="sprinkler">
                    Sprinkler
                  </option>

                  <option value="surface">
                    Surface Irrigation
                  </option>

                  <option value="mixed">
                    Mixed
                  </option>
                </select>

              </div>


              <div className="baseline-field">

                <label htmlFor="primaryCrop">
                  Primary Crop
                </label>

                <select
                  id="primaryCrop"
                  defaultValue=""
                >
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
                </select>

              </div>


              <div className="baseline-field">

                <label htmlFor="yield">
                  Typical Annual Yield
                </label>

                <div className="baseline-unit-input">

                  <input
                    id="yield"
                    type="number"
                    placeholder="0"
                  />

                  <span>units/acre</span>

                </div>

              </div>


              <div className="baseline-field">

                <label htmlFor="season">
                  Main Growing Season
                </label>

                <select
                  id="season"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select season
                  </option>

                  <option value="spring">
                    Spring
                  </option>

                  <option value="summer">
                    Summer
                  </option>

                  <option value="fall">
                    Fall
                  </option>

                  <option value="winter">
                    Winter
                  </option>

                  <option value="year-round">
                    Year-round
                  </option>
                </select>

              </div>

            </div>

          </section>


          {/* Baseline Notes */}
          <section className="baseline-card">

            <div className="baseline-card-header">

              <div className="baseline-card-icon">
                📋
              </div>

              <div>
                <h2>Baseline Notes</h2>

                <p>
                  Add additional information about normal farm
                  conditions.
                </p>
              </div>

            </div>


            <div className="baseline-field">

              <label htmlFor="baselineNotes">
                Notes
              </label>

              <textarea
                id="baselineNotes"
                rows="6"
                placeholder="Describe typical weather, recurring challenges, planting patterns, or other useful information..."
              />

            </div>

          </section>


          {/* Notice */}
          <div className="baseline-notice">

            <span>ⓘ</span>

            <p>
              <strong>Frontend demonstration:</strong>{" "}
              Your baseline information is currently not being
              stored. Database storage will be connected later.
            </p>

          </div>


          {/* Actions */}
          <div className="baseline-actions">

            <button
              type="button"
              className="baseline-secondary-button"
              onClick={() => window.history.back()}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="baseline-primary-button"
            >
              Save Farm Baseline
            </button>

          </div>

        </form>

      </div>

    </main>
  );
};

export default FarmBaseline;