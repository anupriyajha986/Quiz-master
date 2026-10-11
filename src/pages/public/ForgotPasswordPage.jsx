import React, { useState } from "react";
import { Link } from "react-router-dom";
import { resetPassword } from "../../services/firebase/authService";
import { useToast } from "../../context/ToastContext";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { GraduationCap, Mail, ArrowLeft, Send } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      await resetPassword(email);
      setSubmitted(true);
      toast.success("Password reset instructions sent to your email.");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to send reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#2563EB] text-white shadow-xs mb-4">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-[#111827]">
              Reset Account Password
            </h2>
            <p className="text-xs text-[#64748B] mt-1">
              Enter your registered email to receive password reset instructions
            </p>
          </div>

          <Card className="p-6 sm:p-8">
            {submitted ? (
              <div className="text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center mx-auto">
                  <Mail className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[#111827]">
                  Check Your Inbox
                </h3>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  We have dispatched a password reset link to <span className="font-semibold text-[#111827]">{email}</span>.
                  Follow the instructions to regain access.
                </p>
                <div className="pt-2">
                  <Link to="/login">
                    <Button variant="secondary" className="w-full">
                      Return to Login
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Registered Email"
                  type="email"
                  icon={Mail}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@institution.edu"
                  required
                />

                <Button
                  type="submit"
                  loading={loading}
                  className="w-full"
                  icon={Send}
                >
                  Send Reset Link
                </Button>

                <div className="text-center pt-2">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#111827]"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
                  </Link>
                </div>
              </form>
            )}
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
