import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Compose from "./pages/Compose";
import MailView from "./pages/MailView";
import Login from "./pages/Login";
import AuthCallback from "./pages/AuthCallback"

const isAuthenticated = () => {
  return Boolean(localStorage.getItem("token"));
};

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route
        path="/dashboard"
        element={
          isAuthenticated() ? <Dashboard /> : <Navigate to="/" replace />
        }
      />
      <Route
        path="/compose"
        element={
          isAuthenticated() ? <Compose /> : <Navigate to="/" replace />
        }
      />
      <Route
        path="/mail/:id"
        element={
          isAuthenticated() ? <MailView /> : <Navigate to="/" replace />
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
