import React, { useState, useEffect } from "react";
import { doc, getDoc, setDoc, serverTimestamp, addDoc, collection } from "firebase/firestore";
import { db } from "../../services/firebase/config";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Badge from "../../components/common/Badge";
import { Settings, ShieldCheck, Database, Server, Key, Save, CheckCircle2 } from "lucide-react";

export default function AdminSettings() {
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID || "quiz-master-portal";
  const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "quiz-master-portal.firebaseapp.com";
  const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "quiz-master-portal.firebasestorage.app";

  const [platformName, setPlatformName] = useState("QuizMaster Examination Authority");
  const [defaultDuration, setDefaultDuration] = useState(180);
  const [allowRegistration, setAllowRegistration] = useState(true);
  const [publishImmediately, setPublishImmediately] = useState(true);
  const [proctoringStrict, setProctoringStrict] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const { currentUser, userProfile } = useAuth();
  const toast = useToast();

  useEffect(() => {
    async function loadSettings() {
      setLoading(true);
      try {
        const snap = await getDoc(doc(db, "platformSettings", "general"));
        if (snap.exists()) {
          const data = snap.data();
          if (data.platformName) setPlatformName(data.platformName);
          if (data.defaultDuration) setDefaultDuration(data.defaultDuration);
          if (data.allowRegistration !== undefined) setAllowRegistration(data.allowRegistration);
          if (data.publishImmediately !== undefined) setPublishImmediately(data.publishImmediately);
          if (data.proctoringStrict !== undefined) setProctoringStrict(data.proctoringStrict);
        }
      } catch (err) {
        console.error("Failed to load platform settings:", err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        platformName,
        defaultDuration: Number(defaultDuration) || 180,
        allowRegistration,
        publishImmediately,
        proctoringStrict,
        updatedAt: serverTimestamp(),
        updatedBy: currentUser?.uid || "admin"
      };

      await setDoc(doc(db, "platformSettings", "general"), payload, { merge: true });

      // Log to auditLogs
      await addDoc(collection(db, "auditLogs"), {
        action: "UPDATE_PLATFORM_SETTINGS",
        actorUid: currentUser?.uid || "admin",
        actorEmail: currentUser?.email || "admin",
        actorName: userProfile?.fullName || currentUser?.displayName || "Administrator",
        details: {
          platformName,
          defaultDuration: Number(defaultDuration),
          allowRegistration,
          publishImmediately,
          proctoringStrict
        },
        timestamp: serverTimestamp()
      });

      toast.success("Platform operational settings saved successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save platform settings: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-2xs">
        <div>
          <span className="text-[11px] font-bold text-[#2563EB] uppercase tracking-wider">
            Configuration & Governance
          </span>
          <h1 className="text-2xl font-black text-[#111827] tracking-tight mt-0.5">
            System & Infrastructure Settings
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Review active cloud connection parameters and operational examination defaults.
          </p>
        </div>
      </div>

      {/* Cloud Infrastructure Status */}
      <Card className="p-6 space-y-6">
        <h3 className="text-sm font-bold text-[#111827] flex items-center gap-2">
          <Server className="w-4 h-4 text-[#2563EB]" /> Connected Firebase Services
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
            <span className="text-[#64748B] block mb-1">Firebase Project ID</span>
            <span className="font-mono font-bold text-[#111827] block truncate">
              {projectId}
            </span>
            <Badge variant="success" size="xs" className="mt-2">
              CONNECTED
            </Badge>
          </div>

          <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
            <span className="text-[#64748B] block mb-1">Auth Domain</span>
            <span className="font-mono font-bold text-[#111827] block truncate">
              {authDomain}
            </span>
            <Badge variant="success" size="xs" className="mt-2">
              ACTIVE
            </Badge>
          </div>

          <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
            <span className="text-[#64748B] block mb-1">Cloud Storage</span>
            <span className="font-mono font-bold text-[#111827] block truncate">
              {storageBucket}
            </span>
            <Badge variant="primary" size="xs" className="mt-2">
              STORAGE READY
            </Badge>
          </div>
        </div>

        <div className="pt-4 border-t border-[#E2E8F0] text-xs space-y-3">
          <h4 className="font-bold text-[#111827]">Security & Integrity Guarantees</h4>
          <ul className="space-y-2 text-[#64748B]">
            <li className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#16A34A] shrink-0" />
              <span>Isolated Answer Key Vault prevents client examination inspection.</span>
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#16A34A] shrink-0" />
              <span>Authoritative server timestamps govern test deadlines and auto-submission.</span>
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#16A34A] shrink-0" />
              <span>Firestore Security Rules forbid candidates from modifying roles, deadlines, or scores.</span>
            </li>
          </ul>
        </div>
      </Card>

      {/* Operational Defaults Form */}
      <Card className="p-6">
        <form onSubmit={handleSaveSettings} className="space-y-5 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
            <h3 className="text-sm font-bold text-[#111827] flex items-center gap-2">
              <Settings className="w-4 h-4 text-[#2563EB]" /> Examination Engine Defaults
            </h3>
            <span className="text-[11px] text-[#64748B]">Saved to Cloud Firestore</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#111827] mb-1">
                Organization / Platform Branding Name
              </label>
              <input
                type="text"
                required
                value={platformName}
                onChange={(e) => setPlatformName(e.target.value)}
                className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl outline-none focus:border-[#2563EB] text-[#111827]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#111827] mb-1">
                Default Examination Duration (Minutes)
              </label>
              <input
                type="number"
                required
                min={15}
                max={360}
                value={defaultDuration}
                onChange={(e) => setDefaultDuration(e.target.value)}
                className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl outline-none focus:border-[#2563EB] text-[#111827]"
              />
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex items-center gap-3 p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl cursor-pointer hover:bg-[#F1F5F9] transition-colors">
              <input
                type="checkbox"
                checked={allowRegistration}
                onChange={(e) => setAllowRegistration(e.target.checked)}
                className="w-4 h-4 text-[#2563EB] rounded accent-[#2563EB]"
              />
              <div>
                <p className="font-bold text-[#111827]">Allow Student Self-Registration</p>
                <p className="text-[11px] text-[#64748B]">When disabled, only administrators can provision candidate accounts.</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl cursor-pointer hover:bg-[#F1F5F9] transition-colors">
              <input
                type="checkbox"
                checked={publishImmediately}
                onChange={(e) => setPublishImmediately(e.target.checked)}
                className="w-4 h-4 text-[#2563EB] rounded accent-[#2563EB]"
              />
              <div>
                <p className="font-bold text-[#111827]">Publish Scorecards Immediately Upon Submission</p>
                <p className="text-[11px] text-[#64748B]">When disabled, scorecards remain hidden until released in the results ledger.</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl cursor-pointer hover:bg-[#F1F5F9] transition-colors">
              <input
                type="checkbox"
                checked={proctoringStrict}
                onChange={(e) => setProctoringStrict(e.target.checked)}
                className="w-4 h-4 text-[#2563EB] rounded accent-[#2563EB]"
              />
              <div>
                <p className="font-bold text-[#111827]">Strict Window & Fullscreen Telemetry Alerts</p>
                <p className="text-[11px] text-[#64748B]">Enforce security focus warnings when candidate switches tabs or exits examination mode.</p>
              </div>
            </label>
          </div>

          <div className="flex justify-end pt-3 border-t border-[#F1F5F9]">
            <Button
              type="submit"
              icon={Save}
              loading={isSaving}
              size="sm"
            >
              Save Platform Configuration
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
