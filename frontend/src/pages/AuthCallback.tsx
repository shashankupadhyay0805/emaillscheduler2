import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";

export default function AuthCallback() {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!auth) {
      navigate("/");
      return;
    }

    if (token) {
      auth.login(token);
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  }, [navigate, auth]);

  return <div>Logging you in...</div>;
}
