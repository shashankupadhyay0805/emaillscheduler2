import { createContext } from "react";

interface JwtPayload {
  userId: string;
  email: string;
  exp: number;
}

export interface AuthContextType {
  user: JwtPayload | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);
