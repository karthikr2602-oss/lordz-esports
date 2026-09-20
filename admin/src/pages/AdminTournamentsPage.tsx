import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { tournamentsApi } from "../api/tournaments";
import { type Tournament, tournamentsData } from "../data/tournaments";
import {
  Plus,
  Search,
  Radio,
  Edit,
  Trash2,
  Users,
  X,
  Calendar,
  DollarSign,
  Copy,
  ArrowRight,
  Shield,
} from "lucide-react";

export const AdminTournamentsPage: React.FC = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTournament, setEditingTournament] = useState<Tournament | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [uploadingBanner, setUploadingBanner] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    game: "FREE FIRE MAX",
    gameCategory: "FREE FIRE MAX" as any,
    status: "REGISTRATION_OPEN" as any,
    prizePool: "₹50,000",
    firstPrize: "₹30,000",
    secondPrize: "₹15,000",
    thirdPrize: "₹5,000",
    entryFee: "₹499 / SQUAD",
    feeAmount: 499,
    currency: "INR",
    slots: "128 TEAMS",
    totalTeams: 128,
    teamSize: 4,
    maxPlayersPerTeam: 5,
    substituteCount: 1,
    date: "SEP 28, 2026 • 6:00 PM IST",
    startDate: "2026-09-28T18:00:00Z",
    endDate: "2026-09-30T22:00:00Z",
    regStartDate: "2026-09-10T00:00:00Z",
    regEndDate: "2026-09-26T23:59:59Z",
    format: "Group Stage + Knockout",
    featured: false,
    tagline: "The pinnacle championship of mobile esports supremacy.",
    shortDescription: "",
    description: "",
    streamUrl: "",
    bannerImage: "" as string | null,
    rules: "1. Emulators strictly banned.\n2. In-game anti-cheat recording required.\n3. Discord check-in mandatory.",
    termsConditions: "Registration fees are strictly non-refundable once slots are reserved.",
    upiId: "lordzesports@upi",
    upiQrImage: "" as string | null,
  });

  const loadTournaments = async () => {
    setLoading(true);
    try {
      const data = await tournamentsApi.getAll({
        status: statusFilter,
        search: searchQuery,
      });
      setTournaments(data && data.length > 0 ? data : tournamentsData);
    } catch {
      setTournaments(tournamentsData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTournaments();
  }, [statusFilter, searchQuery]);

  const handleOpenCreate = () => {
    setEditingTournament(null);
    setFormData({
      title: "",
      slug: "",
      game: "FREE FIRE MAX",
      gameCategory: "FREE FIRE MAX",
      status: "REGISTRATION_OPEN",
      prizePool: "₹50,000",
      firstPrize: "₹30,000",
      secondPrize: "₹15,000",
      thirdPrize: "₹5,000",
      entryFee: "₹499 / SQUAD",
      feeAmount: 499,
      currency: "INR",
      slots: "128 TEAMS",
      totalTeams: 128,
      teamSize: 4,
      maxPlayersPerTeam: 5,
      substituteCount: 1,
      date: "SEP 28, 2026 • 6:00 PM IST",
      startDate: "2026-09-28T18:00:00Z",
      endDate: "2026-09-30T22:00:00Z",
      regStartDate: "2026-09-10T00:00:00Z",
      regEndDate: "2026-09-26T23:59:59Z",
      format: "Group Stage + Knockout",
      featured: false,
      tagline: "The pinnacle championship of South Indian esports supremacy.",
      shortDescription: "",
      description: "",
      streamUrl: "https://www.youtube.com",
      bannerImage: "/uploads/partner-freefire.png",
      rules: "1. Emulators strictly banned.\n2. In-game anti-cheat recording required.\n3. Discord check-in mandatory.",
      termsConditions: "Registration fees are strictly non-refundable once slots are reserved.",
      upiId: "lordzesports@upi",
      upiQrImage: "/uploads/partner-ewc.png",
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (t: Tournament) => {
    setEditingTournament(t);
    setFormData({
      title: t.title,
      slug: t.slug || t.id,
      game: t.game,
      gameCategory: t.gameCategory as any,
      status: t.status as any,
      prizePool: t.prizePool,
      firstPrize: t.firstPrize || "",
      secondPrize: t.secondPrize || "",
      thirdPrize: t.thirdPrize || "",
      entryFee: t.entryFee,
      feeAmount: t.feeAmount || 0,
      currency: t.currency || "INR",
      slots: t.slots,
      totalTeams: t.totalTeams || 32,
      teamSize: t.teamSize || 4,
      maxPlayersPerTeam: t.maxPlayersPerTeam || 5,
      substituteCount: t.substituteCount || 1,
      date: t.date,
      startDate: t.startDate || "",
      endDate: t.endDate || "",
      regStartDate: t.regStartDate || "",
      regEndDate: t.regEndDate || "",
      format: t.format,
      featured: !!t.featured,
      tagline: t.tagline,
      shortDescription: t.shortDescription || "",
      description: t.description || "",
      streamUrl: t.streamUrl || "",
      bannerImage: t.bannerImage || null,
      rules: t.rules || "",
      termsConditions: t.termsConditions || "",
      upiId: t.upiId || "lordzesports@upi",
      upiQrImage: t.upiQrImage || null,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTournament) {
        await tournamentsApi.update(editingTournament.id, formData);
        setTournaments((prev) =>
          prev.map((item) =>
            item.id === editingTournament.id ? { ...item, ...formData } : item
          )
        );
      } else {
        const newId =
          formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        const newTournament: Tournament = {
          id: newId,
          ...formData,
          registeredTeams: 0,
        };
        try {
          const created = await tournamentsApi.create(newTournament);
          setTournaments((prev) => [created || newTournament, ...prev]);
        } catch {
          setTournaments((prev) => [newTournament, ...prev]);
        }
      }
      setModalOpen(false);
    } catch (err: any) {
      alert(err.message || "Failed to save tournament");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await tournamentsApi.delete(id);
    } catch {
      // optimistic
    }
    setTournaments((prev) => prev.filter((t) => t.id !== id));
    setDeleteId(null);
  };

  const handleDuplicate = async (id: string) => {
    try {
      const duplicated = await tournamentsApi.duplicate(id);
      setTournaments((prev) => [duplicated, ...prev]);
    } catch {
      alert("Failed to duplicate tournament");
    }
  };

  const handleBannerUpload = async (file: File) => {
    setUploadingBanner(true);
    try {
      const res = await tournamentsApi.uploadImage(file);
      setFormData((prev) => ({ ...prev, bannerImage: res.url }));
    } catch (err: any) {
      alert(err.message || "Failed to upload banner");
    } finally {
      setUploadingBanner(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Title and Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl uppercase tracking-wider text-white">
            TOURNAMENT ENGINE MANAGEMENT
          </h1>
          <p className="text-xs text-gray-400 font-body">
            Create, schedule, broadcast, and administer Free Fire MAX tournaments, stages, and leaderboards.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-heading text-xs font-bold uppercase tracking-wider text-black bg-[#FFBE32] hover:bg-[#FFA000] transition-all cursor-pointer shadow-[0_0_15px_rgba(255,190,50,0.3)] shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Create Tournament</span>
        </button>
      </div>

      {/* Filters and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#0D0D12] border border-white/10 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Status Pill Tabs */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {["ALL", "REGISTRATION_OPEN", "LIVE", "UPCOMING", "COMPLETED"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-4 py-1.5 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-all cursor-pointer ${
                statusFilter === st
                  ? "bg-[#FFBE32] text-black shadow-[0_0_10px_rgba(255,190,50,0.3)] font-extrabold"
                  : "bg-black/50 text-gray-400 hover:text-white border border-white/5"
              }`}
            >
              {st.replace("_", " ")}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tournament title..."
            className="w-full rounded-xl border border-white/10 bg-black/60 pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:border-[#FFBE32] focus:outline-none"
          />
        </div>
      </div>

      {/* Tournament Cards Grid */}
      {loading ? (
        <div className="py-20 text-center text-gray-400 font-mono text-xs animate-pulse">
          Loading tournaments...
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {tournaments.map((t) => {
            const registeredCount = t.registeredTeams ?? (t.stats?.total || 0);
            const maxCount = t.totalTeams || 32;

            return (
              <div
                key={t.id}
                className="rounded-2xl bg-[#0C0C10] border border-white/10 hover:border-[#FFBE32]/40 transition-all flex flex-col lg:flex-row overflow-hidden group shadow-xl"
              >
                {/* Banner Thumbnail (Left on desktop) */}
                <div className="relative lg:w-72 h-44 lg:h-auto bg-[#141419] shrink-0 overflow-hidden">
                  {t.bannerImage ? (
                    <img
                      src={t.bannerImage}
                      alt={t.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-black via-[#141419] to-black p-4 text-center">
                      <Shield className="h-8 w-8 text-gray-600 mb-1" />
                      <span className="text-[10px] text-gray-500 font-mono">LORDZ ARENA</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/80 via-transparent to-transparent" />

                  {/* Registered Count Badge on Banner */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/80 border border-[#FFBE32]/40 text-[#FFBE32] font-heading font-extrabold text-[11px] uppercase tracking-wider backdrop-blur-md shadow-lg">
                    {registeredCount} TEAMS REGISTERED
                  </div>
                </div>

                {/* Center Content */}
                <div className="p-5 flex-1 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded bg-black border border-white/10 text-[10px] font-mono font-bold text-[#FFBE32] uppercase">
                        {t.gameCategory || t.game}
                      </span>

                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-heading font-bold uppercase tracking-wider ${
                          t.status === "LIVE"
                            ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                            : t.status === "REGISTRATION_OPEN" || t.status === "UPCOMING"
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            : "bg-neutral-800 text-neutral-400 border border-neutral-700"
                        }`}
                      >
                        {t.status === "LIVE" && <Radio className="h-2.5 w-2.5 animate-pulse" />}
                        {t.status.replace("_", " ")}
                      </span>

                      {t.featured && (
                        <span className="px-2 py-0.5 rounded bg-[#FFBE32]/20 text-[#FFBE32] border border-[#FFBE32]/40 text-[9px] font-mono uppercase font-bold">
                          Featured Hero
                        </span>
                      )}
                    </div>

                    <Link to={`/tournaments/${t.id}`}>
                      <h3 className="font-display text-2xl uppercase tracking-wider text-white hover:text-[#FFBE32] transition-colors">
                        {t.title}
                      </h3>
                    </Link>

                    <p className="text-xs text-gray-400 font-body max-w-2xl line-clamp-1">
                      {t.tagline}
                    </p>
                  </div>

                  {/* Prominent Registered Teams Counter + Metadata */}
                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono pt-1">
                    {/* CRITICAL CORE REQUIREMENT: Display "XX / YY TEAMS REGISTERED" */}
                    <div className="px-3 py-1.5 rounded-lg bg-black/70 border border-[#FFBE32]/30 text-white font-bold inline-flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-[#FFBE32]" />
                      <span className="text-[#FFBE32] text-sm font-display">{registeredCount}</span>
                      <span className="text-gray-400">/ {maxCount} TEAMS REGISTERED</span>
                    </div>

                    <span className="flex items-center gap-1 text-[#FFBE32]">
                      <DollarSign className="h-3.5 w-3.5" /> Pool: <strong>{t.prizePool}</strong>
                    </span>

                    <span className="flex items-center gap-1 text-gray-300">
                      Fee: <strong>{t.feeAmount && t.feeAmount > 0 ? `₹${t.feeAmount}` : t.entryFee}</strong>
                    </span>

                    <span className="flex items-center gap-1 text-gray-400">
                      <Calendar className="h-3.5 w-3.5" /> {t.date}
                    </span>
                  </div>
                </div>

                {/* Right Action Rail */}
                <div className="p-5 lg:border-l border-white/5 flex lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-3 bg-black/20 shrink-0">
                  <Link
                    to={`/tournaments/${t.id}`}
                    className="w-full lg:w-40 py-2.5 px-4 rounded-xl font-heading text-xs font-bold uppercase tracking-wider bg-[#FFBE32] hover:bg-[#FFA000] text-black text-center transition-all shadow-[0_0_12px_rgba(255,190,50,0.2)] flex items-center justify-center gap-1.5"
                  >
                    <span>Manage Hub</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDuplicate(t.id)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white"
                      title="Duplicate Tournament"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(t)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-[#FFBE32]"
                      title="Edit Tournament"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeleteId(t.id)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/10 border border-white/10 text-gray-400 hover:text-rose-400"
                      title="Delete Tournament"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-2xl bg-[#0D0D12] border border-red-500/30 p-6 space-y-4 shadow-2xl">
            <h3 className="font-display text-xl uppercase text-white">Delete Tournament</h3>
            <p className="text-xs text-gray-400 font-body">
              Are you sure you want to delete this tournament? This will remove all associated stages, registrations, and leaderboards.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-xl border border-white/10 text-xs font-heading font-bold text-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-heading font-bold text-xs uppercase"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Modal Dialog */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-3xl rounded-2xl bg-[#0D0D12] border border-[#FFBE32]/40 p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.9)] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <h3 className="font-display text-2xl uppercase tracking-wider text-white">
                {editingTournament ? "Edit Tournament" : "Create New Tournament"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Banner Upload Field with Aspect Ratio Hint */}
              <div>
                <label className="block text-xs font-heading font-bold uppercase tracking-wider text-gray-300 mb-1">
                  Tournament Banner (Recommended aspect ratio 16:9 or 21:9)
                </label>
                {formData.bannerImage && (
                  <div className="h-36 rounded-xl overflow-hidden mb-2 border border-white/10">
                    <img
                      src={formData.bannerImage}
                      alt="Banner Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleBannerUpload(e.target.files[0]);
                    }
                  }}
                  className="w-full text-xs text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-heading file:font-bold file:bg-[#FFBE32] file:text-black cursor-pointer"
                />
                {uploadingBanner && (
                  <div className="text-xs text-[#FFBE32] mt-1 font-mono animate-pulse">
                    Uploading banner...
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-heading font-bold uppercase tracking-wider text-gray-300 mb-1">
                  Tournament Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. FLAME OF GLORY S3 FINALS"
                  className="w-full rounded-xl border border-white/15 bg-black/60 px-4 py-2.5 text-sm text-white focus:border-[#FFBE32] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-heading font-bold uppercase tracking-wider text-gray-300 mb-1">
                    Game Category
                  </label>
                  <select
                    value={formData.gameCategory}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        gameCategory: e.target.value as any,
                        game: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-white/15 bg-black/60 px-4 py-2.5 text-sm text-white focus:border-[#FFBE32] focus:outline-none"
                  >
                    <option value="FREE FIRE MAX">FREE FIRE MAX</option>
                    <option value="FREE FIRE">FREE FIRE</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-heading font-bold uppercase tracking-wider text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full rounded-xl border border-white/15 bg-black/60 px-4 py-2.5 text-sm text-white focus:border-[#FFBE32] focus:outline-none uppercase font-bold"
                  >
                    <option value="DRAFT">DRAFT</option>
                    <option value="REGISTRATION_OPEN">REGISTRATION OPEN</option>
                    <option value="REGISTRATION_CLOSED">REGISTRATION CLOSED</option>
                    <option value="ONGOING">ONGOING</option>
                    <option value="COMPLETED">COMPLETED</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-heading font-bold uppercase tracking-wider text-gray-300 mb-1">
                    Prize Pool
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.prizePool}
                    onChange={(e) => setFormData({ ...formData, prizePool: e.target.value })}
                    placeholder="e.g. ₹50,000"
                    className="w-full rounded-xl border border-white/15 bg-black/60 px-4 py-2.5 text-sm text-white focus:border-[#FFBE32] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-heading font-bold uppercase tracking-wider text-gray-300 mb-1">
                    Registration Fee (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.feeAmount}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      setFormData({
                        ...formData,
                        feeAmount: val,
                        entryFee: val > 0 ? `₹${val} / SQUAD` : "FREE ENTRY",
                      });
                    }}
                    placeholder="499"
                    className="w-full rounded-xl border border-white/15 bg-black/60 px-4 py-2.5 text-sm text-white focus:border-[#FFBE32] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-heading font-bold uppercase tracking-wider text-gray-300 mb-1">
                    Max Slots (Teams)
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.totalTeams}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        totalTeams: Number(e.target.value),
                        slots: `${e.target.value} TEAMS`,
                      })
                    }
                    placeholder="128"
                    className="w-full rounded-xl border border-white/15 bg-black/60 px-4 py-2.5 text-sm text-white focus:border-[#FFBE32] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-heading font-bold uppercase tracking-wider text-gray-300 mb-1">
                    Payment UPI ID
                  </label>
                  <input
                    type="text"
                    value={formData.upiId}
                    onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                    placeholder="lordzesports@upi"
                    className="w-full rounded-xl border border-white/15 bg-black/60 px-4 py-2.5 text-sm text-white focus:border-[#FFBE32] focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-heading font-bold uppercase tracking-wider text-gray-300 mb-1">
                    Schedule / Date Display
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    placeholder="e.g. SEP 28, 2026 • 6:00 PM IST"
                    className="w-full rounded-xl border border-white/15 bg-black/60 px-4 py-2.5 text-sm text-white focus:border-[#FFBE32] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-heading font-bold uppercase tracking-wider text-gray-300 mb-1">
                  Tagline / Short Summary
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="The pinnacle championship of mobile esports supremacy."
                  className="w-full rounded-xl border border-white/15 bg-black/60 px-4 py-2.5 text-sm text-white focus:border-[#FFBE32] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-heading font-bold uppercase tracking-wider text-gray-300 mb-1">
                  Tournament Rules
                </label>
                <textarea
                  rows={3}
                  value={formData.rules}
                  onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                  className="w-full rounded-xl border border-white/15 bg-black/60 px-4 py-2.5 text-xs text-white focus:border-[#FFBE32] focus:outline-none font-mono"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-white/10 text-xs font-heading font-bold uppercase tracking-wider text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#FFBE32] hover:bg-[#FFA000] text-black font-heading font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(255,190,50,0.3)]"
                >
                  {editingTournament ? "Save Changes" : "Publish Tournament"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
