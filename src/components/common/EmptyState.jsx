import React from "react";
import Button from "./Button";

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionText,
  onAction,
  actionIcon,
  className = ""
}) {
  return (
    <div
      className={`w-full flex flex-col items-center justify-center text-center p-12 bg-white border border-[#E2E8F0] rounded-2xl ${className}`}
    >
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#2563EB] mb-4">
          <Icon className="w-7 h-7" />
        </div>
      )}
      <h3 className="text-base font-bold text-[#111827] mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-[#64748B] max-w-sm mb-6">{description}</p>
      )}
      {actionText && onAction && (
        <Button onClick={onAction} icon={actionIcon} variant="primary">
          {actionText}
        </Button>
      )}
    </div>
  );
}
