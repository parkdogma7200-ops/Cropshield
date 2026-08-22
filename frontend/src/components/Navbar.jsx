import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../css/Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Log Crop Loss", path: "/log-loss" },
    { name: "Farm Baseline", path: "/farm-baseline" },
    { name: "Reports", path: "/reports" },
    { name: "About CropShield", path: "/about" },
    { name: "Log In", path: "/login" },
    { name: "Sign Up", path: "/signup" },
    { name: "Settings", path: "/settings" },
  ];

  const handleNavigation = () => {
    setMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="navbar-container">

        {/* Brand */}
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


        {/* Menu */}
        <div className="navbar-menu-wrapper">

          <button
            className={`menu-button ${
              menuOpen ? "menu-button-open" : ""
            }`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-label="Open navigation menu"
          >
            <span>Menu</span>

            <span className="menu-arrow">
              {menuOpen ? "▲" : "▼"}
            </span>
          </button>


          {menuOpen && (
            <nav className="dropdown-menu">

              {navItems.map((item) => (
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

            </nav>
          )}

        </div>

      </div>
    </header>
  );
};

export default Navbar;