import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { AuthUser, ProfileFormValues } from "../types/user";
import { userStorage } from "../models/userStorage";

interface AuthContextType {
  user: AuthUser | null;
  login: (username: string) => void;
  logout: () => void;
  updateProfile: (values: ProfileFormValues) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => userStorage.get());

  useEffect(() => {
    if (user) {
      userStorage.set(user);
    } else {
      userStorage.remove();
    }
  }, [user]);

  const login = (username: string) => {
    setUser({ username, isLoggedIn: true });
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (values: ProfileFormValues) => {
    setUser((prev) => {
      if (!prev) {
        return null;
      }
      return {
        ...prev,
        ...values,
      };
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
