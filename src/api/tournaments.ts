import { apiRequest } from "./client";
import {
  tournamentsData,
  type Tournament,
  type TournamentStage,
  type RegistrationItem,
  type LeaderboardEntry,
} from "../data/tournaments";

export interface SquadRegistrationInput {
  teamName: string;
  teamLogo?: string;
  captainIgn: string;
  captainName?: string;
  captainPhone?: string;
  captainEmail?: string;
  whatsapp: string;
  discordTag?: string;
  playerNames?: string;
  players?: Array<{
    name: string;
    ign: string;
    playerId?: string;
    role: string;
    phone?: string;
    email?: string;
    discordId?: string;
    isCaptain?: boolean;
    isSubstitute?: boolean;
  }>;
  payment?: {
    amount?: number;
    method?: string;
    utr?: string;
    payerName?: string;
    screenshot?: string;
    remarks?: string;
  };
}

export const tournamentsApi = {
  getAll: async (params?: { gameCategory?: string; status?: string; search?: string }): Promise<Tournament[]> => {
    const query = new URLSearchParams();
    if (params?.gameCategory && params.gameCategory !== "ALL") query.set("gameCategory", params.gameCategory);
    if (params?.status && params.status !== "ALL") query.set("status", params.status);
    if (params?.search) query.set("search", params.search);

    const qs = query.toString() ? `?${query.toString()}` : "";
    return apiRequest<Tournament[]>(`/tournaments${qs}`, { method: "GET" }, tournamentsData);
  },

  getById: async (id: string): Promise<Tournament | null> => {
    const fallback = tournamentsData.find((t) => t.id === id || t.slug === id) || null;
    return apiRequest<Tournament | null>(`/tournaments/${id}`, { method: "GET" }, fallback);
  },

  registerSquad: async (tournamentId: string, squad: SquadRegistrationInput): Promise<any> => {
    return apiRequest(`/tournaments/${tournamentId}/register`, {
      method: "POST",
      body: JSON.stringify(squad),
    });
  },

  getRegistrations: async (params?: { tournamentId?: string; status?: string; search?: string }): Promise<RegistrationItem[]> => {
    const query = new URLSearchParams();
    if (params?.tournamentId) query.set("tournamentId", params.tournamentId);
    if (params?.status && params.status !== "ALL") query.set("status", params.status);
    if (params?.search) query.set("search", params.search);

    const qs = query.toString() ? `?${query.toString()}` : "";
    return apiRequest<RegistrationItem[]>(`/tournaments/registrations${qs}`, { method: "GET" }, []);
  },

  getStages: async (tournamentId: string): Promise<TournamentStage[]> => {
    return apiRequest<TournamentStage[]>(`/tournaments/${tournamentId}/stages`, { method: "GET" }, []);
  },

  getLeaderboard: async (tournamentId: string): Promise<LeaderboardEntry[]> => {
    return apiRequest<LeaderboardEntry[]>(`/tournaments/${tournamentId}/leaderboard`, { method: "GET" }, []);
  },

  uploadImage: async (file: File): Promise<{ success: boolean; url: string; filename: string }> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Failed to upload screenshot");
    }
    return res.json();
  },
};
