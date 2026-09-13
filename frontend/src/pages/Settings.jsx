import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "../css/Settings.css";

const Settings = () => {
  const navigate = useNavigate();

  const { user, token, login, logout } = useAuth();

  const [accountOpen, setAccountOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [accountForm, setAccountForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    farmName: user?.farmName || "",
    farmLocation: user?.farmLocation || "",
    farmSize: user?.farmSize || "",
    primaryCrop: user?.primaryCrop || "",
  });

  // =====================================
  // Open Account Editor
  // =====================================

  const handleOpenAccount = () => {
    setAccountForm({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      farmName: user?.farmName || "",
      farmLocation: user?.farmLocation || "",
      farmSize: user?.farmSize || "",
      primaryCrop: user?.primaryCrop || "",
    });

    setMessage("");
    setError("");
    setAccountOpen(true);
  };

  // =====================================
  // Close Account Editor
  // =====================================

  const handleCloseAccount = () => {
    if (saving) {
      return;
    }

    setAccountOpen(false);
    setMessage("");
    setError("");
  };

  // =====================================
  // Handle Form Changes
  // =====================================

  const handleAccountChange = (event) => {
    const { name, value } = event.target;

    setAccountForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================
  // Save Account Information
  // =====================================

  const handleSaveAccount = async (event) => {
    event.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/me",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(accountForm),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to update account information."
        );
      }

      /*
       * Update AuthContext immediately so the
       * Navbar profile changes without logging in again.
       */
      const rememberMe =
        localStorage.getItem("cropShieldToken") !== null;

      login(data.user, token, rememberMe);

      setMessage("Account information updated successfully.");

      setTimeout(() => {
        setAccountOpen(false);
        setMessage("");
      }, 1200);
    } catch (error) {
      console.error("Account update error:", error);

      setError(
        error.message ||
          "Something went wrong while updating your account."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================
  // Logout
  // =====================================

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="settings-page">
      <div className="settings-container">

        {/* Header */}
        <div className="settings-header">
          <span className="settings-label">
            PREFERENCES
          </span>

          <h1>Settings</h1>

          <p>
            Manage your CropShield preferences and
            application settings.
          </p>
        </div>


        {/* Settings Cards */}
        <div className="settings-content">

          {/* =====================================
              Account
          ===================================== */}

          <section className="settings-card">

            <div className="settings-card-header">

              <div className="settings-card-icon">
                👤
              </div>

              <div>
                <h2>Account</h2>

                <p>
                  Manage your account information.
                </p>
              </div>

            </div>


            {/* Profile Preview */}
            <div className="settings-profile">

              <div className="profile-avatar">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>

              <div className="profile-info">

                <strong>
                  {user?.name || "CropShield User"}
                </strong>

                <span>
                  {user?.email || "No email available"}
                </span>

              </div>

            </div>


            {/* Edit Account */}
            <div className="settings-row">

              <div>
                <strong>
                  Account Information
                </strong>

                <span>
                  Edit your personal and farm information.
                </span>
              </div>

              <button
                type="button"
                className="settings-edit-button"
                onClick={handleOpenAccount}
              >
                Edit Information
              </button>

            </div>


            {/* Account Status */}
            <div className="settings-row">

              <div>
                <strong>Account Status</strong>

                <span>
                  Your CropShield account is active.
                </span>
              </div>

              <span className="settings-status">
                Active
              </span>

            </div>


            {/* Email Notifications */}
            <div className="settings-row">

              <div>
                <strong>Email Notifications</strong>

                <span>
                  Receive updates about your reports.
                </span>
              </div>

              <label className="settings-toggle">

                <input
                  type="checkbox"
                  defaultChecked
                />

                <span className="toggle-slider"></span>

              </label>

            </div>


            {/* Logout */}
            <div className="settings-logout">

              <div>
                <strong>Sign Out</strong>

                <span>
                  Sign out of your CropShield account.
                </span>
              </div>

              <button
                type="button"
                className="settings-logout-button"
                onClick={handleLogout}
              >
                Log Out
              </button>

            </div>

          </section>


          {/* =====================================
              Appearance
          ===================================== */}

          <section className="settings-card">

            <div className="settings-card-header">

              <div className="settings-card-icon">
                🎨
              </div>

              <div>
                <h2>Appearance</h2>

                <p>
                  Customize how CropShield looks.
                </p>
              </div>

            </div>


            <div className="settings-row">

              <div>
                <strong>Theme</strong>

                <span>
                  Choose your preferred appearance.
                </span>
              </div>

              <select defaultValue="light">

                <option value="light">
                  Light
                </option>

                <option value="dark">
                  Dark
                </option>

                <option value="system">
                  System
                </option>

              </select>

            </div>

          </section>


          {/* =====================================
              Data & Reports
          ===================================== */}

          <section className="settings-card">

            <div className="settings-card-header">

              <div className="settings-card-icon">
                🗂️
              </div>

              <div>
                <h2>Data & Reports</h2>

                <p>
                  Manage your report preferences.
                </p>
              </div>

            </div>


            <div className="settings-row">

              <div>
                <strong>
                  Save Reports Automatically
                </strong>

                <span>
                  Automatically save completed reports.
                </span>
              </div>

              <label className="settings-toggle">

                <input type="checkbox" />

                <span className="toggle-slider"></span>

              </label>

            </div>


            <div className="settings-row">

              <div>
                <strong>Report Format</strong>

                <span>
                  Default format for generated reports.
                </span>
              </div>

              <select defaultValue="PDF">

                <option value="PDF">
                  PDF
                </option>

                <option value="DOCX">
                  DOCX
                </option>

              </select>

            </div>

          </section>


          {/* Information Notice */}
          <div className="settings-notice">

            <span>ⓘ</span>

            <div>
              <p>
                <strong>
                  Your account information is stored securely.
                </strong>{" "}
                Changes made through Account Settings are
                saved to your CropShield account.
              </p>
            </div>

          </div>

        </div>
      </div>


      {/* =====================================
          Account Edit Modal
      ===================================== */}

      {accountOpen && (
        <div
          className="account-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              handleCloseAccount();
            }
          }}
        >

          <div
            className="account-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="account-modal-title"
          >

            {/* Modal Header */}
            <div className="account-modal-header">

              <div>
                <span className="account-modal-label">
                  ACCOUNT
                </span>

                <h2 id="account-modal-title">
                  Edit Account Information
                </h2>

                <p>
                  Update your personal and farm details.
                </p>
              </div>

              <button
                type="button"
                className="account-modal-close"
                onClick={handleCloseAccount}
                disabled={saving}
                aria-label="Close account editor"
              >
                ✕
              </button>

            </div>


            {/* Modal Form */}
            <form
              className="account-form"
              onSubmit={handleSaveAccount}
            >

              {/* Personal Information */}
              <div className="account-form-section">

                <h3>Personal Information</h3>

                <div className="account-form-grid">

                  <div className="account-form-group">

                    <label htmlFor="name">
                      Name
                    </label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={accountForm.name}
                      onChange={handleAccountChange}
                      placeholder="Enter your name"
                      required
                    />

                  </div>


                  <div className="account-form-group">

                    <label htmlFor="email">
                      Email
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={accountForm.email}
                      onChange={handleAccountChange}
                      placeholder="Enter your email"
                      required
                    />

                  </div>

                </div>


                <div className="account-form-group">

                  <label htmlFor="phone">
                    Phone Number
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={accountForm.phone}
                    onChange={handleAccountChange}
                    placeholder="Enter your phone number"
                  />

                </div>

              </div>


              {/* Farm Information */}
              <div className="account-form-section">

                <h3>Farm Information</h3>

                <div className="account-form-group">

                  <label htmlFor="farmName">
                    Farm Name
                  </label>

                  <input
                    id="farmName"
                    name="farmName"
                    type="text"
                    value={accountForm.farmName}
                    onChange={handleAccountChange}
                    placeholder="Enter your farm name"
                  />

                </div>


                <div className="account-form-group">

                  <label htmlFor="farmLocation">
                    Farm Location
                  </label>

                  <input
                    id="farmLocation"
                    name="farmLocation"
                    type="text"
                    value={accountForm.farmLocation}
                    onChange={handleAccountChange}
                    placeholder="Enter your farm location"
                  />

                </div>


                <div className="account-form-grid">

                  <div className="account-form-group">

                    <label htmlFor="farmSize">
                      Farm Size
                    </label>

                    <input
                      id="farmSize"
                      name="farmSize"
                      type="text"
                      value={accountForm.farmSize}
                      onChange={handleAccountChange}
                      placeholder="e.g. 3.5 acres"
                    />

                  </div>


                  <div className="account-form-group">

                    <label htmlFor="primaryCrop">
                      Primary Crop
                    </label>

                    <input
                      id="primaryCrop"
                      name="primaryCrop"
                      type="text"
                      value={accountForm.primaryCrop}
                      onChange={handleAccountChange}
                      placeholder="e.g. Rice"
                    />

                  </div>

                </div>

              </div>


              {/* Success/Error Message */}
              {message && (
                <div className="account-message account-message-success">
                  ✓ {message}
                </div>
              )}

              {error && (
                <div className="account-message account-message-error">
                  {error}
                </div>
              )}


              {/* Modal Actions */}
              <div className="account-modal-actions">

                <button
                  type="button"
                  className="account-cancel-button"
                  onClick={handleCloseAccount}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="account-save-button"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}
    </div>
  );
};

export default Settings;
