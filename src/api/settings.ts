import { apiRequest } from "./client";

export interface SettingsMap {
  liveTicker?: string;
  emergencyBanner?: string;
  emergencyBannerActive?: string;
  tournamentsCount?: string;
  playersCount?: string;
  teamsCount?: string;
  prizePoolCount?: string;
  discordUrl?: string;
  whatsappUrl?: string;
  youtubeUrl?: string;
  instagramUrl?: string;
  [key: string]: string | undefined;
}

export const fallbackSettings: SettingsMap = {
  liveTicker: "🔥 FLAME OF GLORY S2 GRAND FINALS LIVE NOW • WATCH ON YOUTUBE • PRIZE POOL ₹50,000",
  emergencyBanner: "OFFICIAL REGISTRATIONS OPEN FOR LORDZ CLUTCH CUP S1 (₹1,00,000 PRIZE POOL)",
  emergencyBannerActive: "true",
  tournamentsCount: "25+",
  playersCount: "500+",
  teamsCount: "50+",
  prizePoolCount: "₹5L+",
  discordUrl: "https://discord.gg/lordzesports",
  whatsappUrl: "https://chat.whatsapp.com/lordzesports",
  youtubeUrl: "https://youtube.com/@lordzesports",
  instagramUrl: "https://instagram.com/lordzesports",
};

export const settingsApi = {
  getSettings: async (): Promise<SettingsMap> => {
    return apiRequest<SettingsMap>("/settings", { method: "GET" }, fallbackSettings);
  },

  updateSettings: async (settings: SettingsMap): Promise<SettingsMap> => {
    return apiRequest<SettingsMap>("/settings", {
      method: "PUT",
      body: JSON.stringify(settings),
    });
  },
};
