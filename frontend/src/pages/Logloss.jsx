import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { jsPDF } from "jspdf";
import {
  Document,
  Packer,
  Paragraph,
  HeadingLevel,
  TextRun,
} from "docx";
import "../css/LogCropLoss.css";

const initialForm = {
  cropType: "",
  otherCrop: "",
  cause: "",
  lossDate: new Date().toISOString().slice(0, 10),
  farmLocation: "",
  affectedArea: "",
  estimatedLossPercent: "",
  estimatedQuantity: "",
  quantityUnit: "kg",
  description: "",
};

const readFile = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () =>
      resolve({
        name: file.name,
        mimeType: file.type,
        dataUrl: reader.result,
      });

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const sanitizeFileName = (name) => {
  return name
    .replace(/[^a-z0-9-_]/gi, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
};

const getReportFileName = (form, extension) => {
  const cropName =
    form.cropType === "Other"
      ? form.otherCrop || "Crop"
      : form.cropType || "Crop";

  const safeCropName = sanitizeFileName(cropName);

  return `CropShield_${safeCropName}_Loss_Report_${form.lossDate}.${extension}`;
};

const getReportData = (form, coordinates, evidence) => {
  const cropName =
    form.cropType === "Other"
      ? form.otherCrop || "Other"
      : form.cropType;

  return {
    cropName,
    lossDate: form.lossDate,
    farmLocation: form.farmLocation || "Not provided",
    affectedArea: form.affectedArea
      ? `${form.affectedArea} acres`
      : "Not provided",
    estimatedLossPercent: form.estimatedLossPercent
      ? `${form.estimatedLossPercent}%`
      : "Not provided",
    cause: form.cause || "Not provided",
    estimatedQuantity: form.estimatedQuantity
      ? `${form.estimatedQuantity} ${form.quantityUnit}`
      : "Not provided",
    description: form.description || "Not provided",
    gps: coordinates
      ? `${coordinates.latitude.toFixed(6)}, ${coordinates.longitude.toFixed(
          6
        )}`
      : "Not captured",
    gpsAccuracy: coordinates
      ? `±${coordinates.accuracy} meters`
      : "Not available",
    gpsCapturedAt: coordinates
      ? new Date(coordinates.capturedAt).toLocaleString()
      : "Not available",
    photos:
      evidence.length > 0
        ? evidence.map((photo) => photo.name)
        : [],
  };
};

/* =========================================================
   PDF REPORT
========================================================= */

const generatePDFReport = (form, coordinates, evidence) => {
  const report = getReportData(form, coordinates, evidence);

  const pdf = new jsPDF();

  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  let y = 20;

  const addWrappedText = (text, x, currentY, maxWidth, lineHeight = 6) => {
    const lines = pdf.splitTextToSize(text, maxWidth);

    pdf.text(lines, x, currentY);

    return currentY + lines.length * lineHeight;
  };

  /* Header */

  pdf.setFontSize(20);
  pdf.setFont("helvetica", "bold");
  pdf.text("CropShield", margin, y);

  y += 9;

  pdf.setFontSize(15);
  pdf.text("Crop Loss Report", margin, y);

  y += 6;

  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(100, 100, 100);

  pdf.text(
    `Generated: ${new Date().toLocaleString()}`,
    margin,
    y
  );

  y += 12;

  pdf.setTextColor(40, 40, 40);

  /* Divider */

  pdf.setDrawColor(210, 220, 212);
  pdf.line(margin, y, pageWidth - margin, y);

  y += 12;

  /* Crop Information */

  pdf.setFontSize(13);
  pdf.setFont("helvetica", "bold");
  pdf.text("Crop Information", margin, y);

  y += 9;

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");

  const cropInformation = [
    ["Crop Name", report.cropName],
    ["Date of Loss", report.lossDate],
    ["Farm / Plot Location", report.farmLocation],
    ["Affected Area", report.affectedArea],
  ];

  cropInformation.forEach(([label, value]) => {
    pdf.setFont("helvetica", "bold");
    pdf.text(`${label}:`, margin, y);

    pdf.setFont("helvetica", "normal");

    y = addWrappedText(
      value,
      margin + 48,
      y,
      contentWidth - 48
    );

    y += 3;
  });

  y += 5;

  /* Loss Details */

  pdf.setFontSize(13);
  pdf.setFont("helvetica", "bold");
  pdf.text("Loss Details", margin, y);

  y += 9;

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");

  const lossInformation = [
    ["Estimated Crop Loss", report.estimatedLossPercent],
    ["Primary Cause", report.cause],
    ["Estimated Quantity Lost", report.estimatedQuantity],
  ];

  lossInformation.forEach(([label, value]) => {
    pdf.setFont("helvetica", "bold");
    pdf.text(`${label}:`, margin, y);

    pdf.setFont("helvetica", "normal");

    y = addWrappedText(
      value,
      margin + 55,
      y,
      contentWidth - 55
    );

    y += 3;
  });

  y += 5;

  /* Description */

  pdf.setFontSize(13);
  pdf.setFont("helvetica", "bold");
  pdf.text("Description", margin, y);

  y += 8;

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");

  y = addWrappedText(
    report.description,
    margin,
    y,
    contentWidth,
    6
  );

  y += 12;

  /* GPS */

  pdf.setFontSize(13);
  pdf.setFont("helvetica", "bold");
  pdf.text("GPS Information", margin, y);

  y += 9;

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");

  const gpsInformation = [
    ["Coordinates", report.gps],
    ["Accuracy", report.gpsAccuracy],
    ["Captured At", report.gpsCapturedAt],
  ];

  gpsInformation.forEach(([label, value]) => {
    pdf.setFont("helvetica", "bold");
    pdf.text(`${label}:`, margin, y);

    pdf.setFont("helvetica", "normal");

    y = addWrappedText(
      value,
      margin + 35,
      y,
      contentWidth - 35
    );

    y += 3;
  });

  y += 8;

  /* Evidence */

  pdf.setFontSize(13);
  pdf.setFont("helvetica", "bold");
  pdf.text("Photo Evidence", margin, y);

  y += 9;

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");

  if (report.photos.length === 0) {
    pdf.text("No photos attached.", margin, y);
    y += 7;
  } else {
    report.photos.forEach((photo, index) => {
      const photoText = `${index + 1}. ${photo}`;

      y = addWrappedText(
        photoText,
        margin,
        y,
        contentWidth,
        6
      );

      y += 2;

      if (y > 270) {
        pdf.addPage();
        y = 20;
      }
    });
  }

  /* Footer */

  const pageCount = pdf.getNumberOfPages();

  for (let page = 1; page <= pageCount; page++) {
    pdf.setPage(page);

    const pageHeight = pdf.internal.pageSize.getHeight();

    pdf.setFontSize(8);
    pdf.setTextColor(120, 120, 120);

    pdf.text(
      `CropShield Crop Loss Report — Page ${page} of ${pageCount}`,
      margin,
      pageHeight - 10
    );
  }

  const fileName = getReportFileName(form, "pdf");

  pdf.save(fileName);
};

/* =========================================================
   DOCX REPORT
========================================================= */

const generateDOCXReport = async (
  form,
  coordinates,
  evidence
) => {
  const report = getReportData(form, coordinates, evidence);

  const children = [
    new Paragraph({
      text: "CropShield",
      heading: HeadingLevel.TITLE,
    }),

    new Paragraph({
      text: "Crop Loss Report",
      heading: HeadingLevel.HEADING_1,
    }),

    new Paragraph({
      children: [
        new TextRun({
          text: `Generated: ${new Date().toLocaleString()}`,
          size: 18,
          color: "666666",
        }),
      ],
    }),

    new Paragraph({
      text: "",
    }),

    new Paragraph({
      text: "Crop Information",
      heading: HeadingLevel.HEADING_2,
    }),

    new Paragraph({
      children: [
        new TextRun({
          text: "Crop Name: ",
          bold: true,
        }),
        new TextRun(report.cropName),
      ],
    }),

    new Paragraph({
      children: [
        new TextRun({
          text: "Date of Loss: ",
          bold: true,
        }),
        new TextRun(report.lossDate),
      ],
    }),

    new Paragraph({
      children: [
        new TextRun({
          text: "Farm / Plot Location: ",
          bold: true,
        }),
        new TextRun(report.farmLocation),
      ],
    }),

    new Paragraph({
      children: [
        new TextRun({
          text: "Affected Area: ",
          bold: true,
        }),
        new TextRun(report.affectedArea),
      ],
    }),

    new Paragraph({
      text: "",
    }),

    new Paragraph({
      text: "Loss Details",
      heading: HeadingLevel.HEADING_2,
    }),

    new Paragraph({
      children: [
        new TextRun({
          text: "Estimated Crop Loss: ",
          bold: true,
        }),
        new TextRun(report.estimatedLossPercent),
      ],
    }),

    new Paragraph({
      children: [
        new TextRun({
          text: "Primary Cause: ",
          bold: true,
        }),
        new TextRun(report.cause),
      ],
    }),

    new Paragraph({
      children: [
        new TextRun({
          text: "Estimated Quantity Lost: ",
          bold: true,
        }),
        new TextRun(report.estimatedQuantity),
      ],
    }),

    new Paragraph({
      text: "",
    }),

    new Paragraph({
      text: "Description",
      heading: HeadingLevel.HEADING_2,
    }),

    new Paragraph({
      text: report.description,
    }),

    new Paragraph({
      text: "",
    }),

    new Paragraph({
      text: "GPS Information",
      heading: HeadingLevel.HEADING_2,
    }),

    new Paragraph({
      children: [
        new TextRun({
          text: "Coordinates: ",
          bold: true,
        }),
        new TextRun(report.gps),
      ],
    }),

    new Paragraph({
      children: [
        new TextRun({
          text: "Accuracy: ",
          bold: true,
        }),
        new TextRun(report.gpsAccuracy),
      ],
    }),

    new Paragraph({
      children: [
        new TextRun({
          text: "Captured At: ",
          bold: true,
        }),
        new TextRun(report.gpsCapturedAt),
      ],
    }),

    new Paragraph({
      text: "",
    }),

    new Paragraph({
      text: "Photo Evidence",
      heading: HeadingLevel.HEADING_2,
    }),
  ];

  if (report.photos.length === 0) {
    children.push(
      new Paragraph({
        text: "No photos attached.",
      })
    );
  } else {
    report.photos.forEach((photo, index) => {
      children.push(
        new Paragraph({
          text: `${index + 1}. ${photo}`,
        })
      );
    });
  }

  children.push(
    new Paragraph({
      text: "",
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: "Generated by CropShield",
          italics: true,
          color: "666666",
        }),
      ],
    })
  );

  const document = new Document({
    sections: [
      {
        properties: {},
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(document);

  const fileName = getReportFileName(form, "docx");

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

/* =========================================================
   AUTOMATIC REPORT SAVING
========================================================= */

const automaticallySaveReport = async (
  form,
  coordinates,
  evidence
) => {
  const autoSave =
    localStorage.getItem("cropShieldAutoSave") === "true";

  if (!autoSave) {
    return;
  }

  const selectedFormat =
    localStorage.getItem("cropShieldReportFormat") || "PDF";

  try {
    if (selectedFormat === "DOCX") {
      await generateDOCXReport(
        form,
        coordinates,
        evidence
      );
    } else {
      generatePDFReport(
        form,
        coordinates,
        evidence
      );
    }
  } catch (error) {
    console.error("Automatic report generation failed:", error);
  }
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

const LogLoss = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [evidence, setEvidence] = useState([]);
  const [coordinates, setCoordinates] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [saving, setSaving] = useState(false);
  const [locating, setLocating] = useState(false);

  const update = (event) => {
    setForm((old) => ({
      ...old,
      [event.target.name]: event.target.value,
    }));
  };

  /* =========================================================
     GPS
  ========================================================= */

  const captureLocation = () => {
    if (!navigator.geolocation) {
      return setError(
        "GPS is not supported by this browser."
      );
    }

    setLocating(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: Math.round(
            position.coords.accuracy
          ),
          capturedAt: new Date().toISOString(),
        });

        setLocating(false);
      },
      () => {
        setError(
          "We could not get your location. Please allow location access and try again."
        );

        setLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  };

  /* =========================================================
     PHOTO SELECTION
  ========================================================= */

  const selectFiles = async (event) => {
    const chosen = Array.from(event.target.files);

    if (
      chosen.some(
        (file) =>
          file.size > 1.5 * 1024 * 1024
      )
    ) {
      return setError(
        "Each photo must be 1.5 MB or smaller."
      );
    }

    const files = chosen.slice(
      0,
      5 - evidence.length
    );

    if (
      chosen.length + evidence.length >
      5
    ) {
      setError(
        "You can attach a maximum of five photos."
      );
    }

    try {
      const selected = await Promise.all(
        files.map(readFile)
      );

      setEvidence((old) => [
        ...old,
        ...selected,
      ]);
    } catch {
      setError(
        "One or more photos could not be read."
      );
    }
  };

  /* =========================================================
     SUBMIT REPORT
  ========================================================= */

  const submit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (
      !form.cropType ||
      !form.cause ||
      !form.lossDate ||
      form.affectedArea === "" ||
      form.estimatedLossPercent === ""
    ) {
      return setError(
        "Please complete all required fields."
      );
    }

    if (
      form.cropType === "Other" &&
      !form.otherCrop.trim()
    ) {
      return setError(
        "Please enter the crop name."
      );
    }

    setSaving(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/crop-losses",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...form,
            evidence,
            coordinates,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      /*
       * The database save was successful.
       * Now check the user's Data & Reports
       * settings and automatically generate
       * the selected file format if enabled.
       */

      await automaticallySaveReport(
        form,
        coordinates,
        evidence
      );

      const autoSave =
        localStorage.getItem(
          "cropShieldAutoSave"
        ) === "true";

      const selectedFormat =
        localStorage.getItem(
          "cropShieldReportFormat"
        ) || "PDF";

      if (autoSave) {
        setMessage(
          `Your crop-loss report has been saved${
            selectedFormat === "DOCX"
              ? " and the DOCX report was downloaded."
              : " and the PDF report was downloaded."
          }`
        );
      } else {
        setMessage(
          "Your verified crop-loss report has been saved."
        );
      }

      setTimeout(() => {
        navigate("/reports");
      }, 1200);
    } catch (err) {
      setError(
        err.message ||
          "Unable to save the report."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="log-loss-page">
      <div className="log-loss-container">

        <div className="log-loss-header">
          <span className="log-loss-label">
            CROP LOSS REPORT
          </span>

          <h1>Log Crop Loss</h1>

          <p>
            Document damage with the date, area,
            GPS position, and photos needed for
            an aid or insurance claim.
          </p>
        </div>

        <form
          className="loss-form"
          onSubmit={submit}
        >

          {/* =================================================
              CROP INFORMATION
          ================================================= */}

          <section className="form-card">

            <div className="form-card-header">
              <div className="form-card-icon">
                🌾
              </div>

              <div>
                <h2>
                  Crop information
                </h2>

                <p>
                  Tell us what was affected.
                </p>
              </div>
            </div>

            <div className="form-grid">

              <div className="form-field">
                <label>
                  Crop name *
                </label>

                <select
                  name="cropType"
                  value={form.cropType}
                  onChange={update}
                  required
                >
                  <option
                    value=""
                    disabled
                  >
                    Select crop
                  </option>

                  <option value="Rice">
                    Rice
                  </option>

                  <option value="Jute">
                    Jute
                  </option>

                  <option value="Wheat">
                    Wheat
                  </option>

                  <option value="Maize">
                    Maize
                  </option>

                  <option value="Vegetables">
                    Vegetables
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>
              </div>

              <div className="form-field">
                <label>
                  Date of loss *
                </label>

                <input
                  name="lossDate"
                  type="date"
                  value={form.lossDate}
                  onChange={update}
                  required
                />
              </div>

              <div className="form-field">
                <label>
                  Farm/plot location
                </label>

                <input
                  name="farmLocation"
                  value={form.farmLocation}
                  onChange={update}
                  placeholder="e.g. North Field, Barisal"
                />
              </div>

              <div className="form-field">
                <label>
                  Affected area (acres) *
                </label>

                <div className="input-with-unit">
                  <input
                    name="affectedArea"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.affectedArea}
                    onChange={update}
                    required
                  />

                  <span>
                    acres
                  </span>
                </div>
              </div>

              {form.cropType ===
                "Other" && (
                <div className="form-field">
                  <label>
                    Crop name *
                  </label>

                  <input
                    name="otherCrop"
                    value={form.otherCrop}
                    onChange={update}
                    placeholder="Enter crop name"
                    required
                  />
                </div>
              )}

            </div>
          </section>

          {/* =================================================
              LOSS DETAILS
          ================================================= */}

          <section className="form-card">

            <div className="form-card-header">
              <div className="form-card-icon">
                📉
              </div>

              <div>
                <h2>
                  Loss details
                </h2>

                <p>
                  Describe the scale and likely cause.
                </p>
              </div>
            </div>

            <div className="form-grid">

              <div className="form-field">
                <label>
                  Estimated crop loss (%) *
                </label>

                <div className="input-with-unit">
                  <input
                    name="estimatedLossPercent"
                    type="number"
                    min="0"
                    max="100"
                    value={
                      form.estimatedLossPercent
                    }
                    onChange={update}
                    required
                  />

                  <span>
                    %
                  </span>
                </div>
              </div>

              <div className="form-field">
                <label>
                  Primary cause *
                </label>

                <select
                  name="cause"
                  value={form.cause}
                  onChange={update}
                  required
                >
                  <option
                    value=""
                    disabled
                  >
                    Select cause
                  </option>

                  <option>
                    Flood
                  </option>

                  <option>
                    Cyclone
                  </option>

                  <option>
                    Waterlogging
                  </option>

                  <option>
                    Drought
                  </option>

                  <option>
                    Pest damage
                  </option>

                  <option>
                    Disease
                  </option>

                  <option>
                    Other
                  </option>
                </select>
              </div>

              <div className="form-field">
                <label>
                  Estimated quantity lost
                </label>

                <input
                  name="estimatedQuantity"
                  type="number"
                  min="0"
                  value={
                    form.estimatedQuantity
                  }
                  onChange={update}
                />
              </div>

              <div className="form-field">
                <label>
                  Unit
                </label>

                <select
                  name="quantityUnit"
                  value={form.quantityUnit}
                  onChange={update}
                >
                  <option>
                    kg
                  </option>

                  <option>
                    maund
                  </option>

                  <option>
                    bundles
                  </option>

                  <option>
                    pieces
                  </option>
                </select>
              </div>

            </div>

            <div className="form-field">
              <label>
                Description
              </label>

              <textarea
                name="description"
                rows="4"
                value={form.description}
                onChange={update}
                placeholder="What happened and what damage is visible?"
              />
            </div>

          </section>

          {/* =================================================
              EVIDENCE AND GPS
          ================================================= */}

          <section className="form-card">

            <div className="form-card-header">
              <div className="form-card-icon">
                📍
              </div>

              <div>
                <h2>
                  Evidence and GPS
                </h2>

                <p>
                  Capture location and photos
                  while documenting the event.
                </p>
              </div>
            </div>

            <div className="form-field">

              <button
                type="button"
                className="secondary-button"
                onClick={captureLocation}
                disabled={locating}
              >
                {locating
                  ? "Capturing location…"
                  : "Capture current GPS location"}
              </button>

              {coordinates && (
                <p className="evidence-status">
                  ✓ GPS captured:{" "}
                  {coordinates.latitude.toFixed(
                    5
                  )}
                  ,{" "}
                  {coordinates.longitude.toFixed(
                    5
                  )}{" "}
                  (±
                  {coordinates.accuracy} m)
                </p>
              )}

            </div>

            <div className="upload-area">

              <h3>
                Upload photos
              </h3>

              <p>
                Up to five JPG or PNG photos
                (1.5 MB each). They are stored
                with this report.
              </p>

              <input
                type="file"
                accept="image/png,image/jpeg"
                multiple
                onChange={selectFiles}
              />

              {evidence.length > 0 && (
                <p className="evidence-status">
                  {evidence.length} photo
                  {evidence.length > 1
                    ? "s"
                    : ""}{" "}
                  attached
                </p>
              )}

            </div>

          </section>

          {/* =================================================
              MESSAGES
          ================================================= */}

          {message && (
            <div className="baseline-success">
              <span>✓</span>

              <p>
                {message}
              </p>
            </div>
          )}

          {error && (
            <div className="baseline-error">
              <span>!</span>

              <p>
                {error}
              </p>
            </div>
          )}

          {/* =================================================
              ACTIONS
          ================================================= */}

          <div className="form-actions">

            <button
              type="button"
              className="secondary-button"
              onClick={() =>
                navigate(-1)
              }
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={saving}
            >
              {saving
                ? "Saving…"
                : "Save loss report"}
            </button>

          </div>

        </form>
      </div>
    </main>
  );
};

export default LogLoss;