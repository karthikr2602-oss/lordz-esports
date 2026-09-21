import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Trophy,
  Users,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  Shield,
  UserPlus,
  ExternalLink,
  CreditCard,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useModals } from "../context/useModals";
import { getMyTournaments, submitPayment } from "../api/tournaments";
import { ManageTeamModal } from "../components/modals/ManageTeamModal";

interface RegisteredTournamentItem {
  id: string;
  tournamentId: string;
  tournament: {
    id: string;
    title: string;
    slug: string;
    game: string;
    gameMode: string;
    entryFee: number;
    prizePool: number;
    startDate: string;
    startTime?: string;
    bannerUrl?: string;
    rosterLockDate?: string;
    contactInfo?: string;
    status: string;
  };
  teamId: string;
  team: {
    id: string;
    name: string;
    tag?: string;
    logoUrl?: string;
    members: Array<{
      id: string;
      userId: string;
      role: string;
      ign: string;
      gameUid?: string;
      user?: {
        id: string;
        username: string;
        ign?: string;
        gameUid?: string;
        avatarUrl?: string;
      };
    }>;
  };
  status: string;
  paymentStatus: string;
  createdAt: string;
  confirmedAt?: string;
  payment?: {
    id: string;
    amount: number;
    status: string;
    utr?: string;
    rejectionReason?: string;
  };
}

export const MyTournamentsPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { openLogin } = useModals();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [registrations, setRegistrations] = useState<RegisteredTournamentItem[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<{
    id: string;
    name: string;
    members: any[];
    rosterLockDate?: string;
    maxPlayers?: number;
  } | null>(null);

  // Re-submit payment modal state
  const [resubmitReg, setResubmitReg] = useState<RegisteredTournamentItem | null>(null);
  const [utrInput, setUtrInput] = useState("");
  const [submittingPayment, setSubmittingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const fetchRegistrations = async () => {
    try {
      setRefreshing(true);
      const res = await getMyTournaments();
      if (Array.isArray(res)) {
        setRegistrations(res);
      }
    } catch (err) {
      console.error("Failed to fetch user tournaments:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchRegistrations();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const handleResubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resubmitReg || !utrInput.trim()) return;

    setSubmittingPayment(true);
    setPaymentError("");
    try {
      const res = await submitPayment(resubmitReg.id, {
        utr: utrInput.trim(),
        amount: resubmitReg.tournament.entryFee,
      });

      if (res?.success) {
        setPaymentSuccess(true);
        setTimeout(() => {
          setResubmitReg(null);
          setPaymentSuccess(false);
          setUtrInput("");
          fetchRegistrations();
        }, 1500);
      } else {
        setPaymentError(res.message || "Failed to submit payment UTR.");
      }
    } catch (err: any) {
      setPaymentError(err.message || "Error submitting payment.");
    } finally {
      setSubmittingPayment(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#FFBE32]/10 border border-[#FFBE32]/30 flex items-center justify-center mb-6 text-[#FFBE32] shadow-[0_0_20px_rgba(255,190,50,0.2)]">
          <Trophy className="w-8 h-8" />
        </div>
        <h1 className="font-display text-3xl sm:text-4xl text-white uppercase tracking-wider mb-3">
          MY <span className="text-[#FFBE32]">TOURNAMENTS</span>
        </h1>
        <p className="text-gray-400 max-w-md mb-8 text-sm sm:text-base">
          Sign in with your Lord Athlete profile to view your registered tournaments, manage team rosters, track payment verifications, and view match schedules.
        </p>
        <button
          onClick={openLogin}
          className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#FFBE32] to-[#FFA000] text-black font-heading font-black tracking-widest text-sm uppercase shadow-[0_0_25px_rgba(255,190,50,0.35)] hover:scale-105 transition-all cursor-pointer"
        >
          LOGIN TO ATHLETE PASSPORT
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 sm:pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#FFBE32] uppercase tracking-widest mb-1.5">
            <Trophy className="w-4 h-4" />
            <span>PLAYER ATHLETE DASHBOARD</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white uppercase tracking-wider">
            MY <span className="text-[#FFBE32]">TOURNAMENTS</span>
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1 max-w-xl">
            Track squad rosters, entry confirmations, UPI payment verification status, and room credentials for all registered tournaments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchRegistrations}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white font-heading text-xs tracking-wider uppercase transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-[#FFBE32]" : ""}`} />
            <span>{refreshing ? "REFRESHING..." : "REFRESH STATUS"}</span>
          </button>
          <Link
            to="/tournaments"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFBE32] hover:bg-[#FFE082] text-black font-heading font-black text-xs tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(255,190,50,0.25)]"
          >
            <span>EXPLORE TOURNAMENTS</span>
          </Link>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-24 text-center">
          <div className="w-12 h-12 border-2 border-[#FFBE32] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-mono text-sm text-gray-400 uppercase tracking-widest">LOADING TOURNAMENT DATA...</p>
        </div>
      ) : registrations.length === 0 ? (
        <div className="py-20 text-center bg-[#0C0C0F]/60 border border-white/5 rounded-3xl mt-8 p-8">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 text-gray-500">
            <Trophy className="w-8 h-8" />
          </div>
          <h3 className="font-display text-xl text-white uppercase tracking-wider mb-2">
            NO REGISTERED TOURNAMENTS
          </h3>
          <p className="text-gray-400 text-sm max-w-md mx-auto mb-6">
            You haven't joined any tournaments yet. Join our elite weekly and monthly esports events to compete for real cash prizes.
          </p>
          <Link
            to="/tournaments"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FFBE32] text-black font-heading font-bold text-xs uppercase tracking-wider hover:bg-[#FFE082] transition-colors"
          >
            <span>BROWSE UPCOMING EVENTS</span>
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          {registrations.map((reg) => {
            const isConfirmed = reg.status === "CONFIRMED";
            const isPaymentUnderReview = reg.status === "PAYMENT_UNDER_REVIEW" || reg.paymentStatus === "UNDER_REVIEW";
            const isRejected = reg.status === "PAYMENT_FAILED" || reg.payment?.status === "REJECTED";
            const isPending = reg.status === "PENDING";

            // Determine if current logged-in user is Leader of this team
            const currentMember = reg.team?.members?.find((m) => m.userId === user?.id);
            const isLeader = currentMember?.role === "LEADER";

            // Roster lock check
            const isRosterLocked = reg.tournament.rosterLockDate
              ? new Date() > new Date(reg.tournament.rosterLockDate)
              : false;

            return (
              <motion.div
                key={reg.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-white/10 bg-[#0C0C0F]/90 backdrop-blur-xl overflow-hidden hover:border-[#FFBE32]/40 transition-all duration-300 shadow-xl"
              >
                {/* Status Bar */}
                <div
                  className={`px-5 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b ${
                    isConfirmed
                      ? "bg-[#22C55E]/10 border-[#22C55E]/30 text-[#22C55E]"
                      : isPaymentUnderReview
                      ? "bg-[#FFBE32]/10 border-[#FFBE32]/30 text-[#FFBE32]"
                      : isRejected
                      ? "bg-red-500/10 border-red-500/30 text-red-400"
                      : "bg-blue-500/10 border-blue-500/30 text-blue-400"
                  }`}
                >
                  <div className="flex items-center gap-2 font-heading font-bold text-xs uppercase tracking-wider">
                    {isConfirmed && <CheckCircle2 className="w-4 h-4 shrink-0" />}
                    {isPaymentUnderReview && <Clock className="w-4 h-4 shrink-0 animate-pulse" />}
                    {isRejected && <XCircle className="w-4 h-4 shrink-0" />}
                    {isPending && <AlertCircle className="w-4 h-4 shrink-0" />}

                    <span>
                      {isConfirmed && "SLOT CONFIRMED — REGISTRATION COMPLETE"}
                      {isPaymentUnderReview && "PAYMENT UNDER REVIEW — VERIFYING UTR"}
                      {isRejected && "PAYMENT REJECTED"}
                      {isPending && "REGISTRATION PENDING"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 font-mono text-[11px] text-gray-400">
                    <span>REG ID: #{reg.id.slice(0, 8).toUpperCase()}</span>
                    <span>•</span>
                    <span>{new Date(reg.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Card Main Body */}
                <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Tournament & Team Info */}
                  <div className="lg:col-span-8 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded bg-white/10 text-gray-300 font-mono text-[10px] uppercase font-bold">
                            {reg.tournament.game}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-[#FFBE32]/20 border border-[#FFBE32]/30 text-[#FFBE32] font-mono text-[10px] uppercase font-bold">
                            {reg.tournament.gameMode || "SQUAD"}
                          </span>
                        </div>
                        <h3 className="font-display text-2xl text-white uppercase tracking-wider">
                          {reg.tournament.title}
                        </h3>
                      </div>

                      <Link
                        to={`/tournaments/${reg.tournament.slug || reg.tournament.id}`}
                        className="inline-flex items-center gap-1.5 text-xs font-heading font-bold text-[#FFBE32] hover:text-[#FFE082] uppercase transition-colors shrink-0"
                      >
                        <span>TOURNAMENT DETAILS</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                    {/* Meta badges: Date, Fee, Prize */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div className="bg-black/40 rounded-xl p-3 border border-white/5">
                        <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-mono uppercase mb-1">
                          <Calendar className="w-3 h-3 text-[#FFBE32]" />
                          <span>START DATE</span>
                        </div>
                        <p className="font-heading font-bold text-xs text-white">
                          {new Date(reg.tournament.startDate).toLocaleDateString()} {reg.tournament.startTime || ""}
                        </p>
                      </div>

                      <div className="bg-black/40 rounded-xl p-3 border border-white/5">
                        <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-mono uppercase mb-1">
                          <CreditCard className="w-3 h-3 text-[#FFBE32]" />
                          <span>ENTRY FEE</span>
                        </div>
                        <p className="font-heading font-bold text-xs text-white">
                          {reg.tournament.entryFee > 0 ? `₹${reg.tournament.entryFee}` : "FREE ENTRY"}
                        </p>
                      </div>

                      <div className="bg-black/40 rounded-xl p-3 border border-white/5 col-span-2 sm:col-span-1">
                        <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-mono uppercase mb-1">
                          <Trophy className="w-3 h-3 text-[#FFBE32]" />
                          <span>PRIZE POOL</span>
                        </div>
                        <p className="font-heading font-bold text-xs text-[#FFBE32]">
                          ₹{reg.tournament.prizePool.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Team Roster Preview */}
                    <div className="bg-black/50 rounded-xl p-4 border border-white/10">
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-[#FFBE32]" />
                          <span className="font-heading font-bold text-xs text-white uppercase tracking-wider">
                            SQUAD: <span className="text-[#FFBE32]">{reg.team?.name || "UNNAMED"}</span>
                          </span>
                          {reg.team?.tag && (
                            <span className="text-[10px] font-mono text-gray-400">[{reg.team.tag}]</span>
                          )}
                        </div>

                        {/* Manage Roster Action for Leader */}
                        {isLeader && (
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedTeam({
                                id: reg.team.id,
                                name: reg.team.name,
                                members: reg.team.members || [],
                                rosterLockDate: reg.tournament.rosterLockDate,
                                maxPlayers: 6,
                              })
                            }
                            className="text-[11px] font-heading font-bold text-[#FFBE32] hover:text-[#FFE082] uppercase flex items-center gap-1 cursor-pointer transition-colors bg-[#FFBE32]/10 px-2.5 py-1 rounded-lg border border-[#FFBE32]/30"
                          >
                            <UserPlus className="w-3 h-3" />
                            <span>{isRosterLocked ? "VIEW ROSTER" : "MANAGE ROSTER"}</span>
                          </button>
                        )}
                      </div>

                      {/* Members list */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {reg.team?.members?.map((m) => (
                          <div
                            key={m.id}
                            className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="w-7 h-7 rounded-md bg-[#FFBE32]/10 border border-[#FFBE32]/20 flex items-center justify-center font-display text-xs text-[#FFBE32] shrink-0">
                                {m.ign.slice(0, 2).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <p className="font-heading font-bold text-xs text-white truncate">{m.ign}</p>
                                {m.gameUid && (
                                  <p className="font-mono text-[9px] text-gray-400 truncate">UID: {m.gameUid}</p>
                                )}
                              </div>
                            </div>
                            <span
                              className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded ${
                                m.role === "LEADER"
                                  ? "bg-[#FFBE32]/20 text-[#FFBE32] border border-[#FFBE32]/30 font-bold"
                                  : "bg-white/10 text-gray-400"
                              }`}
                            >
                              {m.role}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Rejection Notice if applicable */}
                    {isRejected && (
                      <div className="p-3.5 rounded-xl bg-red-950/30 border border-red-500/40 text-red-300 text-xs">
                        <div className="flex items-center gap-2 font-bold mb-1 text-red-200">
                          <AlertCircle className="w-4 h-4 text-red-400" />
                          <span>PAYMENT REJECTION REASON:</span>
                        </div>
                        <p className="font-mono text-[11px] mb-3">
                          {reg.payment?.rejectionReason || "UTR was invalid or payment could not be reconciled."}
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setResubmitReg(reg);
                            setUtrInput(reg.payment?.utr || "");
                          }}
                          className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-heading font-bold text-xs uppercase tracking-wider cursor-pointer"
                        >
                          RESUBMIT VALID UTR / PAYMENT
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Room info & Status Callouts */}
                  <div className="lg:col-span-4 bg-black/60 rounded-2xl p-5 border border-white/10 space-y-4">
                    <h4 className="font-display text-base text-white uppercase tracking-wider flex items-center gap-2">
                      <Shield className="w-4 h-4 text-[#FFBE32]" />
                      <span>MATCH ACCESS</span>
                    </h4>

                    {isConfirmed ? (
                      <div className="space-y-3">
                        <div className="p-3 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/20 text-xs text-[#22C55E] space-y-1">
                          <p className="font-bold uppercase tracking-wider flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" /> SLOT CONFIRMED
                          </p>
                          <p className="text-gray-300 text-[11px]">
                            Your slot is locked in. Custom room ID and password will be displayed here and sent via Discord 15 minutes before match start.
                          </p>
                        </div>

                        <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                          <p className="text-[10px] font-mono text-gray-400 uppercase mb-1">CUSTOM ROOM CREDENTIALS</p>
                          <p className="font-mono font-bold text-xs text-[#FFBE32] tracking-widest">
                            REVEALING AT MATCH TIME
                          </p>
                        </div>
                      </div>
                    ) : isPaymentUnderReview ? (
                      <div className="p-3 rounded-xl bg-[#FFBE32]/10 border border-[#FFBE32]/20 text-xs text-[#FFBE32] space-y-2">
                        <p className="font-bold uppercase tracking-wider flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 animate-spin" /> VERIFICATION IN PROGRESS
                        </p>
                        <p className="text-gray-300 text-[11px]">
                          UTR submitted: <span className="font-mono text-white font-bold">{reg.payment?.utr || "Submitted"}</span>. Our admins verify manual UPI payments within 15-30 minutes.
                        </p>
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-400 space-y-2">
                        <p className="font-bold text-white uppercase tracking-wider">PENDING VERIFICATION</p>
                        <p className="text-[11px]">
                          Complete payment submission to secure your spot before slots run out.
                        </p>
                      </div>
                    )}

                    {/* Support Discord / Contact */}
                    {reg.tournament.contactInfo && (
                      <div className="pt-2 border-t border-white/10">
                        <p className="text-[10px] font-mono text-gray-400 uppercase mb-1">COORDINATION</p>
                        <p className="text-xs text-gray-300 font-mono break-all">{reg.tournament.contactInfo}</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Roster Management Modal */}
      {selectedTeam && (
        <ManageTeamModal
          isOpen={true}
          onClose={() => {
            setSelectedTeam(null);
            fetchRegistrations();
          }}
          teamId={selectedTeam.id}
          teamName={selectedTeam.name}
          initialMembers={selectedTeam.members}
          rosterLockDate={selectedTeam.rosterLockDate}
          maxPlayers={selectedTeam.maxPlayers || 6}
          onTeamUpdated={() => fetchRegistrations()}
        />
      )}

      {/* Resubmit Payment Modal */}
      {resubmitReg && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#0C0C0F] border border-white/10 rounded-2xl p-6 shadow-2xl">
            <h3 className="font-display text-xl text-white uppercase tracking-wider mb-2">
              RESUBMIT UPI PAYMENT
            </h3>
            <p className="text-xs text-gray-400 mb-4">
              Enter the 12-digit UPI Reference / UTR number for your transaction of{" "}
              <span className="text-[#FFBE32] font-bold">₹{resubmitReg.tournament.entryFee}</span>.
            </p>

            {paymentError && (
              <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-500/40 text-red-300 text-xs mb-4">
                {paymentError}
              </div>
            )}

            {paymentSuccess && (
              <div className="p-2.5 rounded-lg bg-green-950/40 border border-green-500/40 text-green-300 text-xs mb-4">
                UTR resubmitted successfully! Reviewing...
              </div>
            )}

            <form onSubmit={handleResubmitPayment} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase text-gray-300 mb-1">
                  12-DIGIT UPI REFERENCE / UTR *
                </label>
                <input
                  type="text"
                  required
                  value={utrInput}
                  onChange={(e) => setUtrInput(e.target.value)}
                  placeholder="e.g. 428190348291"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/20 text-white font-mono text-sm focus:border-[#FFBE32] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setResubmitReg(null)}
                  className="px-4 py-2 rounded-xl text-gray-400 hover:text-white text-xs font-heading font-bold uppercase cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={submittingPayment || !utrInput.trim()}
                  className="px-5 py-2.5 rounded-xl bg-[#FFBE32] hover:bg-[#FFE082] text-black text-xs font-heading font-black uppercase cursor-pointer disabled:opacity-50"
                >
                  {submittingPayment ? "SUBMITTING..." : "SUBMIT UTR"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
