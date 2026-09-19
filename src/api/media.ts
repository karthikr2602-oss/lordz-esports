import { apiRequest } from "./client";
import { mediaData, type MediaItem } from "../data/media";

export const mediaApi = {
  getAll: async (type?: string): Promise<MediaItem[]> => {
    const query = type && type !== "ALL" ? `?type=${type}` : "";
    return apiRequest<MediaItem[]>(`/media${query}`, { method: "GET" }, mediaData);
  },

  getFeatured: async (): Promise<MediaItem[]> => {
    return apiRequest<MediaItem[]>("/media?featured=true", { method: "GET" }, mediaData.filter(m => m.featured));
  },

  create: async (data: Partial<MediaItem>): Promise<MediaItem> => {
    return apiRequest<MediaItem>("/media", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<MediaItem>): Promise<MediaItem> => {
    return apiRequest<MediaItem>(`/media/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiRequest<void>(`/media/${id}`, {
      method: "DELETE",
    });
  },
};
