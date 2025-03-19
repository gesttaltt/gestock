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
      <div className="flex flex-col my-4">
        {label && name && (
          <label htmlFor={name} className="mb-2 text-white">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={name}
          name={name}
          className={`px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200 ${className}`}
          {...rest}
        />
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
