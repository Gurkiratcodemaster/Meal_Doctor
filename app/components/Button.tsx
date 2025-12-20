import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  disabled?: boolean;
}

const Button = ({ children, onClick, type = "button",disabled = false, className = "" }: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-lg bg-green-600 text-white font-bold hover:bg-green-700 active:scale-95${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
