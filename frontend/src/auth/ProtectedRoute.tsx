import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = useContext(AuthContext);

  if (!auth?.token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
