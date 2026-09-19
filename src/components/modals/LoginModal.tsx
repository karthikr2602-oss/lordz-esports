import React, { useState, useEffect } from "react";
import { Modal } from "../common/Modal";
import { GoldButton } from "../common/GoldButton";
import { OutlineButton } from "../common/OutlineButton";
import {
  Lock,
  User,
  Mail,
  Phone,
  Gamepad2,
  Trophy,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Sparkles,
  ShieldCheck,
  Calendar,
  Hash,
  Pencil,
  Check,
} from "lucide-react";
import logoImg from "../../assets/lordz-logo.png";
import { useAuth } from "../../context/AuthContext";
import { authApi } from "../../api/auth";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { user, isAuthenticated, login, register, logout, updateUser } = useAuth();

  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Editable Gaming Experience Tier state
  const [isEditingTier, setIsEditingTier] = useState(false);
  const [selectedTier, setSelectedTier] = useState(user?.gamingExperience || "1-2 Years (Semi-Pro)");
  const [isSavingTier, setIsSavingTier] = useState(false);
  const [tierUpdateFeedback, setTierUpdateFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (user?.gamingExperience) {
      setSelectedTier(user.gamingExperience);
    }
  }, [user?.gamingExperience]);

  const handleSaveTier = async () => {
    if (!user) return;
    setIsSavingTier(true);
    try {
      await authApi.updateProfile({ gamingExperience: selectedTier });
      updateUser({ gamingExperience: selectedTier });
      setTierUpdateFeedback("Tier updated!");
      setIsEditingTier(false);
      setTimeout(() => setTierUpdateFeedback(null), 3000);
    } catch (err: any) {
      alert("Failed to update tier: " + (err.message || "Unknown error"));
    } finally {
      setIsSavingTier(false);
    }
  };

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form state
  const [regUsername, setRegUsername] = useState("");
  const [regFullName, setRegFullName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regGamingExp, setRegGamingExp] = useState("1-2 Years (Semi-Pro)");
  const [regPrimaryGame, setRegPrimaryGame] = useState("FREE FIRE MAX");
  const [regIgn, setRegIgn] = useState("");
  const [regDevice, setRegDevice] = useState("Mobile (Android)");
  const [regDiscord, setRegDiscord] = useState("");

  const resetForms = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoginIdentifier("");
    setLoginPassword("");
    setRegUsername("");
    setRegFullName("");
    setRegEmail("");
    setRegPassword("");
    setRegPhone("");
    setRegIgn("");
    setRegDiscord("");
  };

  const handleClose = () => {
    resetForms();
    onClose();
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      await login({
        identifier: loginIdentifier.trim(),
        password: loginPassword,
      });
      setSuccessMessage("Welcome back! You are now logged in.");
      setTimeout(() => {
        handleClose();
      }, 1200);
    } catch (err: any) {
      setErrorMessage(err.message || "Invalid credentials. Please verify and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      await register({
        username: regUsername.trim().toLowerCase(),
        fullName: regFullName.trim(),
        email: regEmail.trim().toLowerCase(),
        password: regPassword,
        phone: regPhone.trim(),
        gamingExperience: regGamingExp,
        primaryGame: regPrimaryGame,
        ign: regIgn.trim() || regUsername.trim().toUpperCase(),
        device: regDevice,
        discord: regDiscord.trim() || undefined,
      });
      setSuccessMessage("Account created successfully! Welcome to Lordz Esports.");
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err.message || "Registration failed. Please review your details.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutClick = async () => {
    setLoading(true);
    try {
      await logout();
      resetForms();
      setActiveTab("login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isAuthenticated ? "ATHLETE PASSPORT" : activeTab === "login" ? "PLAYER PORTAL SIGN IN" : "JOIN LORDZ CLAN — REGISTRATION"}
      subtitle={
        isAuthenticated
          ? "Official verified esports athlete ID & credentials"
          : activeTab === "login"
          ? "Access your clan tournament brackets, verified scrims & stats"
          : "Register your athlete profile with real gaming credentials"
      }
      maxWidth={isAuthenticated ? "md" : activeTab === "register" ? "lg" : "sm"}
    >
      {/* If User Is Logged In -> Show Full Athlete Profile Passport */}
      {isAuthenticated && user ? (
        <div className="space-y-6 py-2">
          {/* Athlete Header Card */}
          <div className="relative overflow-hidden rounded-2xl border border-[#FFBE32]/30 bg-gradient-to-br from-[#121214] to-[#0A0A0B] p-5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFBE32]/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="relative shrink-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-[#FFBE32] to-[#FFE082] p-0.5 flex items-center justify-center shadow-[0_0_20px_rgba(255,190,50,0.3)]">
                  <div className="w-full h-full bg-[#070708] rounded-2xl flex items-center justify-center font-display text-2xl font-bold text-[#FFBE32]">
                    {user.ign?.slice(0, 2).toUpperCase() || user.username?.slice(0, 2).toUpperCase() || "LZ"}
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 bg-[#22C55E] rounded-full p-1 border-2 border-[#070708]">
                  <ShieldCheck className="h-3 w-3 text-black" />
                </div>
              </div>

              <div className="text-center sm:text-left flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h3 className="font-display text-2xl sm:text-3xl text-white uppercase tracking-wider truncate">
                    {user.ign || user.username}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-heading font-black tracking-widest bg-[#FFBE32]/20 text-[#FFBE32] border border-[#FFBE32]/40 uppercase">
                    PRO ATHLETE
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1 font-mono">@{user.username}</p>
                {user.fullName && (
                  <p className="text-xs text-gray-300 font-medium mt-0.5">{user.fullName}</p>
                )}
              </div>
            </div>

            {/* Profile Data Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t border-white/10">
              <div className="bg-black/40 rounded-xl p-3 border border-white/5">
                <span className="text-[10px] font-mono text-gray-400 uppercase block mb-1 flex items-center gap-1">
                  <Mail className="h-3 w-3 text-[#FFBE32]" /> Email
                </span>
                <span className="text-xs text-white font-medium truncate block" title={user.email}>
                  {user.email}
                </span>
              </div>

              <div className="bg-black/40 rounded-xl p-3 border border-white/5">
                <span className="text-[10px] font-mono text-gray-400 uppercase block mb-1 flex items-center gap-1">
                  <Phone className="h-3 w-3 text-[#FFBE32]" /> Mobile
                </span>
                <span className="text-xs text-white font-medium block">
                  {user.phone || "Not set"}
                </span>
              </div>

              <div className="bg-black/50 rounded-xl p-3 border border-[#FFBE32]/30 relative transition-all">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono text-gray-400 uppercase flex items-center gap-1">
                    <Trophy className="h-3 w-3 text-[#FFBE32]" /> Experience Tier
                  </span>
                  {!isEditingTier && (
                    <button
                      type="button"
                      onClick={() => setIsEditingTier(true)}
                      className="text-[10px] font-mono text-[#FFBE32] hover:text-[#FFE082] hover:underline flex items-center gap-1 cursor-pointer transition-colors"
                      title="Edit Experience Tier"
                    >
                      <Pencil className="h-2.5 w-2.5" /> Edit
                    </button>
                  )}
                </div>

                {isEditingTier ? (
                  <div className="space-y-2 mt-1">
                    <select
                      value={selectedTier}
                      onChange={(e) => setSelectedTier(e.target.value)}
                      className="w-full rounded-lg border border-[#FFBE32] bg-[#0A0A0C] px-2 py-1 text-xs text-white focus:outline-none cursor-pointer"
                    >
                      <option value="< 1 Year (Rookie / Beginner)" className="bg-[#0A0A0C]">
                        &lt; 1 Year (Rookie / Beginner)
                      </option>
                      <option value="1-2 Years (Semi-Pro)" className="bg-[#0A0A0C]">
                        1-2 Years (Semi-Pro)
                      </option>
                      <option value="2-4 Years (Tier-2 Competitive)" className="bg-[#0A0A0C]">
                        2-4 Years (Tier-2 Competitive)
                      </option>
                      <option value="4+ Years (Tier-1 Veteran)" className="bg-[#0A0A0C]">
                        4+ Years (Tier-1 Veteran)
                      </option>
                    </select>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={isSavingTier}
                        onClick={handleSaveTier}
                        className="px-2.5 py-1 rounded-md bg-[#FFBE32] hover:bg-[#FFE082] text-black text-[10px] font-heading font-bold uppercase cursor-pointer transition-colors flex items-center gap-1"
                      >
                        <Check className="h-2.5 w-2.5" />
                        {isSavingTier ? "SAVING..." : "SAVE TIER"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedTier(user.gamingExperience || "1-2 Years (Semi-Pro)");
                          setIsEditingTier(false);
                        }}
                        className="px-2 py-1 rounded-md border border-white/20 text-gray-400 text-[10px] font-heading cursor-pointer hover:text-white transition-colors"
                      >
                        CANCEL
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <span className="text-xs text-[#FFBE32] font-bold block truncate">
                      {user.gamingExperience || "1-2 Years (Semi-Pro)"}
                    </span>
                    {tierUpdateFeedback && (
                      <span className="text-[10px] text-emerald-400 font-mono mt-0.5 block flex items-center gap-1">
                        <Check className="h-2.5 w-2.5" /> {tierUpdateFeedback}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="bg-black/40 rounded-xl p-3 border border-white/5">
                <span className="text-[10px] font-mono text-gray-400 uppercase block mb-1 flex items-center gap-1">
                  <Gamepad2 className="h-3 w-3 text-[#FFBE32]" /> Primary Game
                </span>
                <span className="text-xs text-white font-medium block">
                  {user.primaryGame || "FREE FIRE MAX"}
                </span>
              </div>

              <div className="bg-black/40 rounded-xl p-3 border border-white/5">
                <span className="text-[10px] font-mono text-gray-400 uppercase block mb-1 flex items-center gap-1">
                  <Smartphone className="h-3 w-3 text-[#FFBE32]" /> Device
                </span>
                <span className="text-xs text-white font-medium block">
                  {user.device || "Mobile"}
                </span>
              </div>

              <div className="bg-black/40 rounded-xl p-3 border border-white/5">
                <span className="text-[10px] font-mono text-gray-400 uppercase block mb-1 flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-[#FFBE32]" /> Joined
                </span>
                <span className="text-xs text-gray-300 block">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Active Clan"}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <OutlineButton
              onClick={handleLogoutClick}
              disabled={loading}
              className="w-full sm:w-auto text-red-400 hover:text-red-300 border-red-500/30 hover:border-red-500 flex items-center justify-center gap-2"
              size="sm"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>SIGN OUT OF PASSPORT</span>
            </OutlineButton>

            <GoldButton onClick={handleClose} className="w-full sm:w-auto" size="sm" showArrow={false}>
              CLOSE PASSPORT
            </GoldButton>
          </div>
        </div>
      ) : (
        /* Not Logged In -> Show Sign In / Register Tabs */
        <div className="space-y-5">
          {/* Top Logo and Tabs Switcher */}
          <div className="flex flex-col items-center">
            <img
              src={logoImg}
              alt="Lordz"
              className="h-12 w-12 object-contain drop-shadow-[0_0_12px_rgba(255,190,50,0.3)] mb-3"
            />

            <div className="grid grid-cols-2 w-full max-w-sm rounded-xl bg-black/60 p-1 border border-white/10">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("login");
                  setErrorMessage(null);
                }}
                className={`py-2 text-xs font-heading font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                  activeTab === "login"
                    ? "bg-[#FFBE32] text-black shadow-[0_0_12px_rgba(255,190,50,0.4)]"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                SIGN IN
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("register");
                  setErrorMessage(null);
                }}
                className={`py-2 text-xs font-heading font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                  activeTab === "register"
                    ? "bg-[#FFBE32] text-black shadow-[0_0_12px_rgba(255,190,50,0.4)]"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                REGISTER ATHLETE
              </button>
            </div>
          </div>

          {/* Feedback Messages */}
          {errorMessage && (
            <div className="rounded-xl border border-red-500/40 bg-red-950/40 p-3.5 text-xs text-red-200 flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/40 p-3.5 text-xs text-emerald-200 flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* TAB 1: SIGN IN FORM */}
          {activeTab === "login" && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-heading uppercase tracking-wider text-gray-300 mb-1.5">
                  Username, Email or IGN
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 h-4 w-4 text-gray-500" />
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="e.g. shadow_lord or athlete@gmail.com"
                    className="w-full rounded-xl border border-white/15 bg-black/60 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:border-[#FFBE32] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-heading uppercase tracking-wider text-gray-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-gray-500" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-white/15 bg-black/60 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 focus:border-[#FFBE32] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
                <span className="text-[11px] text-gray-400">
                  New to Lordz Clan?{" "}
                  <button
                    type="button"
                    onClick={() => setActiveTab("register")}
                    className="text-[#FFBE32] hover:underline cursor-pointer font-bold"
                  >
                    Register here
                  </button>
                </span>
              </div>

              <div className="pt-2">
                <GoldButton type="submit" disabled={loading} className="w-full" size="md">
                  {loading ? "AUTHENTICATING..." : "SIGN IN TO PORTAL"}
                </GoldButton>
              </div>
            </form>
          )}

          {/* TAB 2: REGISTRATION FORM */}
          {activeTab === "register" && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Username */}
                <div>
                  <label className="block text-xs font-heading uppercase tracking-wider text-gray-300 mb-1">
                    Clan Username *
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                    <input
                      type="text"
                      required
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value)}
                      placeholder="e.g. viper_beast"
                      pattern="^[a-zA-Z0-9_]{3,30}$"
                      title="3-30 letters, numbers, underscores"
                      className="w-full rounded-xl border border-white/15 bg-black/60 pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:border-[#FFBE32] focus:outline-none"
                    />
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono mt-0.5 block">
                    Unique handle (letters, numbers, _)
                  </span>
                </div>

                {/* Full Real Name */}
                <div>
                  <label className="block text-xs font-heading uppercase tracking-wider text-gray-300 mb-1">
                    Full Real Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                    <input
                      type="text"
                      required
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      placeholder="e.g. Arjun Sharma"
                      className="w-full rounded-xl border border-white/15 bg-black/60 pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:border-[#FFBE32] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-heading uppercase tracking-wider text-gray-300 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="athlete@gmail.com"
                      className="w-full rounded-xl border border-white/15 bg-black/60 pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:border-[#FFBE32] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Mobile Phone Number */}
                <div>
                  <label className="block text-xs font-heading uppercase tracking-wider text-gray-300 mb-1">
                    Mobile Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                    <input
                      type="tel"
                      required
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full rounded-xl border border-white/15 bg-black/60 pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:border-[#FFBE32] focus:outline-none"
                    />
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono mt-0.5 block">
                    For scrim slot updates &amp; prize transfers
                  </span>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-heading uppercase tracking-wider text-gray-300 mb-1">
                    Account Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="w-full rounded-xl border border-white/15 bg-black/60 pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:border-[#FFBE32] focus:outline-none"
                    />
                  </div>
                </div>

                {/* In-Game Name (IGN) */}
                <div>
                  <label className="block text-xs font-heading uppercase tracking-wider text-gray-300 mb-1">
                    In-Game Name (IGN)
                  </label>
                  <div className="relative">
                    <Sparkles className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                    <input
                      type="text"
                      value={regIgn}
                      onChange={(e) => setRegIgn(e.target.value)}
                      placeholder="e.g. LZ・VIPER"
                      className="w-full rounded-xl border border-white/15 bg-black/60 pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:border-[#FFBE32] focus:outline-none"
                    />
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono mt-0.5 block">
                    Defaults to username if left empty
                  </span>
                </div>

                {/* Gaming Experience */}
                <div>
                  <label className="block text-xs font-heading uppercase tracking-wider text-gray-300 mb-1">
                    Gaming Experience *
                  </label>
                  <div className="relative">
                    <Trophy className="absolute left-3 top-2.5 h-4 w-4 text-[#FFBE32]" />
                    <select
                      value={regGamingExp}
                      onChange={(e) => setRegGamingExp(e.target.value)}
                      className="w-full rounded-xl border border-white/15 bg-black/60 pl-9 pr-3 py-2 text-xs text-white focus:border-[#FFBE32] focus:outline-none cursor-pointer"
                    >
                      <option value="< 1 Year (Rookie / Beginner)" className="bg-[#0A0A0B]">
                        &lt; 1 Year (Rookie / Beginner)
                      </option>
                      <option value="1-2 Years (Semi-Pro)" className="bg-[#0A0A0B]">
                        1-2 Years (Semi-Pro)
                      </option>
                      <option value="2-4 Years (Tier-2 Competitive)" className="bg-[#0A0A0B]">
                        2-4 Years (Tier-2 Competitive)
                      </option>
                      <option value="4+ Years (Tier-1 Veteran)" className="bg-[#0A0A0B]">
                        4+ Years (Tier-1 Veteran)
                      </option>
                    </select>
                  </div>
                </div>

                {/* Primary Game */}
                <div>
                  <label className="block text-xs font-heading uppercase tracking-wider text-gray-300 mb-1">
                    Primary Esports Title *
                  </label>
                  <div className="relative">
                    <Gamepad2 className="absolute left-3 top-2.5 h-4 w-4 text-[#FFBE32]" />
                    <select
                      value={regPrimaryGame}
                      onChange={(e) => setRegPrimaryGame(e.target.value)}
                      className="w-full rounded-xl border border-white/15 bg-black/60 pl-9 pr-3 py-2 text-xs text-white focus:border-[#FFBE32] focus:outline-none cursor-pointer"
                    >
                      <option value="FREE FIRE MAX" className="bg-[#0A0A0B]">FREE FIRE MAX</option>
                      <option value="FREE FIRE" className="bg-[#0A0A0B]">FREE FIRE</option>
                    </select>
                  </div>
                </div>

                {/* Playing Device */}
                <div>
                  <label className="block text-xs font-heading uppercase tracking-wider text-gray-300 mb-1">
                    Playing Device
                  </label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                    <select
                      value={regDevice}
                      onChange={(e) => setRegDevice(e.target.value)}
                      className="w-full rounded-xl border border-white/15 bg-black/60 pl-9 pr-3 py-2 text-xs text-white focus:border-[#FFBE32] focus:outline-none cursor-pointer"
                    >
                      <option value="Mobile (Android)" className="bg-[#0A0A0B]">Mobile (Android)</option>
                      <option value="Mobile (iOS / iPhone)" className="bg-[#0A0A0B]">Mobile (iOS / iPhone)</option>
                      <option value="iPad / Tablet" className="bg-[#0A0A0B]">iPad / Tablet</option>
                      <option value="PC / Desktop" className="bg-[#0A0A0B]">PC / Desktop</option>
                    </select>
                  </div>
                </div>

                {/* Discord Tag */}
                <div>
                  <label className="block text-xs font-heading uppercase tracking-wider text-gray-300 mb-1">
                    Discord Tag (Optional)
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                    <input
                      type="text"
                      value={regDiscord}
                      onChange={(e) => setRegDiscord(e.target.value)}
                      placeholder="e.g. shadow#1234 or @handle"
                      className="w-full rounded-xl border border-white/15 bg-black/60 pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:border-[#FFBE32] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <GoldButton type="submit" disabled={loading} className="w-full" size="md" showArrow={false}>
                  {loading ? "REGISTERING ATHLETE..." : "COMPLETE REGISTRATION"}
                </GoldButton>
              </div>

              <p className="text-center text-[11px] text-gray-400">
                Already have an athlete account?{" "}
                <button
                  type="button"
                  onClick={() => setActiveTab("login")}
                  className="text-[#FFBE32] hover:underline cursor-pointer font-bold"
                >
                  Sign in here
                </button>
              </p>
            </form>
          )}
        </div>
      )}
    </Modal>
  );
};
