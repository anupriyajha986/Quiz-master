import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import {
  GraduationCap,
  Mail,
  Lock,
  User,
  Building,
  Hash,
  Phone,
  ArrowRight
} from "lucide-react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    rollNumber: "",
    instituteName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!formData.rollNumber.trim()) {
      setError("Please provide your institutional roll number.");
      return;
    }
    if (!formData.email.trim()) {
      setError("Please enter a valid email address.");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!formData.agreeTerms) {
      setError("You must accept the examination code of conduct to proceed.");
      return;
    }

    setLoading(true);
    try {
      await register({
        fullName: formData.fullName,
        rollNumber: formData.rollNumber,
        instituteName: formData.instituteName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });

      toast.success("Account successfully created! Welcome to QuizMaster.");
      navigate("/student/dashboard");
    } catch (err) {
      console.error("Registration error:", err);
      let msg = err.message || "Failed to register account.";
      if (err.message.includes("email-already-in-use")) {
        msg = "This email address is already registered. Please sign in.";
      }
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="max-w-xl w-full space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#2563EB] text-white shadow-xs mb-4">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-[#111827]">
              Student Registration
            </h2>
            <p className="text-xs text-[#64748B] mt-1">
              Create your official examinee profile for QuizMaster assessments
            </p>
          </div>

          <Card className="p-6 sm:p-8">
            {error && (
              <div className="mb-6 p-3 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-xs text-[#991B1B] font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name *"
                  name="fullName"
                  icon={User}
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Rahul Sharma"
                  required
                />

                <Input
                  label="Roll / Registration No. *"
                  name="rollNumber"
                  icon={Hash}
                  value={formData.rollNumber}
                  onChange={handleChange}
                  placeholder="e.g. 2026-CS-1042"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Institute / College"
                  name="instituteName"
                  icon={Building}
                  value={formData.instituteName}
                  onChange={handleChange}
                  placeholder="e.g. National Institute of Tech"
                />

                <Input
                  label="Contact Phone"
                  name="phone"
                  type="tel"
                  icon={Phone}
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                />
              </div>

              <Input
                label="Email Address *"
                name="email"
                type="email"
                icon={Mail}
                value={formData.email}
                onChange={handleChange}
                placeholder="student@institution.edu"
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Password *"
                  name="password"
                  type="password"
                  icon={Lock}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  required
                />

                <Input
                  label="Confirm Password *"
                  name="confirmPassword"
                  type="password"
                  icon={Lock}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  required
                />
              </div>

              <div className="flex items-start gap-2 pt-2">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="mt-0.5 rounded border-[#CBD5E1] text-[#2563EB] focus:ring-[#2563EB]"
                  required
                />
                <label htmlFor="agreeTerms" className="text-xs text-[#64748B]">
                  I certify that all provided credentials are valid and agree to the examination code of conduct and server timing policies.
                </label>
              </div>

              <Button
                type="submit"
                loading={loading}
                className="w-full mt-4"
                icon={ArrowRight}
              >
                Complete Registration
              </Button>
            </form>

            <div className="mt-6 text-center text-xs text-[#64748B]">
              Already registered?{" "}
              <Link to="/login" className="text-[#2563EB] font-bold hover:underline">
                Sign in to your account
              </Link>
            </div>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
