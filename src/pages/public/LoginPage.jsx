import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { GraduationCap, Mail, Lock, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { currentUser, userProfile, isAdmin, login, loading: authLoading } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || null;

  // Auto-redirect if already authenticated and role is known
  React.useEffect(() => {
    if (!authLoading && currentUser && userProfile) {
      const userRole = (userProfile?.role || "").trim().toLowerCase();
      const isAdminRole = ["admin", "super_admin", "manager", "evaluator"].includes(userRole);
      if (isAdminRole) {
        if (from && from.startsWith("/admin")) {
          navigate(from, { replace: true });
        } else {
          navigate("/admin/dashboard", { replace: true });
        }
      } else if (userRole === "student") {
        if (from && from.startsWith("/student") && !from.startsWith("/student/dashboard")) {
          navigate(from, { replace: true });
        } else {
          navigate("/student/dashboard", { replace: true });
        }
      }
    }
  }, [currentUser, userProfile, isAdmin, authLoading, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please provide both email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await login(email, password);
      const userRole = (res.profile?.role || "").trim().toLowerCase();
      const isAdminRole = ["admin", "super_admin", "manager", "evaluator"].includes(userRole);
      const isStudentRole = userRole === "student";

      toast.success(`Welcome back, ${res.profile?.fullName || "User"}!`);

      if (isAdminRole) {
        if (from && from.startsWith("/admin")) {
          navigate(from, { replace: true });
        } else {
          navigate("/admin/dashboard", { replace: true });
        }
      } else if (isStudentRole) {
        if (from && from.startsWith("/student") && !from.startsWith("/student/dashboard")) {
          navigate(from, { replace: true });
        } else {
          navigate("/student/dashboard", { replace: true });
        }
      } else {
        // Unrecognized role
        console.warn("Unrecognized user role:", userRole);
        toast.error("Account role is unassigned or unauthorized. Please contact administrator.");
        navigate("/", { replace: true });
      }
    } catch (err) {
      console.error("Login failed:", err);
      let msg = "Invalid email or password.";
      if (err.message?.includes("user-not-found")) msg = "No user found with this email.";
      if (err.message?.includes("wrong-password") || err.message?.includes("invalid-credential")) {
        msg = "Incorrect credentials. Please verify your password.";
      }
      if (err.message?.includes("deactivated") || err.message?.includes("inactive")) {
        msg = "This account has been deactivated or is inactive. Please contact an administrator.";
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
        <div className="max-w-md w-full space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#2563EB] text-white shadow-xs mb-4">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-[#111827]">
              Sign in to QuizMaster
            </h2>
            <p className="text-xs text-[#64748B] mt-1">
              Access examinations, results, and administrative controls
            </p>
          </div>

          <Card className="p-6 sm:p-8">
            {error && (
              <div className="mb-6 p-3 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-xs text-[#991B1B] font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                icon={Mail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@institution.edu"
                required
              />

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#111827]">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-[#2563EB] hover:underline font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  type="password"
                  icon={Lock}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your account password"
                  required
                />
              </div>

              <Button
                type="submit"
                loading={loading}
                className="w-full mt-2"
                icon={ArrowRight}
              >
                Sign In to Platform
              </Button>
            </form>



            <div className="mt-6 text-center text-xs text-[#64748B]">
              New to QuizMaster?{" "}
              <Link to="/register" className="text-[#2563EB] font-bold hover:underline">
                Register as a Student
              </Link>
            </div>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
