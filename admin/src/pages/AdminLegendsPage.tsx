import React, { useState, useEffect } from "react";
import { playersApi, type LegendItem, fallbackLegends } from "../api/players";
import {
  Sparkles,
  Plus,
  Edit,
  Trash2,
  Award,
  X
} from "lucide-react";

export const AdminLegendsPage: React.FC = () => {
  const [legends, setLegends] = useState<LegendItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLegend, setEditingLegend] = useState<LegendItem | null>(null);

  const [formData, setFormData] = useState<Partial<LegendItem>>({
    ign: "",
    realName: "",
    role: "FOUNDING RUSHER",
    activeYears: "2023 - 2024",
    retiredJerseyNumber: "10",
    achievements: "Inaugural Booyah MVP, Season 1 Regional Champion",
    hallOfFameBio: "",
    highlightVideoUrl: "https://www.youtube.com",
  });

  const loadLegends = async () => {
    setLoading(true);
    try {
      const data = await playersApi.getLegends();
      setLegends(data);
    } catch {
      setLegends(fallbackLegends);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLegends();
  }, []);

  const handleOpenCreate = () => {
    setEditingLegend(null);
    setFormData({
      ign: "",
      realName: "",
      role: "VETERAN CLUTCHER",
      activeYears: "2022 - 2024",
      retiredJerseyNumber: "01",
      achievements: "National Championship Finalist, MVP Season 1",
      hallOfFameBio: "Pioneered early competitive squad strategies that laid the foundation for the organization.",
      highlightVideoUrl: "https://www.youtube.com",
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (leg: LegendItem) => {
    setEditingLegend(leg);
    setFormData(leg);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingLegend) {
        await playersApi.updateLegend(editingLegend.id, formData);
        setLegends((prev) =>
          prev.map((l) => (l.id === editingLegend.id ? ({ ...l, ...formData } as LegendItem) : l))
        );
      } else {
        const newLegend: LegendItem = {
          id: `legend-${formData.ign?.toLowerCase()}`,
          ign: formData.ign?.toUpperCase() || "LEGEND",
          realName: formData.realName || "Veteran",
          role: formData.role || "LEGEND",
          activeYears: formData.activeYears || "2022 - 2024",
          retiredJerseyNumber: formData.retiredJerseyNumber,
          achievements: formData.achievements || "Hall of Fame Honoree",
          hallOfFameBio: formData.hallOfFameBio || "",
          highlightVideoUrl: formData.highlightVideoUrl,
        };
        try {
          await playersApi.createLegend(newLegend);
        } catch {
          // fallback
        }
        setLegends((prev) => [...prev, newLegend]);
      }
      setModalOpen(false);
    } catch (err: any) {
      alert(err.message || "Failed to save legend");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this player from the Hall of Fame?")) return;
    try {
      await playersApi.deleteLegend(id);
    } catch {
      // optimistic
    }
    setLegends((prev) => prev.filter((l) => l.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl uppercase tracking-wider text-white">
            OLD PLAYERS / HALL OF FAME LEGENDS
          </h1>
          <p className="text-xs text-gray-400 font-body">
            Honor retired esports pioneers, hallmark achievements, and historic championship veterans.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-heading text-xs font-bold uppercase tracking-wider text-black bg-[#FFBE32] hover:bg-[#FFA000] transition-all cursor-pointer shadow-[0_0_15px_rgba(255,190,50,0.3)] shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Induct New Legend</span>
        </button>
      </div>

      {/* Legends Grid */}
      {loading ? (
        <div className="py-20 text-center text-gray-400 font-mono text-xs animate-pulse">
          Loading Hall of Fame records...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {legends.map((leg) => (
          <div
            key={leg.id}
            className="p-6 rounded-2xl bg-[#0C0C10] border border-[#FFBE32]/20 hover:border-[#FFBE32]/60 transition-all flex flex-col justify-between group shadow-[0_10px_30px_rgba(0,0,0,0.8)] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFBE32]/5 blur-3xl pointer-events-none" />

            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <span className="px-2.5 py-0.5 rounded bg-black border border-white/10 text-[10px] font-mono text-[#FFBE32] font-bold">
                  ACTIVE: {leg.activeYears}
                </span>
                {leg.retiredJerseyNumber && (
                  <span className="font-mono text-xs font-bold text-amber-300">
                    RETIRED #{leg.retiredJerseyNumber}
                  </span>
                )}
              </div>

              {/* Name & Role */}
              <div className="mt-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-2xl uppercase tracking-wider text-white group-hover:text-[#FFBE32] transition-colors">
                    {leg.ign}
                  </h3>
                  <Sparkles className="h-4 w-4 text-[#FFBE32]" />
                </div>
                <div className="text-xs text-gray-400 font-body">
                  {leg.realName} • <strong className="text-gray-300 uppercase">{leg.role}</strong>
                </div>
              </div>

              {/* Achievements Box */}
              <div className="mt-4 p-3 rounded-xl bg-black/60 border border-white/5 space-y-1 text-xs">
                <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-[#FFBE32] flex items-center gap-1">
                  <Award className="h-3 w-3" /> Landmark Achievements:
                </span>
                <p className="text-gray-300 font-body text-xs">
                  {leg.achievements}
                </p>
              </div>

              {/* Bio */}
              <p className="mt-4 text-xs text-gray-400 font-body leading-relaxed">
                {leg.hallOfFameBio}
              </p>
            </div>

            {/* Actions */}
            <div className="mt-6 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
              <span className="text-gray-500 font-mono">Hall of Fame Inductee</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(leg)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-[#FFBE32] cursor-pointer"
                  title="Edit Legend"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(leg.id)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/10 text-gray-400 hover:text-rose-400 cursor-pointer"
                  title="Remove Legend"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Induct / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-2xl bg-[#0D0D12] border border-[#FFBE32]/40 p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.9)] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <h3 className="font-display text-2xl uppercase tracking-wider text-white">
                {editingLegend ? "Edit Hall of Fame Legend" : "Induct New Legend"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-heading font-bold uppercase text-gray-300 mb-1">
                    Legend IGN *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.ign}
                    onChange={(e) => setFormData({ ...formData, ign: e.target.value })}
                    placeholder="THUNDER"
                    className="w-full rounded-xl border border-white/15 bg-black/60 px-3.5 py-2 text-sm text-white uppercase focus:border-[#FFBE32] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-heading font-bold uppercase text-gray-300 mb-1">
                    Real Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.realName}
                    onChange={(e) => setFormData({ ...formData, realName: e.target.value })}
                    placeholder="Praveen Raj"
                    className="w-full rounded-xl border border-white/15 bg-black/60 px-3.5 py-2 text-sm text-white focus:border-[#FFBE32] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-heading font-bold uppercase text-gray-300 mb-1">
                    Active Years
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.activeYears}
                    onChange={(e) => setFormData({ ...formData, activeYears: e.target.value })}
                    placeholder="2023 - 2025"
                    className="w-full rounded-xl border border-white/15 bg-black/60 px-3.5 py-2 text-sm text-white focus:border-[#FFBE32] focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-heading font-bold uppercase text-gray-300 mb-1">
                    Retired Jersey Number
                  </label>
                  <input
                    type="text"
                    value={formData.retiredJerseyNumber || ""}
                    onChange={(e) => setFormData({ ...formData, retiredJerseyNumber: e.target.value })}
                    placeholder="10"
                    className="w-full rounded-xl border border-white/15 bg-black/60 px-3.5 py-2 text-sm text-white focus:border-[#FFBE32] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-heading font-bold uppercase text-gray-300 mb-1">
                  Historical Combat Role
                </label>
                <input
                  type="text"
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="FOUNDING RUSHER / VETERAN SNIPER"
                  className="w-full rounded-xl border border-white/15 bg-black/60 px-3.5 py-2 text-sm text-white uppercase focus:border-[#FFBE32] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-heading font-bold uppercase text-gray-300 mb-1">
                  Landmark Achievements
                </label>
                <input
                  type="text"
                  required
                  value={formData.achievements}
                  onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
                  placeholder="Inaugural Booyah MVP, Season 1 Regional Champion"
                  className="w-full rounded-xl border border-white/15 bg-black/60 px-3.5 py-2 text-sm text-white focus:border-[#FFBE32] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-heading font-bold uppercase text-gray-300 mb-1">
                  Hall of Fame Legacy Bio
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.hallOfFameBio}
                  onChange={(e) => setFormData({ ...formData, hallOfFameBio: e.target.value })}
                  placeholder="Pioneered the hyper-aggressive Clock Tower breach tactics that defined early Lordz dominance..."
                  className="w-full rounded-xl border border-white/15 bg-black/60 px-3.5 py-2 text-sm text-white focus:border-[#FFBE32] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2 rounded-xl border border-white/15 text-xs font-heading font-bold text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#FFBE32] text-black font-heading text-xs font-bold uppercase tracking-wider"
                >
                  Induct Legend
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
