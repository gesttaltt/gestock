/*
  AuthContext.tsx
*/
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { getProfile, loginUser } from "../api/authApi";

// Define the user interface
interface User {
  id: string;
  role: string;
  name?: string;
  email?: string;
}

// Define the authentication context interface
interface AuthContextType {
  token: string | null;
  user: User | null;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<boolean>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

// Create the authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Function to refresh the user profile
  const refreshProfile = async (): Promise<void> => {
    try {
      const profile = await getProfile();
      if (profile) {
        setUser({
          id: profile._id,
          role: profile.role,
          name: profile.name,
          email: profile.email,
        });
      } else {
        setUser(null);
      }
    } catch (error: any) {
      console.error("Error al refrescar el perfil:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Function to log in
  const login = async (
    credentials: { email: string; password: string }
  ): Promise<boolean> => {
    try {
      const response = await loginUser(credentials);
      if (response && response.token) {
        localStorage.setItem("token", response.token);
        setToken(response.token);
        await refreshProfile();
        return true;
      }
      return false;
    } catch (error: any) {
      console.error("Error al iniciar sesión:", error);
      return false;
    }
  };

  // Function to log out
  const logout = (): void => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    if (token) {
      refreshProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, user, loading, login, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};

export default AuthContext;
