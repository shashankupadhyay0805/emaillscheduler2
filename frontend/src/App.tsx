import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Compose from "./pages/Compose";
import MailView from "./pages/MailView";

export default function App() {
  return (
    <Routes>
      {/* ✅ Default route */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Main Pages */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/compose" element={<Compose />} />
      <Route path="/mail/:id" element={<MailView />} />

      {/* ❌ Optional fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
