import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, Mail, Lock, Eye, EyeOff, Terminal } from "lucide-react";
import { loginUser } from "../services/authService";

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const tempErrors = {};
    if (!email) tempErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email))
      tempErrors.email = "Invalid email address";
    if (!password) tempErrors.password = "Password is required";
    else if (password.length < 6)
      tempErrors.password = "Password must be at least 6 characters";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);

    try {
      const response = await loginUser({
        email,
        password,
      });

      localStorage.setItem("access_token", response.access_token);

      localStorage.setItem("user_email", email);

      onLogin();

      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.detail || "Login Failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85svh] grid lg:grid-cols-2 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
      {/* Left side: Branding & Cryptographic Mockup */}
      <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-12 relative overflow-hidden">
        <div className="grid-bg absolute inset-0 opacity-20"></div>
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl"></div>

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
            Secure and verify your digital documents.
          </h2>
          <p className="text-slate-400 text-sm max-w-md leading-relaxed">
            Gain deep insights, check signatures, and leverage machine learning
            heuristics to assure contract integrity instantly.
          </p>

          <div className="rounded-xl border border-slate-800/80 bg-slate-950/80 p-5 font-mono text-xs text-slate-400 space-y-3 shadow-2xl">
            <div className="flex items-center gap-2 text-blue-400 border-b border-slate-900 pb-2">
              <Terminal className="h-4 w-4" />
              <span>verification_daemon.sh</span>
            </div>
            <div className="space-y-1">
              <p className="text-slate-500">// INITIALIZING METADATA AUDIT</p>
              <p>Scanning signature block indices...</p>
              <p className="text-emerald-400">
                SUCCESS: Cryptographic checks complete
              </p>
              <p className="text-blue-400">
                AI Trust Score computed: 98.4% [Passed]
              </p>
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-500 relative z-10">
          Trusted by over 4,000 digital organizations worldwide.
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="flex items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2 text-center lg:text-left">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Welcome back
            </h1>
            <p className="text-sm text-slate-400">
              Enter your credentials to access your document control room
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Password
                </label>
                <Link
                  to="#"
                  className="text-xs text-blue-400 hover:text-blue-300 font-medium"
                >
                  Forgot password?
                </Link>
              </div>
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center font-semibold text-sm text-white bg-blue-600 hover:bg-blue-500 py-3 rounded-lg shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none mt-2"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                "Sign In to Dashboard"
              )}
            </button>
          </form>

          {/* Social Sign-On Mock */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-950 px-3 text-slate-500 font-semibold">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onLogin}
              className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800/80 border border-slate-800 rounded-lg py-2.5 text-xs text-slate-300 transition-all font-medium"
            >
              <svg
                className="w-4 h-4 text-blue-500 fill-current"
                viewBox="0 0 24 24"
              >
                <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.94 5.94 0 018 12.583a5.94 5.94 0 015.99-5.933c1.55 0 2.97.575 4.07 1.526l3.14-3.14C19.26 3.14 16.78 2 13.99 2 8.47 2 4 6.47 4 12s4.47 10 9.99 10c5.77 0 9.8-4.06 9.8-9.99 0-.67-.06-1.3-.18-1.725H12.24z" />
              </svg>
              Google
            </button>
            <button
              type="button"
              onClick={onLogin}
              className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800/80 border border-slate-800 rounded-lg py-2.5 text-xs text-slate-300 transition-all font-medium"
            >
              <svg
                className="w-4 h-4 text-white fill-current"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              Github
            </button>
          </div>

          <p className="text-center text-xs text-slate-400 mt-6">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-400 hover:text-blue-300 font-semibold"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
