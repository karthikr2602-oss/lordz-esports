import { apiRequest } from "./client";
import { tournamentsData, type Tournament } from "../data/tournaments";

export interface SquadRegistrationInput {
  teamName: string;
  captainIgn: string;
  whatsapp: string;
  discordTag?: string;
  playerNames?: string;
}

export interface RegistrationItem {
  id: string;
  tournamentId: string;
  teamName: string;
  captainIgn: string;
  whatsapp: string;
  discordTag?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  slotNumber?: number;
  createdAt: string;
  tournament?: {
    id: string;
    title: string;
    game: string;
    prizePool: string;
    status: string;
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
    const fallback = tournamentsData.find((t) => t.id === id) || null;
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

  updateRegistrationStatus: async (
    id: string,
    status: "APPROVED" | "REJECTED" | "PENDING",
    slotNumber?: number
  ): Promise<any> => {
    return apiRequest(`/tournaments/registrations/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status, slotNumber }),
    });
  },
};
