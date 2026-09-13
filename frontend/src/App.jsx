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
  return (
    <>
      <Navbar />

      <main>
        <Routes>

          {/* =========================================
              Public Routes
          ========================================= */}

          <Route path="/" element={<Home />} />

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