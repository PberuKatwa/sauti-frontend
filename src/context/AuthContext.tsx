import { createContext, useContext, useState, useEffect } from "react";
import type { AuthContextType, AuthUser } from "../types/auth.types";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

  const [user, setUserState] = useState<AuthUser | null>(null);

}
