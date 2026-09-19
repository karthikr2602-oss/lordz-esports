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
  DollarSign
} from "lucide-react";

export const AdminTournamentsPage: React.FC = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTournament, setEditingTournament] = useState<Tournament | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    game: "FREE FIRE MAX",
    gameCategory: "FREE FIRE MAX" as any,
    status: "UPCOMING" as "LIVE" | "UPCOMING" | "COMPLETED",
    prizePool: "₹50,000",
    entryFee: "FREE ENTRY",
    slots: "32 TEAMS",
    date: "",
    format: "BATTLE ROYALE • 6 MATCHES",
    featured: false,
    tagline: "",
    streamUrl: "",
    totalTeams: 32,
  });

  const loadTournaments = async () => {
    setLoading(true);
    try {
      const data = await tournamentsApi.getAll({
        status: statusFilter,
        search: searchQuery,
      });
      setTournaments(data);
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
      game: "FREE FIRE MAX",
      gameCategory: "FREE FIRE MAX",
      status: "UPCOMING",
      prizePool: "₹50,000",
      entryFee: "FREE ENTRY",
      slots: "32 TEAMS",
      date: "LIVE SOON • 6:00 PM IST",
      format: "BATTLE ROYALE • 6 MATCHES",
      featured: false,
      tagline: "The pinnacle championship of mobile esports supremacy.",
      streamUrl: "https://www.youtube.com",
      totalTeams: 32,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (t: Tournament) => {
    setEditingTournament(t);
    setFormData({
      title: t.title,
      game: t.game,
      gameCategory: t.gameCategory,
      status: t.status,
      prizePool: t.prizePool,
      entryFee: t.entryFee,
      slots: t.slots,
      date: t.date,
      format: t.format,
      featured: !!t.featured,
      tagline: t.tagline,
      streamUrl: t.streamUrl || "",
      totalTeams: t.totalTeams || 32,
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
        const newId = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        const newTournament: Tournament = {
          id: newId,
          ...formData,
          registeredTeams: 0,
        };
        try {
          await tournamentsApi.create(newTournament);
        } catch {
          // fallback optimistic
        }
        setTournaments((prev) => [newTournament, ...prev]);
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

  const handleToggleStatus = async (tournament: Tournament, newStatus: "LIVE" | "UPCOMING" | "COMPLETED") => {
    try {
      await tournamentsApi.update(tournament.id, { status: newStatus });
    } catch {
      // optimistic
    }
    setTournaments((prev) =>
      prev.map((t) => (t.id === tournament.id ? { ...t, status: newStatus } : t))
    );
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
            Create, schedule, broadcast, and publish Free Fire & mobile esports tournaments.
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
          {["ALL", "LIVE", "UPCOMING", "COMPLETED"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-4 py-1.5 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-all cursor-pointer ${
                statusFilter === st
                  ? "bg-[#FFBE32] text-black shadow-[0_0_10px_rgba(255,190,50,0.3)] font-extrabold"
                  : "bg-black/50 text-gray-400 hover:text-white border border-white/5"
              }`}
            >
              {st}
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

      {/* Tournament Cards Table */}
      {loading ? (
        <div className="py-20 text-center text-gray-400 font-mono text-xs animate-pulse">
          Loading tournaments...
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {tournaments.map((t) => (
          <div
            key={t.id}
            className="p-5 rounded-2xl bg-[#0C0C10] border border-white/10 hover:border-[#FFBE32]/40 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5 group"
          >
            {/* Left Info */}
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-black border border-white/10 text-[10px] font-mono font-bold text-[#FFBE32] uppercase">
                  {t.gameCategory}
                </span>

                {/* Status Switcher Dropdown / Pill */}
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-heading font-bold uppercase tracking-wider ${
                    t.status === "LIVE"
                      ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                      : t.status === "UPCOMING"
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      : "bg-neutral-800 text-neutral-400 border border-neutral-700"
                  }`}
                >
                  {t.status === "LIVE" && <Radio className="h-2.5 w-2.5 animate-pulse" />}
                  {t.status}
                </span>

                {t.featured && (
                  <span className="px-2 py-0.5 rounded bg-[#FFBE32]/20 text-[#FFBE32] border border-[#FFBE32]/40 text-[9px] font-mono uppercase font-bold">
                    Featured Hero
                  </span>
                )}
              </div>

              <h3 className="font-display text-2xl uppercase tracking-wider text-white group-hover:text-[#FFBE32] transition-colors">
                {t.title}
              </h3>

              <p className="text-xs text-gray-400 font-body max-w-2xl line-clamp-1">
                {t.tagline}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-gray-400 pt-1">
                <span className="flex items-center gap-1 text-[#FFBE32]">
                  <DollarSign className="h-3.5 w-3.5" /> Pool: <strong>{t.prizePool}</strong>
                </span>
                <span className="flex items-center gap-1 text-gray-300">
                  <Users className="h-3.5 w-3.5 text-gray-400" /> Slots: {t.registeredTeams || 0} / {t.totalTeams} Teams
                </span>
                <span className="flex items-center gap-1 text-gray-400">
                  <Calendar className="h-3.5 w-3.5" /> {t.date}
                </span>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex flex-wrap lg:flex-nowrap items-center gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-white/5">
              {/* Status Quick Switch Buttons */}
              <div className="flex items-center p-1 rounded-xl bg-black/60 border border-white/10">
                <button
                  onClick={() => handleToggleStatus(t, "LIVE")}
                  className={`px-2.5 py-1 text-[10px] font-heading font-bold rounded uppercase transition-colors cursor-pointer ${
                    t.status === "LIVE" ? "bg-rose-500 text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Live
                </button>
                <button
                  onClick={() => handleToggleStatus(t, "UPCOMING")}
                  className={`px-2.5 py-1 text-[10px] font-heading font-bold rounded uppercase transition-colors cursor-pointer ${
                    t.status === "UPCOMING" ? "bg-amber-500 text-black" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Upcoming
                </button>
                <button
                  onClick={() => handleToggleStatus(t, "COMPLETED")}
                  className={`px-2.5 py-1 text-[10px] font-heading font-bold rounded uppercase transition-colors cursor-pointer ${
                    t.status === "COMPLETED" ? "bg-neutral-700 text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  End
                </button>
              </div>

              {/* Registrations CTA */}
              <Link
                to={`/registrations?tournamentId=${t.id}`}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-[#FFBE32] transition-colors"
                title="View Squad Registrations"
              >
                <Users className="h-4 w-4" />
              </Link>

              {/* Edit */}
              <button
                onClick={() => handleOpenEdit(t)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-[#FFBE32] transition-colors cursor-pointer"
                title="Edit Tournament"
              >
                <Edit className="h-4 w-4" />
              </button>

              {/* Delete */}
              <button
                onClick={() => setDeleteId(t.id)}
                className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/10 border border-white/10 text-gray-400 hover:text-rose-400 transition-colors cursor-pointer"
                title="Delete Tournament"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Create / Edit Modal Dialog */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-2xl bg-[#0D0D12] border border-[#FFBE32]/40 p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.9)] max-h-[90vh] overflow-y-auto">
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
                    onChange={(e) => setFormData({ ...formData, gameCategory: e.target.value as any, game: e.target.value })}
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
                    className="w-full rounded-xl border border-white/15 bg-black/60 px-4 py-2.5 text-sm text-white focus:border-[#FFBE32] focus:outline-none"
                  >
                    <option value="UPCOMING">UPCOMING</option>
                    <option value="LIVE">LIVE NOW</option>
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
                    Entry Fee
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.entryFee}
                    onChange={(e) => setFormData({ ...formData, entryFee: e.target.value })}
                    placeholder="e.g. FREE ENTRY"
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
                    onChange={(e) => setFormData({ ...formData, totalTeams: Number(e.target.value), slots: `${e.target.value} TEAMS` })}
                    placeholder="32"
                    className="w-full rounded-xl border border-white/15 bg-black/60 px-4 py-2.5 text-sm text-white focus:border-[#FFBE32] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                <div>
                  <label className="block text-xs font-heading font-bold uppercase tracking-wider text-gray-300 mb-1">
                    Format
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.format}
                    onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                    placeholder="e.g. BATTLE ROYALE • 6 MATCHES"
                    className="w-full rounded-xl border border-white/15 bg-black/60 px-4 py-2.5 text-sm text-white focus:border-[#FFBE32] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-heading font-bold uppercase tracking-wider text-gray-300 mb-1">
                  Tagline / Broadcast Subtitle
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="Official championship showdown for mobile warriors."
                  className="w-full rounded-xl border border-white/15 bg-black/60 px-4 py-2.5 text-sm text-white focus:border-[#FFBE32] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-heading font-bold uppercase tracking-wider text-gray-300 mb-1">
                  YouTube Livestream Link
                </label>
                <input
                  type="url"
                  value={formData.streamUrl}
                  onChange={(e) => setFormData({ ...formData, streamUrl: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full rounded-xl border border-white/15 bg-black/60 px-4 py-2.5 text-sm text-white focus:border-[#FFBE32] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded border-white/20 bg-black accent-[#FFBE32] h-4 w-4"
                />
                <label htmlFor="featured" className="text-xs font-heading uppercase text-gray-300 cursor-pointer">
                  Feature prominently on public website hero & tournament banner
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-white/15 text-xs font-heading font-bold text-gray-300 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#FFBE32] hover:bg-[#FFA000] text-black font-heading text-xs font-bold uppercase tracking-wider cursor-pointer shadow-[0_0_15px_rgba(255,190,50,0.3)]"
                >
                  Save Tournament
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-2xl bg-[#0D0D12] border border-rose-500/40 p-6 text-center space-y-4 shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
            <div className="h-12 w-12 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
              <Trash2 className="h-6 w-6" />
            </div>
            <h4 className="font-display text-2xl uppercase text-white">Delete Tournament?</h4>
            <p className="text-xs text-gray-400">
              This will permanently delete this tournament and its registered squads. This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-xl border border-white/15 text-xs font-heading font-bold text-gray-300 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-heading text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
