import React, { forwardRef } from "react";

const Input = forwardRef(function Input(
  {
    label,
    error,
    helperText,
    icon: Icon,
    className = "",
    id,
    type = "text",
    ...props
  },
  ref
) {
  const inputId = id || props.name || Math.random().toString(36).substring(7);

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold text-[#111827] tracking-wide"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3 text-[#64748B] pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={`w-full bg-white border rounded-xl text-sm text-[#111827] placeholder:text-[#94A3B8] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent ${
            Icon ? "pl-9 pr-3 py-2.5" : "px-3.5 py-2.5"
          } ${
            error
              ? "border-[#EF4444] focus:ring-[#EF4444]"
              : "border-[#E2E8F0] hover:border-[#CBD5E1]"
          } ${className}`}
          {...props}
        />
      </div>
      {error ? (
        <p className="text-xs text-[#DC2626] font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-[#64748B]">{helperText}</p>
      ) : null}
    </div>
  );
});

export default Input;
