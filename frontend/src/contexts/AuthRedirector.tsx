// AuthRedirector.tsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface AuthRedirectorProps {
  children: React.ReactNode;
}

const AuthRedirector: React.FC<AuthRedirectorProps> = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  return <>{children}</>;
};

export default AuthRedirector;
