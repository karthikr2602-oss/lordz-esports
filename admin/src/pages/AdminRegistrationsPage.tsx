import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { tournamentsApi, type RegistrationItem } from "../api/tournaments";
import {
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Phone,
  Check,
  X
} from "lucide-react";

export const AdminRegistrationsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialTourneyId = searchParams.get("tournamentId") || "";

  const [registrations, setRegistrations] = useState<RegistrationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [tournamentFilter, setTournamentFilter] = useState(initialTourneyId);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const sampleFallback: RegistrationItem[] = [
    {
      id: "reg-1",
      tournamentId: "lordz-clutch-cup",
      teamName: "SOUL WARRIORS",
      captainIgn: "SOUL_VIPER",
      whatsapp: "+91 98765 43210",
      discordTag: "viper#1234",
      status: "APPROVED",
      slotNumber: 1,
      createdAt: new Date().toISOString(),
      tournament: { id: "lordz-clutch-cup", title: "LORDZ CLUTCH CUP S1", game: "FREE FIRE MAX", prizePool: "₹1,00,000", status: "UPCOMING" },
    },
    {
      id: "reg-2",
      tournamentId: "tamil-nadu-clash",
      teamName: "VEERA TAMIZHAN",
      captainIgn: "TAMIL_HUNTER",
      whatsapp: "+91 97890 55443",
      discordTag: "hunter#4433",
      status: "PENDING",
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      tournament: { id: "tamil-nadu-clash", title: "TAMIL NADU INVITATIONAL", game: "FREE FIRE MAX", prizePool: "₹35,000", status: "UPCOMING" },
    },
    {
      id: "reg-3",
      tournamentId: "lordz-clutch-cup",
      teamName: "GODLIKE CLAN",
      captainIgn: "JONATHAN_X",
      whatsapp: "+91 98450 11223",
      discordTag: "jonathan#9988",
      status: "APPROVED",
      slotNumber: 2,
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      tournament: { id: "lordz-clutch-cup", title: "LORDZ CLUTCH CUP S1", game: "FREE FIRE MAX", prizePool: "₹1,00,000", status: "UPCOMING" },
    },
    {
      id: "reg-4",
      tournamentId: "fog-season-2",
      teamName: "DFG ESPORTS",
      captainIgn: "DFG_MAHESH",
      whatsapp: "+91 99000 88776",
      discordTag: "dfg_lead#0001",
      status: "APPROVED",
      slotNumber: 3,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      tournament: { id: "fog-season-2", title: "FLAME OF GLORY - FINALS", game: "FREE FIRE MAX", prizePool: "₹50,000", status: "LIVE" },
    },
  ];

  const loadRegistrations = async () => {
    setLoading(true);
    try {
      const data = await tournamentsApi.getRegistrations({
        tournamentId: tournamentFilter || undefined,
        status: statusFilter,
        search: searchQuery,
      });
      setRegistrations(data && data.length > 0 ? data : sampleFallback);
    } catch {
      setRegistrations(sampleFallback);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRegistrations();
  }, [tournamentFilter, statusFilter, searchQuery]);

  const handleUpdateStatus = async (id: string, newStatus: "APPROVED" | "REJECTED" | "PENDING") => {
    try {
      await tournamentsApi.updateRegistrationStatus(id, newStatus);
    } catch {
      // optimistic
    }
    setRegistrations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl uppercase tracking-wider text-white">
          SQUAD REGISTRATION DESK
        </h1>
        <p className="text-xs text-gray-400 font-body">
          Review, vet, and dispatch slot approvals for tournament squads registered from the public site.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-[#0D0D12] border border-white/10 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {["ALL", "PENDING", "APPROVED", "REJECTED"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-heading font-bold uppercase tracking-wider transition-all cursor-pointer ${
                statusFilter === st
                  ? "bg-[#FFBE32] text-black shadow-[0_0_10px_rgba(255,190,50,0.3)] font-extrabold"
                  : "bg-black/50 text-gray-400 hover:text-white border border-white/5"
              }`}
            >
              {st}
            </button>
          ))}

          {tournamentFilter && (
            <button
              onClick={() => setTournamentFilter("")}
              className="px-3 py-1.5 rounded-lg text-xs font-heading font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 inline-flex items-center gap-1.5 hover:bg-amber-500/20 transition-all cursor-pointer"
            >
              <span>Tournament: {tournamentFilter}</span>
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search squad, captain, phone..."
            className="w-full rounded-xl border border-white/10 bg-black/60 pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:border-[#FFBE32] focus:outline-none"
          />
        </div>
      </div>

      {/* Registrations List */}
      <div className="rounded-2xl bg-[#0C0C10] border border-white/10 overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-black/80 border-b border-white/10 text-gray-400 font-heading uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4 font-bold">Team / Squad</th>
                <th className="py-3.5 px-4 font-bold">Tournament</th>
                <th className="py-3.5 px-4 font-bold">Captain IGN</th>
                <th className="py-3.5 px-4 font-bold">WhatsApp Dispatch</th>
                <th className="py-3.5 px-4 font-bold">Discord Tag</th>
                <th className="py-3.5 px-4 font-bold">Status</th>
                <th className="py-3.5 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono text-gray-300">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-gray-400 font-mono text-xs animate-pulse">
                    Loading tournament squad registrations...
                  </td>
                </tr>
              ) : registrations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500 font-body text-xs">
                    No squad registrations found matching criteria.
                  </td>
                </tr>
              ) : (
                registrations.map((reg) => {
                const phoneClean = reg.whatsapp.replace(/[^0-9]/g, "");

                return (
                  <tr key={reg.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-4 font-heading font-bold text-white text-sm">
                      {reg.teamName}
                    </td>

                    <td className="py-4 px-4 text-gray-400">
                      <div className="text-white font-heading font-semibold text-xs">
                        {reg.tournament?.title || "Flame of Glory"}
                      </div>
                      <span className="text-[10px] text-[#FFBE32]">{reg.tournament?.game || "FREE FIRE MAX"}</span>
                    </td>

                    <td className="py-4 px-4 font-bold text-white">
                      {reg.captainIgn}
                    </td>

                    <td className="py-4 px-4">
                      <a
                        href={`https://wa.me/${phoneClean}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold hover:underline"
                        title="Chat on WhatsApp"
                      >
                        <Phone className="h-3 w-3" />
                        <span>{reg.whatsapp}</span>
                      </a>
                    </td>

                    <td className="py-4 px-4 text-gray-400">
                      {reg.discordTag || "—"}
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-heading font-bold uppercase tracking-wider ${
                          reg.status === "APPROVED"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : reg.status === "PENDING"
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                        }`}
                      >
                        {reg.status === "APPROVED" && <CheckCircle2 className="h-3 w-3" />}
                        {reg.status === "PENDING" && <Clock className="h-3 w-3" />}
                        {reg.status === "REJECTED" && <XCircle className="h-3 w-3" />}
                        <span>{reg.status}</span>
                      </span>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        {reg.status !== "APPROVED" && (
                          <button
                            onClick={() => handleUpdateStatus(reg.id, "APPROVED")}
                            className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 transition-colors cursor-pointer"
                            title="Approve Squad"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                        )}
                        {reg.status !== "REJECTED" && (
                          <button
                            onClick={() => handleUpdateStatus(reg.id, "REJECTED")}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 transition-colors cursor-pointer"
                            title="Reject Squad"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
