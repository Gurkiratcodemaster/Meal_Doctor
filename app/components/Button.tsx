import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  disabled?: boolean;
}

const Button = ({ children, onClick, type = "button", className = "" }: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 active:scale-95 transistion ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
