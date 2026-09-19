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
  whatsappScrimsUrl?: string;
  youtubeUrl?: string;
  instagramUrl?: string;
  businessEmail?: string;
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
  discordUrl: "https://discord.gg/Q8KR7tU96",
  whatsappUrl: "https://whatsapp.com/channel/0029Vb8sSc66hENsTW35hd11",
  whatsappScrimsUrl: "https://whatsapp.com/channel/0029Vb8fM218kyySLfM90o0l",
  youtubeUrl: "https://youtube.com/@lord-esportz07",
  instagramUrl: "https://www.instagram.com/lord.esportz",
  businessEmail: "lordesportz75@gmail.com",
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
