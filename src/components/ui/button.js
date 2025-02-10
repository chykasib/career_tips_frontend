// In @/components/ui/button.js
import React from "react";

export const Button = ({ children, onClick, variant }) => {
  const buttonStyles =
    variant === "outline" ? "border border-gray-500" : "bg-blue-500";

  return (
    <button
      onClick={onClick}
      className={`${buttonStyles} px-4 py-2 rounded-md`}
    >
      {children}
    </button>
  );
};
