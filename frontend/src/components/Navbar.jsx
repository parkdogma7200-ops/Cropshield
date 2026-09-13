import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "../css/Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const location = useLocation();

  const { user, isAuthenticated, logout } = useAuth();

  const navItems = [
    { name: "Home", path: "/" },

    // Protected routes
    { name: "Dashboard", path: "/dashboard", protected: true },
    { name: "Log Crop Loss", path: "/log-loss", protected: true },
    { name: "Farm Baseline", path: "/farm-baseline", protected: true },
    { name: "Reports", path: "/reports", protected: true },

    // Public route
    { name: "About CropShield", path: "/about" },

    // Guest-only routes
    { name: "Log In", path: "/login", guestOnly: true },
    { name: "Sign Up", path: "/signup", guestOnly: true },

    // Settings only when logged in
    { name: "Settings", path: "/settings", protected: true },
  ];

  /*
   * Show protected routes only when logged in.
   * Show Login/Sign Up only when logged out.
   */
  const visibleNavItems = navItems.filter((item) => {
    if (item.protected && !isAuthenticated) {
      return false;
    }

    if (item.guestOnly && isAuthenticated) {
      return false;
    }

    return true;
  });

  const handleNavigation = () => {
    setMenuOpen(false);
    setProfileOpen(false);
  };

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    setProfileOpen(false);
  };

  return (
    <header className="navbar">
      <div className="navbar-container">

        {/* =========================================
            Brand
        ========================================= */}
        <Link
          to="/"
          className="navbar-brand"
          onClick={handleNavigation}
        >
          <span className="brand-icon">🌾</span>

          <span className="brand-text">
            <span className="brand-name">
              CropShield
            </span>

            <span className="brand-tagline">
              Protect. Document. Recover.
            </span>
          </span>
        </Link>


        {/* =========================================
            Right Side
            Profile -> Menu
        ========================================= */}
        <div className="navbar-right">

          {/* =========================================
              Profile
          ========================================= */}
          <div className="navbar-profile">

            {isAuthenticated ? (
              <>
                <button
                  className="profile-button"
                  onClick={() => {
                    setProfileOpen(!profileOpen);
                    setMenuOpen(false);
                  }}
                  aria-expanded={profileOpen}
                  aria-label="Open user profile"
                >
                  <span className="profile-icon">
                    👤
                  </span>

                  <span className="profile-name">
                    {user?.name}
                  </span>

                  <span className="profile-arrow">
                    {profileOpen ? "▲" : "▼"}
                  </span>
                </button>


                {/* Profile Window
                    Only name and email */}
                {profileOpen && (
                  <div className="profile-dropdown">

                    <div className="profile-photo-placeholder">
                      👤
                    </div>

                    <div className="profile-info">
                      <strong>
                        {user?.name}
                      </strong>

                      <span>
                        {user?.email}
                      </span>
                    </div>

                  </div>
                )}
              </>
            ) : (

              /* Logged Out */
              <Link
                to="/login"
                className="profile-login"
                onClick={handleNavigation}
              >
                <span className="profile-icon">
                  👤
                </span>

                <span>
                  Log In
                </span>
              </Link>

            )}

          </div>


          {/* =========================================
              Menu
          ========================================= */}
          <div className="navbar-menu-wrapper">

            <button
              className={`menu-button ${
                menuOpen ? "menu-button-open" : ""
              }`}
              onClick={() => {
                setMenuOpen(!menuOpen);
                setProfileOpen(false);
              }}
              aria-expanded={menuOpen}
              aria-label="Open navigation menu"
            >
              <span>
                Menu
              </span>

              <span className="menu-arrow">
                {menuOpen ? "▲" : "▼"}
              </span>
            </button>


            {/* Menu Dropdown */}
            {menuOpen && (
              <nav className="dropdown-menu">

                {visibleNavItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`dropdown-item ${
                      location.pathname === item.path
                        ? "dropdown-item-active"
                        : ""
                    }`}
                    onClick={handleNavigation}
                  >
                    {item.name}
                  </Link>
                ))}


                {/* Logout only when logged in */}
                {isAuthenticated && (
                  <>
                    <div className="menu-divider" />

                    <button
                      className="dropdown-logout"
                      onClick={handleLogout}
                    >
                      Log Out
                    </button>
                  </>
                )}

              </nav>
            )}

          </div>

        </div>

      </div>
    </header>
  );
};

export default Navbar;