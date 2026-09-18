import React, { useState, useEffect } from "react";
import { apiRequest } from "../api/client";
import { flameOfGloryStandings, type StandingRow } from "../data/standings";
import { Save, RefreshCw, Check, Plus, Trash2 } from "lucide-react";

export const AdminStandingsPage: React.FC = () => {
  const [standings, setStandings] = useState<StandingRow[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const loadStandings = async () => {
      try {
        const data = await apiRequest<StandingRow[]>("/standings", { method: "GET" }, flameOfGloryStandings);
        setStandings(data && data.length > 0 ? data : flameOfGloryStandings);
      } catch {
        setStandings(flameOfGloryStandings);
      }
    };
    loadStandings();
  }, []);

  const handleChange = (index: number, field: keyof StandingRow, value: string) => {
    setStandings((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      // Auto compute total if finishes or position changed
      if (field === "position" || field === "finishes") {
        const pos = parseInt(copy[index].position) || 0;
        const fin = parseInt(copy[index].finishes) || 0;
        copy[index].total = String(pos + fin).padStart(2, "0");
      }
      return copy;
    });
    setSaveSuccess(false);
  };

  const handleSaveBatch = async () => {
    setSaving(true);
    try {
      await apiRequest("/standings/batch", {
        method: "PUT",
        body: JSON.stringify({ standings }),
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || "Failed to update standings");
    } finally {
      setSaving(false);
    }
  };

  const handleAddRow = () => {
    const nextRank = String(standings.length + 1).padStart(2, "0");
    const newRow: StandingRow = {
      rank: nextRank,
      team: "NEW TEAM ESPORTS",
      tag: "NTE",
      chickenDinner: "00",
      matches: "02",
      position: "00",
      finishes: "00",
      total: "00",
      isTopThree: false,
    };
    setStandings([...standings, newRow]);
  };

  const handleDeleteRow = (index: number) => {
    setStandings(standings.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl uppercase tracking-wider text-white">
            STANDINGS & LEADERBOARD DESK
          </h1>
          <p className="text-xs text-gray-400 font-body">
            Edit Flame of Glory Grand Finals points table, Chicken Dinners, kills, and positions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleAddRow}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-heading font-bold uppercase tracking-wider text-gray-200 cursor-pointer"
          >
            <Plus className="h-4 w-4 text-[#FFBE32]" />
            <span>Add Row</span>
          </button>
          <button
            onClick={handleSaveBatch}
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-heading text-xs font-bold uppercase tracking-wider text-black bg-[#FFBE32] hover:bg-[#FFA000] transition-all cursor-pointer shadow-[0_0_15px_rgba(255,190,50,0.3)] disabled:opacity-50"
          >
            {saving ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : saveSuccess ? (
              <>
                <Check className="h-4 w-4" />
                <span>Saved Live!</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save Live Standings</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-2xl bg-[#0C0C10] border border-white/10 overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-black/80 border-b border-white/10 text-gray-400 font-heading uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 w-16 text-center">Rank</th>
                <th className="py-3 px-4 min-w-[200px]">Team Name</th>
                <th className="py-3 px-4 w-24">Tag</th>
                <th className="py-3 px-4 w-20 text-center">Booyah</th>
                <th className="py-3 px-4 w-20 text-center">Matches</th>
                <th className="py-3 px-4 w-20 text-center">Pos Pts</th>
                <th className="py-3 px-4 w-20 text-center">Finishes</th>
                <th className="py-3 px-4 w-24 text-center">Total</th>
                <th className="py-3 px-4 w-16 text-right">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono text-gray-300">
              {standings.map((row, index) => (
                <tr key={index} className={`hover:bg-white/[0.02] ${index < 3 ? "bg-[#FFBE32]/[0.02]" : ""}`}>
                  <td className="py-3 px-4 text-center">
                    <input
                      type="text"
                      value={row.rank}
                      onChange={(e) => handleChange(index, "rank", e.target.value)}
                      className="w-10 text-center bg-black/60 border border-white/10 rounded py-1 text-white font-bold"
                    />
                  </td>

                  <td className="py-3 px-4">
                    <input
                      type="text"
                      value={row.team}
                      onChange={(e) => handleChange(index, "team", e.target.value)}
                      className="w-full bg-black/60 border border-white/10 rounded py-1 px-2 text-white font-heading font-bold uppercase"
                    />
                  </td>

                  <td className="py-3 px-4">
                    <input
                      type="text"
                      value={row.tag}
                      onChange={(e) => handleChange(index, "tag", e.target.value)}
                      className="w-16 bg-black/60 border border-white/10 rounded py-1 px-2 text-[#FFBE32] uppercase"
                    />
                  </td>

                  <td className="py-3 px-4 text-center">
                    <input
                      type="text"
                      value={row.chickenDinner}
                      onChange={(e) => handleChange(index, "chickenDinner", e.target.value)}
                      className="w-12 text-center bg-black/60 border border-white/10 rounded py-1 text-amber-300 font-bold"
                    />
                  </td>

                  <td className="py-3 px-4 text-center">
                    <input
                      type="text"
                      value={row.matches}
                      onChange={(e) => handleChange(index, "matches", e.target.value)}
                      className="w-12 text-center bg-black/60 border border-white/10 rounded py-1 text-gray-300"
                    />
                  </td>

                  <td className="py-3 px-4 text-center">
                    <input
                      type="text"
                      value={row.position}
                      onChange={(e) => handleChange(index, "position", e.target.value)}
                      className="w-12 text-center bg-black/60 border border-white/10 rounded py-1 text-gray-300"
                    />
                  </td>

                  <td className="py-3 px-4 text-center">
                    <input
                      type="text"
                      value={row.finishes}
                      onChange={(e) => handleChange(index, "finishes", e.target.value)}
                      className="w-12 text-center bg-black/60 border border-white/10 rounded py-1 text-rose-300 font-bold"
                    />
                  </td>

                  <td className="py-3 px-4 text-center">
                    <input
                      type="text"
                      value={row.total}
                      onChange={(e) => handleChange(index, "total", e.target.value)}
                      className="w-14 text-center bg-black border border-[#FFBE32]/40 rounded py-1 text-[#FFBE32] font-bold text-sm"
                    />
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleDeleteRow(index)}
                      className="p-1 rounded text-gray-500 hover:text-rose-400 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
