import React, { useState, useEffect } from "react";
import { playersApi } from "../api/players";
import { type Player, playersData } from "../data/players";
import {
  Plus,
  Edit,
  Trash2,
  X
} from "lucide-react";

export const AdminPlayersPage: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);

  const [formData, setFormData] = useState<Partial<Player>>({
    ign: "",
    realName: "",
    jerseyNumber: "00",
    role: "RUSHER",
    game: "FREE FIRE MAX",
    team: "LORDZ ESPORTS",
    kdRatio: "4.50",
    headshotRate: "70%",
    matchesPlayed: 100,
    featuredQuote: "Tactics win rounds. Pure conviction wins championships.",
    isCaptain: false,
  });

  const loadPlayers = async () => {
    setLoading(true);
    try {
      const data = await playersApi.getAll();
      setPlayers(data);
    } catch {
      setPlayers(playersData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlayers();
  }, []);

  const handleOpenCreate = () => {
    setEditingPlayer(null);
    setFormData({
      ign: "",
      realName: "",
      jerseyNumber: "99",
      role: "FRAGGER" as any,
      game: "FREE FIRE MAX",
      team: "LORDZ ESPORTS",
      kdRatio: "4.50",
      headshotRate: "70%",
      matchesPlayed: 100,
      featuredQuote: "Victory is the only acceptable outcome.",
      isCaptain: false,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (p: Player) => {
    setEditingPlayer(p);
    setFormData(p);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPlayer) {
        await playersApi.update(editingPlayer.id, formData);
        setPlayers((prev) =>
          prev.map((p) => (p.id === editingPlayer.id ? ({ ...p, ...formData } as Player) : p))
        );
      } else {
        const newPlayer: Player = {
          id: `player-${formData.ign?.toLowerCase()}`,
          ign: formData.ign?.toUpperCase() || "NEW_PLAYER",
          realName: formData.realName || "Athlete",
          jerseyNumber: formData.jerseyNumber || "99",
          role: formData.role || "RUSHER",
          game: formData.game || "FREE FIRE MAX",
          team: "LORDZ ESPORTS",
          kdRatio: formData.kdRatio || "4.00",
          headshotRate: formData.headshotRate || "65%",
          matchesPlayed: formData.matchesPlayed || 100,
          featuredQuote: formData.featuredQuote || "Built for the ones who keep pushing.",
          avatarBg: "from-amber-500/20 via-neutral-900 to-transparent",
          isCaptain: !!formData.isCaptain,
        };
        try {
          await playersApi.create(newPlayer);
        } catch {
          // fallback
        }
        setPlayers((prev) => [...prev, newPlayer]);
      }
      setModalOpen(false);
    } catch (err: any) {
      alert(err.message || "Failed to save athlete");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this athlete from the active roster?")) return;
    try {
      await playersApi.delete(id);
    } catch {
      // optimistic
    }
    setPlayers((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl uppercase tracking-wider text-white">
            PRO ATHLETE ROSTERS
          </h1>
          <p className="text-xs text-gray-400 font-body">
            Manage starting lineups, jersey numbers, official battle statistics, and captain designations.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-heading text-xs font-bold uppercase tracking-wider text-black bg-[#FFBE32] hover:bg-[#FFA000] transition-all cursor-pointer shadow-[0_0_15px_rgba(255,190,50,0.3)] shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Add Pro Athlete</span>
        </button>
      </div>

      {/* Athletes Grid */}
      {loading ? (
        <div className="py-20 text-center text-gray-400 font-mono text-xs animate-pulse">
          Loading pro athletes...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {players.map((p) => (
          <div
            key={p.id}
            className="p-5 rounded-2xl bg-[#0C0C10] border border-white/10 hover:border-[#FFBE32]/60 transition-all flex flex-col justify-between group shadow-[0_10px_25px_rgba(0,0,0,0.7)]"
          >
            <div>
              {/* Header Badge */}
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <span className="px-2 py-0.5 rounded bg-black/60 border border-white/10 text-[10px] font-heading font-bold uppercase text-gray-300">
                  {p.role}
                </span>
                <div className="flex items-center gap-1 font-mono text-[#FFBE32] font-bold text-sm">
                  #{p.jerseyNumber}
                </div>
              </div>

              {/* Player Name */}
              <div className="mt-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-2xl uppercase tracking-wider text-white group-hover:text-[#FFBE32] transition-colors">
                    {p.ign}
                  </h3>
                  {p.isCaptain && (
                    <span className="px-1.5 py-0.5 rounded bg-[#FFBE32] text-black text-[9px] font-mono font-extrabold uppercase">
                      IGL
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-400 font-body">{p.realName}</span>
              </div>

              {/* Stats Box */}
              <div className="mt-4 grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-black/60 border border-white/5 font-mono text-center">
                <div>
                  <span className="block text-sm font-bold text-[#FFBE32]">{p.kdRatio}</span>
                  <span className="text-[9px] text-gray-400 font-heading uppercase">K/D Ratio</span>
                </div>
                <div>
                  <span className="block text-sm font-bold text-white">{p.headshotRate}</span>
                  <span className="text-[9px] text-gray-400 font-heading uppercase">Headshot %</span>
                </div>
              </div>

              <p className="mt-3 text-[11px] text-gray-400 font-body italic line-clamp-2">
                "{p.featuredQuote}"
              </p>
            </div>

            {/* Actions */}
            <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
              <span className="text-gray-500 font-mono">{p.matchesPlayed} Matches</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(p)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-[#FFBE32] cursor-pointer"
                  title="Edit Player"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/10 text-gray-400 hover:text-rose-400 cursor-pointer"
                  title="Delete Player"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-2xl bg-[#0D0D12] border border-[#FFBE32]/40 p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.9)] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <h3 className="font-display text-2xl uppercase tracking-wider text-white">
                {editingPlayer ? "Edit Pro Athlete" : "Add Pro Athlete"}
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
                    Athlete In-Game Name (IGN) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.ign}
                    onChange={(e) => setFormData({ ...formData, ign: e.target.value })}
                    placeholder="BEAST"
                    className="w-full rounded-xl border border-white/15 bg-black/60 px-3.5 py-2 text-sm text-white uppercase focus:border-[#FFBE32] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-heading font-bold uppercase text-gray-300 mb-1">
                    Real Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.realName}
                    onChange={(e) => setFormData({ ...formData, realName: e.target.value })}
                    placeholder="Akash Sharma"
                    className="w-full rounded-xl border border-white/15 bg-black/60 px-3.5 py-2 text-sm text-white focus:border-[#FFBE32] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-heading font-bold uppercase text-gray-300 mb-1">
                    Jersey Number
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.jerseyNumber}
                    onChange={(e) => setFormData({ ...formData, jerseyNumber: e.target.value })}
                    placeholder="00"
                    className="w-full rounded-xl border border-white/15 bg-black/60 px-3.5 py-2 text-sm text-white font-mono focus:border-[#FFBE32] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-heading font-bold uppercase text-gray-300 mb-1">
                    Combat Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    className="w-full rounded-xl border border-white/15 bg-black/60 px-3.5 py-2 text-sm text-white focus:border-[#FFBE32] focus:outline-none"
                  >
                    <option value="IGL">IGL (In-Game Leader)</option>
                    <option value="RUSHER">RUSHER</option>
                    <option value="SNIPER">SNIPER</option>
                    <option value="SUPPORT">SUPPORT</option>
                    <option value="FRAGGER">FRAGGER</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-heading font-bold uppercase text-gray-300 mb-1">
                    K/D Ratio
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.kdRatio}
                    onChange={(e) => setFormData({ ...formData, kdRatio: e.target.value })}
                    placeholder="4.82"
                    className="w-full rounded-xl border border-white/15 bg-black/60 px-3.5 py-2 text-sm text-white focus:border-[#FFBE32] focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-heading font-bold uppercase text-gray-300 mb-1">
                    Headshot %
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.headshotRate}
                    onChange={(e) => setFormData({ ...formData, headshotRate: e.target.value })}
                    placeholder="68%"
                    className="w-full rounded-xl border border-white/15 bg-black/60 px-3.5 py-2 text-sm text-white focus:border-[#FFBE32] focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-heading font-bold uppercase text-gray-300 mb-1">
                    Matches
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.matchesPlayed}
                    onChange={(e) => setFormData({ ...formData, matchesPlayed: Number(e.target.value) })}
                    placeholder="140"
                    className="w-full rounded-xl border border-white/15 bg-black/60 px-3.5 py-2 text-sm text-white focus:border-[#FFBE32] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-heading font-bold uppercase text-gray-300 mb-1">
                  Athlete Quote
                </label>
                <input
                  type="text"
                  value={formData.featuredQuote}
                  onChange={(e) => setFormData({ ...formData, featuredQuote: e.target.value })}
                  placeholder="Tactics win rounds. Pure conviction wins championships."
                  className="w-full rounded-xl border border-white/15 bg-black/60 px-3.5 py-2 text-sm text-white focus:border-[#FFBE32] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isCaptain"
                  checked={formData.isCaptain}
                  onChange={(e) => setFormData({ ...formData, isCaptain: e.target.checked })}
                  className="rounded border-white/20 bg-black accent-[#FFBE32] h-4 w-4"
                />
                <label htmlFor="isCaptain" className="text-xs font-heading uppercase text-gray-300 cursor-pointer">
                  Team Captain / IGL Badge
                </label>
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
                  Save Athlete
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
