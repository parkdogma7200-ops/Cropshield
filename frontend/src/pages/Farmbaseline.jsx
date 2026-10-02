import { useEffect, useState } from "react";
import "../css/Farmbaseline.css";
import { useAuth } from "../context/AuthContext.jsx";

const FarmBaseline = () => {
  const { token } = useAuth();

  const [formData, setFormData] = useState({
    farmName: "",
    farmLocation: "",
    totalFarmSize: "",
    soilType: "",
    irrigationType: "",
    primaryCrop: "",
    typicalAnnualYield: "",
    growingSeason: "",
    notes: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =====================================
  // Load existing baseline
  // =====================================

  useEffect(() => {
    const loadBaseline = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/farm-baseline",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          const baseline = data.baseline;

          setFormData({
            farmName: baseline.farmName || "",
            farmLocation: baseline.farmLocation || "",
            totalFarmSize:
              baseline.totalFarmSize ?? "",
            soilType: baseline.soilType || "",
            irrigationType:
              baseline.irrigationType || "",
            primaryCrop:
              baseline.primaryCrop || "",
            typicalAnnualYield:
              baseline.typicalAnnualYield ?? "",
            growingSeason:
              baseline.growingSeason || "",
            notes: baseline.notes || "",
          });
        }
      } catch (error) {
        console.error(
          "Error loading farm baseline:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadBaseline();
  }, [token]);

  // =====================================
  // Handle field changes
  // =====================================

  const handleChange = (event) => {
    const { id, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [id]: value,
    }));

    setMessage("");
    setError("");
  };

  // =====================================
  // Save baseline
  // =====================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    // Basic frontend validation
    if (
      !formData.farmName.trim() ||
      !formData.farmLocation.trim() ||
      !formData.totalFarmSize ||
      !formData.primaryCrop
    ) {
      setError(
        "Please fill in farm name, location, farm size, and primary crop."
      );

      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/farm-baseline",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Failed to save farm baseline."
        );

        return;
      }

      setMessage(
        "Farm baseline saved successfully."
      );
    } catch (error) {
      console.error(
        "Save farm baseline error:",
        error
      );

      setError(
        "Unable to connect to the CropShield server."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================
  // Loading
  // =====================================

  if (loading) {
    return (
      <main className="baseline-page">
        <div className="baseline-container">
          <div className="baseline-header">
            <span className="baseline-label">
              FARM PROFILE
            </span>

            <h1>Farm Baseline</h1>

            <p>
              Loading your farm information...
            </p>
          </div>
        </div>
      </main>
    );
  }

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
            Establish your farm's normal conditions so
            future reports can be compared against a
            baseline.
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
                  value={formData.farmName}
                  onChange={handleChange}
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
                  value={formData.farmLocation}
                  onChange={handleChange}
                />

              </div>

              <div className="baseline-field">

                <label htmlFor="totalFarmSize">
                  Total Farm Size
                </label>

                <div className="baseline-unit-input">

                  <input
                    id="totalFarmSize"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.totalFarmSize}
                    onChange={handleChange}
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
                  value={formData.soilType}
                  onChange={handleChange}
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
                  Describe your usual farming
                  conditions.
                </p>
              </div>

            </div>

            <div className="baseline-grid">

              <div className="baseline-field">

                <label htmlFor="irrigationType">
                  Irrigation Type
                </label>

                <select
                  id="irrigationType"
                  value={formData.irrigationType}
                  onChange={handleChange}
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
                  value={formData.primaryCrop}
                  onChange={handleChange}
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

                <label htmlFor="typicalAnnualYield">
                  Typical Annual Yield
                </label>

                <div className="baseline-unit-input">

                  <input
                    id="typicalAnnualYield"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0"
                    value={
                      formData.typicalAnnualYield
                    }
                    onChange={handleChange}
                  />

                  <span>units/acre</span>

                </div>

              </div>

              <div className="baseline-field">

                <label htmlFor="growingSeason">
                  Main Growing Season
                </label>

                <select
                  id="growingSeason"
                  value={formData.growingSeason}
                  onChange={handleChange}
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
                  Add additional information about normal
                  farm conditions.
                </p>
              </div>

            </div>

            <div className="baseline-field">

              <label htmlFor="notes">
                Notes
              </label>

              <textarea
                id="notes"
                rows="6"
                placeholder="Describe typical weather, recurring challenges, planting patterns, or other useful information..."
                value={formData.notes}
                onChange={handleChange}
              />

            </div>

          </section>

          {/* Success / Error */}

          {message && (
            <div className="baseline-success">
              <span>✓</span>
              <p>{message}</p>
            </div>
          )}

          {error && (
            <div className="baseline-error">
              <span>!</span>
              <p>{error}</p>
            </div>
          )}

          {/* Notice */}

          <div className="baseline-notice">

            <span>ⓘ</span>

            <p>
              <strong>Saved to CropShield:</strong>{" "}
              Your farm baseline is securely associated
              with your account and will be used when
              calculating future crop losses.
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
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "Save Farm Baseline"}
            </button>

          </div>

        </form>

      </div>
    </main>
  );
};

export default FarmBaseline;