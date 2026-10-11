import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { updateUserProfile } from "../../services/firebase/authService";
import { useToast } from "../../context/ToastContext";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Badge from "../../components/common/Badge";
import {
  User,
  Hash,
  Building,
  Mail,
  Phone,
  ShieldCheck,
  Save
} from "lucide-react";

export default function StudentProfile() {
  const { currentUser, userProfile, refreshProfile } = useAuth();
  const [formData, setFormData] = useState({
    fullName: userProfile?.fullName || "",
    instituteName: userProfile?.instituteName || "",
    phone: userProfile?.phone || ""
  });
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      toast.error("Full name cannot be empty.");
      return;
    }

    setSaving(true);
    try {
      await updateUserProfile(currentUser.uid, formData);
      await refreshProfile();
      toast.success("Profile details updated successfully.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] flex items-center justify-center font-bold text-xl">
            {userProfile?.fullName?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-[#111827]">
                {userProfile?.fullName || "Student Profile"}
              </h1>
              <Badge variant="success" size="xs">
                {userProfile?.accountStatus?.toUpperCase() || "ACTIVE"}
              </Badge>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              Candidate Roll No: <span className="font-mono font-bold text-[#2563EB]">{userProfile?.normalizedRollNumber || "N/A"}</span>
            </p>
          </div>
        </div>
      </div>

      <Card className="p-6">
        <h3 className="text-sm font-bold text-[#111827] mb-4">
          Official Candidate Details
        </h3>

        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Full Name *"
            icon={User}
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Roll / Registration No. (Fixed)"
              icon={Hash}
              value={userProfile?.normalizedRollNumber || ""}
              disabled
              helperText="Assigned upon initial registration"
            />

            <Input
              label="Registered Email (Fixed)"
              icon={Mail}
              value={userProfile?.email || currentUser?.email || ""}
              disabled
              helperText="Managed by authentication provider"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Institution / College"
              icon={Building}
              value={formData.instituteName}
              onChange={(e) => setFormData({ ...formData, instituteName: e.target.value })}
              placeholder="e.g. National Institute of Tech"
            />

            <Input
              label="Contact Phone"
              icon={Phone}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+91 98765 43210"
            />
          </div>

          <div className="pt-4 border-t border-[#E2E8F0] flex justify-end">
            <Button type="submit" loading={saving} icon={Save}>
              Save Profile Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
