import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Compose from "./pages/Compose";
import MailView from "./pages/MailView";
import Login from "./pages/Login";
import AuthCallback from "./pages/AuthCallback";
import ProtectedRoute from "./auth/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/compose" element={<ProtectedRoute><Compose /></ProtectedRoute>} />
      <Route path="/mail/:id" element={<ProtectedRoute><MailView /></ProtectedRoute>} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
