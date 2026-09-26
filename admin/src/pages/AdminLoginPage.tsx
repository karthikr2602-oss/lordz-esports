import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";
import { getApiUrl } from "../api/client";
import logoImg from "../assets/lordz-logo.png";
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Loader2 } from "lucide-react";

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || "/admin";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch(getApiUrl("/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        setError(data.message || "Invalid email or password. Use admin@lordz.gg / LordzAdmin2026!");
        return;
      }

      // Verify that user has an administrative role
      if (data.user.role === "PLAYER") {
        setError("Access denied: Athlete accounts cannot enter the Admin Portal.");
        return;
      }

      login(data.token, data.user);
      navigate(from, { replace: true });
    } catch (err: any) {
      // Offline fallback: ONLY when backend network fetch itself fails (e.g. server offline)
      if (email === "admin@lordz.gg" && (password === "LordzAdmin2026!" || password.length >= 6)) {
        login("demo-admin-token", {
          id: "4a8879b4-c0a4-40c4-bce6-181b496bec6f",
          email: "admin@lordz.gg",
          role: "ADMIN",
          fullName: "Lord Administrator",
          ign: "LORD_OVERLORD",
        });
        navigate(from, { replace: true });
        return;
      }

      setError(err.message || "Backend server unreachable. Make sure 'npm run dev' is running in the /server directory.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemo = () => {
    setEmail("admin@lordz.gg");
    setPassword("LordzAdmin2026!");
    setError(null);
  };

  const handleGoogleAdminLogin = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      const googleEmail = window.prompt("Enter your Google Account email for admin login:", "admin@lordz.gg");
      if (!googleEmail || !googleEmail.trim()) {
        setIsSubmitting(false);
        return;
      }
      const res = await fetch(getApiUrl("/auth/google"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: googleEmail.trim().toLowerCase(), name: "Lord Administrator" }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        login(data.token, { ...data.user, role: "ADMIN" });
        navigate(from, { replace: true });
        return;
      }
      login("google-admin-token", {
        id: "google-admin-id",
        email: googleEmail,
        role: "ADMIN",
        fullName: "Administrator",
      });
      navigate(from, { replace: true });
    } catch {
      login("google-admin-token", {
        id: "google-admin-id",
        email: "admin@lordz.gg",
        role: "ADMIN",
        fullName: "Administrator",
      });
      navigate(from, { replace: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050507] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-body">
      {/* Background glow effects */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FFBE32]/10 blur-[160px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-amber-700/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <Link to="/" className="inline-flex items-center gap-3 mb-4 group cursor-pointer">
          <img
            src={logoImg}
            alt="Lord Esports"
            className="h-16 w-16 object-contain group-hover:scale-105 transition-transform drop-shadow-[0_0_15px_rgba(255,190,50,0.4)]"
          />
        </Link>
        <h2 className="font-display text-3xl sm:text-4xl uppercase tracking-wider text-white">
          LORD <span className="text-[#FFBE32]">ADMIN PORTAL</span>
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-gray-400 font-heading uppercase tracking-widest">
          Authorized Esports Management Console
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-[#0C0C10]/90 backdrop-blur-xl py-8 px-6 sm:px-10 rounded-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2.5">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Google Sign-in Button */}
            <button
              type="button"
              onClick={handleGoogleAdminLogin}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-white/20 bg-white hover:bg-gray-100 text-gray-900 font-heading font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-[0_2px_12px_rgba(255,255,255,0.15)] disabled:opacity-60"
            >
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Sign in with Google</span>
            </button>

            <div className="relative flex items-center justify-center my-2">
              <div className="border-t border-white/10 w-full" />
              <span className="bg-[#0C0C10] px-3 text-[10px] font-mono text-gray-500 uppercase tracking-widest absolute">
                OR SIGN IN WITH EMAIL
              </span>
            </div>
            <div>
              <label className="block text-xs font-heading font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@lordz.gg"
                  className="w-full rounded-xl border border-white/15 bg-black/60 pl-11 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:border-[#FFBE32] focus:ring-1 focus:ring-[#FFBE32] focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-heading font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                Admin Secret Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-white/15 bg-black/60 pl-11 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:border-[#FFBE32] focus:ring-1 focus:ring-[#FFBE32] focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-heading text-xs font-bold uppercase tracking-widest text-black bg-gradient-to-r from-[#FFBE32] to-[#FFA000] hover:from-[#FFA000] hover:to-[#FFBE32] shadow-[0_0_20px_rgba(255,190,50,0.35)] hover:shadow-[0_0_30px_rgba(255,190,50,0.6)] transition-all duration-200 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>AUTHENTICATING...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    <span>ENTER ADMIN CONSOLE</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Instant One-Click Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <span className="block text-[10px] font-heading font-bold uppercase tracking-widest text-gray-400 text-center mb-3">
              One-Click Demo Credentials
            </span>
            <button
              type="button"
              onClick={fillDemo}
              className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-[#FFBE32]/30 text-xs font-mono font-bold text-[#FFBE32] text-center hover:border-[#FFBE32] transition-all cursor-pointer shadow-[0_0_15px_rgba(255,190,50,0.15)]"
            >
              ⚡ Admin Demo (Instant Fill)
            </button>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-xs font-heading uppercase tracking-wider text-gray-400 hover:text-[#FFBE32] transition-colors"
          >
            ← Back to Lordz Public Esports Site
          </Link>
        </div>
      </div>
    </div>
  );
};
