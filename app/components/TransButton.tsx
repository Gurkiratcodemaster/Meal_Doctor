import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  disabled?: boolean;
}

const TransButton = ({ children, onClick, type = "button",disabled = false, className = "" }: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-3 py-2 rounded-xl hover:bg-black/15 hover:backdrop-blur-md

 text-black font-bold hover:scale-105 transition-transform transition-300ms ${className}`}
    >
      {children}
    </button>
  );
};

export default TransButton;
