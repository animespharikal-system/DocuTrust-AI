import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Terminal,
  CheckCircle2,
} from "lucide-react";
import { registerUser } from "../services/authService";

export default function Signup({ onLogin }) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const tempErrors = {};
    if (!name) tempErrors.name = "Full name is required";
    if (!email) tempErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email))
      tempErrors.email = "Invalid email address";
    if (!password) tempErrors.password = "Password is required";
    else if (password.length < 6)
      tempErrors.password = "Password must be at least 6 characters";
    if (password !== confirmPassword)
      tempErrors.confirmPassword = "Passwords do not match";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);

    try {
      await registerUser({
        name,
        email,
        password,
      });

      alert("Registration Successful!");

      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.detail || "Registration Failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85svh] grid lg:grid-cols-2 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
      {/* Left side: Branding & Visual check list */}
      <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-12 relative overflow-hidden">
        <div className="grid-bg absolute inset-0 opacity-20"></div>
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-indigo-500/5 blur-3xl"></div>

        <div className="flex items-center gap-2 relative z-10">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <span className="font-bold text-white text-lg tracking-tight">
            DocuTrust AI
          </span>
        </div>

        <div className="space-y-6 relative z-10">
          <h2 className="text-3xl font-bold leading-tight text-white">
            Security. Compliance. Authenticity.
          </h2>
          <p className="text-slate-400 text-sm max-w-md leading-relaxed">
            Configure automated rules, audit your operational contracts, and
            prevent corporate fraud before it happens.
          </p>

          <div className="space-y-3.5 text-slate-300 text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
              <span>Free Developer sandbox with 10 documents / mo</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
              <span>Full compliance logging and verification reporting</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
              <span>AI semantic auditing and layout pattern analysis</span>
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-500 relative z-10">
          Advanced cryptographical engine licensed by DocuTrust Labs.
        </div>
      </div>

      {/* Right side: Signup Form */}
      <div className="flex items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2 text-center lg:text-left">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Create your account
            </h1>
            <p className="text-sm text-slate-400">
              Get started with our unified document trust suite
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className={`w-full bg-slate-900 border ${
                    errors.name
                      ? "border-rose-500"
                      : "border-slate-800 focus:border-blue-500"
                  } rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition-all`}
                />
              </div>
              {errors.name && (
                <p className="text-xs text-rose-400 mt-1 font-medium">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className={`w-full bg-slate-900 border ${
                    errors.email
                      ? "border-rose-500"
                      : "border-slate-800 focus:border-blue-500"
                  } rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition-all`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-rose-400 mt-1 font-medium">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full bg-slate-900 border ${
                    errors.password
                      ? "border-rose-500"
                      : "border-slate-800 focus:border-blue-500"
                  } rounded-lg py-2.5 pl-10 pr-10 text-sm text-white placeholder-slate-500 outline-none transition-all`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4.5 w-4.5" />
                  ) : (
                    <Eye className="h-4.5 w-4.5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-rose-400 mt-1 font-medium">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full bg-slate-900 border ${
                    errors.confirmPassword
                      ? "border-rose-500"
                      : "border-slate-800 focus:border-blue-500"
                  } rounded-lg py-2.5 pl-10 pr-10 text-sm text-white placeholder-slate-500 outline-none transition-all`}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-rose-400 mt-1 font-medium">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Terms and conditions mock checkbox */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                required
                id="terms"
                className="h-4 w-4 rounded border-slate-800 bg-slate-900 text-blue-600 focus:ring-blue-600/30"
              />
              <label htmlFor="terms" className="text-xs text-slate-400">
                I agree to the{" "}
                <Link
                  to="#"
                  className="text-blue-400 hover:text-blue-300 font-semibold"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  to="#"
                  className="text-blue-400 hover:text-blue-300 font-semibold"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center font-semibold text-sm text-white bg-blue-600 hover:bg-blue-500 py-3 rounded-lg shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none mt-4"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                "Create Pro Account"
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-400 hover:text-blue-300 font-semibold"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
