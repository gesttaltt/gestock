/*
 Input.tsx
*/
import React, { InputHTMLAttributes, forwardRef } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, name, className = "", ...rest }, ref) => {
    return (
      <div className="flex flex-col">
        {label && name && (
          <label htmlFor={name} className="m-4 text-white">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={name}
          name={name}
          className={`flex m-4 p-4 bg-gray-800 text-white border border-gray-600 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200 ${className}`}
          {...rest}
        />
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
