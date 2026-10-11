import React from "react";
import { Loader2 } from "lucide-react";

export default function Button({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  onClick,
  className = "",
  icon: Icon,
  ...props
}) {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none";

  const variants = {
    primary: "bg-[#2563EB] hover:bg-[#1D4ED8] text-white focus:ring-[#2563EB] rounded-xl shadow-xs",
    secondary: "bg-white hover:bg-[#F8FAFC] text-[#111827] border border-[#E2E8F0] focus:ring-[#2563EB] rounded-xl",
    success: "bg-[#16A34A] hover:bg-[#15803D] text-white focus:ring-[#16A34A] rounded-xl",
    outline: "bg-transparent hover:bg-[#EFF6FF] text-[#2563EB] border border-[#2563EB] focus:ring-[#2563EB] rounded-xl",
    ghost: "bg-transparent hover:bg-[#F8FAFC] text-[#64748B] hover:text-[#111827] rounded-xl",
    danger: "bg-[#DC2626] hover:bg-[#B91C1C] text-white focus:ring-[#DC2626] rounded-xl"
  };

  const sizes = {
    sm: "text-xs px-3 py-1.5 gap-1.5",
    md: "text-sm px-4 py-2.5 gap-2",
    lg: "text-base px-6 py-3 gap-2.5"
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      {children}
    </button>
  );
}
