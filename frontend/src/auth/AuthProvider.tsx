import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  userId: string;
  email: string;
  exp: number;
}

interface AuthContextType {
  user: JwtPayload | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("token");
  });

  const [user, setUser] = useState<JwtPayload | null>(() => {
    const storedToken = localStorage.getItem("token");
    return storedToken ? jwtDecode(storedToken) : null;
  });

  const login = (jwtToken: string) => {
    localStorage.setItem("token", jwtToken);
    setToken(jwtToken);
    setUser(jwtDecode(jwtToken));
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  // Optional: auto-logout on token expiry
  useEffect(() => {
    if (!user) return;

    const now = Date.now() / 1000;
    if (user.exp < now) {
      logout();
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
