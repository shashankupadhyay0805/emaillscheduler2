import { useEffect, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "./AuthContext";

interface JwtPayload {
  userId: string;
  email: string;
  exp: number;
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token")
  );

  const user = useMemo<JwtPayload | null>(() => {
    if (!token) return null;
    try {
      return jwtDecode<JwtPayload>(token);
    } catch {
      return null;
    }
  }, [token]);

  const login = (jwtToken: string) => {
    localStorage.setItem("token", jwtToken);
    setToken(jwtToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  useEffect(() => {
  if (!user) return;

  const isExpired = user.exp * 1000 <= Date.now();

  if (isExpired) {
    const id = setTimeout(() => {
      logout();
    }, 0);

    return () => clearTimeout(id);
    }
  }, [user?.exp]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
