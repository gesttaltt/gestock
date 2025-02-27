const Input = ({ type = "text", placeholder, value, onChange, className = "" }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`mb-4 mx-4 mt-4 px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200 ${className}`}
    />
  );
};

export default Input;
