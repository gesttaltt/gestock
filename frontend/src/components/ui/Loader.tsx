/*
 Loader.tsx
*/
import React from "react";

const Loader: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-6">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
    </div>
  );
};

export default Loader;
