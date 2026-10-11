import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { resetPassword } from "../../services/firebase/authService";
import { Settings, Shield, Bell, Moon, Lock, Check, Loader2 } from "lucide-react";

export default function StudentSettings() {
  const { currentUser } = useAuth();
  const toast = useToast();
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [examReminders, setExamReminders] = useState(true);
  const [saved, setSaved] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    toast.success("Preferences saved successfully.");
    setTimeout(() => setSaved(false), 2500);
  };

  const handlePasswordReset = async () => {
    if (!currentUser?.email) return;
    setResettingPassword(true);
    try {
      await resetPassword(currentUser.email);
      toast.success(`Password reset email sent to ${currentUser.email}. Check your inbox.`);
    } catch (err) {
      console.error("Password reset error:", err);
      toast.error(`Failed to send password reset: ${err.message}`);
    } finally {
      setResettingPassword(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-black text-[#111A36]">Settings</h1>
        <p className="text-xs text-[#64748B] mt-1">
          Manage your account preferences, notifications, and security controls.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Notifications Preference */}
        <div className="bg-white rounded-3xl p-6 border border-[#E5ECF5] shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#F1F5F9]">
            <Bell className="w-5 h-5 text-[#0866F5]" />
            <h3 className="text-sm font-bold text-[#111A36]">Notifications</h3>
          </div>

          <label className="flex items-center justify-between cursor-pointer py-1">
            <div>
              <p className="text-xs font-bold text-[#111A36]">Exam Schedules & Alerts</p>
              <p className="text-[11px] text-[#64748B]">Receive notifications when new test series are published.</p>
            </div>
            <input
              type="checkbox"
              checked={examReminders}
              onChange={(e) => setExamReminders(e.target.checked)}
              className="w-4 h-4 text-[#0866F5] rounded border-[#CBD5E1]"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer py-1">
            <div>
              <p className="text-xs font-bold text-[#111A36]">Scorecard & Result Announcements</p>
              <p className="text-[11px] text-[#64748B]">Get instant alerts when your scorecard evaluation is published.</p>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="w-4 h-4 text-[#0866F5] rounded border-[#CBD5E1]"
            />
          </label>
        </div>

        {/* Security & Password */}
        <div className="bg-white rounded-3xl p-6 border border-[#E5ECF5] shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#F1F5F9]">
            <Shield className="w-5 h-5 text-[#16B866]" />
            <h3 className="text-sm font-bold text-[#111A36]">Account Security</h3>
          </div>

          <div className="text-xs text-[#64748B]">
            Logged in as <span className="font-bold text-[#111A36]">{currentUser?.email}</span>
          </div>

          <div className="pt-2">
            <button
              type="button"
              disabled={resettingPassword}
              onClick={handlePasswordReset}
              className="px-4 py-2 rounded-xl border border-[#CBD5E1] hover:bg-[#F8FAFD] text-xs font-bold text-[#111A36] transition-colors cursor-pointer disabled:opacity-50 inline-flex items-center gap-2"
            >
              {resettingPassword ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Sending email...</span>
                </>
              ) : (
                <span>Send Password Reset Email</span>
              )}
            </button>
          </div>
        </div>

        {/* Save Changes */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#0866F5] hover:bg-[#0754D1] text-white font-bold text-xs shadow-xs transition-all flex items-center gap-2"
          >
            {saved ? <Check className="w-4 h-4" /> : null}
            <span>{saved ? "Preferences Saved" : "Save Settings"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
