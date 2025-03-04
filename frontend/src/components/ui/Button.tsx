const Button = ({ onClick, children, type = "button", className = "" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`flex m-6 mt-2 justify-end px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-500 transition duration-200 ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
