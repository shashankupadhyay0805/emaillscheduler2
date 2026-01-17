import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

export default function AuthCallback() {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token || !auth) return;

    fetch("https://emaillscheduler2.onrender.com/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(user => {
        auth.login(user, token); // ✅ FIXED
        navigate("/dashboard");
      });
  }, [auth, navigate]);

  return <p>Logging you in...</p>;
}
