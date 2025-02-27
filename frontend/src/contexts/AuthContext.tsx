// /contexts/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { getProfile, loginUser } from "../api/authApi";

// Define la interfaz del usuario
interface User {
  id: string;
  role: string;
  name?: string;
  email?: string;
}

// Define la interfaz del contexto de autenticación
interface AuthContextType {
  token: string | null;
  user: User | null;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<boolean>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

// Crea el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Función para refrescar el perfil del usuario
  const refreshProfile = async () => {
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
    } catch (error) {
      console.error("Error al refrescar el perfil:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Función para iniciar sesión
  const login = async (credentials: { email: string; password: string }): Promise<boolean> => {
    try {
      const response = await loginUser(credentials);
      if (response && response.token) {
        localStorage.setItem("token", response.token);
        setToken(response.token);
        await refreshProfile();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      return false;
    }
  };

  // Función para cerrar sesión
  const logout = () => {
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
    <AuthContext.Provider
      value={{ token, user, loading, login, logout, refreshProfile }}
    >
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
