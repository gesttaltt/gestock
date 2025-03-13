/*
 Form.tsx
*/
import React from "react";

interface FormProps {
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  children: React.ReactNode;
  className?: string;
}

const Form: React.FC<FormProps> = ({ onSubmit, children, className = "" }) => {
  return (
    <form
      onSubmit={onSubmit}
      className={`p-8 m-8 bg-gray-900 text-white rounded-lg shadow-lg space-y-4 ${className}`}
    >
      {children}
    </form>
  );
};

export default Form;
