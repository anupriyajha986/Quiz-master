import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc, serverTimestamp, query, orderBy } from "firebase/firestore";
import { db } from "../../services/firebase/config";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import {
  Bell,
  Send,
  Plus,
  Users,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Radio,
  Clock
} from "lucide-react";

export default function AdminNotifications() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [composeModalOpen, setComposeModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState("all_students");
  const [type, setType] = useState("general");
  const [isPublishing, setIsPublishing] = useState(false);

  const { currentUser } = useAuth();
  const toast = useToast();

  const loadAnnouncements = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "notifications"));
      const snap = await getDocs(q);
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => {
        const tA = a.createdAt?.toMillis ? a.createdAt.toMillis() : new Date(a.createdAt || 0).getTime();
        const tB = b.createdAt?.toMillis ? b.createdAt.toMillis() : new Date(b.createdAt || 0).getTime();
        return tB - tA;
      });
      setAnnouncements(list);
    } catch (err) {
      console.error("Failed to load notifications:", err);
      toast.error("Failed to load announcements.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const handlePublish = async (e) => {
    e.preventDefault();
    if (!title || !message) {
      toast.error("Please fill in both title and announcement body.");
      return;
    }
    setIsPublishing(true);
    try {
      const newNotif = {
        title,
        message,
        audience: audience === "all_students" ? "All Registered Students" : "Active Examinees",
        type,
        createdBy: currentUser?.uid || "admin",
        createdAt: serverTimestamp(),
        publishedAt: "Just now"
      };

      const docRef = await addDoc(collection(db, "notifications"), newNotif);

      // Audit log
      await addDoc(collection(db, "auditLogs"), {
        action: "BROADCAST_ANNOUNCEMENT",
        actorUid: currentUser?.uid || "admin",
        actorEmail: currentUser?.email || "admin",
        details: { notificationId: docRef.id, title, audience, type },
        timestamp: serverTimestamp()
      });

      toast.success("Broadcast announcement published to students!");
      setComposeModalOpen(false);
      setTitle("");
      setMessage("");
      await loadAnnouncements();
    } catch (err) {
      console.error(err);
      toast.error("Failed to publish announcement.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#E5EAF2] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-[#EFF6FF] text-[#2563EB]">
              <Bell className="w-4 h-4" />
            </span>
            <span className="text-[11px] font-bold text-[#2563EB] uppercase tracking-wider">
              Communication Center
            </span>
          </div>
          <h1 className="text-2xl font-black text-[#172B4D] tracking-tight">
            Notifications & Announcements
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Broadcast authoritative exam alerts, timing updates, and institutional notices to students.
          </p>
        </div>

        <Button icon={Plus} size="sm" onClick={() => setComposeModalOpen(true)}>
          Broadcast Notice
        </Button>
      </div>

      {/* Broadcast Feed */}
      <div className="bg-white border border-[#E5EAF2] rounded-2xl overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-[#F1F5F9] flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#172B4D]">Published Announcements</h3>
          <span className="text-xs font-semibold text-[#64748B]">
            {announcements.length} Published
          </span>
        </div>

        <div className="divide-y divide-[#F8FAFC]">
          {announcements.map((item, idx) => (
            <div key={item.id || idx} className="p-5 hover:bg-[#F8FAFD] transition-colors flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0 mt-0.5">
                <Bell className="w-5 h-5" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 mb-1">
                  <h4 className="text-sm font-bold text-[#172B4D]">
                    {item.title}
                  </h4>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0]">
                    Published
                  </span>
                </div>
                <p className="text-xs text-[#64748B] leading-relaxed mb-2">
                  {item.message}
                </p>
                <div className="flex items-center gap-4 text-[11px] text-[#94A3B8]">
                  <span className="flex items-center gap-1 font-medium text-[#2563EB]">
                    <Users className="w-3.5 h-3.5" />
                    Target: {item.audience}
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {item.publishedAt || "Recently"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compose Modal */}
      {composeModalOpen && (
        <Modal
          isOpen={composeModalOpen}
          onClose={() => setComposeModalOpen(false)}
          title="Broadcast New Announcement"
        >
          <form onSubmit={handlePublish} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#172B4D] mb-1">
                Announcement Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Adherence to CBT Guidelines for Mock 02"
                className="w-full px-3 py-2 text-xs bg-[#F6F8FC] border border-[#E5EAF2] rounded-xl outline-none focus:border-[#2563EB] text-[#172B4D]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#172B4D] mb-1">
                Target Audience Cohort
              </label>
              <select
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#F6F8FC] border border-[#E5EAF2] rounded-xl outline-none focus:border-[#2563EB] text-[#172B4D] font-medium"
              >
                <option value="all_students">All Registered Students (Public Broadcast)</option>
                <option value="active_attempts">Students with Active In-Progress Attempts</option>
                <option value="jee_mock">Enrolled in Grand Mock 2026 Only</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#172B4D] mb-1">
                Notification Message Body
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write clear, authoritative instructions for students..."
                className="w-full px-3 py-2 text-xs bg-[#F6F8FC] border border-[#E5EAF2] rounded-xl outline-none focus:border-[#2563EB] text-[#172B4D]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F1F5F9]">
              <Button
                variant="secondary"
                size="sm"
                type="button"
                onClick={() => setComposeModalOpen(false)}
              >
                Cancel
              </Button>
              <Button size="sm" type="submit" loading={isPublishing} icon={Send}>
                Publish Broadcast
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
