import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { votingApi, type VotingEvent } from "../api/voting";
import { playersApi } from "../api/players";
import { type Player, playersData } from "../data/players";
import {
  Vote,
  Plus,
  Search,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  Archive,
  Trash2,
  Edit,
  BarChart3,
  X,
  Flame,
  AlertTriangle,
  Loader2,
  TrendingUp,
} from "lucide-react";

export const AdminVotingPage: React.FC = () => {
  const [events, setEvents] = useState<VotingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Create / Edit Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Available Players for Nominee Picker
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [playerSearch, setPlayerSearch] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    bannerImage: "",
    startDate: "",
    endDate: "",
    status: "DRAFT" as "DRAFT" | "PUBLISHED" | "CLOSED" | "ARCHIVED",
    isLiveResults: false,
    playerIds: [] as string[],
  });

  // Delete Dialog State
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Load Events & Players
  const loadData = async () => {
    setLoading(true);
    try {
      const [eventsRes, playersRes] = await Promise.all([
        votingApi.getAll(),
        playersApi.getAll().catch(() => playersData),
      ]);
      setEvents(eventsRes || []);
      setAllPlayers(playersRes && playersRes.length > 0 ? playersRes : playersData);
    } catch {
      setEvents([]);
      setAllPlayers(playersData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Format date helper for datetime-local inputs
  const toDatetimeLocal = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const handleOpenCreate = () => {
    setEditingEventId(null);
    setErrorMsg(null);
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    setFormData({
      title: "",
      slug: "",
      description: "",
      bannerImage: "",
      startDate: toDatetimeLocal(now.toISOString()),
      endDate: toDatetimeLocal(nextWeek.toISOString()),
      status: "DRAFT",
      isLiveResults: false,
      playerIds: [],
    });
    setPlayerSearch("");
    setModalOpen(true);
  };

  const handleOpenEdit = async (event: VotingEvent) => {
    setEditingEventId(event.id);
    setErrorMsg(null);

    // Fetch complete event details to populate selected nominees
    try {
      const full = await votingApi.getById(event.id);
      const existingPlayerIds = full.nominees?.map((n) => n.playerId) || [];

      setFormData({
        title: full.title,
        slug: full.slug || "",
        description: full.description || "",
        bannerImage: full.bannerImage || "",
        startDate: toDatetimeLocal(full.startDate),
        endDate: toDatetimeLocal(full.endDate),
        status: full.status,
        isLiveResults: full.isLiveResults,
        playerIds: existingPlayerIds,
      });
    } catch {
      setFormData({
        title: event.title,
        slug: event.slug || "",
        description: event.description || "",
        bannerImage: event.bannerImage || "",
        startDate: toDatetimeLocal(event.startDate),
        endDate: toDatetimeLocal(event.endDate),
        status: event.status,
        isLiveResults: event.isLiveResults,
        playerIds: [],
      });
    }

    setPlayerSearch("");
    setModalOpen(true);
  };

  const handleTogglePlayer = (playerId: string) => {
    setFormData((prev) => {
      const exists = prev.playerIds.includes(playerId);
      return {
        ...prev,
        playerIds: exists
          ? prev.playerIds.filter((id) => id !== playerId)
          : [...prev.playerIds, playerId],
      };
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formData.title.trim()) {
      setErrorMsg("Please enter an event title.");
      return;
    }
    if (!formData.startDate || !formData.endDate) {
      setErrorMsg("Please specify both start and end dates.");
      return;
    }
    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      setErrorMsg("End date must be after the start date.");
      return;
    }
    if (formData.playerIds.length === 0) {
      setErrorMsg("Please select at least one nominated player.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: formData.title.trim(),
        slug: formData.slug.trim() || undefined,
        description: formData.description.trim() || undefined,
        bannerImage: formData.bannerImage.trim() || undefined,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        status: formData.status,
        isLiveResults: formData.isLiveResults,
        playerIds: formData.playerIds,
      };

      if (editingEventId) {
        await votingApi.update(editingEventId, payload);
      } else {
        await votingApi.create(payload);
      }

      setModalOpen(false);
      await loadData();
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to save voting event");
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (
    id: string,
    newStatus: "DRAFT" | "PUBLISHED" | "CLOSED" | "ARCHIVED"
  ) => {
    try {
      await votingApi.updateStatus(id, newStatus);
      await loadData();
    } catch (err: any) {
      alert(err?.message || "Failed to update event status");
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    setDeleting(true);
    try {
      await votingApi.delete(deleteConfirmId);
      setDeleteConfirmId(null);
      await loadData();
    } catch (err: any) {
      alert(err?.message || "Failed to delete event");
    } finally {
      setDeleting(false);
    }
  };

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const matchesStatus = statusFilter === "ALL" || e.status === statusFilter;
      const matchesSearch =
        !searchQuery.trim() ||
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (e.description && e.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesStatus && matchesSearch;
    });
  }, [events, statusFilter, searchQuery]);

  // KPI Calculations
  const totalEventsCount = events.length;
  const publishedCount = events.filter((e) => e.status === "PUBLISHED").length;
  const totalVotesCast = events.reduce((acc, curr) => acc + (curr.totalVotes || 0), 0);
  const activeEvent = events.find((e) => e.status === "PUBLISHED");

  // Filtered players for selector
  const filteredPlayers = useMemo(() => {
    if (!playerSearch.trim()) return allPlayers;
    const q = playerSearch.toLowerCase();
    return allPlayers.filter(
      (p) =>
        p.ign.toLowerCase().includes(q) ||
        p.realName.toLowerCase().includes(q) ||
        p.role.toLowerCase().includes(q)
    );
  }, [allPlayers, playerSearch]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-heading font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            PUBLISHED (LIVE)
          </span>
        );
      case "DRAFT":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-heading font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Clock className="h-3 w-3" />
            DRAFT
          </span>
        );
      case "CLOSED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-heading font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <CheckCircle2 className="h-3 w-3" />
            CLOSED
          </span>
        );
      case "ARCHIVED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-heading font-bold bg-gray-500/10 text-gray-400 border border-gray-500/30">
            <Archive className="h-3 w-3" />
            ARCHIVED
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="p-2 rounded-lg bg-[#FFBE32]/10 border border-[#FFBE32]/25 text-[#FFBE32]">
              <Vote className="h-5 w-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-black text-white uppercase tracking-wider">
              Player Voting <span className="text-[#FFBE32]">Management</span>
            </h1>
          </div>
          <p className="text-sm text-gray-400 font-body">
            Publish community voting polls, manage nominated pro athletes, and monitor live voting results.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FFBE32] to-[#FFA000] text-black font-heading font-black text-xs uppercase tracking-wider hover:shadow-[0_0_25px_rgba(255,190,50,0.4)] transition-all cursor-pointer shrink-0"
        >
          <Plus className="h-4 w-4 stroke-[3]" />
          Create Voting Event
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Events */}
        <div className="bg-[#0D0D12] rounded-2xl border border-white/10 p-5 relative overflow-hidden group hover:border-[#FFBE32]/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase tracking-wider text-gray-400">Total Polls</span>
            <Vote className="h-4 w-4 text-[#FFBE32]" />
          </div>
          <p className="text-3xl font-display font-black text-white">{totalEventsCount}</p>
          <span className="text-[11px] text-gray-500 font-body">All-time community events</span>
        </div>

        {/* Live Event */}
        <div className="bg-[#0D0D12] rounded-2xl border border-white/10 p-5 relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase tracking-wider text-gray-400">Active Live Poll</span>
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <p className="text-3xl font-display font-black text-emerald-400">{publishedCount}</p>
          <span className="text-[11px] text-gray-500 font-body truncate block">
            {activeEvent ? activeEvent.title : "No live event currently"}
          </span>
        </div>

        {/* Total Votes Cast */}
        <div className="bg-[#0D0D12] rounded-2xl border border-white/10 p-5 relative overflow-hidden group hover:border-[#FFBE32]/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase tracking-wider text-gray-400">Total Votes Cast</span>
            <TrendingUp className="h-4 w-4 text-[#FFBE32]" />
          </div>
          <p className="text-3xl font-display font-black text-[#FFBE32]">{totalVotesCast.toLocaleString()}</p>
          <span className="text-[11px] text-gray-500 font-body">Verified athlete fan votes</span>
        </div>

        {/* Leading Nominee */}
        <div className="bg-[#0D0D12] rounded-2xl border border-white/10 p-5 relative overflow-hidden group hover:border-amber-400/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase tracking-wider text-gray-400">Leading Athlete</span>
            <Flame className="h-4 w-4 text-[#FFBE32]" />
          </div>
          <p className="text-2xl font-display font-black text-white truncate">
            {activeEvent?.leadingNominee?.ign || "Pending Votes"}
          </p>
          <span className="text-[11px] text-gray-500 font-body">
            {activeEvent?.leadingNominee ? `${activeEvent.leadingNominee.votes} votes in current poll` : "Awaiting fan submissions"}
          </span>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Status Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-[#0D0D12] rounded-xl border border-white/10 overflow-x-auto">
          {["ALL", "PUBLISHED", "DRAFT", "CLOSED", "ARCHIVED"].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-heading font-black tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer ${
                statusFilter === tab
                  ? "bg-[#FFBE32] text-black shadow-[0_0_15px_rgba(255,190,50,0.3)]"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[260px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search events by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#0D0D12] border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FFBE32] transition-colors"
          />
        </div>
      </div>

      {/* Events Table / Cards */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 bg-[#0D0D12] rounded-2xl border border-white/10">
          <Loader2 className="h-8 w-8 text-[#FFBE32] animate-spin mb-3" />
          <span className="text-xs font-mono uppercase tracking-widest text-gray-400">Loading voting events...</span>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-[#0D0D12] rounded-2xl border border-white/10 text-center px-4">
          <div className="p-4 rounded-full bg-white/5 border border-white/10 mb-4 text-gray-500">
            <Vote className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="font-display text-lg text-white uppercase tracking-wider mb-1">
            No Voting Events Found
          </h3>
          <p className="text-xs text-gray-400 max-w-sm font-body mb-5">
            {searchQuery || statusFilter !== "ALL"
              ? "No events match the selected filter criteria. Try adjusting your search query."
              : "Get started by creating your first community player voting event."}
          </p>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFBE32] text-black text-xs font-heading font-black uppercase tracking-wider hover:bg-[#FFA000] cursor-pointer"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            Create Event
          </button>
        </div>
      ) : (
        <div className="bg-[#0D0D12] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-black/40 text-[11px] font-mono text-gray-400 uppercase tracking-widest">
                  <th className="py-3.5 px-4 font-semibold">Event Details</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold">Schedule Window</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Nominees</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Total Votes</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs font-body">
                {filteredEvents.map((event) => {
                  const startStr = new Date(event.startDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });
                  const endStr = new Date(event.endDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });

                  return (
                    <tr key={event.id} className="hover:bg-white/[0.02] transition-colors group">
                      {/* Title & Description */}
                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <span className="font-heading font-black text-sm text-white uppercase tracking-wider group-hover:text-[#FFBE32] transition-colors">
                            {event.title}
                          </span>
                          {event.description && (
                            <span className="text-[11px] text-gray-400 line-clamp-1 max-w-md mt-0.5">
                              {event.description}
                            </span>
                          )}
                          <span className="text-[10px] font-mono text-gray-500 mt-1">ID: {event.id}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 whitespace-nowrap">{getStatusBadge(event.status)}</td>

                      {/* Schedule */}
                      <td className="py-4 px-4 whitespace-nowrap font-mono text-[11px] text-gray-300">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-[#FFBE32]" />
                          <span>
                            {startStr} — {endStr}
                          </span>
                        </div>
                      </td>

                      {/* Nominees Count */}
                      <td className="py-4 px-4 text-center whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/5 border border-white/10 font-mono text-xs text-white">
                          <Users className="h-3 w-3 text-[#FFBE32]" />
                          {event.nomineesCount || 0}
                        </span>
                      </td>

                      {/* Total Votes */}
                      <td className="py-4 px-4 text-center whitespace-nowrap font-mono">
                        <span className="font-bold text-sm text-[#FFBE32]">
                          {(event.totalVotes || 0).toLocaleString()}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Results Link */}
                          <Link
                            to={`/voting/${event.id}`}
                            className="p-1.5 rounded-lg bg-[#FFBE32]/10 hover:bg-[#FFBE32] text-[#FFBE32] hover:text-black transition-all"
                            title="View Results & Analytics"
                          >
                            <BarChart3 className="h-4 w-4" />
                          </Link>

                          {/* Edit */}
                          <button
                            onClick={() => handleOpenEdit(event)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-all cursor-pointer"
                            title="Edit Event"
                          >
                            <Edit className="h-4 w-4" />
                          </button>

                          {/* Status Transitions */}
                          {event.status === "DRAFT" && (
                            <button
                              onClick={() => handleStatusChange(event.id, "PUBLISHED")}
                              className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-black font-heading font-black text-[10px] uppercase tracking-wider transition-all cursor-pointer"
                              title="Publish this event"
                            >
                              Publish
                            </button>
                          )}
                          {event.status === "PUBLISHED" && (
                            <button
                              onClick={() => handleStatusChange(event.id, "CLOSED")}
                              className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-black font-heading font-black text-[10px] uppercase tracking-wider transition-all cursor-pointer"
                              title="Close voting"
                            >
                              Close
                            </button>
                          )}
                          {event.status === "CLOSED" && (
                            <button
                              onClick={() => handleStatusChange(event.id, "ARCHIVED")}
                              className="px-2.5 py-1 rounded-lg bg-gray-500/20 hover:bg-gray-500 text-gray-300 hover:text-white font-heading font-black text-[10px] uppercase tracking-wider transition-all cursor-pointer"
                              title="Archive event"
                            >
                              Archive
                            </button>
                          )}

                          {/* Delete */}
                          <button
                            onClick={() => setDeleteConfirmId(event.id)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white transition-all cursor-pointer"
                            title="Delete Event"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#0C0C10] border border-white/15 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#09090D]">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-[#FFBE32]/10 border border-[#FFBE32]/20 text-[#FFBE32]">
                  <Vote className="h-5 w-5" />
                </div>
                <h3 className="font-display font-black text-lg text-white uppercase tracking-wider">
                  {editingEventId ? "Edit Voting Event" : "Create New Voting Event"}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
              {errorMsg && (
                <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-body">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-gray-300 mb-1.5">
                  Event Title <span className="text-[#FFBE32]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. LORDZ MVP OF THE SEASON 2026"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#14141A] border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FFBE32]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-gray-300 mb-1.5">
                  Description / Subtitle
                </label>
                <textarea
                  rows={2}
                  placeholder="Vote for the champion athlete who delivered the most decisive clutch rounds this season."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#14141A] border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FFBE32]"
                />
              </div>

              {/* Date Schedule */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-gray-300 mb-1.5">
                    Start Date & Time <span className="text-[#FFBE32]">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#14141A] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#FFBE32]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-gray-300 mb-1.5">
                    End Date & Time <span className="text-[#FFBE32]">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#14141A] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#FFBE32]"
                  />
                </div>
              </div>

              {/* Status & Live Results Toggle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-gray-300 mb-1.5">
                    Lifecycle Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-[#14141A] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#FFBE32]"
                  >
                    <option value="DRAFT">DRAFT (Hidden from Public)</option>
                    <option value="PUBLISHED">PUBLISHED (Active & Live)</option>
                    <option value="CLOSED">CLOSED (Voting Ended)</option>
                    <option value="ARCHIVED">ARCHIVED (Historical)</option>
                  </select>
                </div>

                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2.5 p-2.5 bg-[#14141A] border border-white/10 rounded-xl cursor-pointer hover:border-white/20 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.isLiveResults}
                      onChange={(e) => setFormData({ ...formData, isLiveResults: e.target.checked })}
                      className="rounded border-white/20 bg-black text-[#FFBE32] focus:ring-0 focus:ring-offset-0 h-4 w-4"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-heading font-bold text-white uppercase tracking-wider">
                        Live Public Results
                      </span>
                      <span className="text-[10px] text-gray-400">Show percentage bars to public while voting</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Nominee Selection Area */}
              <div className="border-t border-white/10 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-gray-200 block">
                      Select Nominated Players <span className="text-[#FFBE32]">*</span>
                    </span>
                    <span className="text-[11px] text-gray-400">
                      Selected: <strong className="text-[#FFBE32]">{formData.playerIds.length}</strong> athletes
                    </span>
                  </div>

                  {/* Player Search Input */}
                  <div className="relative w-48 sm:w-64">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search roster..."
                      value={playerSearch}
                      onChange={(e) => setPlayerSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-[#14141A] border border-white/10 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FFBE32]"
                    />
                  </div>
                </div>

                {/* Nominee Chips / Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto p-1 border border-white/5 rounded-xl bg-black/40">
                  {filteredPlayers.map((player) => {
                    const isSelected = formData.playerIds.includes(player.id);
                    const imgUrl = player.avatarUrl || player.image || "/players/player-beast.jpg";

                    return (
                      <div
                        key={player.id}
                        onClick={() => handleTogglePlayer(player.id)}
                        className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#FFBE32]/10 border-[#FFBE32] shadow-[0_0_15px_rgba(255,190,50,0.15)]"
                            : "bg-[#121217] border-white/5 hover:border-white/20"
                        }`}
                      >
                        {/* Checkbox indicator */}
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border transition-all ${
                            isSelected
                              ? "bg-[#FFBE32] border-[#FFBE32] text-black"
                              : "border-gray-500 bg-black/50"
                          }`}
                        >
                          {isSelected && <CheckCircle2 className="h-3 w-3 stroke-[3]" />}
                        </div>

                        {/* Player Thumbnail */}
                        <div className="h-9 w-9 rounded-lg overflow-hidden bg-black border border-white/10 shrink-0">
                          <img
                            src={imgUrl}
                            alt={player.ign}
                            className="h-full w-full object-cover object-top"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = "none";
                            }}
                          />
                        </div>

                        {/* Player Info */}
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="font-heading font-black text-xs text-white uppercase tracking-wider truncate">
                            {player.ign}
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono truncate">
                            {player.realName} • <span className="text-[#FFBE32]">{player.role}</span>
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-heading text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FFBE32] to-[#FFA000] text-black font-heading font-black text-xs uppercase tracking-wider hover:shadow-[0_0_20px_rgba(255,190,50,0.35)] transition-all cursor-pointer disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : editingEventId ? (
                    "Update Event"
                  ) : (
                    "Save & Create Event"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="bg-[#0C0C10] border border-white/15 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h4 className="font-display font-black text-lg text-white uppercase tracking-wider">
                Delete Voting Event?
              </h4>
            </div>
            <p className="text-xs text-gray-400 font-body leading-relaxed">
              Are you sure you want to permanently delete this event? Note: Events with recorded votes cannot be deleted to preserve voting integrity; archive them instead.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-heading font-bold uppercase transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-heading font-black uppercase transition-all cursor-pointer disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
