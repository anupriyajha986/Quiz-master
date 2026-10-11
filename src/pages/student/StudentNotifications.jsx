import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  getUserNotifications,
  markNotificationAsRead
} from "../../services/firebase/notificationService";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import EmptyState from "../../components/common/EmptyState";
import { TableSkeleton } from "../../components/common/LoadingSkeleton";
import { formatDate } from "../../utils/formatters";
import { Bell, Check, ExternalLink, FileCheck2, Award } from "lucide-react";

export default function StudentNotifications() {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const data = await getUserNotifications(currentUser.uid);
      setNotifications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [currentUser]);

  const handleMarkRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-[#E2E8F0] rounded-2xl p-6">
        <div>
          <span className="text-[11px] font-bold text-[#2563EB] uppercase tracking-wider">
            In-App Messaging
          </span>
          <h1 className="text-2xl font-black text-[#111827] tracking-tight mt-0.5">
            Notifications & Alerts
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Official announcements, examination releases, and result publications.
          </p>
        </div>
      </div>

      {loading ? (
        <TableSkeleton rows={4} cols={3} />
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No Notifications"
          description="You are fully up to date! New examination announcements will appear here."
        />
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <Card
              key={notif.id}
              className={`p-5 transition-all ${
                !notif.isRead ? "border-l-4 border-l-[#2563EB] bg-[#EFF6FF]/20" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-[#111827]">
                      {notif.title}
                    </h3>
                    {!notif.isRead && (
                      <Badge variant="primary" size="xs">
                        NEW
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    {notif.message}
                  </p>
                  <span className="text-[10px] text-[#94A3B8] block pt-1">
                    {formatDate(notif.createdAt)}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {notif.type === "exam" && (
                    <Link
                      to="/student/exams"
                      className="p-1.5 rounded-lg text-[#2563EB] hover:bg-[#EFF6FF]"
                      title="View Examinations"
                    >
                      <FileCheck2 className="w-4 h-4" />
                    </Link>
                  )}
                  {notif.type === "result" && notif.referenceId && (
                    <Link
                      to={`/student/results/${notif.referenceId}`}
                      className="p-1.5 rounded-lg text-[#16A34A] hover:bg-[#DCFCE7]"
                      title="View Result"
                    >
                      <Award className="w-4 h-4" />
                    </Link>
                  )}
                  {notif.type === "exam_submission" && notif.referenceId && (
                    <Link
                      to={`/student/results/${notif.referenceId}`}
                      className="p-1.5 rounded-lg text-[#2563EB] hover:bg-[#EFF6FF]"
                      title="View Submission Details"
                    >
                      <FileCheck2 className="w-4 h-4" />
                    </Link>
                  )}

                  {!notif.isRead && (
                    <button
                      onClick={() => handleMarkRead(notif.id)}
                      className="p-1.5 rounded-lg text-[#64748B] hover:text-[#111827] hover:bg-[#F8FAFC]"
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
