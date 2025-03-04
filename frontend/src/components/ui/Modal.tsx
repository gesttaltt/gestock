import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        {title && <h3 className="text-xl font-bold text-gray-800">{title}</h3>}
        <div className="mt-4">{children}</div>
        <button
          onClick={onClose}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default Modal;
