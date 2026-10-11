import React from "react";

export default function Badge({
  children,
  variant = "default",
  size = "sm",
  className = ""
}) {
  const variants = {
    default: "bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]",
    primary: "bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]",
    success: "bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC]",
    danger: "bg-[#FEF2F2] text-[#991B1B] border border-[#FECACA]",
    warning: "bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]",
    outline: "bg-transparent text-[#64748B] border border-[#CBD5E1]"
  };

  const sizes = {
    xs: "text-[10px] px-2 py-0.5 rounded-md font-semibold tracking-wider",
    sm: "text-xs px-2.5 py-1 rounded-lg font-medium",
    md: "text-sm px-3 py-1.5 rounded-xl font-medium"
  };

  return (
    <span
      className={`inline-flex items-center justify-center gap-1.5 ${variants[variant] || variants.default} ${sizes[size] || sizes.sm} ${className}`}
    >
      {children}
    </span>
  );
}
