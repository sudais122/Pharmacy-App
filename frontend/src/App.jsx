import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/login/login";

import Dashboard from "./pages/dashboard/Dashboard";
import Medicines from "./pages/medicines/medicines";
import Sales from "./pages/sales/sales";
import Reports from "./pages/reports/reports";
import Seetings from "./pages/seetings/seetings";

import Layout from "./Layout/Layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public route */}
        <Route path="/login" element={<Login />} />

        {/* Dashboard Layout */}
        <Route element={<Layout />}>

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/medicines"
            element={<Medicines />}
          />

          <Route
            path="/sales"
            element={<Sales />}
          />

          <Route
            path="/reports"
            element={<Reports />}
          />

          <Route
            path="/settings"
            element={<Seetings />}
          />

        </Route>

        {/* Default route */}
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        {/* Unknown routes */}
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;