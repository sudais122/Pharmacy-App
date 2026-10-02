import React from "react";

const Button = ({ icon: Icon, text, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 cursor-pointer transition-colors duration-200"
    >
      {Icon && <Icon className="w-5 h-5" />}
      <span>{text}</span>
    </button>
  );
};

export default Button;