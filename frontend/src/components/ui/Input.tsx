/*
 Input.tsx
*/
import React from "react";

interface InputProps {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  name?: string; // Made optional for minimal changes
  className?: string;
  label?: string;
}

const Input: React.FC<InputProps> = ({
  type = "text",
  placeholder,
  value,
  onChange,
  name = "", // Default to an empty string if not provided
  className = "",
  label,
}) => {
  return (
    <div className="flex flex-col">
      {label && name && (
        <label htmlFor={name} className="m-4 text-white">
          {label}
        </label>
      )}
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name}
        className={`flex m-4 p-4 bg-gray-800 text-white border border-gray-600 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200 ${className}`}
      />
    </div>
  );
};

export default Input;
