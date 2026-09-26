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
  Truck,
  Copy,
  Loader2,
  PackageCheck,
} from "lucide-react";
import logoImg from "../../assets/lordz-logo.png";
import { useAuth } from "../../context/AuthContext";
import { authApi } from "../../api/auth";
import { merchandiseApi, type OrderItem } from "../../api/merchandise";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { user, isAuthenticated, login, loginWithGoogle, register, logout, updateUser } = useAuth();

  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Editable Gaming Experience Tier state
  const [isEditingTier, setIsEditingTier] = useState(false);
  const [selectedTier, setSelectedTier] = useState(user?.gamingExperience || "1-2 Years (Semi-Pro)");
  const [isSavingTier, setIsSavingTier] = useState(false);
  const [tierUpdateFeedback, setTierUpdateFeedback] = useState<string | null>(null);

  // Athlete Sub-tabs: Passport vs Orders
  const [athleteTab, setAthleteTab] = useState<"passport" | "orders">("passport");
  const [userOrders, setUserOrders] = useState<OrderItem[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [copiedOrderTracking, setCopiedOrderTracking] = useState<string | null>(null);

  const loadUserOrders = async () => {
    if (!isAuthenticated) return;
    setLoadingOrders(true);
    try {
      const data = await merchandiseApi.getMyOrders();
      setUserOrders(data || []);
    } catch {
      setUserOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadUserOrders();
    }
  }, [isOpen, isAuthenticated]);

  const handleCopyTracking = (trackNum: string, id: string) => {
    navigator.clipboard.writeText(trackNum);
    setCopiedOrderTracking(id);
    setTimeout(() => setCopiedOrderTracking(null), 2000);
  };

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

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setGoogleLoading(true);

    try {
      // Prompt user for Google account email
      const googleEmail = window.prompt("Enter your Google Account email to sign in:", "athlete@gmail.com");
      if (!googleEmail || !googleEmail.trim()) {
        setGoogleLoading(false);
        return;
      }

      const emailTrimmed = googleEmail.trim().toLowerCase();
      const defaultName = emailTrimmed.split("@")[0].replace(/[^a-zA-Z0-9]/g, " ").toUpperCase();

      const signedInUser = await loginWithGoogle({
        email: emailTrimmed,
        name: defaultName,
        picture: `https://api.dicebear.com/7.x/bottts/svg?seed=${emailTrimmed}`,
      });

      setSuccessMessage(`Welcome ${signedInUser.fullName || signedInUser.ign || "Athlete"}! Signed in with Google.`);
      setTimeout(() => {
        handleClose();
      }, 1200);
    } catch (err: any) {
      setErrorMessage(err.message || "Google Sign-In failed. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
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
      setSuccessMessage("Account created successfully! Welcome to Lord Esports.");
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
          </div>

          {/* Sub-Tabs: Passport Credentials vs Merchandise Orders */}
          <div className="flex items-center gap-2 p-1 rounded-xl bg-black/60 border border-white/10">
            <button
              type="button"
              onClick={() => setAthleteTab("passport")}
              className={`flex-1 py-2 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
                athleteTab === "passport"
                  ? "bg-[#FFBE32] text-black shadow-[0_0_10px_rgba(255,190,50,0.3)]"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Athlete Credentials</span>
            </button>
            <button
              type="button"
              onClick={() => setAthleteTab("orders")}
              className={`flex-1 py-2 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
                athleteTab === "orders"
                  ? "bg-[#FFBE32] text-black shadow-[0_0_10px_rgba(255,190,50,0.3)]"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Truck className="h-3.5 w-3.5" />
              <span>My Orders ({userOrders.length})</span>
            </button>
          </div>

          {/* TAB CONTENT: ATHLETE CREDENTIALS */}
          {athleteTab === "passport" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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
          )}

          {/* TAB CONTENT: MERCHANDISE ORDER HISTORY */}
          {athleteTab === "orders" && (
            <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
              {loadingOrders ? (
                <div className="py-12 text-center text-gray-400 font-mono text-xs flex flex-col items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin text-[#FFBE32]" />
                  <span>Loading your orders from database...</span>
                </div>
              ) : userOrders.length === 0 ? (
                <div className="py-10 text-center text-gray-400 font-mono text-xs bg-black/40 rounded-xl border border-white/5 space-y-2">
                  <PackageCheck className="h-8 w-8 text-gray-500 mx-auto" />
                  <p className="text-white font-heading font-bold text-sm">No Merchandise Orders</p>
                  <p>No clan armory orders placed under this athlete account yet.</p>
                  <a
                    href="/products"
                    onClick={handleClose}
                    className="inline-block mt-2 px-4 py-1.5 rounded-lg bg-[#FFBE32] text-black font-heading text-xs font-bold uppercase"
                  >
                    View Official Clan Store
                  </a>
                </div>
              ) : (
                <div className="space-y-3">
                  {userOrders.map((ord) => {
                    const isShipped = ord.orderStatus === "SHIPPED" || ord.orderStatus === "DELIVERED";
                    const isDelivered = ord.orderStatus === "DELIVERED";
                    const isProcessing = ord.orderStatus === "PROCESSING" || isShipped;

                    return (
                      <div
                        key={ord.id}
                        className="p-4 rounded-xl bg-black/60 border border-white/10 hover:border-[#FFBE32]/40 transition-all space-y-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-[#FFBE32]">
                              {ord.orderNumber}
                            </span>
                            <span className="text-[11px] font-mono text-gray-400">
                              {new Date(ord.createdAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-heading font-bold uppercase tracking-wider ${
                              ord.orderStatus === "DELIVERED"
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                                : ord.orderStatus === "SHIPPED"
                                ? "bg-blue-500/20 text-blue-400 border border-blue-500/40"
                                : ord.orderStatus === "PROCESSING"
                                ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                                : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                            }`}
                          >
                            {ord.orderStatus}
                          </span>
                        </div>

                        {/* Visual 4-Stage Mini Progress */}
                        <div className="grid grid-cols-4 gap-1 text-center font-mono text-[9px] py-1">
                          <div>
                            <div className="w-5 h-5 rounded-full mx-auto mb-1 flex items-center justify-center font-bold bg-[#FFBE32] text-black">
                              ✓
                            </div>
                            <span className="text-white">Placed</span>
                          </div>
                          <div>
                            <div
                              className={`w-5 h-5 rounded-full mx-auto mb-1 flex items-center justify-center font-bold ${
                                isProcessing ? "bg-[#FFBE32] text-black" : "bg-white/10 text-gray-400"
                              }`}
                            >
                              {isProcessing ? "✓" : "2"}
                            </div>
                            <span className={isProcessing ? "text-white" : "text-gray-500"}>Customizing</span>
                          </div>
                          <div>
                            <div
                              className={`w-5 h-5 rounded-full mx-auto mb-1 flex items-center justify-center font-bold ${
                                isShipped ? "bg-blue-500 text-white" : "bg-white/10 text-gray-400"
                              }`}
                            >
                              {isShipped ? "✓" : "3"}
                            </div>
                            <span className={isShipped ? "text-blue-400" : "text-gray-500"}>Shipped</span>
                          </div>
                          <div>
                            <div
                              className={`w-5 h-5 rounded-full mx-auto mb-1 flex items-center justify-center font-bold ${
                                isDelivered ? "bg-emerald-500 text-black" : "bg-white/10 text-gray-400"
                              }`}
                            >
                              {isDelivered ? "✓" : "4"}
                            </div>
                            <span className={isDelivered ? "text-emerald-400" : "text-gray-500"}>Delivered</span>
                          </div>
                        </div>

                        {/* Item Details */}
                        <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 flex flex-wrap items-center justify-between text-xs font-mono">
                          <div>
                            <span className="text-white font-bold">{ord.productName}</span>
                            <span className="text-gray-400 ml-2">Size: {ord.size}</span>
                            {ord.customIgn && (
                              <span className="text-[#FFBE32] ml-2">
                                (IGN: {ord.customIgn} #{ord.customNumber || "00"})
                              </span>
                            )}
                          </div>
                          <span className="text-[#FFBE32] font-bold">₹{ord.totalAmount}</span>
                        </div>

                        {/* Courier / Delivery Info */}
                        {(ord.courierPartner || ord.expectedDeliveryDate) && (
                          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-gray-300">
                            {ord.courierPartner && (
                              <span className="flex items-center gap-1.5">
                                <span>Courier: <strong className="text-white">{ord.courierPartner}</strong></span>
                                {ord.trackingNumber && (
                                  <span className="text-gray-400">
                                    (AWB: {ord.trackingNumber})
                                    <button
                                      type="button"
                                      onClick={() => handleCopyTracking(ord.trackingNumber!, ord.id)}
                                      className="ml-1 text-gray-400 hover:text-white"
                                      title="Copy AWB"
                                    >
                                      {copiedOrderTracking === ord.id ? (
                                        <Check className="inline h-2.5 w-2.5 text-emerald-400" />
                                      ) : (
                                        <Copy className="inline h-2.5 w-2.5" />
                                      )}
                                    </button>
                                  </span>
                                )}
                              </span>
                            )}
                            {ord.expectedDeliveryDate && (
                              <span className="text-[#FFBE32]">
                                Expected: {ord.expectedDeliveryDate}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

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
              alt="Lord Esports"
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
            <div className="space-y-4">
              {/* Google Sign In Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading || googleLoading}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-white/20 bg-white hover:bg-gray-100 text-gray-900 font-heading font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-[0_2px_12px_rgba(255,255,255,0.15)] disabled:opacity-60"
              >
                {googleLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-gray-700" />
                ) : (
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
                )}
                <span>{googleLoading ? "Connecting Google..." : "Sign In with Google"}</span>
              </button>

              <div className="relative flex items-center justify-center my-1">
                <div className="border-t border-white/10 w-full" />
                <span className="bg-[#0b0b0e] px-3 text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                  OR USE CLAN CREDENTIALS
                </span>
              </div>

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
            </div>
          )}

          {/* TAB 2: REGISTRATION FORM */}
          {activeTab === "register" && (
            <div className="space-y-4">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading || googleLoading}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-white/20 bg-white hover:bg-gray-100 text-gray-900 font-heading font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-[0_2px_12px_rgba(255,255,255,0.15)] disabled:opacity-60"
              >
                {googleLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-gray-700" />
                ) : (
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
                )}
                <span>{googleLoading ? "Connecting Google..." : "Fast Register with Google"}</span>
              </button>

              <div className="relative flex items-center justify-center my-1">
                <div className="border-t border-white/10 w-full" />
                <span className="bg-[#0b0b0e] px-3 text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                  OR ENTER ATHLETE DETAILS
                </span>
              </div>

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
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};
