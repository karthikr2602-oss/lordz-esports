import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageHero } from "../components/common/PageHero";
import { votingApi, type PublicVotingEvent } from "../api/voting";
import { useAuth } from "../context/AuthContext";
import { useModals } from "../context/useModals";
import {
  Vote,
  Trophy,
  Shield,
  Zap,
  Crosshair,
  Target,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Loader2,
  Lock,
  Sparkles,
} from "lucide-react";

export const VotingPage = () => {
  const { user, isAuthenticated } = useAuth();
  const { openLogin } = useModals();

  const [event, setEvent] = useState<PublicVotingEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedNomineeId, setSelectedNomineeId] = useState<string | null>(null);

  // Voting action states
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Load Active Event
  const loadActiveEvent = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const data = await votingApi.getActive();
      setEvent(data);
      if (data?.userVotingStatus?.votedNomineeId) {
        setSelectedNomineeId(data.userVotingStatus.votedNomineeId);
      }
    } catch {
      setEvent(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "LORD ESPORTS — Community Player Voting";
    loadActiveEvent();
  }, [isAuthenticated, user?.id]);

  // Real-time Countdown Timer derived from server end date
  useEffect(() => {
    if (!event?.endDate) return;

    const calculateTime = () => {
      const diff = new Date(event.endDate).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [event?.endDate]);

  // Selected Nominee Object
  const selectedNominee = useMemo(() => {
    if (!event || !selectedNomineeId) return null;
    return event.nominees.find((n) => n.id === selectedNomineeId) || null;
  }, [event, selectedNomineeId]);

  // User voting status
  const hasVoted = Boolean(event?.userVotingStatus?.hasVoted);
  const votedNominee = useMemo(() => {
    if (!event || !event.userVotingStatus?.votedNomineeId) return null;
    return event.nominees.find((n) => n.id === event.userVotingStatus?.votedNomineeId) || null;
  }, [event]);

  // Submit Vote Handler
  const handleCastVote = async () => {
    if (!event || !selectedNomineeId) return;

    if (!isAuthenticated) {
      openLogin();
      return;
    }

    if (hasVoted) return;

    setSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await votingApi.castVote(event.id, selectedNomineeId);
      setSuccessMessage(`BOOYAH! Your vote has been officially registered for ${res.playerIgn}!`);

      // Refresh event to reflect updated vote counts and verified user state
      await loadActiveEvent();
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to submit vote. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "IGL":
        return <Shield className="h-4 w-4 text-[#FFBE32]" />;
      case "RUSHER":
        return <Zap className="h-4 w-4 text-[#FFBE32]" />;
      case "SNIPER":
        return <Crosshair className="h-4 w-4 text-[#FFBE32]" />;
      default:
        return <Target className="h-4 w-4 text-[#FFBE32]" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#FFBE32] selection:text-black">
      {/* Hero Section */}
      <PageHero
        badge="LORD COMMUNITY"
        title="VOTE FOR YOUR"
        titleHighlight="CHAMPION"
        subtitle="Your voice. Your choice. Recognize the players who represent the LORD legacy."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-28">
            <Loader2 className="h-10 w-10 text-[#FFBE32] animate-spin mb-4" />
            <span className="text-xs font-mono uppercase tracking-widest text-gray-400">
              Loading active community poll...
            </span>
          </div>
        ) : !event ? (
          /* NO ACTIVE VOTING EVENTS (EMPTY STATE) */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 px-4 text-center max-w-xl mx-auto rounded-3xl bg-gradient-to-b from-[#111116] via-[#0B0B0E] to-[#070709] border border-white/10 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
          >
            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-2xl bg-[#FFBE32]/10 border border-[#FFBE32]/30 flex items-center justify-center text-[#FFBE32] shadow-[0_0_30px_rgba(255,190,50,0.2)]">
                <Trophy className="h-10 w-10" />
              </div>
              <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-[#050505] border border-white/10">
                <Clock className="h-4 w-4 text-gray-400" />
              </div>
            </div>

            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#FFBE32] mb-2 block">
              COMMUNITY POLLS
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white uppercase tracking-wider mb-3">
              NO ACTIVE VOTING EVENTS
            </h2>
            <p className="text-sm text-gray-400 font-body leading-relaxed max-w-md mb-8">
              Stay tuned for the next LORD community vote. Official tournament MVP awards, player of the month, and hall of glory nominations will open soon.
            </p>

            <a
              href="/players"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-[#FFBE32] text-gray-300 hover:text-black font-heading font-black text-xs uppercase tracking-wider border border-white/10 hover:border-[#FFBE32] transition-all cursor-pointer"
            >
              Explore Pro Roster Athletes →
            </a>
          </motion.div>
        ) : (
          /* ACTIVE VOTING EVENT CONTENT */
          <div className="space-y-12">
            {/* Event Header Banner Card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative rounded-3xl bg-gradient-to-r from-[#14141A] via-[#0E0E12] to-[#0A0A0E] border border-[#FFBE32]/30 p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(255,190,50,0.1)] overflow-hidden"
            >
              {/* Subtle top gold neon glow line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FFBE32] to-transparent" />

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                {/* Left: Event Details */}
                <div className="max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2.5 mb-3">
                    {event.isActive ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-heading font-black bg-emerald-500/15 text-emerald-400 border border-emerald-500/35 uppercase tracking-wider">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                        LIVE POLL OPEN
                      </span>
                    ) : event.isExpired ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-heading font-black bg-rose-500/15 text-rose-400 border border-rose-500/35 uppercase tracking-wider">
                        <CheckCircle2 className="h-3 w-3" />
                        VOTING CONCLUDED
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-heading font-black bg-amber-500/15 text-amber-400 border border-amber-500/35 uppercase tracking-wider">
                        <Clock className="h-3 w-3" />
                        UPCOMING POLL
                      </span>
                    )}

                    <span className="text-xs font-mono text-gray-400 uppercase tracking-widest px-2 py-0.5 rounded bg-black/40 border border-white/5">
                      {event.nominees.length} ATHLETES NOMINATED
                    </span>
                  </div>

                  <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-white uppercase tracking-wider mb-2">
                    {event.title}
                  </h2>

                  {event.description && (
                    <p className="text-sm sm:text-base text-gray-300 font-body leading-relaxed max-w-xl">
                      {event.description}
                    </p>
                  )}
                </div>

                {/* Right: Real-time Countdown Timer */}
                {event.isActive && (
                  <div className="bg-black/60 rounded-2xl border border-white/10 p-4 sm:p-5 backdrop-blur-md shrink-0">
                    <span className="text-[10px] font-mono text-[#FFBE32] uppercase tracking-[0.2em] block mb-2 text-center">
                      POLL CLOSES IN
                    </span>
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div className="bg-[#141419] px-2.5 py-2 rounded-xl border border-white/5">
                        <span className="font-display font-black text-xl sm:text-2xl text-white block">
                          {timeLeft.days.toString().padStart(2, "0")}
                        </span>
                        <span className="text-[9px] font-mono text-gray-400 uppercase">DAYS</span>
                      </div>
                      <div className="bg-[#141419] px-2.5 py-2 rounded-xl border border-white/5">
                        <span className="font-display font-black text-xl sm:text-2xl text-white block">
                          {timeLeft.hours.toString().padStart(2, "0")}
                        </span>
                        <span className="text-[9px] font-mono text-gray-400 uppercase">HOURS</span>
                      </div>
                      <div className="bg-[#141419] px-2.5 py-2 rounded-xl border border-white/5">
                        <span className="font-display font-black text-xl sm:text-2xl text-white block">
                          {timeLeft.minutes.toString().padStart(2, "0")}
                        </span>
                        <span className="text-[9px] font-mono text-gray-400 uppercase">MINS</span>
                      </div>
                      <div className="bg-[#141419] px-2.5 py-2 rounded-xl border border-white/5">
                        <span className="font-display font-black text-xl sm:text-2xl text-[#FFBE32] block">
                          {timeLeft.seconds.toString().padStart(2, "0")}
                        </span>
                        <span className="text-[9px] font-mono text-gray-400 uppercase">SECS</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Notification Banners */}
            <AnimatePresence>
              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-sm font-body shadow-[0_0_30px_rgba(16,185,129,0.2)]"
                >
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
                  <span className="font-semibold">{successMessage}</span>
                </motion.div>
              )}

              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-sm font-body shadow-[0_0_30px_rgba(244,63,94,0.2)]"
                >
                  <AlertTriangle className="h-5 w-5 shrink-0 text-rose-400" />
                  <span>{errorMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Verified Voted Confirmation State */}
            {hasVoted && votedNominee && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#FFBE32]/15 via-[#131317] to-[#0A0A0D] border border-[#FFBE32]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_0_35px_rgba(255,190,50,0.15)]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#FFBE32] text-black flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(255,190,50,0.4)]">
                    <CheckCircle2 className="h-7 w-7 stroke-[2.5]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono uppercase tracking-widest text-[#FFBE32]">
                        OFFICIALLY RECORDED
                      </span>
                      <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-heading font-black uppercase">
                        VERIFIED VOTE
                      </span>
                    </div>
                    <h3 className="font-display font-black text-lg sm:text-xl text-white uppercase tracking-wider">
                      You voted for {votedNominee.name || votedNominee.player?.ign}
                    </h3>
                    <p className="text-xs text-gray-400 font-body">
                      One verified vote per athlete account is strictly enforced. Thank you for making your voice heard!
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <span className="text-[11px] font-mono text-gray-400 uppercase tracking-widest block">
                    Athlete Choice
                  </span>
                  <span className="font-heading font-black text-sm text-[#FFBE32] uppercase">
                    {votedNominee.team || votedNominee.name || votedNominee.player?.realName}
                  </span>
                </div>
              </motion.div>
            )}

            {/* Section Heading */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#FFBE32] block">
                  CANDIDATE ROSTER
                </span>
                <h3 className="font-display font-black text-xl sm:text-2xl text-white uppercase tracking-wider">
                  Select Your Nominee
                </h3>
              </div>
              <span className="text-xs font-mono text-gray-400">
                Click a card to choose your athlete
              </span>
            </div>

            {/* Nominated Player Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {event.nominees.map((nominee, index) => {
                const isSelected = selectedNomineeId === nominee.id;
                const isUserVotedThis = event.userVotingStatus?.votedNomineeId === nominee.id;
                const candidateName = nominee.name || nominee.player?.ign || "Candidate";
                const candidateRole = nominee.role || nominee.player?.role || "ATHLETE";
                const candidateTeam = nominee.team || nominee.player?.team || "LORD ESPORTS";
                const candidateBio = nominee.bio || nominee.player?.featuredQuote || nominee.player?.about || "";
                const imgUrl =
                  nominee.imageUrl ||
                  nominee.player?.avatarUrl ||
                  nominee.player?.image ||
                  "/players/player-beast.jpg";

                return (
                  <motion.div
                    key={nominee.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.08 }}
                    whileHover={!hasVoted && event.isActive ? { y: -6 } : {}}
                    onClick={() => {
                      if (!hasVoted && event.isActive) {
                        setSelectedNomineeId(nominee.id);
                        setErrorMessage(null);
                      }
                    }}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        if (!hasVoted && event.isActive) {
                          setSelectedNomineeId(nominee.id);
                          setErrorMessage(null);
                        }
                      }
                    }}
                    className={`group relative flex flex-col justify-between rounded-2xl transition-all duration-300 p-4 sm:p-5 overflow-hidden cursor-pointer outline-none ${
                      isSelected
                        ? "bg-gradient-to-b from-[#181822] via-[#0E0E14] to-[#07070A] border-2 border-[#FFBE32] shadow-[0_0_35px_rgba(255,190,50,0.35)]"
                        : "bg-gradient-to-b from-[#141418] via-[#0C0C0E] to-[#070709] border border-white/10 hover:border-white/30 shadow-[0_15px_40px_rgba(0,0,0,0.8)]"
                    }`}
                  >
                    {/* Top Gold Accent Strip */}
                    <div
                      className={`absolute top-0 left-0 right-0 h-1 transition-opacity ${
                        isSelected
                          ? "bg-[#FFBE32] opacity-100 shadow-[0_0_12px_rgba(255,190,50,0.8)]"
                          : "bg-gradient-to-r from-transparent via-[#FFBE32] to-transparent opacity-0 group-hover:opacity-60"
                      }`}
                    />

                    <div>
                      {/* Card Header: Role & Radio Selector */}
                      <div className="flex items-center justify-between mb-3 z-10">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/70 border border-white/10 text-[10px] font-heading font-bold uppercase tracking-wider text-gray-300">
                          {getRoleIcon(candidateRole)}
                          <span>{candidateRole}</span>
                        </div>

                        {/* Radio Checkmark Circle */}
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center transition-all border ${
                            isSelected
                              ? "bg-[#FFBE32] border-[#FFBE32] text-black shadow-[0_0_12px_rgba(255,190,50,0.5)]"
                              : "border-white/20 bg-black/50 text-transparent"
                          }`}
                        >
                          <CheckCircle2 className="h-4 w-4 stroke-[3]" />
                        </div>
                      </div>

                      {/* Athlete Portrait Visual */}
                      <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-black/70 border border-white/5 mb-4 group-hover:border-[#FFBE32]/40 transition-all shadow-inner">
                        <img
                          src={imgUrl}
                          alt={`${candidateName} - Nominee`}
                          className="h-full w-full object-cover object-top filter contrast-105 group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0E] via-black/25 to-transparent opacity-90" />

                        {/* Selected or Voted Label */}
                        {isUserVotedThis ? (
                          <div className="absolute bottom-2.5 left-3 right-3 bg-emerald-500 text-black font-heading font-black text-[10px] uppercase tracking-wider py-1 rounded-md text-center shadow-lg">
                            YOUR CHOICE
                          </div>
                        ) : isSelected ? (
                          <div className="absolute bottom-2.5 left-3 right-3 bg-[#FFBE32] text-black font-heading font-black text-[10px] uppercase tracking-wider py-1 rounded-md text-center shadow-lg">
                            SELECTED
                          </div>
                        ) : null}
                      </div>

                      {/* Player Identity */}
                      <div className="space-y-1">
                        <div className="flex items-baseline justify-between gap-2">
                          <h4 className="font-display font-black text-xl text-white uppercase tracking-wider group-hover:text-[#FFBE32] transition-colors">
                            {candidateName}
                          </h4>
                          <span className="text-[10px] font-mono text-[#FFBE32] uppercase">
                            {candidateTeam}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 font-body">{candidateRole}</p>
                      </div>

                      {/* Player Quote / Bio */}
                      {candidateBio && (
                        <p className="mt-3 text-[11px] text-gray-400 font-body line-clamp-2 leading-relaxed italic border-l border-[#FFBE32]/40 pl-2">
                          "{candidateBio}"
                        </p>
                      )}
                    </div>

                    {/* Live Results Bar (if enabled) */}
                    {nominee.percentage !== undefined && (
                      <div className="mt-4 pt-3 border-t border-white/10 space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <span className="text-gray-400">VOTE SHARE</span>
                          <span className="font-bold text-[#FFBE32]">{nominee.percentage}%</span>
                        </div>
                        <div className="w-full bg-black/60 rounded-full h-2 overflow-hidden border border-white/5">
                          <div
                            className="bg-gradient-to-r from-[#FFBE32] to-[#FFA000] h-full rounded-full transition-all duration-700"
                            style={{ width: `${nominee.percentage}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* FLOATING / STICKY VOTE ACTION HUD DOCK */}
            <div className="sticky bottom-6 z-40">
              <div className="max-w-4xl mx-auto p-4 sm:p-5 rounded-2xl bg-[#0B0B0F]/95 backdrop-blur-2xl border border-[#FFBE32]/40 shadow-[0_20px_50px_rgba(0,0,0,0.95),0_0_30px_rgba(255,190,50,0.15)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Selected Athlete Preview */}
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-black border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                    {selectedNominee ? (
                      <img
                        src={
                          selectedNominee.imageUrl ||
                          selectedNominee.player?.avatarUrl ||
                          selectedNominee.player?.image ||
                          "/players/player-beast.jpg"
                        }
                        alt={selectedNominee.name || selectedNominee.player?.ign || "Candidate"}
                        className="h-full w-full object-cover object-top"
                      />
                    ) : (
                      <Vote className="h-6 w-6 text-[#FFBE32]" />
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400 block">
                      CURRENT SELECTION
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-display font-black text-lg text-white uppercase tracking-wider">
                        {selectedNominee
                          ? selectedNominee.name || selectedNominee.player?.ign
                          : "NO ATHLETE SELECTED"}
                      </span>
                      {selectedNominee && (
                        <span className="text-xs font-mono text-[#FFBE32]">
                          ({selectedNominee.role || selectedNominee.player?.role || "ATHLETE"})
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Action Button */}
                <div className="flex items-center gap-3">
                  {!isAuthenticated ? (
                    <button
                      type="button"
                      onClick={openLogin}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#FFBE32] to-[#FFA000] text-black font-heading font-black text-xs uppercase tracking-wider hover:shadow-[0_0_25px_rgba(255,190,50,0.4)] transition-all cursor-pointer"
                    >
                      <Lock className="h-4 w-4" />
                      LOGIN TO VOTE
                    </button>
                  ) : hasVoted ? (
                    <button
                      type="button"
                      disabled
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 text-gray-400 font-heading font-bold text-xs uppercase tracking-wider cursor-not-allowed border border-white/10"
                    >
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      ALREADY VOTED
                    </button>
                  ) : !event.isActive ? (
                    <button
                      type="button"
                      disabled
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 text-gray-400 font-heading font-bold text-xs uppercase tracking-wider cursor-not-allowed"
                    >
                      POLL CONCLUDED
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleCastVote}
                      disabled={!selectedNomineeId || submitting}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-[#FFBE32] via-[#FFD54F] to-[#FFA000] text-black font-heading font-black text-xs uppercase tracking-wider hover:shadow-[0_0_30px_rgba(255,190,50,0.5)] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          RECORDING VOTE...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 fill-black" />
                          CONFIRM & CAST VOTE
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
