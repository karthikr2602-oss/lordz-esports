import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { tournamentsApi } from "../api/tournaments";
import {
  type Tournament,
  type TournamentStage,
  type RegistrationItem,
  type LeaderboardEntry,
  tournamentsData,
} from "../data/tournaments";
import {
  Shield,
  Users,
  ArrowLeft,
  CheckCircle2,
  Eye,
  Plus,
  Save,
  Trash2,
  RefreshCw,
  ExternalLink,
  Search,
  Upload,
  ArrowRight,
  Layers,
  Award,
  CreditCard,
  Settings,
  ListOrdered,
  FileSpreadsheet,
  Check,
  X,
  AlertTriangle,
} from "lucide-react";

type TabType =
  | "OVERVIEW"
  | "REGISTRATIONS"
  | "TEAMS"
  | "STAGES"
  | "LEADERBOARD"
  | "PAYMENTS"
  | "SETTINGS";

export const AdminTournamentDetailPage: React.FC = () => {
  const { tournamentId } = useParams<{ tournamentId: string }>();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<TabType>("OVERVIEW");
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);

  // Registrations state
  const [registrations, setRegistrations] = useState<RegistrationItem[]>([]);
  const [regFilterStatus, setRegFilterStatus] = useState("ALL");
  const [regFilterPayment, setRegFilterPayment] = useState("ALL");
  const [regFilterStage, setRegFilterStage] = useState("ALL");
  const [regSearchQuery, setRegSearchQuery] = useState("");
  const [selectedRegIds, setSelectedRegIds] = useState<string[]>([]);
  const [activeRegDetail, setActiveRegDetail] = useState<RegistrationItem | null>(null);
  const [previewScreenshot, setPreviewScreenshot] = useState<string | null>(null);

  // Stages state
  const [stages, setStages] = useState<TournamentStage[]>([]);
  const [selectedTeamsForMove, setSelectedTeamsForMove] = useState<string[]>([]);
  const [targetMoveStageId, setTargetMoveStageId] = useState<string>("");
  const [showMoveConfirm, setShowMoveConfirm] = useState(false);
  const [newStageModalOpen, setNewStageModalOpen] = useState(false);
  const [newStageData, setNewStageData] = useState({
    name: "",
    order: 1,
    teamsCount: 32,
    qualificationCriteria: "Top teams qualify for next round",
  });

  // Leaderboard state
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [savingLb, setSavingLb] = useState(false);
  const [lbSaveSuccess, setLbSaveSuccess] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamTag, setNewTeamTag] = useState("");

  // Tournament settings state
  const [settingsForm, setSettingsForm] = useState<Partial<Tournament>>({});
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Load tournament data
  const loadData = async () => {
    if (!tournamentId) return;
    setLoading(true);
    try {
      const data = await tournamentsApi.getById(tournamentId);
      if (data) {
        setTournament(data);
        setSettingsForm(data);
        if (data.stages) setStages(data.stages);
        if (data.registrations) setRegistrations(data.registrations);
        if (data.leaderboard) setLeaderboard(data.leaderboard);
      }
    } catch {
      // fallback
      const fallback = tournamentsData.find((t) => t.id === tournamentId || t.slug === tournamentId);
      if (fallback) {
        setTournament(fallback);
        setSettingsForm(fallback);
      }
    } finally {
      // Fetch fresh registrations, stages, and leaderboard in parallel
      try {
        const [regs, stgs, lb] = await Promise.all([
          tournamentsApi.getRegistrations({ tournamentId }),
          tournamentsApi.getStages(tournamentId),
          tournamentsApi.getLeaderboard(tournamentId),
        ]);
        if (regs && regs.length > 0) setRegistrations(regs);
        if (stgs && stgs.length > 0) {
          setStages(stgs);
          if (stgs.length > 1 && !targetMoveStageId) {
            setTargetMoveStageId(stgs[1].id);
          }
        }
        if (lb && lb.length > 0) setLeaderboard(lb);
      } catch (err) {
        console.warn("Secondary data fetch failed:", err);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [tournamentId]);

  if (loading && !tournament) {
    return (
      <div className="p-12 text-center text-gray-400">
        <RefreshCw className="h-8 w-8 animate-spin mx-auto text-[#FFBE32] mb-3" />
        <p className="font-heading text-sm uppercase tracking-wider">Loading Tournament Management Hub...</p>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="p-12 text-center text-gray-400 space-y-4">
        <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto" />
        <h2 className="font-display text-2xl uppercase text-white">Tournament Not Found</h2>
        <Link
          to="/tournaments"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FFBE32] text-black font-heading font-bold text-xs uppercase"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Tournaments
        </Link>
      </div>
    );
  }

  // Registrations filtering
  const filteredRegistrations = registrations.filter((r) => {
    const matchStatus = regFilterStatus === "ALL" || r.status === regFilterStatus;
    const matchPayment = regFilterPayment === "ALL" || r.paymentStatus === regFilterPayment;
    const matchStage = regFilterStage === "ALL" || r.currentStageId === regFilterStage;
    const q = regSearchQuery.toLowerCase();
    const matchQuery =
      !regSearchQuery ||
      r.teamName.toLowerCase().includes(q) ||
      r.captainIgn.toLowerCase().includes(q) ||
      (r.captainName && r.captainName.toLowerCase().includes(q)) ||
      (r.whatsapp && r.whatsapp.includes(q)) ||
      (r.payment?.utr && r.payment.utr.toLowerCase().includes(q));
    return matchStatus && matchPayment && matchStage && matchQuery;
  });

  // Calculate live statistics
  const statsTotal = registrations.length;
  const statsApproved = registrations.filter((r) => r.status === "APPROVED").length;
  const statsPending = registrations.filter((r) => r.status === "PENDING" || r.status === "UNDER_REVIEW").length;
  const statsPaymentPending = registrations.filter(
    (r) => r.status === "PAYMENT_PENDING" || r.paymentStatus === "PENDING"
  ).length;
  const statsPaymentVerified = registrations.filter((r) => r.paymentStatus === "VERIFIED").length;
  const statsRejected = registrations.filter((r) => r.status === "REJECTED").length;

  // Handlers for Registration actions
  const handleUpdateRegStatus = async (regId: string, status: string) => {
    try {
      await tournamentsApi.updateRegistrationStatus(regId, status);
      setRegistrations((prev) =>
        prev.map((r) => (r.id === regId ? { ...r, status, approvedAt: status === "APPROVED" ? new Date().toISOString() : r.approvedAt } : r))
      );
      if (activeRegDetail && activeRegDetail.id === regId) {
        setActiveRegDetail((prev) => (prev ? { ...prev, status } : null));
      }
    } catch (err: any) {
      alert(err.message || "Failed to update registration status");
    }
  };

  const handleUpdatePayment = async (regId: string, paymentStatus: string, autoApprove = false) => {
    try {
      await tournamentsApi.updatePaymentStatus(regId, paymentStatus, undefined, autoApprove);
      setRegistrations((prev) =>
        prev.map((r) => {
          if (r.id === regId) {
            return {
              ...r,
              paymentStatus,
              status: autoApprove ? "APPROVED" : r.status,
              payment: r.payment ? { ...r.payment, status: paymentStatus } : null,
            };
          }
          return r;
        })
      );
      if (activeRegDetail && activeRegDetail.id === regId) {
        setActiveRegDetail((prev) =>
          prev
            ? {
                ...prev,
                paymentStatus,
                status: autoApprove ? "APPROVED" : prev.status,
                payment: prev.payment ? { ...prev.payment, status: paymentStatus } : null,
              }
            : null
        );
      }
    } catch (err: any) {
      alert(err.message || "Failed to update payment status");
    }
  };

  const handleBulkAction = async (action: "APPROVE" | "REJECT" | "VERIFY_PAYMENT") => {
    if (selectedRegIds.length === 0) return;
    try {
      await tournamentsApi.bulkActionRegistrations(selectedRegIds, action);
      setRegistrations((prev) =>
        prev.map((r) => {
          if (selectedRegIds.includes(r.id)) {
            if (action === "APPROVE") return { ...r, status: "APPROVED" };
            if (action === "REJECT") return { ...r, status: "REJECTED" };
            if (action === "VERIFY_PAYMENT") return { ...r, paymentStatus: "VERIFIED" };
          }
          return r;
        })
      );
      setSelectedRegIds([]);
    } catch (err: any) {
      alert(err.message || "Bulk action failed");
    }
  };

  const handleExportCsv = async () => {
    try {
      const csv = await tournamentsApi.exportRegistrationsCsv(
        tournament.id,
        regFilterStage !== "ALL" ? regFilterStage : undefined,
        regFilterStatus !== "ALL" ? regFilterStatus : undefined
      );
      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `lordz-${tournament.slug || tournament.id}-registrations.csv`;
      a.click();
    } catch (err: any) {
      alert(err.message || "Failed to export registrations");
    }
  };

  // Stage Progression Handlers
  const handleMoveTeamsConfirm = async () => {
    if (selectedTeamsForMove.length === 0 || !targetMoveStageId) return;
    try {
      await tournamentsApi.moveTeamsToStage(tournament.id, selectedTeamsForMove, targetMoveStageId);
      // update local registrations
      setRegistrations((prev) =>
        prev.map((r) => (selectedTeamsForMove.includes(r.id) ? { ...r, currentStageId: targetMoveStageId } : r))
      );
      setSelectedTeamsForMove([]);
      setShowMoveConfirm(false);
      // Refresh stages
      const freshStages = await tournamentsApi.getStages(tournament.id);
      if (freshStages) setStages(freshStages);
    } catch (err: any) {
      alert(err.message || "Failed to move teams to stage");
    }
  };

  const handleCreateStage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await tournamentsApi.createStage(tournament.id, {
        name: newStageData.name.toUpperCase(),
        order: Number(newStageData.order),
        teamsCount: Number(newStageData.teamsCount),
        qualificationCriteria: newStageData.qualificationCriteria,
      });
      setStages((prev) => [...prev, created].sort((a, b) => a.order - b.order));
      setNewStageModalOpen(false);
      setNewStageData({
        name: "",
        order: stages.length + 1,
        teamsCount: 32,
        qualificationCriteria: "Top teams qualify for next round",
      });
    } catch (err: any) {
      alert(err.message || "Failed to create stage");
    }
  };

  // Leaderboard Handlers
  const handleLeaderboardCellChange = (index: number, field: keyof LeaderboardEntry, value: any) => {
    setLeaderboard((prev) => {
      const copy = [...prev];
      const row = { ...copy[index], [field]: value };
      const kills = Number(field === "kills" ? value : row.kills) || 0;
      const placementPoints = Number(field === "placementPoints" ? value : row.placementPoints) || 0;
      const bonusPoints = Number(field === "bonusPoints" ? value : row.bonusPoints) || 0;

      // Auto compute total points
      if (field === "kills" || field === "placementPoints" || field === "bonusPoints") {
        row.totalPoints = placementPoints + kills + bonusPoints;
      }
      copy[index] = row;
      return copy;
    });
    setLbSaveSuccess(false);
  };

  const handleSaveLeaderboard = async () => {
    setSavingLb(true);
    try {
      // Sort rows descending by total points, then kills
      const sorted = [...leaderboard].sort((a, b) => {
        if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
        return b.kills - a.kills;
      });
      sorted.forEach((row, idx) => {
        row.rank = idx + 1;
      });

      await tournamentsApi.updateLeaderboardBatch(tournament.id, sorted);
      setLeaderboard(sorted);
      setLbSaveSuccess(true);
      setTimeout(() => setLbSaveSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || "Failed to save leaderboard");
    } finally {
      setSavingLb(false);
    }
  };

  const handleAddLeaderboardRow = async () => {
    if (!newTeamName.trim()) return;
    try {
      const created = await tournamentsApi.addLeaderboardEntry(tournament.id, {
        teamName: newTeamName.trim().toUpperCase(),
        tag: newTeamTag.trim().toUpperCase() || undefined,
        matchesPlayed: 0,
        wins: 0,
        kills: 0,
        placementPoints: 0,
        bonusPoints: 0,
      });
      setLeaderboard((prev) => [...prev, created]);
      setNewTeamName("");
      setNewTeamTag("");
    } catch (err: any) {
      alert(err.message || "Failed to add team to leaderboard");
    }
  };

  const handleDeleteLeaderboardRow = async (id: string) => {
    try {
      await tournamentsApi.deleteLeaderboardEntry(tournament.id, id);
      setLeaderboard((prev) => prev.filter((r) => r.id !== id));
    } catch (err: any) {
      alert(err.message || "Failed to remove entry");
    }
  };

  // Settings Save Handler
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const updated = await tournamentsApi.update(tournament.id, settingsForm);
      setTournament(updated);
      setSettingsSuccess(true);
      setTimeout(() => setSettingsSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || "Failed to update tournament configuration");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleFileUpload = async (file: File, targetField: "bannerImage" | "upiQrImage") => {
    try {
      const res = await tournamentsApi.uploadImage(file);
      setSettingsForm((prev) => ({ ...prev, [targetField]: res.url }));
    } catch (err: any) {
      alert(err.message || "Upload failed");
    }
  };

  const getStatusBadge = (st: string) => {
    switch (st) {
      case "LIVE":
      case "ONGOING":
        return "bg-red-950/80 text-red-400 border-red-500/40 animate-pulse";
      case "REGISTRATION_OPEN":
      case "UPCOMING":
        return "bg-amber-950/60 text-[#FFBE32] border-[#FFBE32]/40";
      case "COMPLETED":
        return "bg-emerald-950/60 text-emerald-400 border-emerald-500/40";
      case "DRAFT":
        return "bg-neutral-800 text-gray-300 border-white/10";
      default:
        return "bg-black/50 text-gray-400 border-white/10";
    }
  };

  return (
    <div className="space-y-6">
      {/* Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/tournaments"
          className="inline-flex items-center gap-2 text-xs font-heading font-bold uppercase tracking-wider text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4 text-[#FFBE32]" />
          <span>Back to Tournaments</span>
        </Link>

        <div className="flex items-center gap-3">
          <a
            href={`/tournaments/${tournament.slug || tournament.id}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-heading font-bold text-gray-300 uppercase tracking-wider"
          >
            <span>Public Website Page</span>
            <ExternalLink className="h-3.5 w-3.5 text-[#FFBE32]" />
          </a>
          <button
            onClick={async () => {
              if (confirm("Duplicate this tournament configuration?")) {
                const dup = await tournamentsApi.duplicate(tournament.id);
                navigate(`/tournaments/${dup.id}`);
              }
            }}
            className="px-3 py-1.5 rounded-lg border border-white/10 bg-black/40 hover:bg-white/5 text-xs font-heading font-bold text-gray-400 hover:text-white uppercase"
          >
            Duplicate
          </button>
        </div>
      </div>

      {/* ================= COMMAND HEADER ================= */}
      <div className="relative rounded-2xl border border-white/10 bg-[#0C0C0E] overflow-hidden shadow-2xl">
        {/* Banner Backdrop */}
        <div className="relative h-44 sm:h-52 w-full bg-gradient-to-r from-black via-[#141419] to-black overflow-hidden">
          {tournament.bannerImage ? (
            <img
              src={tournament.bannerImage}
              alt={tournament.title}
              className="h-full w-full object-cover opacity-40 filter saturate-150"
            />
          ) : (
            <div className="h-full w-full bg-[radial-gradient(ellipse_at_top,#FFBE32_0%,transparent_70%)] opacity-15" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0E] via-[#0C0C0E]/70 to-transparent" />

          {/* Top Info overlay */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-heading font-bold uppercase tracking-widest bg-black/70 border border-white/10 text-white backdrop-blur-md">
              <Shield className="h-3 w-3 text-[#FFBE32]" />
              {tournament.game}
            </span>

            <span
              className={`px-3 py-1 rounded-md text-[10px] font-heading font-bold uppercase tracking-wider border backdrop-blur-md ${getStatusBadge(
                tournament.status
              )}`}
            >
              {tournament.status.replace("_", " ")}
            </span>
          </div>

          {/* Banner Quick Stats Bar */}
          <div className="absolute bottom-4 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl sm:text-4xl uppercase tracking-wider text-white drop-shadow-md">
                {tournament.title}
              </h1>
              <p className="text-xs text-gray-300 font-body mt-1 max-w-2xl line-clamp-1">
                {tournament.tagline}
              </p>
            </div>

            {/* DYNAMIC REGISTRATION COUNTERS */}
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 rounded-xl bg-black/80 border border-[#FFBE32]/40 backdrop-blur-md text-right shadow-[0_0_15px_rgba(255,190,50,0.15)]">
                <div className="text-[10px] font-heading font-extrabold uppercase tracking-widest text-[#FFBE32]">
                  TEAMS REGISTERED
                </div>
                <div className="font-display text-xl sm:text-2xl text-white font-bold">
                  <span className="text-[#FFBE32]">{statsTotal}</span> / {tournament.totalTeams}
                </div>
              </div>

              <div className="hidden sm:block px-4 py-2 rounded-xl bg-black/80 border border-white/10 backdrop-blur-md text-right">
                <div className="text-[10px] font-heading font-bold uppercase tracking-widest text-gray-400">
                  PRIZE POOL
                </div>
                <div className="font-display text-xl text-white font-bold text-[#FFBE32]">
                  {tournament.prizePool}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation Ribbon */}
        <div className="flex items-center overflow-x-auto border-t border-white/10 bg-[#09090B] px-4 scrollbar-none">
          {(
            [
              { key: "OVERVIEW", label: "Overview", icon: Layers },
              { key: "REGISTRATIONS", label: `Registrations (${statsTotal})`, icon: Users },
              { key: "TEAMS", label: `Teams (${statsApproved})`, icon: Shield },
              { key: "STAGES", label: `Stages (${stages.length})`, icon: ListOrdered },
              { key: "LEADERBOARD", label: "Leaderboard", icon: Award },
              { key: "PAYMENTS", label: `Payments (${statsPaymentVerified})`, icon: CreditCard },
              { key: "SETTINGS", label: "Settings", icon: Settings },
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 py-3.5 px-4 font-heading text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap border-b-2 cursor-pointer ${
                  active
                    ? "border-[#FFBE32] text-[#FFBE32] bg-[#FFBE32]/5"
                    : "border-transparent text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? "text-[#FFBE32]" : "text-gray-500"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= TAB 1: OVERVIEW ================= */}
      {activeTab === "OVERVIEW" && (
        <div className="space-y-6">
          {/* Key Metric Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-4 rounded-xl bg-[#0D0D12] border border-white/10">
              <div className="text-[10px] font-heading uppercase tracking-wider text-gray-400">Total Registered</div>
              <div className="mt-1 font-display text-2xl font-bold text-white">{statsTotal}</div>
              <div className="text-[10px] text-gray-500 mt-1">Cap: {tournament.totalTeams} Teams</div>
            </div>
            <div className="p-4 rounded-xl bg-[#0D0D12] border border-emerald-500/20">
              <div className="text-[10px] font-heading uppercase tracking-wider text-emerald-400">Approved</div>
              <div className="mt-1 font-display text-2xl font-bold text-emerald-400">{statsApproved}</div>
              <div className="text-[10px] text-emerald-500/60 mt-1">Confirmed Slots</div>
            </div>
            <div className="p-4 rounded-xl bg-[#0D0D12] border border-amber-500/20">
              <div className="text-[10px] font-heading uppercase tracking-wider text-amber-400">Under Review</div>
              <div className="mt-1 font-display text-2xl font-bold text-amber-400">{statsPending}</div>
              <div className="text-[10px] text-amber-500/60 mt-1">Awaiting Decision</div>
            </div>
            <div className="p-4 rounded-xl bg-[#0D0D12] border border-amber-500/20">
              <div className="text-[10px] font-heading uppercase tracking-wider text-amber-400">Payment Pending</div>
              <div className="mt-1 font-display text-2xl font-bold text-amber-400">{statsPaymentPending}</div>
              <div className="text-[10px] text-amber-500/60 mt-1">Unpaid / No UTR</div>
            </div>
            <div className="p-4 rounded-xl bg-[#0D0D12] border border-cyan-500/20">
              <div className="text-[10px] font-heading uppercase tracking-wider text-cyan-400">Payment Verified</div>
              <div className="mt-1 font-display text-2xl font-bold text-cyan-400">{statsPaymentVerified}</div>
              <div className="text-[10px] text-cyan-500/60 mt-1">Verified on Bank/UPI</div>
            </div>
            <div className="p-4 rounded-xl bg-[#0D0D12] border border-red-500/20">
              <div className="text-[10px] font-heading uppercase tracking-wider text-red-400">Rejected</div>
              <div className="mt-1 font-display text-2xl font-bold text-red-400">{statsRejected}</div>
              <div className="text-[10px] text-red-500/60 mt-1">Ineligible / Disqualified</div>
            </div>
          </div>

          {/* Quick Overview Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Stages Progression Flow */}
              <div className="p-5 rounded-2xl bg-[#0D0D12] border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <ListOrdered className="h-4 w-4 text-[#FFBE32]" />
                    <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-white">
                      Tournament Stages Pipeline
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveTab("STAGES")}
                    className="text-xs text-[#FFBE32] hover:underline font-heading uppercase font-bold"
                  >
                    Manage Stages &rarr;
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {stages.map((stg) => (
                    <div
                      key={stg.id}
                      className="p-3 rounded-xl bg-black/40 border border-white/5 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono">
                          <span>STAGE 0{stg.order}</span>
                          <span className="text-amber-400">{stg.status}</span>
                        </div>
                        <h4 className="font-display text-base text-white uppercase mt-1">{stg.name}</h4>
                        <p className="text-[11px] text-gray-400 mt-1 line-clamp-2">
                          {stg.qualificationCriteria || "Standard points advance"}
                        </p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                        <span className="text-gray-400">Squads:</span>
                        <span className="font-bold text-white">
                          {registrations.filter((r) => r.currentStageId === stg.id).length} Active
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tournament Description & Rules */}
              <div className="p-5 rounded-2xl bg-[#0D0D12] border border-white/10 space-y-4">
                <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-white">
                  Description & Rules Summary
                </h3>
                <p className="text-xs text-gray-300 font-body leading-relaxed">
                  {tournament.description || tournament.shortDescription || "No detailed description provided."}
                </p>

                {tournament.rules && (
                  <div className="mt-4 p-3.5 rounded-xl bg-black/60 border border-white/5 text-xs text-gray-300 font-mono whitespace-pre-line">
                    <span className="text-[#FFBE32] font-heading font-bold uppercase block mb-1">
                      Official Tournament Rules:
                    </span>
                    {tournament.rules}
                  </div>
                )}
              </div>
            </div>

            {/* Right Side Info Rail */}
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-[#0D0D12] border border-white/10 space-y-4 text-xs">
                <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-[#FFBE32]">
                  Tournament Specifications
                </h3>

                <div className="space-y-2.5 divide-y divide-white/5">
                  <div className="flex justify-between pt-2">
                    <span className="text-gray-400">Format:</span>
                    <span className="text-white font-medium">{tournament.format}</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-gray-400">Entry Fee:</span>
                    <span className="text-[#FFBE32] font-bold">
                      {tournament.feeAmount && tournament.feeAmount > 0 ? `₹${tournament.feeAmount}` : tournament.entryFee}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-gray-400">UPI Receiver ID:</span>
                    <span className="text-white font-mono">{tournament.upiId || "None"}</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-gray-400">Roster Capacity:</span>
                    <span className="text-white">
                      {tournament.teamSize || 4} Starters + {tournament.substituteCount || 1} Subs
                    </span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-gray-400">Start Date:</span>
                    <span className="text-white">{tournament.date}</span>
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    onClick={() => setActiveTab("SETTINGS")}
                    className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-heading font-bold uppercase text-white flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Settings className="h-4 w-4 text-[#FFBE32]" /> Edit Configuration
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: REGISTRATIONS ================= */}
      {activeTab === "REGISTRATIONS" && (
        <div className="space-y-4">
          {/* Header Action Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-[#0D0D12] border border-white/10">
            <div>
              <h2 className="font-heading text-base font-bold uppercase tracking-wider text-white">
                Squads Registered for {tournament.title}
              </h2>
              <p className="text-xs text-gray-400 font-body mt-0.5">
                Displaying <strong>{filteredRegistrations.length}</strong> of <strong>{registrations.length}</strong> total registered squads.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportCsv}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-heading font-bold uppercase text-gray-200 cursor-pointer"
              >
                <FileSpreadsheet className="h-4 w-4 text-[#FFBE32]" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="p-4 rounded-2xl bg-[#0D0D12] border border-white/10 flex flex-col lg:flex-row gap-3 items-center justify-between">
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
              {/* Registration Status filter */}
              <select
                value={regFilterStatus}
                onChange={(e) => setRegFilterStatus(e.target.value)}
                className="px-3 py-1.5 rounded-lg text-xs font-heading font-bold uppercase tracking-wider bg-black/60 border border-white/10 text-white cursor-pointer"
              >
                <option value="ALL">Status: All</option>
                <option value="APPROVED">Approved</option>
                <option value="PENDING">Pending</option>
                <option value="PAYMENT_PENDING">Payment Pending</option>
                <option value="REJECTED">Rejected</option>
              </select>

              {/* Payment status filter */}
              <select
                value={regFilterPayment}
                onChange={(e) => setRegFilterPayment(e.target.value)}
                className="px-3 py-1.5 rounded-lg text-xs font-heading font-bold uppercase tracking-wider bg-black/60 border border-white/10 text-white cursor-pointer"
              >
                <option value="ALL">Payment: All</option>
                <option value="VERIFIED">Payment Verified</option>
                <option value="SUBMITTED">Payment Submitted</option>
                <option value="PENDING">Payment Pending</option>
              </select>

              {/* Stage filter */}
              <select
                value={regFilterStage}
                onChange={(e) => setRegFilterStage(e.target.value)}
                className="px-3 py-1.5 rounded-lg text-xs font-heading font-bold uppercase tracking-wider bg-black/60 border border-white/10 text-white cursor-pointer"
              >
                <option value="ALL">Stage: All Stages</option>
                {stages.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Input */}
            <div className="relative w-full lg:w-72">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-500" />
              <input
                type="text"
                value={regSearchQuery}
                onChange={(e) => setRegSearchQuery(e.target.value)}
                placeholder="Search team, captain, UTR..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FFBE32]"
              />
            </div>
          </div>

          {/* Bulk actions banner if checked */}
          {selectedRegIds.length > 0 && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs">
              <span className="font-heading font-bold text-amber-300">
                {selectedRegIds.length} squads selected
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleBulkAction("APPROVE")}
                  className="px-3 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-bold uppercase text-[11px]"
                >
                  Bulk Approve
                </button>
                <button
                  onClick={() => handleBulkAction("VERIFY_PAYMENT")}
                  className="px-3 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 font-bold uppercase text-[11px]"
                >
                  Verify Payment
                </button>
                <button
                  onClick={() => handleBulkAction("REJECT")}
                  className="px-3 py-1 rounded bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold uppercase text-[11px]"
                >
                  Bulk Reject
                </button>
                <button
                  onClick={() => setSelectedRegIds([])}
                  className="px-2 py-1 text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Data Table */}
          <div className="rounded-2xl border border-white/10 bg-[#0C0C0E] overflow-x-auto shadow-xl">
            <table className="w-full text-left text-xs font-heading">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02] text-[11px] uppercase tracking-wider text-gray-400">
                  <th className="py-3 px-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={
                        filteredRegistrations.length > 0 &&
                        selectedRegIds.length === filteredRegistrations.length
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedRegIds(filteredRegistrations.map((r) => r.id));
                        } else {
                          setSelectedRegIds([]);
                        }
                      }}
                      className="cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-4">TEAM / REG NUMBER</th>
                  <th className="py-3 px-3">CAPTAIN / LEADER</th>
                  <th className="py-3 px-3">PLAYERS</th>
                  <th className="py-3 px-3">PAYMENT</th>
                  <th className="py-3 px-3">STATUS</th>
                  <th className="py-3 px-3">STAGE</th>
                  <th className="py-3 px-4 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredRegistrations.length > 0 ? (
                  filteredRegistrations.map((r) => {
                    const isSelected = selectedRegIds.includes(r.id);
                    const currentStageName =
                      stages.find((s) => s.id === r.currentStageId)?.name || "Round 1";
                    const isApproved = r.status === "APPROVED";
                    const isPending = r.status === "PENDING" || r.status === "UNDER_REVIEW";

                    return (
                      <tr
                        key={r.id}
                        className={`hover:bg-white/[0.02] transition-colors ${
                          isSelected ? "bg-[#FFBE32]/5" : ""
                        }`}
                      >
                        <td className="py-3 px-3 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedRegIds((prev) => [...prev, r.id]);
                              } else {
                                setSelectedRegIds((prev) => prev.filter((id) => id !== r.id));
                              }
                            }}
                            className="cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-white text-sm">{r.teamName}</div>
                          <div className="text-[10px] text-gray-500 font-mono">
                            {r.registrationNumber || r.id}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="text-white font-mono text-xs">{r.captainIgn}</div>
                          <div className="text-[10px] text-gray-400">{r.captainName || r.whatsapp}</div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded bg-black/60 border border-white/5 text-[11px] text-gray-300">
                            {r.players && r.players.length > 0
                              ? `${r.players.length} Players`
                              : "5 Players"}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 ${
                              r.paymentStatus === "FREE" || r.paymentStatus === "VERIFIED"
                                ? "bg-emerald-950/60 text-emerald-400 border border-emerald-500/30"
                                : r.paymentStatus === "SUBMITTED"
                                ? "bg-cyan-950/60 text-cyan-400 border border-cyan-500/30"
                                : "bg-amber-950/60 text-amber-400 border border-amber-500/30"
                            }`}
                          >
                            {r.paymentStatus === "FREE" ? "FREE PRE-ENTRY" : r.paymentStatus}
                          </span>
                          {r.payment?.utr && (
                            <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                              UTR: {r.payment.utr.slice(0, 10)}...
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              isApproved
                                ? "bg-emerald-950/60 text-emerald-400 border border-emerald-500/30"
                                : isPending
                                ? "bg-amber-950/60 text-amber-400 border border-amber-500/30"
                                : "bg-red-950/60 text-red-400 border border-red-500/30"
                            }`}
                          >
                            {r.status}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-gray-300">
                            {currentStageName}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setActiveRegDetail(r)}
                              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-[#FFBE32] text-gray-300 hover:text-black border border-white/10 hover:border-[#FFBE32] text-[11px] font-bold uppercase transition-all cursor-pointer"
                            >
                              View
                            </button>
                            {!isApproved && (
                              <button
                                onClick={() => handleUpdateRegStatus(r.id, "APPROVED")}
                                title="Approve Registration"
                                className="p-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-pointer"
                              >
                                <Check className="h-3.5 w-3.5" />
                              </button>
                            )}
                            {r.status !== "REJECTED" && (
                              <button
                                onClick={() => handleUpdateRegStatus(r.id, "REJECTED")}
                                title="Reject Registration"
                                className="p-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 cursor-pointer"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-gray-500">
                      No registered teams found matching filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 3: TEAMS ================= */}
      {activeTab === "TEAMS" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-base font-bold uppercase tracking-wider text-white">
              Approved Participating Squads ({statsApproved})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {registrations
              .filter((r) => r.status === "APPROVED")
              .map((team) => (
                <div
                  key={team.id}
                  className="p-5 rounded-2xl bg-[#0D0D12] border border-white/10 hover:border-[#FFBE32]/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2 py-0.5 rounded bg-[#FFBE32]/10 text-[#FFBE32] border border-[#FFBE32]/20 text-[10px] font-bold">
                        SLOT #{team.slotNumber || 1}
                      </span>
                      <span className="text-[10px] text-gray-500 font-mono">
                        {team.registrationNumber}
                      </span>
                    </div>

                    <h3 className="font-display text-xl text-white uppercase">{team.teamName}</h3>
                    <p className="text-xs text-gray-400 font-mono mt-0.5">
                      Captain: <span className="text-[#FFBE32]">{team.captainIgn}</span>
                    </p>

                    {/* Players Roster */}
                    <div className="mt-4 pt-3 border-t border-white/5 space-y-1">
                      <div className="text-[10px] uppercase tracking-wider font-bold text-gray-500 mb-1">
                        Active Roster:
                      </div>
                      {team.players && team.players.length > 0 ? (
                        team.players.map((p) => (
                          <div
                            key={p.id}
                            className="flex items-center justify-between text-xs font-mono text-gray-300"
                          >
                            <span>{p.ign}</span>
                            <span className="text-[10px] text-gray-500 uppercase">{p.role}</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-xs text-gray-500 font-mono">{team.playerNames}</div>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> VERIFIED ENTRY
                    </span>
                    <button
                      onClick={() => setActiveRegDetail(team)}
                      className="text-xs text-[#FFBE32] hover:underline font-bold"
                    >
                      View Details &rarr;
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ================= TAB 4: STAGES & TEAM ADVANCEMENT ================= */}
      {activeTab === "STAGES" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#0D0D12] border border-white/10">
            <div>
              <h2 className="font-heading text-base font-bold uppercase tracking-wider text-white">
                Tournament Stages & Qualification Engine
              </h2>
              <p className="text-xs text-gray-400 font-body">
                Promote selected qualified squads to the next tournament stage (e.g. Round 1 &rarr; Round 2 &rarr; Grand Finals).
              </p>
            </div>

            <button
              onClick={() => setNewStageModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FFBE32] hover:bg-[#FFA000] text-black font-heading font-bold text-xs uppercase tracking-wider cursor-pointer shadow-[0_0_15px_rgba(255,190,50,0.2)]"
            >
              <Plus className="h-4 w-4" /> Add Stage
            </button>
          </div>

          {/* Stages List with Squads per stage */}
          <div className="grid grid-cols-1 gap-6">
            {stages.map((stage, sIdx) => {
              const stageSquads = registrations.filter((r) => r.currentStageId === stage.id);
              const nextStage = stages[sIdx + 1];

              return (
                <div
                  key={stage.id}
                  className="rounded-2xl border border-white/10 bg-[#0C0C0E] overflow-hidden"
                >
                  <div className="p-4 bg-white/[0.02] border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFBE32]/10 border border-[#FFBE32]/30 text-[#FFBE32] font-heading font-bold text-xs">
                        {stage.order}
                      </span>
                      <div>
                        <h3 className="font-display text-lg text-white uppercase">{stage.name}</h3>
                        <p className="text-xs text-gray-400 font-body">
                          {stage.qualificationCriteria || "Standard points advance"} •{" "}
                          <strong className="text-white">{stageSquads.length}</strong> squads active
                        </p>
                      </div>
                    </div>

                    {/* Promotion Action */}
                    {nextStage && stageSquads.length > 0 && (
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            if (selectedTeamsForMove.length === 0) {
                              alert("Please check at least one squad to move!");
                              return;
                            }
                            setTargetMoveStageId(nextStage.id);
                            setShowMoveConfirm(true);
                          }}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFBE32] hover:bg-[#FFA000] text-black font-heading font-bold text-xs uppercase tracking-wider cursor-pointer shadow-[0_0_10px_rgba(255,190,50,0.2)]"
                        >
                          <span>Move Selected to {nextStage.name}</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Table of squads in this stage */}
                  <div className="overflow-x-auto">
                    {stageSquads.length > 0 ? (
                      <table className="w-full text-left text-xs font-heading">
                        <thead>
                          <tr className="border-b border-white/5 text-[10px] uppercase text-gray-500 bg-black/40">
                            <th className="py-2.5 px-3 w-10 text-center">
                              <input
                                type="checkbox"
                                onChange={(e) => {
                                  const stageSquadIds = stageSquads.map((s) => s.id);
                                  if (e.target.checked) {
                                    setSelectedTeamsForMove((prev) => [
                                      ...new Set([...prev, ...stageSquadIds]),
                                    ]);
                                  } else {
                                    setSelectedTeamsForMove((prev) =>
                                      prev.filter((id) => !stageSquadIds.includes(id))
                                    );
                                  }
                                }}
                                className="cursor-pointer"
                              />
                            </th>
                            <th className="py-2.5 px-3">TEAM NAME</th>
                            <th className="py-2.5 px-3">CAPTAIN</th>
                            <th className="py-2.5 px-3">PAYMENT</th>
                            <th className="py-2.5 px-3">STATUS</th>
                            <th className="py-2.5 px-3 text-right">ACTION</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {stageSquads.map((team) => {
                            const isChecked = selectedTeamsForMove.includes(team.id);
                            return (
                              <tr
                                key={team.id}
                                className={`hover:bg-white/[0.02] ${
                                  isChecked ? "bg-[#FFBE32]/5" : ""
                                }`}
                              >
                                <td className="py-2.5 px-3 text-center">
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedTeamsForMove((prev) => [...prev, team.id]);
                                      } else {
                                        setSelectedTeamsForMove((prev) =>
                                          prev.filter((id) => id !== team.id)
                                        );
                                      }
                                    }}
                                    className="cursor-pointer"
                                  />
                                </td>
                                <td className="py-2.5 px-3 font-bold text-white">
                                  {team.teamName}
                                </td>
                                <td className="py-2.5 px-3 text-gray-300 font-mono">
                                  {team.captainIgn}
                                </td>
                                <td className="py-2.5 px-3">
                                  <span className="text-[10px] text-emerald-400">
                                    {team.paymentStatus}
                                  </span>
                                </td>
                                <td className="py-2.5 px-3">
                                  <span className="text-[10px] text-gray-300">{team.status}</span>
                                </td>
                                <td className="py-2.5 px-3 text-right">
                                  <button
                                    onClick={() => setActiveRegDetail(team)}
                                    className="text-[11px] text-[#FFBE32] hover:underline"
                                  >
                                    View
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    ) : (
                      <div className="py-8 text-center text-xs text-gray-500 font-mono">
                        No squads currently assigned to {stage.name}. Move squads here from earlier stages.
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Move confirmation modal */}
          {showMoveConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
              <div className="w-full max-w-md rounded-2xl border border-[#FFBE32]/40 bg-[#0E0E12] p-6 shadow-2xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[#FFBE32]/20 flex items-center justify-center text-[#FFBE32]">
                    <ArrowRight className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg uppercase text-white">
                      Confirm Stage Advancement
                    </h3>
                    <p className="text-xs text-gray-400">
                      Move {selectedTeamsForMove.length} squads to{" "}
                      <strong className="text-[#FFBE32]">
                        {stages.find((s) => s.id === targetMoveStageId)?.name}
                      </strong>
                      ?
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-black/60 border border-white/5 text-xs text-gray-300 max-h-32 overflow-y-auto font-mono">
                  {selectedTeamsForMove.map((id) => {
                    const t = registrations.find((r) => r.id === id);
                    return <div key={id}>✓ {t?.teamName}</div>;
                  })}
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => setShowMoveConfirm(false)}
                    className="px-4 py-2 rounded-xl border border-white/10 text-xs font-heading font-bold text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleMoveTeamsConfirm}
                    className="px-5 py-2 rounded-xl bg-[#FFBE32] text-black font-heading font-bold text-xs uppercase"
                  >
                    Confirm &amp; Advance
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Create Stage Modal */}
          {newStageModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
              <div className="w-full max-w-md rounded-2xl border border-white/15 bg-[#0E0E12] p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg uppercase text-white">Add Tournament Stage</h3>
                  <button
                    onClick={() => setNewStageModalOpen(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleCreateStage} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-gray-400 font-bold uppercase mb-1">
                      Stage Name (e.g. SEMI FINALS)
                    </label>
                    <input
                      type="text"
                      required
                      value={newStageData.name}
                      onChange={(e) =>
                        setNewStageData({ ...newStageData, name: e.target.value })
                      }
                      placeholder="SEMI FINALS"
                      className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/10 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-400 font-bold uppercase mb-1">
                        Stage Order Number
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={newStageData.order}
                        onChange={(e) =>
                          setNewStageData({
                            ...newStageData,
                            order: parseInt(e.target.value) || 1,
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/10 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 font-bold uppercase mb-1">
                        Max Teams Capacity
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={newStageData.teamsCount}
                        onChange={(e) =>
                          setNewStageData({
                            ...newStageData,
                            teamsCount: parseInt(e.target.value) || 16,
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/10 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-400 font-bold uppercase mb-1">
                      Qualification Criteria
                    </label>
                    <input
                      type="text"
                      value={newStageData.qualificationCriteria}
                      onChange={(e) =>
                        setNewStageData({
                          ...newStageData,
                          qualificationCriteria: e.target.value,
                        })
                      }
                      placeholder="Top 8 squads qualify for Grand Finals"
                      className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/10 text-white"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setNewStageModalOpen(false)}
                      className="px-4 py-2 rounded-lg border border-white/10 text-gray-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-lg bg-[#FFBE32] text-black font-bold uppercase"
                    >
                      Save Stage
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 5: LEADERBOARD ================= */}
      {activeTab === "LEADERBOARD" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#0D0D12] border border-white/10">
            <div>
              <h2 className="font-heading text-base font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Award className="h-4 w-4 text-[#FFBE32]" />
                Tournament Leaderboard: {tournament.title}
              </h2>
              <p className="text-xs text-gray-400 font-body">
                Manage points, kills, placements, and ranking. Formula: <strong>Total = Placement + Kills + Bonus</strong>.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSaveLeaderboard}
                disabled={savingLb}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#FFBE32] hover:bg-[#FFA000] text-black font-heading font-bold text-xs uppercase tracking-wider cursor-pointer shadow-[0_0_15px_rgba(255,190,50,0.3)] disabled:opacity-50"
              >
                {savingLb ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : lbSaveSuccess ? (
                  <Check className="h-4 w-4 text-black" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span>{lbSaveSuccess ? "Saved & Ranked!" : "Save & Recalculate"}</span>
              </button>
            </div>
          </div>

          {/* Quick Add Team to Leaderboard */}
          <div className="p-4 rounded-2xl bg-[#0D0D12] border border-white/10 flex flex-wrap items-center gap-3">
            <span className="text-xs font-heading font-bold uppercase text-gray-400">
              Add Squad to Board:
            </span>
            <input
              type="text"
              placeholder="Team Name (e.g. LORDZ ESPORTS)"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-xs text-white"
            />
            <input
              type="text"
              placeholder="Tag (e.g. LZ)"
              value={newTeamTag}
              onChange={(e) => setNewTeamTag(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-xs text-white w-24"
            />
            <button
              onClick={handleAddLeaderboardRow}
              className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-heading font-bold uppercase text-white cursor-pointer"
            >
              Add Entry
            </button>
          </div>

          {/* Leaderboard Editable Table */}
          <div className="rounded-2xl border border-white/10 bg-[#0C0C0E] overflow-x-auto shadow-xl">
            <table className="w-full text-left text-xs font-heading">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02] text-[10px] uppercase text-gray-400">
                  <th className="py-3 px-3 w-12 text-center">RANK</th>
                  <th className="py-3 px-4">TEAM NAME</th>
                  <th className="py-3 px-3 text-center">MATCHES</th>
                  <th className="py-3 px-3 text-center">WINS (WWCD)</th>
                  <th className="py-3 px-3 text-center">KILLS</th>
                  <th className="py-3 px-3 text-center">POS PTS</th>
                  <th className="py-3 px-3 text-center">BONUS</th>
                  <th className="py-3 px-4 text-right text-[#FFBE32] font-bold">TOTAL POINTS</th>
                  <th className="py-3 px-3 text-center w-12">DEL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {leaderboard.length > 0 ? (
                  leaderboard.map((row, idx) => (
                    <tr key={row.id || idx} className="hover:bg-white/[0.02]">
                      <td className="py-3 px-3 text-center font-display text-sm text-[#FFBE32]">
                        #{row.rank || idx + 1}
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          value={row.teamName}
                          onChange={(e) =>
                            handleLeaderboardCellChange(idx, "teamName", e.target.value)
                          }
                          className="bg-transparent border-b border-transparent hover:border-white/20 focus:border-[#FFBE32] text-white font-bold text-sm w-full outline-none"
                        />
                      </td>
                      <td className="py-3 px-3 text-center">
                        <input
                          type="number"
                          value={row.matchesPlayed}
                          onChange={(e) =>
                            handleLeaderboardCellChange(idx, "matchesPlayed", e.target.value)
                          }
                          className="bg-transparent text-center border-b border-transparent hover:border-white/20 focus:border-[#FFBE32] text-white w-12 outline-none"
                        />
                      </td>
                      <td className="py-3 px-3 text-center">
                        <input
                          type="number"
                          value={row.wins}
                          onChange={(e) =>
                            handleLeaderboardCellChange(idx, "wins", e.target.value)
                          }
                          className="bg-transparent text-center border-b border-transparent hover:border-white/20 focus:border-[#FFBE32] text-amber-300 w-12 outline-none font-bold"
                        />
                      </td>
                      <td className="py-3 px-3 text-center">
                        <input
                          type="number"
                          value={row.kills}
                          onChange={(e) =>
                            handleLeaderboardCellChange(idx, "kills", e.target.value)
                          }
                          className="bg-transparent text-center border-b border-transparent hover:border-white/20 focus:border-[#FFBE32] text-red-400 w-14 outline-none font-bold"
                        />
                      </td>
                      <td className="py-3 px-3 text-center">
                        <input
                          type="number"
                          value={row.placementPoints}
                          onChange={(e) =>
                            handleLeaderboardCellChange(idx, "placementPoints", e.target.value)
                          }
                          className="bg-transparent text-center border-b border-transparent hover:border-white/20 focus:border-[#FFBE32] text-white w-14 outline-none"
                        />
                      </td>
                      <td className="py-3 px-3 text-center">
                        <input
                          type="number"
                          value={row.bonusPoints}
                          onChange={(e) =>
                            handleLeaderboardCellChange(idx, "bonusPoints", e.target.value)
                          }
                          className="bg-transparent text-center border-b border-transparent hover:border-white/20 focus:border-[#FFBE32] text-gray-300 w-12 outline-none"
                        />
                      </td>
                      <td className="py-3 px-4 text-right font-display text-base font-bold text-[#FFBE32]">
                        {row.totalPoints}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => handleDeleteLeaderboardRow(row.id)}
                          className="text-gray-600 hover:text-red-400 p-1 cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-gray-500">
                      No leaderboard data yet. Add squads above or sync from registered teams.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 6: PAYMENTS ================= */}
      {activeTab === "PAYMENTS" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#0D0D12] border border-white/10">
            <div>
              <h2 className="font-heading text-base font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-[#FFBE32]" />
                Tournament Payment Verification Desk
              </h2>
              <p className="text-xs text-gray-400 font-body">
                Verify UPI transactions, inspect UTR reference codes, and view payment screenshots.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0C0C0E] overflow-x-auto shadow-xl">
            <table className="w-full text-left text-xs font-heading">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02] text-[10px] uppercase text-gray-400">
                  <th className="py-3 px-4">TEAM / REG NUMBER</th>
                  <th className="py-3 px-3">PAYER NAME</th>
                  <th className="py-3 px-3">AMOUNT</th>
                  <th className="py-3 px-3">UTR NUMBER</th>
                  <th className="py-3 px-3">SCREENSHOT</th>
                  <th className="py-3 px-3">STATUS</th>
                  <th className="py-3 px-4 text-right">VERIFY / ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {registrations.filter((r) => r.payment !== null || r.paymentStatus !== "PENDING").length > 0 ? (
                  registrations
                    .filter((r) => r.payment !== null || r.paymentStatus !== "PENDING")
                    .map((reg) => {
                      const p = reg.payment;
                      const isVerified = reg.paymentStatus === "VERIFIED";

                      return (
                        <tr key={reg.id} className="hover:bg-white/[0.02]">
                          <td className="py-3 px-4">
                            <div className="font-bold text-white text-sm">{reg.teamName}</div>
                            <div className="text-[10px] text-gray-500 font-mono">
                              {reg.registrationNumber}
                            </div>
                          </td>
                          <td className="py-3 px-3 text-gray-300">
                            {p?.payerName || reg.captainName || reg.captainIgn}
                          </td>
                          <td className="py-3 px-3 font-mono font-bold text-white">
                            ₹{p?.amount || tournament.feeAmount || 499}
                          </td>
                          <td className="py-3 px-3 font-mono text-xs text-[#FFBE32]">
                            {p?.utr || <span className="text-gray-500">Not provided</span>}
                          </td>
                          <td className="py-3 px-3">
                            {p?.screenshot ? (
                              <button
                                onClick={() => setPreviewScreenshot(p.screenshot || null)}
                                className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] text-[#FFBE32] inline-flex items-center gap-1 cursor-pointer"
                              >
                                <Eye className="h-3 w-3" /> View Proof
                              </button>
                            ) : (
                              <span className="text-gray-500 text-[10px]">No image</span>
                            )}
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                isVerified
                                  ? "bg-emerald-950/60 text-emerald-400 border border-emerald-500/30"
                                  : reg.paymentStatus === "SUBMITTED"
                                  ? "bg-cyan-950/60 text-cyan-400 border border-cyan-500/30"
                                  : "bg-amber-950/60 text-amber-400 border border-amber-500/30"
                              }`}
                            >
                              {reg.paymentStatus}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {!isVerified ? (
                                <button
                                  onClick={() => handleUpdatePayment(reg.id, "VERIFIED", true)}
                                  className="px-3 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500 text-emerald-400 hover:text-black border border-emerald-500/40 text-[11px] font-bold uppercase cursor-pointer transition-all"
                                >
                                  Verify &amp; Approve
                                </button>
                              ) : (
                                <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                                  <Check className="h-3 w-3" /> Verified
                                </span>
                              )}
                              <button
                                onClick={() => handleUpdatePayment(reg.id, "REJECTED")}
                                className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-[11px] font-bold uppercase cursor-pointer"
                              >
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-500">
                      No payment submissions recorded for this tournament.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 7: SETTINGS & BANNER UPLOAD ================= */}
      {activeTab === "SETTINGS" && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#0D0D12] border border-white/10">
            <div>
              <h2 className="font-heading text-base font-bold uppercase tracking-wider text-white">
                Tournament Configuration &amp; Media Assets
              </h2>
              <p className="text-xs text-gray-400 font-body">
                Update tournament title, rules, fee, UPI payment info, and upload official banner.
              </p>
            </div>

            <button
              type="submit"
              disabled={savingSettings}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#FFBE32] hover:bg-[#FFA000] text-black font-heading font-bold text-xs uppercase tracking-wider cursor-pointer shadow-[0_0_15px_rgba(255,190,50,0.3)] disabled:opacity-50"
            >
              {savingSettings ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              <span>{settingsSuccess ? "Configuration Saved!" : "Save Changes"}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Banner & Media Column */}
            <div className="p-5 rounded-2xl bg-[#0D0D12] border border-white/10 space-y-4">
              <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-[#FFBE32]">
                Tournament Banner &amp; Media
              </h3>

              {/* Banner Upload Box */}
              <div>
                <label className="block text-xs font-heading font-bold uppercase text-gray-400 mb-2">
                  Tournament Banner (Recommended aspect ratio 16:9 or 21:9)
                </label>
                {settingsForm.bannerImage ? (
                  <div className="relative rounded-xl overflow-hidden border border-white/15 h-44 mb-3">
                    <img
                      src={settingsForm.bannerImage}
                      alt="Banner Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setSettingsForm({ ...settingsForm, bannerImage: null })}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/80 text-red-400 hover:bg-red-500 hover:text-white"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="h-36 rounded-xl border-2 border-dashed border-white/15 bg-black/40 flex flex-col items-center justify-center p-4 text-center mb-3">
                    <Upload className="h-6 w-6 text-gray-500 mb-2" />
                    <span className="text-xs text-gray-400">No banner uploaded</span>
                    <span className="text-[10px] text-gray-600">JPG, PNG, WEBP up to 10MB</span>
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileUpload(e.target.files[0], "bannerImage");
                    }
                  }}
                  className="w-full text-xs text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-heading file:font-bold file:bg-[#FFBE32] file:text-black cursor-pointer"
                />
              </div>

              {/* UPI Payment Configuration */}
              <div className="pt-4 border-t border-white/5 space-y-3">
                <h4 className="font-heading text-xs font-bold uppercase text-white">
                  Payment Setup (UPI ID &amp; QR Code)
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-gray-400 uppercase font-bold mb-1">
                      Registration Fee (₹)
                    </label>
                    <input
                      type="number"
                      value={settingsForm.feeAmount || 0}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          feeAmount: parseInt(e.target.value) || 0,
                          entryFee: parseInt(e.target.value) > 0 ? `₹${e.target.value} / SQUAD` : "FREE ENTRY",
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/10 text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-gray-400 uppercase font-bold mb-1">
                      UPI ID (e.g. lordzesports@upi)
                    </label>
                    <input
                      type="text"
                      value={settingsForm.upiId || ""}
                      onChange={(e) => setSettingsForm({ ...settingsForm, upiId: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/10 text-white text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-gray-400 uppercase font-bold mb-1">
                    UPI QR Code Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(e.target.files[0], "upiQrImage");
                      }
                    }}
                    className="w-full text-xs text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-heading file:font-bold file:bg-white/10 file:text-white cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* General Info Column */}
            <div className="p-5 rounded-2xl bg-[#0D0D12] border border-white/10 space-y-4">
              <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-[#FFBE32]">
                Basic Information &amp; Schedule
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-gray-400 font-bold uppercase mb-1">Tournament Title</label>
                  <input
                    type="text"
                    required
                    value={settingsForm.title || ""}
                    onChange={(e) => setSettingsForm({ ...settingsForm, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/10 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-400 font-bold uppercase mb-1">Game</label>
                    <input
                      type="text"
                      value={settingsForm.game || "FREE FIRE MAX"}
                      onChange={(e) => setSettingsForm({ ...settingsForm, game: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 font-bold uppercase mb-1">Status</label>
                    <select
                      value={settingsForm.status || "REGISTRATION_OPEN"}
                      onChange={(e) => setSettingsForm({ ...settingsForm, status: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/10 text-white cursor-pointer font-bold uppercase"
                    >
                      <option value="DRAFT">DRAFT</option>
                      <option value="REGISTRATION_OPEN">REGISTRATION OPEN</option>
                      <option value="REGISTRATION_CLOSED">REGISTRATION CLOSED</option>
                      <option value="ONGOING">ONGOING</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-400 font-bold uppercase mb-1">Prize Pool</label>
                    <input
                      type="text"
                      value={settingsForm.prizePool || "₹50,000"}
                      onChange={(e) => setSettingsForm({ ...settingsForm, prizePool: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 font-bold uppercase mb-1">Max Teams Capacity</label>
                    <input
                      type="number"
                      value={settingsForm.totalTeams || 32}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          totalTeams: parseInt(e.target.value) || 32,
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/10 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 font-bold uppercase mb-1">Rules</label>
                  <textarea
                    rows={4}
                    value={settingsForm.rules || ""}
                    onChange={(e) => setSettingsForm({ ...settingsForm, rules: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/10 text-white font-mono text-[11px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* ================= SQUAD REGISTRATION DETAILS MODAL ================= */}
      {activeRegDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl border border-white/15 bg-[#0D0D12] p-6 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] font-mono text-[#FFBE32]">
                  {activeRegDetail.registrationNumber}
                </span>
                <h3 className="font-display text-2xl uppercase text-white">
                  {activeRegDetail.teamName}
                </h3>
              </div>
              <button
                onClick={() => setActiveRegDetail(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Captain & Contact */}
            <div className="p-4 rounded-xl bg-black/50 border border-white/5 space-y-2 text-xs">
              <div className="text-[10px] uppercase font-bold text-gray-400">Team Leader / Captain Info</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono">
                <div>
                  <span className="text-gray-500 block text-[10px]">Captain IGN:</span>
                  <span className="text-white font-bold">{activeRegDetail.captainIgn}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px]">Full Name:</span>
                  <span className="text-white">{activeRegDetail.captainName || "Not specified"}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px]">WhatsApp:</span>
                  <span className="text-white">{activeRegDetail.whatsapp}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px]">Discord:</span>
                  <span className="text-white">{activeRegDetail.discordTag || "N/A"}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px]">Email:</span>
                  <span className="text-white">{activeRegDetail.captainEmail || "N/A"}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px]">Current Stage:</span>
                  <span className="text-[#FFBE32] font-bold">
                    {stages.find((s) => s.id === activeRegDetail.currentStageId)?.name || "Round 1"}
                  </span>
                </div>
              </div>
            </div>

            {/* Players List */}
            <div className="space-y-2">
              <div className="text-xs uppercase font-bold text-gray-400">Squad Roster</div>
              <div className="rounded-xl border border-white/10 bg-black/40 divide-y divide-white/5 text-xs font-mono">
                {activeRegDetail.players && activeRegDetail.players.length > 0 ? (
                  activeRegDetail.players.map((p, idx) => (
                    <div key={p.id || idx} className="p-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-500">0{idx + 1}</span>
                        <span className="font-bold text-white">{p.ign}</span>
                        {p.isCaptain && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-[#FFBE32] text-[9px] font-bold">
                            IGL
                          </span>
                        )}
                        {p.isSubstitute && (
                          <span className="px-1.5 py-0.2 rounded bg-white/10 text-gray-400 text-[9px]">
                            SUB
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-gray-400 text-[11px]">
                        <span>ID: {p.playerId || "N/A"}</span>
                        <span className="text-amber-400 uppercase">{p.role}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-gray-400">{activeRegDetail.playerNames}</div>
                )}
              </div>
            </div>

            {/* Payment Details */}
            {activeRegDetail.payment && (
              <div className="p-4 rounded-xl bg-black/50 border border-white/5 space-y-2 text-xs">
                <div className="text-[10px] uppercase font-bold text-gray-400">Payment Verification Info</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                  <div>
                    <span className="text-gray-500 block text-[10px]">Amount:</span>
                    <span className="text-[#FFBE32] font-bold">₹{activeRegDetail.payment.amount}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px]">Method:</span>
                    <span className="text-white">{activeRegDetail.payment.method}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px]">UTR:</span>
                    <span className="text-cyan-400 font-bold">{activeRegDetail.payment.utr || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px]">Status:</span>
                    <span className="text-emerald-400 font-bold">{activeRegDetail.payment.status}</span>
                  </div>
                </div>

                {activeRegDetail.payment.screenshot && (
                  <div className="pt-2">
                    <button
                      onClick={() => setPreviewScreenshot(activeRegDetail.payment?.screenshot || null)}
                      className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white inline-flex items-center gap-1.5"
                    >
                      <Eye className="h-3.5 w-3.5 text-[#FFBE32]" /> View Payment Screenshot
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleUpdatePayment(activeRegDetail.id, "VERIFIED", true)}
                  className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-black font-heading font-bold text-xs uppercase cursor-pointer"
                >
                  Verify Payment &amp; Approve
                </button>
                <button
                  onClick={() => handleUpdateRegStatus(activeRegDetail.id, "REJECTED")}
                  className="px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white font-heading font-bold text-xs uppercase cursor-pointer"
                >
                  Reject Squad
                </button>
              </div>

              <button
                onClick={() => setActiveRegDetail(null)}
                className="px-4 py-2 rounded-xl bg-white/10 text-white font-heading font-bold text-xs uppercase"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= SCREENSHOT PREVIEW MODAL ================= */}
      {previewScreenshot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <div className="relative max-w-xl w-full rounded-2xl bg-[#0D0D12] border border-white/20 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-heading text-xs font-bold uppercase text-white">
                Payment Screenshot Verification
              </span>
              <button
                onClick={() => setPreviewScreenshot(null)}
                className="text-gray-400 hover:text-white p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="max-h-[70vh] overflow-auto rounded-lg">
              <img
                src={previewScreenshot}
                alt="Payment Screenshot Proof"
                className="w-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
