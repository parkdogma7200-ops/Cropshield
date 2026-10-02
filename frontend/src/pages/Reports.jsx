import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  ImageRun,
} from "docx";
import { useAuth } from "../context/AuthContext.jsx";
import "../css/Reports.css";

const API_URL = "http://localhost:5000";

const Reports = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [losses, setLosses] = useState([]);
  const [baseline, setBaseline] = useState(null);

  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [search, setSearch] = useState("");
  const [cropFilter, setCropFilter] = useState("all");

  const [reportFormat, setReportFormat] = useState(
    localStorage.getItem("cropShieldReportFormat") || "PDF"
  );

  const [autoSaveReports, setAutoSaveReports] = useState(
    localStorage.getItem("cropShieldAutoSave") === "true"
  );

  /* =========================================================
     LOAD REPORT DATA
  ========================================================= */

  const loadReports = useCallback(async () => {
    if (!token) {
      setLoading(false);
      setError("Please log in to view your reports.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/crop-losses/summary`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load reports.");
      }

      setLosses(Array.isArray(data.losses) ? data.losses : []);
      setBaseline(data.baseline || null);
    } catch (err) {
      console.error("Reports loading error:", err);
      setError(err.message || "Unable to load reports.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    // The fetch updates state asynchronously; this effect only starts the request.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadReports();
  }, [loadReports]);

  /* =========================================================
     SETTINGS LISTENERS
  ========================================================= */

  useEffect(() => {
    const handleFormatChange = () => {
      setReportFormat(
        localStorage.getItem("cropShieldReportFormat") || "PDF"
      );
    };

    const handleAutoSaveChange = () => {
      setAutoSaveReports(
        localStorage.getItem("cropShieldAutoSave") === "true"
      );
    };

    window.addEventListener(
      "cropShieldReportFormatChanged",
      handleFormatChange
    );

    window.addEventListener(
      "cropShieldAutoSaveChanged",
      handleAutoSaveChange
    );

    return () => {
      window.removeEventListener(
        "cropShieldReportFormatChanged",
        handleFormatChange
      );

      window.removeEventListener(
        "cropShieldAutoSaveChanged",
        handleAutoSaveChange
      );
    };
  }, []);

  /* =========================================================
     FILTERED REPORTS
  ========================================================= */

  const cropOptions = useMemo(() => {
    const crops = losses
      .map((loss) => {
        if (loss.cropType === "Other" && loss.otherCrop) {
          return loss.otherCrop;
        }

        return loss.cropType;
      })
      .filter(Boolean);

    return [...new Set(crops)].sort();
  }, [losses]);

  const filteredLosses = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return losses.filter((loss) => {
      const cropName =
        loss.cropType === "Other" && loss.otherCrop
          ? loss.otherCrop
          : loss.cropType || "";

      const searchableText = [
        cropName,
        loss.cause,
        loss.farmLocation,
        loss.description,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !searchText || searchableText.includes(searchText);

      const matchesCrop =
        cropFilter === "all" || cropName === cropFilter;

      return matchesSearch && matchesCrop;
    });
  }, [losses, search, cropFilter]);

  /* =========================================================
     SUMMARY CALCULATIONS
  ========================================================= */

  const totalArea = losses.reduce(
    (sum, loss) => sum + Number(loss.affectedArea || 0),
    0
  );

  const averageLoss = losses.length
    ? losses.reduce(
        (sum, loss) =>
          sum + Number(loss.estimatedLossPercent || 0),
        0
      ) / losses.length
    : 0;

  const baselineArea = Number(
    baseline?.totalFarmSize ||
      baseline?.farmSize ||
      baseline?.cultivatedLand ||
      0
  );

  const affectedPercentage =
    baselineArea > 0
      ? (totalArea / baselineArea) * 100
      : 0;

  /* =========================================================
     HELPERS
  ========================================================= */

  const getCropName = (loss) => {
    if (loss.cropType === "Other" && loss.otherCrop) {
      return loss.otherCrop;
    }

    return loss.cropType || "Unknown crop";
  };

  const getFormattedDate = (date) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "N/A";
    }

    return parsedDate.toLocaleDateString();
  };

  const getFormattedDateTime = () => {
    return new Date().toLocaleString();
  };

  const getGpsText = (loss) => {
    const latitude = loss.coordinates?.latitude;
    const longitude = loss.coordinates?.longitude;

    if (
      latitude === undefined ||
      latitude === null ||
      longitude === undefined ||
      longitude === null
    ) {
      return "Not captured";
    }

    return `${latitude}, ${longitude}`;
  };

  const getFileName = (extension) => {
    const farmName =
      baseline?.farmName?.trim() || "CropShield";

    const safeFarmName = farmName
      .replace(/[^a-z0-9]+/gi, "-")
      .replace(/^-+|-+$/g, "")
      .toLowerCase();

    return `${safeFarmName || "cropshield"}-claim-summary.${extension}`;
  };

  const getEvidenceCount = (loss) => {
    return Array.isArray(loss.evidence)
      ? loss.evidence.length
      : 0;
  };

  const getEvidenceUrl = (photo) => {
    if (!photo) return "";

    if (photo.url?.startsWith("http")) {
      return photo.url;
    }

    if (photo.url) {
      return `${API_URL}${photo.url}`;
    }

    if (photo.dataUrl) {
      return photo.dataUrl;
    }

    return "";
  };

  /* =========================================================
     PDF EXPORT
  ========================================================= */

  const generatePDF = async () => {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    let y = 20;

    const addPageIfNeeded = (requiredHeight = 15) => {
      if (y + requiredHeight > pageHeight - 18) {
        pdf.addPage();
        y = 20;
      }
    };

    /* Header */

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(20);
    pdf.text("CropShield", 20, y);

    y += 8;

    pdf.setFontSize(15);
    pdf.text("Seasonal Claim Summary", 20, y);

    y += 7;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.text(
      `Generated: ${getFormattedDateTime()}`,
      20,
      y
    );

    y += 12;

    /* Farm baseline */

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    pdf.text("Farm Baseline", 20, y);

    y += 7;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);

    const farmDetails = [
      `Farm name: ${baseline?.farmName || "Not set"}`,
      `Farm location: ${
        baseline?.farmLocation || "Not set"
      }`,
      `Cultivated land: ${
        baselineArea ? `${baselineArea} acres` : "Not set"
      }`,
    ];

    farmDetails.forEach((detail) => {
      pdf.text(detail, 23, y);
      y += 5;
    });

    y += 6;

    /* Summary */

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    pdf.text("Claim Summary", 20, y);

    y += 7;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);

    const summaryDetails = [
      `Total documented incidents: ${losses.length}`,
      `Total affected area: ${totalArea.toFixed(2)} acres`,
      `Affected land: ${affectedPercentage.toFixed(1)}%`,
      `Average estimated loss: ${averageLoss.toFixed(1)}%`,
    ];

    summaryDetails.forEach((detail) => {
      pdf.text(detail, 23, y);
      y += 5;
    });

    y += 8;

    /* Loss events */

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    pdf.text("Documented Loss Events", 20, y);

    y += 8;

    for (let index = 0; index < losses.length; index++) {
      const loss = losses[index];

      addPageIfNeeded(55);

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(10);

      pdf.text(
        `${index + 1}. ${getCropName(loss)}`,
        20,
        y
      );

      y += 6;

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8.5);

      const details = [
        `Date: ${getFormattedDate(loss.lossDate)}`,
        `Cause: ${loss.cause || "Not specified"}`,
        `Farm / plot: ${
          loss.farmLocation || "Not specified"
        }`,
        `Affected area: ${Number(
          loss.affectedArea || 0
        ).toFixed(2)} acres`,
        `Estimated loss: ${Number(
          loss.estimatedLossPercent || 0
        ).toFixed(1)}%`,
        `Quantity lost: ${
          loss.estimatedQuantity
            ? `${loss.estimatedQuantity} ${
                loss.quantityUnit || ""
              }`
            : "Not specified"
        }`,
        `GPS: ${getGpsText(loss)}`,
        `Evidence photos: ${getEvidenceCount(loss)}`,
      ];

      details.forEach((detail) => {
        addPageIfNeeded(8);

        const wrapped = pdf.splitTextToSize(
          detail,
          pageWidth - 46
        );

        pdf.text(wrapped, 24, y);
        y += wrapped.length * 4.2 + 1;
      });

      if (loss.description) {
        addPageIfNeeded(15);

        pdf.setFont("helvetica", "bold");
        pdf.text("Description:", 24, y);

        y += 4.5;

        pdf.setFont("helvetica", "normal");

        const descriptionLines = pdf.splitTextToSize(
          loss.description,
          pageWidth - 48
        );

        pdf.text(descriptionLines, 24, y);

        y += descriptionLines.length * 4.2 + 3;
      }

      y += 5;

      pdf.setDrawColor(220, 228, 221);
      pdf.line(20, y, pageWidth - 20, y);

      y += 7;
    }

    if (losses.length === 0) {
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.text(
        "No documented crop-loss incidents.",
        23,
        y
      );
    }

    /* Footer */

    const totalPages = pdf.getNumberOfPages();

    for (let page = 1; page <= totalPages; page++) {
      pdf.setPage(page);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(7);

      pdf.text(
        "CropShield — Farmer Crop-Loss Documentation & Aid-Claim Assistant",
        20,
        pageHeight - 10
      );

      pdf.text(
        `Page ${page} of ${totalPages}`,
        pageWidth - 20,
        pageHeight - 10,
        {
          align: "right",
        }
      );
    }

    pdf.save(getFileName("pdf"));
  };

  /* =========================================================
     DOCX EXPORT
  ========================================================= */

  const generateDOCX = async () => {
    const children = [];

    children.push(
      new Paragraph({
        text: "CropShield",
        heading: HeadingLevel.TITLE,
      })
    );

    children.push(
      new Paragraph({
        text: "Seasonal Claim Summary",
        heading: HeadingLevel.HEADING_1,
      })
    );

    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Generated: ${getFormattedDateTime()}`,
          }),
        ],
      })
    );

    children.push(
      new Paragraph({
        text: "Farm Baseline",
        heading: HeadingLevel.HEADING_2,
      })
    );

    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Farm name: ",
            bold: true,
          }),
          new TextRun({
            text: baseline?.farmName || "Not set",
          }),
        ],
      })
    );

    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Farm location: ",
            bold: true,
          }),
          new TextRun({
            text: baseline?.farmLocation || "Not set",
          }),
        ],
      })
    );

    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Cultivated land: ",
            bold: true,
          }),
          new TextRun({
            text: baselineArea
              ? `${baselineArea} acres`
              : "Not set",
          }),
        ],
      })
    );

    children.push(
      new Paragraph({
        text: "Claim Summary",
        heading: HeadingLevel.HEADING_2,
      })
    );

    const summaryItems = [
      `Total documented incidents: ${losses.length}`,
      `Total affected area: ${totalArea.toFixed(2)} acres`,
      `Affected land: ${affectedPercentage.toFixed(1)}%`,
      `Average estimated loss: ${averageLoss.toFixed(1)}%`,
    ];

    summaryItems.forEach((item) => {
      children.push(
        new Paragraph({
          text: item,
          bullet: {
            level: 0,
          },
        })
      );
    });

    children.push(
      new Paragraph({
        text: "Documented Loss Events",
        heading: HeadingLevel.HEADING_2,
      })
    );

    for (let index = 0; index < losses.length; index++) {
      const loss = losses[index];

      children.push(
        new Paragraph({
          text: `${index + 1}. ${getCropName(loss)}`,
          heading: HeadingLevel.HEADING_3,
        })
      );

      const details = [
        ["Date", getFormattedDate(loss.lossDate)],
        ["Cause", loss.cause || "Not specified"],
        [
          "Farm / plot",
          loss.farmLocation || "Not specified",
        ],
        [
          "Affected area",
          `${Number(loss.affectedArea || 0).toFixed(
            2
          )} acres`,
        ],
        [
          "Estimated loss",
          `${Number(
            loss.estimatedLossPercent || 0
          ).toFixed(1)}%`,
        ],
        [
          "Quantity lost",
          loss.estimatedQuantity
            ? `${loss.estimatedQuantity} ${
                loss.quantityUnit || ""
              }`
            : "Not specified",
        ],
        ["GPS", getGpsText(loss)],
        [
          "Evidence photos",
          String(getEvidenceCount(loss)),
        ],
      ];

      details.forEach(([label, value]) => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${label}: `,
                bold: true,
              }),
              new TextRun({
                text: value,
              }),
            ],
          })
        );
      });

      if (loss.description) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "Description: ",
                bold: true,
              }),
              new TextRun({
                text: loss.description,
              }),
            ],
          })
        );
      }

      /*
       * Embed evidence photos when the backend provides
       * accessible image URLs.
       */
      if (
        Array.isArray(loss.evidence) &&
        loss.evidence.length > 0
      ) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "Evidence:",
                bold: true,
              }),
            ],
          })
        );

        for (const photo of loss.evidence) {
          const imageUrl = getEvidenceUrl(photo);

          if (!imageUrl) continue;

          try {
            const imageResponse = await fetch(imageUrl);

            if (!imageResponse.ok) continue;

            const imageBlob =
              await imageResponse.blob();

            const imageArrayBuffer =
              await imageBlob.arrayBuffer();

            children.push(
              new Paragraph({
                children: [
                  new ImageRun({
                    data: imageArrayBuffer,
                    transformation: {
                      width: 180,
                      height: 130,
                    },
                  }),
                ],
              })
            );
          } catch (imageError) {
            console.warn(
              "Could not embed evidence image:",
              imageError
            );
          }
        }
      }
    }

    if (losses.length === 0) {
      children.push(
        new Paragraph({
          text: "No documented crop-loss incidents.",
        })
      );
    }

    /*
     * Important:
     * Use "docxDocument" instead of "document" so that
     * window.document remains available for browser downloads.
     */
    const docxDocument = new Document({
      sections: [
        {
          properties: {},
          children,
        },
      ],
    });

    const blob = await Packer.toBlob(docxDocument);

    const url = URL.createObjectURL(blob);

    const anchor = window.document.createElement("a");

    anchor.href = url;
    anchor.download = getFileName("docx");

    window.document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);
  };

  /* =========================================================
     EXPORT CLAIM SUMMARY
  ========================================================= */

  const downloadClaim = async () => {
    try {
      setExporting(true);
      setMessage("");
      setError("");

      if (reportFormat === "DOCX") {
        await generateDOCX();
        setMessage(
          "Your DOCX claim summary has been generated."
        );
      } else {
        await generatePDF();
        setMessage(
          "Your PDF claim summary has been generated."
        );
      }
    } catch (err) {
      console.error("Export error:", err);
      setError(
        "Unable to generate the claim summary. Please try again."
      );
    } finally {
      setExporting(false);
    }
  };

  /* =========================================================
     UI
  ========================================================= */

  return (
    <main className="reports-page">
      <div className="reports-container">

        {/* ===================================================
            HEADER
        =================================================== */}

        <header className="reports-header">
          <div>
            <span className="reports-label">
              DOCUMENTATION
            </span>

            <h1>Reports</h1>

            <p>
              Review your documented crop losses and prepare
              a claim-ready seasonal summary.
            </p>
          </div>

          <div className="reports-header-actions">
            <button
              type="button"
              className="new-report-button"
              onClick={() => navigate("/log-loss")}
            >
              + New Report
            </button>
          </div>
        </header>

        {/* ===================================================
            EXPORT STATUS
        =================================================== */}

        <div className="reports-export-status">
          <span>
            {autoSaveReports
              ? "✓ Automatic report saving is enabled"
              : "Automatic report saving is disabled"}
          </span>

          <span>
            Export format: <strong>{reportFormat}</strong>
          </span>
        </div>

        {/* ===================================================
            SUMMARY CARDS
        =================================================== */}

        <section className="report-summary">

          <div className="summary-card">
            <div className="summary-icon">📋</div>

            <div>
              <span className="summary-label">
                Total Reports
              </span>

              <strong>{losses.length}</strong>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon">🌾</div>

            <div>
              <span className="summary-label">
                Affected Area
              </span>

              <strong>
                {totalArea.toFixed(2)} acres
              </strong>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon">📉</div>

            <div>
              <span className="summary-label">
                Average Loss
              </span>

              <strong>
                {averageLoss.toFixed(1)}%
              </strong>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon">🗺️</div>

            <div>
              <span className="summary-label">
                Land Affected
              </span>

              <strong>
                {affectedPercentage.toFixed(1)}%
              </strong>
            </div>
          </div>

        </section>

        {/* ===================================================
            TOOLBAR
        =================================================== */}

        <div className="reports-toolbar">

          <div className="report-search">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search reports..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>

          <select
            className="report-filter"
            value={cropFilter}
            onChange={(event) =>
              setCropFilter(event.target.value)
            }
          >
            <option value="all">All crops</option>

            {cropOptions.map((crop) => (
              <option key={crop} value={crop}>
                {crop}
              </option>
            ))}
          </select>

        </div>

        {/* ===================================================
            MESSAGES
        =================================================== */}

        {error && (
          <div className="reports-message reports-error">
            <span>!</span>
            <p>{error}</p>
          </div>
        )}

        {message && (
          <div className="reports-message reports-success">
            <span>✓</span>
            <p>{message}</p>
          </div>
        )}

        {/* ===================================================
            REPORTS CARD
        =================================================== */}

        <section className="reports-card">

          <div className="reports-card-header">
            <div>
              <h2>Documented Losses</h2>

              <p>
                {filteredLosses.length} of{" "}
                {losses.length} reports shown
              </p>
            </div>

            <button
              type="button"
              className="export-claim-button"
              onClick={downloadClaim}
              disabled={
                exporting ||
                loading ||
                losses.length === 0
              }
            >
              {exporting
                ? "Generating..."
                : `Export ${reportFormat}`}
            </button>
          </div>

          {loading ? (
            <div className="reports-empty">
              <div className="reports-loading-spinner">
                ↻
              </div>

              <p>Loading your reports...</p>
            </div>
          ) : filteredLosses.length === 0 ? (
            <div className="reports-empty">
              <div className="reports-empty-icon">
                📄
              </div>

              <h3>
                {losses.length === 0
                  ? "No reports yet"
                  : "No matching reports"}
              </h3>

              <p>
                {losses.length === 0
                  ? "Start by documenting your first crop-loss incident."
                  : "Try changing your search or crop filter."}
              </p>

              {losses.length === 0 && (
                <button
                  type="button"
                  className="new-report-button"
                  onClick={() =>
                    navigate("/log-loss")
                  }
                >
                  + Log Crop Loss
                </button>
              )}
            </div>
          ) : (
            <>
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
                      <th>Evidence</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredLosses.map((loss, index) => (
                      <tr key={loss._id || index}>

                        <td>
                          <span className="report-id">
                            #{String(index + 1).padStart(3, "0")}
                          </span>

                          <span className="report-location">
                            {loss.farmLocation ||
                              "Location not set"}
                          </span>
                        </td>

                        <td>
                          {getFormattedDate(
                            loss.lossDate
                          )}
                        </td>

                        <td>
                          {getCropName(loss)}
                        </td>

                        <td>
                          {loss.cause ||
                            "Not specified"}
                        </td>

                        <td>
                          <span className="loss-value">
                            {Number(
                              loss.estimatedLossPercent ||
                                0
                            ).toFixed(1)}
                            %
                          </span>
                        </td>

                        <td>
                          {Number(
                            loss.affectedArea || 0
                          ).toFixed(2)}{" "}
                          ac
                        </td>

                        <td>
                          <span className="report-status">
                            {getEvidenceCount(loss)} photo
                            {getEvidenceCount(loss) !== 1
                              ? "s"
                              : ""}
                          </span>
                        </td>

                      </tr>
                    ))}
                  </tbody>

                </table>

              </div>

              {/* =================================================
                  EVIDENCE GALLERY
              ================================================= */}

              <div className="reports-evidence-section">

                <div className="reports-evidence-header">
                  <div>
                    <h3>Evidence Photos</h3>

                    <p>
                      Photos attached to your documented
                      crop-loss incidents.
                    </p>
                  </div>
                </div>

                {filteredLosses.some(
                  (loss) =>
                    Array.isArray(loss.evidence) &&
                    loss.evidence.length > 0
                ) ? (
                  <div className="evidence-report-list">

                    {filteredLosses.map((loss, index) => {
                      if (
                        !Array.isArray(loss.evidence) ||
                        loss.evidence.length === 0
                      ) {
                        return null;
                      }

                      return (
                        <div
                          className="evidence-report"
                          key={
                            loss._id ||
                            `evidence-${index}`
                          }
                        >
                          <div className="evidence-report-title">
                            <strong>
                              {getCropName(loss)}
                            </strong>

                            <span>
                              {getFormattedDate(
                                loss.lossDate
                              )}
                            </span>
                          </div>

                          <div className="evidence-gallery">
                            {loss.evidence.map(
                              (photo, photoIndex) => {
                                const imageUrl =
                                  getEvidenceUrl(photo);

                                if (!imageUrl) {
                                  return null;
                                }

                                return (
                                  <a
                                    key={
                                      photo._id ||
                                      photoIndex
                                    }
                                    href={imageUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="evidence-image-link"
                                  >
                                    <img
                                      src={imageUrl}
                                      alt={`Evidence ${
                                        photoIndex + 1
                                      } for ${getCropName(
                                        loss
                                      )}`}
                                    />
                                  </a>
                                );
                              }
                            )}
                          </div>
                        </div>
                      );
                    })}

                  </div>
                ) : (
                  <div className="no-evidence">
                    No evidence photos have been attached
                    to the displayed reports.
                  </div>
                )}

              </div>
            </>
          )}

        </section>

        {/* ===================================================
            NOTICE
        =================================================== */}

        <div className="reports-notice">
          <span>ⓘ</span>

          <p>
            <strong>Claim documentation:</strong>{" "}
            Your reports combine crop-loss details,
            affected area, GPS information, dates, and
            evidence records into a seasonal summary that
            can be exported as {reportFormat}.
          </p>
        </div>

      </div>
    </main>
  );
};

export default Reports;