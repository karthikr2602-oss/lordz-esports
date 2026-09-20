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
  // Tournaments
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

  create: async (data: Partial<Tournament>): Promise<Tournament> => {
    return apiRequest<Tournament>("/tournaments", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<Tournament>): Promise<Tournament> => {
    return apiRequest<Tournament>(`/tournaments/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<{ success: boolean }> => {
    return apiRequest<{ success: boolean }>(`/tournaments/${id}`, {
      method: "DELETE",
    });
  },

  duplicate: async (id: string): Promise<Tournament> => {
    return apiRequest<Tournament>(`/tournaments/${id}/duplicate`, {
      method: "POST",
    });
  },

  // Registrations & Payments
  registerSquad: async (tournamentId: string, squad: SquadRegistrationInput): Promise<any> => {
    return apiRequest(`/tournaments/${tournamentId}/register`, {
      method: "POST",
      body: JSON.stringify(squad),
    });
  },

  getRegistrations: async (params?: {
    tournamentId?: string;
    stageId?: string;
    status?: string;
    paymentStatus?: string;
    search?: string;
  }): Promise<RegistrationItem[]> => {
    const query = new URLSearchParams();
    if (params?.tournamentId && params.tournamentId !== "ALL") query.set("tournamentId", params.tournamentId);
    if (params?.stageId && params.stageId !== "ALL") query.set("stageId", params.stageId);
    if (params?.status && params.status !== "ALL") query.set("status", params.status);
    if (params?.paymentStatus && params.paymentStatus !== "ALL") query.set("paymentStatus", params.paymentStatus);
    if (params?.search) query.set("search", params.search);

    const qs = query.toString() ? `?${query.toString()}` : "";
    return apiRequest<RegistrationItem[]>(`/tournaments/registrations${qs}`, { method: "GET" }, []);
  },

  updateRegistrationStatus: async (
    id: string,
    status: string,
    slotNumber?: number,
    adminNotes?: string
  ): Promise<any> => {
    return apiRequest(`/tournaments/registrations/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status, slotNumber, adminNotes }),
    });
  },

  updatePaymentStatus: async (
    id: string,
    paymentStatus: string,
    adminNotes?: string,
    autoApprove?: boolean
  ): Promise<any> => {
    return apiRequest(`/tournaments/registrations/${id}/payment`, {
      method: "PUT",
      body: JSON.stringify({ paymentStatus, adminNotes, autoApprove }),
    });
  },

  verifyPayment: async (registrationId: string): Promise<any> => {
    return apiRequest(`/tournaments/registrations/${registrationId}/payment-verify`, {
      method: "PUT",
    });
  },

  rejectPayment: async (registrationId: string, reason?: string): Promise<any> => {
    return apiRequest(`/tournaments/registrations/${registrationId}/payment-reject`, {
      method: "PUT",
      body: JSON.stringify({ reason }),
    });
  },

  adminOverrideRoster: async (teamId: string, members: any[]): Promise<any> => {
    return apiRequest(`/teams/${teamId}/override-roster`, {
      method: "POST",
      body: JSON.stringify({ members }),
    });
  },

  getTournamentTeams: async (tournamentId: string): Promise<any[]> => {
    return apiRequest(`/tournaments/${tournamentId}/teams`, { method: "GET" }, []);
  },

  getAnalytics: async (tournamentId?: string): Promise<any> => {
    const qs = tournamentId ? `?tournamentId=${tournamentId}` : "";
    return apiRequest(`/tournaments/admin/analytics${qs}`, { method: "GET" });
  },

  bulkActionRegistrations: async (
    registrationIds: string[],
    action: "APPROVE" | "REJECT" | "VERIFY_PAYMENT" | "MOVE_STAGE",
    targetStageId?: string
  ): Promise<any> => {
    return apiRequest("/tournaments/registrations/bulk", {
      method: "POST",
      body: JSON.stringify({ registrationIds, action, targetStageId }),
    });
  },

  exportRegistrationsCsv: async (tournamentId: string, stageId?: string, status?: string): Promise<string> => {
    const query = new URLSearchParams();
    if (stageId) query.set("stageId", stageId);
    if (status) query.set("status", status);
    const qs = query.toString() ? `?${query.toString()}` : "";

    const url = `/api/tournaments/${tournamentId}/export${qs}`;
    const token = localStorage.getItem("lordz_admin_token") || localStorage.getItem("token");
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(url, { headers });
    return res.text();
  },

  // Stages & Progression
  getStages: async (tournamentId: string): Promise<TournamentStage[]> => {
    return apiRequest<TournamentStage[]>(`/tournaments/${tournamentId}/stages`, { method: "GET" }, []);
  },

  createStage: async (tournamentId: string, stage: Partial<TournamentStage>): Promise<TournamentStage> => {
    return apiRequest<TournamentStage>(`/tournaments/${tournamentId}/stages`, {
      method: "POST",
      body: JSON.stringify(stage),
    });
  },

  updateStage: async (stageId: string, stage: Partial<TournamentStage>): Promise<TournamentStage> => {
    return apiRequest<TournamentStage>(`/tournaments/stages/${stageId}`, {
      method: "PUT",
      body: JSON.stringify(stage),
    });
  },

  deleteStage: async (stageId: string): Promise<{ success: boolean }> => {
    return apiRequest<{ success: boolean }>(`/tournaments/stages/${stageId}`, {
      method: "DELETE",
    });
  },

  moveTeamsToStage: async (tournamentId: string, registrationIds: string[], targetStageId: string): Promise<any> => {
    return apiRequest(`/tournaments/${tournamentId}/stages/move-teams`, {
      method: "POST",
      body: JSON.stringify({ registrationIds, targetStageId }),
    });
  },

  // Tournament Leaderboard
  getLeaderboard: async (tournamentId: string): Promise<LeaderboardEntry[]> => {
    return apiRequest<LeaderboardEntry[]>(`/tournaments/${tournamentId}/leaderboard`, { method: "GET" }, []);
  },

  updateLeaderboardBatch: async (tournamentId: string, entries: LeaderboardEntry[]): Promise<LeaderboardEntry[]> => {
    return apiRequest<LeaderboardEntry[]>(`/tournaments/${tournamentId}/leaderboard`, {
      method: "PUT",
      body: JSON.stringify({ entries }),
    });
  },

  addLeaderboardEntry: async (tournamentId: string, entry: Partial<LeaderboardEntry>): Promise<LeaderboardEntry> => {
    return apiRequest<LeaderboardEntry>(`/tournaments/${tournamentId}/leaderboard/entry`, {
      method: "POST",
      body: JSON.stringify(entry),
    });
  },

  deleteLeaderboardEntry: async (tournamentId: string, entryId: string): Promise<{ success: boolean }> => {
    return apiRequest<{ success: boolean }>(`/tournaments/${tournamentId}/leaderboard/${entryId}`, {
      method: "DELETE",
    });
  },

  // File Uploads
  uploadImage: async (file: File): Promise<{ success: boolean; url: string; filename: string }> => {
    const formData = new FormData();
    formData.append("file", file);

    const token = localStorage.getItem("lordz_admin_token") || localStorage.getItem("token");
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch("/api/upload", {
      method: "POST",
      headers,
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Failed to upload image");
    }
    return res.json();
  },
};
