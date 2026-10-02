import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Home from "./pages/Home.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import LogLoss from "./pages/Logloss.jsx";
import FarmBaseline from "./pages/Farmbaseline.jsx";
import Reports from "./pages/Reports.jsx";
import About from "./pages/About.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Settings from "./pages/Settings.jsx";

const App = () => {

  // =========================================
  // Global Theme
  // =========================================

  useEffect(() => {

    const applyTheme = () => {

      const selectedTheme =
        localStorage.getItem("cropShieldTheme") || "system";

      let actualTheme = selectedTheme;

      // System mode follows the computer/browser theme.
      if (selectedTheme === "system") {

        const prefersDark =
          window.matchMedia(
            "(prefers-color-scheme: dark)"
          ).matches;

        actualTheme = prefersDark
          ? "dark"
          : "light";
      }

      // Apply the final theme to the entire document.
      document.documentElement.setAttribute(
        "data-theme",
        actualTheme
      );
    };


    // Apply theme when App first loads.
    applyTheme();


    // =========================================
    // Listen for theme changes from Settings
    // =========================================

    const handleThemeChange = () => {
      applyTheme();
    };

    window.addEventListener(
      "cropShieldThemeChanged",
      handleThemeChange
    );


    // =========================================
    // System Theme Changes
    // =========================================

    const mediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );

    const handleSystemThemeChange = () => {

      const selectedTheme =
        localStorage.getItem("cropShieldTheme") ||
        "system";

      // Only automatically change when
      // the user selected System mode.
      if (selectedTheme === "system") {
        applyTheme();
      }
    };

    mediaQuery.addEventListener(
      "change",
      handleSystemThemeChange
    );


    // =========================================
    // Cleanup
    // =========================================

    return () => {

      window.removeEventListener(
        "cropShieldThemeChanged",
        handleThemeChange
      );

      mediaQuery.removeEventListener(
        "change",
        handleSystemThemeChange
      );

    };

  }, []);


  return (
    <>
      <Navbar />

      <main>
        <Routes>

          {/* =========================================
              Public Routes
          ========================================= */}

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/about"
            element={<About />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/signup"
            element={<Signup />}
          />


          {/* =========================================
              Protected Routes
          ========================================= */}

          <Route element={<ProtectedRoute />}>

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/log-loss"
              element={<LogLoss />}
            />

            <Route
              path="/farm-baseline"
              element={<FarmBaseline />}
            />

            <Route
              path="/reports"
              element={<Reports />}
            />

            <Route
              path="/settings"
              element={<Settings />}
            />

          </Route>

        </Routes>
      </main>
    </>
  );
};

export default App;