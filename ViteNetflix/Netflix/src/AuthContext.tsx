/* eslint-disable react-refresh/only-export-components */
// AuthContext.tsx
import { createContext, useContext, useState } from "react";

type User = {
  id: number;
  email: string;
};

type AuthContextType = {
  isLoggedIn: boolean;
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Лінива ініціалізація user та isLoggedIn з перевіркою на undefined
  const [user, setUser] = useState<User | null>(() => {
    const userData = localStorage.getItem("user");
    if (userData && userData !== "undefined") {
      try {
        return JSON.parse(userData);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const token = localStorage.getItem("token");
    return token && token !== "undefined" ? true : false;
  });

  const login = (token: string, user: User) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
