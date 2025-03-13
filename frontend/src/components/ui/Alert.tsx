/*
 Alert.tsx
*/
import React from "react";

interface AlertProps {
  message: string;
  type?: "info" | "success" | "error";
}

const Alert: React.FC<AlertProps> = ({ message, type = "info" }) => {
  const alertColors: Record<AlertProps["type"], string> = {
    info: "bg-blue-600",
    success: "bg-green-600",
    error: "bg-red-600",
  };
  return (
    <div className={`p-4 text-white rounded-lg shadow-md ${alertColors[type]}`}>
      {message}
    </div>
  );
};

export default Alert;
