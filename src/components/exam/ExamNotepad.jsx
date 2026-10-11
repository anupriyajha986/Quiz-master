import React, { useRef } from "react";
import {
  Edit3,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered
} from "lucide-react";

export default function ExamNotepad({
  notes = "",
  onChangeNotes,
  onClearNotes,
  saveState = "saved" // 'saving' | 'saved' | 'idle'
}) {
  const textareaRef = useRef(null);

  const applyFormatting = (prefix, suffix = "") => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = el.value.substring(start, end);
    const before = el.value.substring(0, start);
    const after = el.value.substring(end);

    const newText = before + prefix + (selected || "text") + suffix + after;
    onChangeNotes(newText);

    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + prefix.length, start + prefix.length + (selected ? selected.length : 4));
    }, 10);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#DCE5F0] p-4 shadow-2xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-1.5">
          <Edit3 className="w-4 h-4 text-[#0B63F6]" />
          <h4 className="text-xs font-bold text-[#111C3A]">Notepad</h4>
          <span className="text-[10px] font-semibold text-[#16A34A]">
            {saveState === "saving" ? "(Saving...)" : "(Auto Saved)"}
          </span>
        </div>
      </div>

      {/* Input Area */}
      <div className="py-2 flex-1">
        <textarea
          ref={textareaRef}
          value={notes}
          onChange={(e) => onChangeNotes(e.target.value)}
          placeholder="Write your notes here..."
          className="w-full h-24 text-xs text-[#111C3A] placeholder:text-[#94A3B8] resize-none outline-none border-none p-1 bg-transparent leading-relaxed"
        />
      </div>

      {/* Formatting & Action Toolbar */}
      <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-[#52627F]">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => applyFormatting("**", "**")}
            className="w-6 h-6 rounded flex items-center justify-center hover:bg-[#F1F5F9] text-xs font-bold transition-colors cursor-pointer"
            title="Bold"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => applyFormatting("_", "_")}
            className="w-6 h-6 rounded flex items-center justify-center hover:bg-[#F1F5F9] text-xs font-serif italic transition-colors cursor-pointer"
            title="Italic"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => applyFormatting("<u>", "</u>")}
            className="w-6 h-6 rounded flex items-center justify-center hover:bg-[#F1F5F9] text-xs underline transition-colors cursor-pointer"
            title="Underline"
          >
            <Underline className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => applyFormatting("\n• ")}
            className="w-6 h-6 rounded flex items-center justify-center hover:bg-[#F1F5F9] transition-colors cursor-pointer"
            title="Bullet List"
          >
            <List className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => applyFormatting("\n1. ")}
            className="w-6 h-6 rounded flex items-center justify-center hover:bg-[#F1F5F9] transition-colors cursor-pointer"
            title="Numbered List"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>
        </div>

        <button
          type="button"
          onClick={onClearNotes}
          className="text-[11px] font-semibold text-[#0B63F6] hover:text-[#084FC7] transition-colors cursor-pointer"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
