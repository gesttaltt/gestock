/*
 Card.tsx
*/
import React from "react";

interface CardProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({
  title,
  description,
  children,
  className = "",
}) => {
  return (
    <div className={`p-6 bg-gray-800 text-white rounded-lg shadow-md ${className}`}>
      {title && <h3 className="text-xl font-semibold text-blue-300">{title}</h3>}
      {description && <p className="text-gray-400 mt-2">{description}</p>}
      <div className="mt-4">{children}</div>
    </div>
  );
};

export default Card;
