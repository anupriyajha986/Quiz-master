import React from "react";

export default function Card({
  children,
  className = "",
  hover = false,
  onClick,
  ...props
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-white border border-[#E2E8F0] rounded-2xl shadow-xs transition-all duration-150 ${
        hover ? "hover:border-[#CBD5E1] hover:shadow-sm cursor-pointer" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
