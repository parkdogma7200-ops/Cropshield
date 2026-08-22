import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";

import Home from "./pages/Home.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import LogLoss from "./pages/Logloss.jsx";
import FarmBaseline from "./pages/Farmbaseline.jsx";
import Reports from "./pages/Reports.jsx";
import About from "./pages/About.jsx";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Settings from "./pages/Settings";

const App = () => {
  return (
    <>
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/log-loss" element={<LogLoss />} />
          <Route path="/farm-baseline" element={<FarmBaseline />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </>
  );
};

export default App;