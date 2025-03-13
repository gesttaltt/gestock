/*
 Button.tsx
*/
import React from "react";

interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  type?: string; // Allow any string value for button type
  className?: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  type = "button",
  className = "",
  disabled = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`flex m-6 mt-2 justify-end px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-500 transition duration-200 ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
