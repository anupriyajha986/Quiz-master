import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { getUserBookmarks, removeBookmark } from "../../services/firebase/bookmarkService";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import EmptyState from "../../components/common/EmptyState";
import { TableSkeleton } from "../../components/common/LoadingSkeleton";
import { formatDate } from "../../utils/formatters";
import {
  Bookmark,
  Trash2,
  BookOpen,
  Search,
  Filter,
  Layers,
  HelpCircle,
  FileText
} from "lucide-react";

export default function StudentBookmarks() {
  const { currentUser } = useAuth();
  const toast = useToast();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [deletingId, setDeletingId] = useState(null);

  const loadBookmarks = async () => {
    if (!currentUser?.uid) return;
    setLoading(true);
    try {
      const data = await getUserBookmarks(currentUser.uid);
      setBookmarks(data);
    } catch (err) {
      console.error("Error loading bookmarks:", err);
      toast.error("Failed to load bookmarked questions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookmarks();
  }, [currentUser]);

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await removeBookmark(id);
      setBookmarks((prev) => prev.filter((b) => b.id !== id));
      toast.success("Question removed from bookmarks.");
    } catch (err) {
      console.error("Error removing bookmark:", err);
      toast.error("Failed to remove bookmark.");
    } finally {
      setDeletingId(null);
    }
  };

  // Extract unique subjects
  const subjects = Array.from(new Set(bookmarks.map((b) => b.subject).filter(Boolean)));

  // Filtered bookmarks
  const filtered = bookmarks.filter((b) => {
    const matchesSubject = selectedSubject === "all" || b.subject?.toLowerCase() === selectedSubject.toLowerCase();
    const matchesSearch =
      !searchQuery.trim() ||
      b.questionText?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.testTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.explanation?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-2xs">
        <div>
          <span className="text-[11px] font-bold text-[#2563EB] uppercase tracking-wider">
            Personal Revision Vault
          </span>
          <h1 className="text-2xl font-black text-[#111827] tracking-tight mt-0.5">
            Bookmarks & Question Review
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Questions saved during mock tests and performance reviews for focused revision.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="primary" size="sm">
            {bookmarks.length} Saved {bookmarks.length === 1 ? "Question" : "Questions"}
          </Badge>
        </div>
      </div>

      {/* Filter and Search Bar */}
      {bookmarks.length > 0 && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search bookmarked questions or explanations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#F8FAFD] border border-[#E2E8F0] rounded-xl text-xs font-medium text-[#111827] placeholder-[#94A3B8] focus:bg-white focus:border-[#2563EB] outline-none transition-all"
            />
          </div>

          <div className="w-full sm:w-48 shrink-0">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 bg-[#F8FAFD] border border-[#E2E8F0] rounded-xl text-xs font-semibold text-[#111827] focus:bg-white focus:border-[#2563EB] outline-none"
            >
              <option value="all">All Subjects ({bookmarks.length})</option>
              {subjects.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Main Content */}
      {loading ? (
        <TableSkeleton rows={3} cols={2} />
      ) : bookmarks.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No Bookmarked Questions Yet"
          description="While attempting mock exams or analyzing your scorecards, bookmark tricky questions to build a tailored revision deck."
          actionLabel="Explore Available Exams"
          actionHref="/student/exams"
        />
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-8 text-center space-y-2">
          <HelpCircle className="w-8 h-8 text-[#94A3B8] mx-auto" />
          <p className="text-sm font-bold text-[#111827]">No bookmarks matching filter</p>
          <p className="text-xs text-[#64748B]">Try resetting your search query or subject filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item, index) => (
            <Card key={item.id} className="p-6 transition-all hover:shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-3 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="primary" size="xs">
                      {item.subject || "General"}
                    </Badge>
                    <span className="text-[11px] text-[#64748B] font-medium truncate">
                      From: {item.testTitle || "Mock Test"}
                    </span>
                    <span className="text-[10px] text-[#94A3B8] ml-auto">
                      Saved {formatDate(item.createdAt)}
                    </span>
                  </div>

                  <div className="text-sm font-bold text-[#111827] leading-relaxed whitespace-pre-wrap">
                    {index + 1}. {item.questionText}
                  </div>

                  {/* Options if recorded */}
                  {Array.isArray(item.options) && item.options.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {item.options.map((opt, optIdx) => {
                        const optText = typeof opt === "string" ? opt : opt.text || "";
                        const optKey = typeof opt === "string" ? String.fromCharCode(65 + optIdx) : opt.id || String.fromCharCode(65 + optIdx);
                        const isCorrect = String(item.correctAnswer) === String(optKey);
                        const isSelected = String(item.selectedAnswer) === String(optKey);

                        return (
                          <div
                            key={optIdx}
                            className={`p-2.5 rounded-xl text-xs border flex items-center gap-2 ${
                              isCorrect
                                ? "bg-[#F0FDF4] border-[#BBF7D0] text-[#15803D] font-bold"
                                : isSelected
                                ? "bg-[#FEF2F2] border-[#FECACA] text-[#DC2626]"
                                : "bg-[#F8FAFC] border-[#E2E8F0] text-[#475569]"
                            }`}
                          >
                            <span className="w-5 h-5 rounded-full bg-white border flex items-center justify-center text-[10px] font-bold shrink-0">
                              {optKey}
                            </span>
                            <span className="truncate">{optText}</span>
                            {isCorrect && (
                              <span className="text-[10px] uppercase font-bold text-[#16A34A] ml-auto shrink-0">
                                Correct
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Explanation if available */}
                  {item.explanation && (
                    <div className="p-3.5 bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl text-xs text-[#1E40AF] space-y-1">
                      <span className="font-bold flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" /> Explanation / Concept
                      </span>
                      <p className="leading-relaxed text-[#1E3A8A] whitespace-pre-wrap">
                        {item.explanation}
                      </p>
                    </div>
                  )}
                </div>

                {/* Delete Bookmark Button */}
                <button
                  onClick={() => handleDelete(item.id)}
                  disabled={deletingId === item.id}
                  className="p-2 rounded-xl text-[#94A3B8] hover:text-[#DC2626] hover:bg-[#FEF2F2] transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                  title="Remove bookmark"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
