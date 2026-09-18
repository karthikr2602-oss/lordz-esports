import React, { useState, useEffect } from "react";
import { apiRequest } from "../api/client";
import { matchesData, type Match } from "../data/matches";
import {
  Swords,
  Plus,
  Radio,
  Award,
  Trash2,
  Edit,
  X
} from "lucide-react";

export const AdminMatchesPage: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);

  const [formData, setFormData] = useState({
    tournament: "FLAME OF GLORY S2",
    stage: "GRAND FINALS • MATCH 3",
    game: "FREE FIRE MAX",
    map: "BERMUDA",
    status: "UPCOMING" as "LIVE" | "UPCOMING" | "RESULT",
    teamAName: "LORDZ ESPORTS",
    teamATag: "LORDZ",
    teamAScore: 0,
    teamAPoints: 0,
    teamBName: "DFG ESPORTS",
    teamBTag: "DFG",
    teamBScore: 0,
    teamBPoints: 0,
    winner: "",
    startTime: "TODAY • 8:00 PM IST",
    streamUrl: "https://www.youtube.com",
  });

  const loadMatches = async () => {
    setLoading(true);
    try {
      const data = await apiRequest<Match[]>("/matches", { method: "GET" }, matchesData);
      setMatches(data);
    } catch {
      setMatches(matchesData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMatches();
  }, []);

  const handleOpenCreate = () => {
    setEditingMatch(null);
    setFormData({
      tournament: "FLAME OF GLORY S2",
      stage: "GRAND FINALS",
      game: "FREE FIRE MAX",
      map: "BERMUDA",
      status: "UPCOMING",
      teamAName: "LORDZ ESPORTS",
      teamATag: "LORDZ",
      teamAScore: 0,
      teamAPoints: 0,
      teamBName: "TB ESPORTS",
      teamBTag: "TBE",
      teamBScore: 0,
      teamBPoints: 0,
      winner: "",
      startTime: "TODAY • 8:00 PM IST",
      streamUrl: "https://www.youtube.com",
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (m: Match) => {
    setEditingMatch(m);
    setFormData({
      tournament: m.tournament,
      stage: m.stage,
      game: m.game,
      map: m.map || "BERMUDA",
      status: m.status,
      teamAName: m.teamA.name,
      teamATag: m.teamA.tag,
      teamAScore: m.teamA.score || 0,
      teamAPoints: m.teamA.points || 0,
      teamBName: m.teamB.name,
      teamBTag: m.teamB.tag,
      teamBScore: m.teamB.score || 0,
      teamBPoints: m.teamB.points || 0,
      winner: m.winner || "",
      startTime: m.startTime || "",
      streamUrl: m.streamUrl || "",
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      tournamentName: formData.tournament,
      stage: formData.stage,
      game: formData.game,
      map: formData.map,
      status: formData.status,
      teamAName: formData.teamAName,
      teamATag: formData.teamATag,
      teamAScore: formData.teamAScore,
      teamAPoints: formData.teamAPoints,
      teamBName: formData.teamBName,
      teamBTag: formData.teamBTag,
      teamBScore: formData.teamBScore,
      teamBPoints: formData.teamBPoints,
      winner: formData.winner || null,
      startTime: formData.startTime,
      streamUrl: formData.streamUrl,
    };

    try {
      if (editingMatch) {
        await apiRequest(`/matches/${editingMatch.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        setMatches((prev) =>
          prev.map((m) =>
            m.id === editingMatch.id
              ? {
                  ...m,
                  tournament: formData.tournament,
                  stage: formData.stage,
                  map: formData.map,
                  status: formData.status,
                  teamA: { ...m.teamA, name: formData.teamAName, tag: formData.teamATag, score: formData.teamAScore, points: formData.teamAPoints },
                  teamB: { ...m.teamB, name: formData.teamBName, tag: formData.teamBTag, score: formData.teamBScore, points: formData.teamBPoints },
                  winner: formData.winner,
                  startTime: formData.startTime,
                }
              : m
          )
        );
      } else {
        const newId = `match-${Date.now()}`;
        const newMatch: Match = {
          id: newId,
          tournament: formData.tournament,
          stage: formData.stage,
          game: formData.game,
          map: formData.map,
          status: formData.status,
          teamA: { name: formData.teamAName, tag: formData.teamATag, score: formData.teamAScore, points: formData.teamAPoints },
          teamB: { name: formData.teamBName, tag: formData.teamBTag, score: formData.teamBScore, points: formData.teamBPoints },
          winner: formData.winner,
          startTime: formData.startTime,
          streamUrl: formData.streamUrl,
        };
        try {
          await apiRequest("/matches", {
            method: "POST",
            body: JSON.stringify(payload),
          });
        } catch {
          // fallback
        }
        setMatches((prev) => [newMatch, ...prev]);
      }
      setModalOpen(false);
    } catch (err: any) {
      alert(err.message || "Failed to save match");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiRequest(`/matches/${id}`, { method: "DELETE" });
    } catch {
      // optimistic
    }
    setMatches((prev) => prev.filter((m) => m.id !== id));
  };

  const filteredMatches = matches.filter(
    (m) => statusFilter === "ALL" || m.status === statusFilter
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl uppercase tracking-wider text-white">
            MATCH CENTER & FIXTURES
          </h1>
          <p className="text-xs text-gray-400 font-body">
            Post live round scores, schedule upcoming clashes, and broadcast match results directly to the public website.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-heading text-xs font-bold uppercase tracking-wider text-black bg-[#FFBE32] hover:bg-[#FFA000] transition-all cursor-pointer shadow-[0_0_15px_rgba(255,190,50,0.3)] shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>New Match Fixture</span>
        </button>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2">
        {["ALL", "LIVE", "UPCOMING", "RESULT"].map((st) => (
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

      {/* Matches Grid */}
      {loading ? (
        <div className="py-20 text-center text-gray-400 font-mono text-xs animate-pulse">
          Loading match fixtures...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMatches.map((m) => (
          <div
            key={m.id}
            className="p-5 rounded-2xl bg-[#0C0C10] border border-white/10 hover:border-[#FFBE32]/40 transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Card Top */}
              <div className="flex items-center justify-between pb-3 border-b border-white/5 text-[11px] font-mono">
                <span className="text-[#FFBE32] font-bold uppercase">{m.tournament}</span>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-heading font-bold uppercase ${
                    m.status === "LIVE"
                      ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                      : m.status === "UPCOMING"
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  }`}
                >
                  {m.status === "LIVE" && <Radio className="h-2.5 w-2.5 animate-pulse" />}
                  {m.status}
                </span>
              </div>

              {/* Stage & Map */}
              <div className="mt-3 text-xs text-gray-400 font-mono">
                {m.stage} • Map: <strong className="text-gray-200">{m.map}</strong>
              </div>

              {/* Teams Clash */}
              <div className="mt-4 grid grid-cols-5 items-center text-center p-3 rounded-xl bg-black/50 border border-white/5">
                <div className="col-span-2 text-left">
                  <span className="block font-display text-lg text-white leading-tight">
                    {m.teamA.name}
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">{m.teamA.tag}</span>
                  {m.status !== "UPCOMING" && (
                    <div className="text-sm font-mono font-bold text-[#FFBE32] mt-1">
                      Score: {m.teamA.score} ({m.teamA.points} pts)
                    </div>
                  )}
                </div>

                <div className="col-span-1 flex flex-col items-center">
                  <Swords className="h-5 w-5 text-gray-600" />
                  <span className="text-[10px] font-mono text-gray-500 mt-1">VS</span>
                </div>

                <div className="col-span-2 text-right">
                  <span className="block font-display text-lg text-white leading-tight">
                    {m.teamB.name}
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">{m.teamB.tag}</span>
                  {m.status !== "UPCOMING" && (
                    <div className="text-sm font-mono font-bold text-gray-300 mt-1">
                      Score: {m.teamB.score} ({m.teamB.points} pts)
                    </div>
                  )}
                </div>
              </div>

              {m.winner && (
                <div className="mt-3 p-2 rounded-lg bg-[#FFBE32]/10 border border-[#FFBE32]/30 text-xs font-mono text-[#FFBE32] flex items-center justify-center gap-1.5">
                  <Award className="h-3.5 w-3.5" />
                  <span>WINNER: {m.winner}</span>
                </div>
              )}
            </div>

            {/* Bottom Controls */}
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
              <span className="text-gray-400 font-mono">{m.startTime || "Live Arena"}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(m)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-[#FFBE32] cursor-pointer"
                  title="Edit Score / Result"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(m.id)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/10 text-gray-400 hover:text-rose-400 cursor-pointer"
                  title="Delete Match"
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
          <div className="relative w-full max-w-xl rounded-2xl bg-[#0D0D12] border border-[#FFBE32]/40 p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.9)] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <h3 className="font-display text-2xl uppercase tracking-wider text-white">
                {editingMatch ? "Update Match Fixture" : "New Match Fixture"}
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
                    Tournament
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.tournament}
                    onChange={(e) => setFormData({ ...formData, tournament: e.target.value })}
                    className="w-full rounded-xl border border-white/15 bg-black/60 px-3.5 py-2 text-sm text-white focus:border-[#FFBE32] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-heading font-bold uppercase text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full rounded-xl border border-white/15 bg-black/60 px-3.5 py-2 text-sm text-white focus:border-[#FFBE32] focus:outline-none"
                  >
                    <option value="UPCOMING">UPCOMING</option>
                    <option value="LIVE">LIVE NOW</option>
                    <option value="RESULT">MATCH RESULT</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-heading font-bold uppercase text-gray-300 mb-1">
                    Stage
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.stage}
                    onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                    placeholder="GRAND FINALS • MATCH 3"
                    className="w-full rounded-xl border border-white/15 bg-black/60 px-3.5 py-2 text-sm text-white focus:border-[#FFBE32] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-heading font-bold uppercase text-gray-300 mb-1">
                    Map
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.map}
                    onChange={(e) => setFormData({ ...formData, map: e.target.value })}
                    placeholder="BERMUDA / KALAHARI / ERANGEL"
                    className="w-full rounded-xl border border-white/15 bg-black/60 px-3.5 py-2 text-sm text-white focus:border-[#FFBE32] focus:outline-none"
                  />
                </div>
              </div>

              {/* Team A Details */}
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-3">
                <span className="text-[11px] font-heading font-bold uppercase text-[#FFBE32]">Team A Details</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="col-span-2">
                    <input
                      type="text"
                      required
                      placeholder="Team A Name"
                      value={formData.teamAName}
                      onChange={(e) => setFormData({ ...formData, teamAName: e.target.value })}
                      className="w-full rounded-lg border border-white/15 bg-black px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Score"
                      value={formData.teamAScore}
                      onChange={(e) => setFormData({ ...formData, teamAScore: Number(e.target.value) })}
                      className="w-full rounded-lg border border-white/15 bg-black px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Pts"
                      value={formData.teamAPoints}
                      onChange={(e) => setFormData({ ...formData, teamAPoints: Number(e.target.value) })}
                      className="w-full rounded-lg border border-white/15 bg-black px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Team B Details */}
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-3">
                <span className="text-[11px] font-heading font-bold uppercase text-gray-300">Team B Details</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="col-span-2">
                    <input
                      type="text"
                      required
                      placeholder="Team B Name"
                      value={formData.teamBName}
                      onChange={(e) => setFormData({ ...formData, teamBName: e.target.value })}
                      className="w-full rounded-lg border border-white/15 bg-black px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Score"
                      value={formData.teamBScore}
                      onChange={(e) => setFormData({ ...formData, teamBScore: Number(e.target.value) })}
                      className="w-full rounded-lg border border-white/15 bg-black px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Pts"
                      value={formData.teamBPoints}
                      onChange={(e) => setFormData({ ...formData, teamBPoints: Number(e.target.value) })}
                      className="w-full rounded-lg border border-white/15 bg-black px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-heading font-bold uppercase text-gray-300 mb-1">
                    Winner Declaration
                  </label>
                  <input
                    type="text"
                    value={formData.winner}
                    onChange={(e) => setFormData({ ...formData, winner: e.target.value })}
                    placeholder="LORDZ ESPORTS"
                    className="w-full rounded-xl border border-white/15 bg-black/60 px-3.5 py-2 text-sm text-white focus:border-[#FFBE32] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-heading font-bold uppercase text-gray-300 mb-1">
                    Start Schedule
                  </label>
                  <input
                    type="text"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    placeholder="TODAY • 7:45 PM IST"
                    className="w-full rounded-xl border border-white/15 bg-black/60 px-3.5 py-2 text-sm text-white focus:border-[#FFBE32] focus:outline-none"
                  />
                </div>
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
                  Save Fixture
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
