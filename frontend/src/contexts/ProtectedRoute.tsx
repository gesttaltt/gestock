// ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    // Redirect to /auth if user is not authenticated
    return <Navigate to="/auth" replace />;
  }

  // Otherwise, render the protected component
  return <>{children}</>;
};

export default ProtectedRoute;
