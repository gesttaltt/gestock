const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h3 className="text-xl font-semibold text-blue-300">{title}</h3>
        <div className="mt-4">{children}</div>
        <button
          onClick={onClose}
          className="mt-4 w-full bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default Modal;