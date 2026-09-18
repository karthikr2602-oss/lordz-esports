import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma.js";
import { AuthenticatedRequest } from "../middleware/auth.js";

const mediaSchema = z.object({
  type: z.enum(["VIDEOS", "HIGHLIGHTS", "PHOTOS", "SHORTS"]).default("VIDEOS"),
  title: z.string().min(3),
  duration: z.string().optional().nullable(),
  views: z.string().default("10K VIEWS"),
  date: z.string().default("RECENT"),
  game: z.string().default("FREE FIRE MAX"),
  youtubeId: z.string().optional().nullable(),
  thumbnail: z.string().optional().nullable(),
  tag: z.string().default("FEATURED"),
  description: z.string().optional().nullable(),
  featured: z.boolean().default(false),
});

export const getMedia = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { type, featured } = req.query;
    const where: any = {};
    if (type && type !== "ALL") where.type = String(type);
    if (featured !== undefined) where.featured = featured === "true";

    const items = await prisma.mediaItem.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
};

export const createMedia = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = mediaSchema.parse(req.body);
    const item = await prisma.mediaItem.create({ data });
    res.status(201).json({ success: true, message: "Media item added successfully", data: item });
  } catch (error) {
    next(error);
  }
};

export const updateMedia = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const data = mediaSchema.partial().parse(req.body);
    const item = await prisma.mediaItem.update({
      where: { id },
      data,
    });
    res.json({ success: true, message: "Media item updated successfully", data: item });
  } catch (error) {
    next(error);
  }
};

export const deleteMedia = async (_req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = _req.params;
    await prisma.mediaItem.delete({ where: { id } });
    res.json({ success: true, message: "Media item deleted successfully" });
  } catch (error) {
    next(error);
  }
};
