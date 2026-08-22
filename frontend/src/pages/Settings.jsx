import "../css/Settings.css";

const Settings = () => {
  return (
    <main className="settings-page">

      <div className="settings-container">

        {/* Header */}
        <div className="settings-header">

          <span className="settings-label">
            PREFERENCES
          </span>

          <h1>Settings</h1>

          <p>
            Manage your CropShield preferences and application
            settings.
          </p>

        </div>


        {/* Settings Cards */}
        <div className="settings-content">

          {/* Account */}
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


            <div className="settings-row">

              <div>
                <strong>Account Status</strong>

                <span>
                  Frontend demonstration
                </span>
              </div>

              <span className="settings-status">
                Demo
              </span>

            </div>


            <div className="settings-row">

              <div>
                <strong>Email Notifications</strong>

                <span>
                  Receive updates about your reports.
                </span>
              </div>

              <label className="settings-toggle">

                <input type="checkbox" />

                <span className="toggle-slider"></span>

              </label>

            </div>

          </section>


          {/* Appearance */}
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


          {/* Data */}
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
                <strong>Save Reports Automatically</strong>

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


          {/* Future Backend Notice */}
          <div className="settings-notice">

            <span>ⓘ</span>

            
          </div>

        </div>

      </div>

    </main>
  );
};

export default Settings;