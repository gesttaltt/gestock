const Form = ({ onSubmit, children, className = "" }) => {
  return (
    <form
      onSubmit={onSubmit}
      className={`p-6 bg-gray-900 text-white rounded-lg shadow-lg space-y-4 ${className}`}
    >
      {children}
    </form>
  );
};

export default Form;
