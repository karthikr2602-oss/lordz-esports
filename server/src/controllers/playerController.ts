import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma.js";
import { AuthenticatedRequest } from "../middleware/auth.js";

const playerSchema = z.object({
  ign: z.string().min(2),
  realName: z.string().min(2),
  jerseyNumber: z.string().min(1).max(3),
  role: z.enum(["IGL", "RUSHER", "SNIPER", "SUPPORT", "FRAGGER"]).default("RUSHER"),
  game: z.string().default("FREE FIRE MAX"),
  team: z.string().default("LORDZ ESPORTS"),
  kdRatio: z.string().default("4.00"),
  headshotRate: z.string().default("65%"),
  matchesPlayed: z.number().default(100),
  featuredQuote: z.string().default("Built for the ones who keep pushing."),
  avatarUrl: z.string().optional().nullable(),
  avatarBg: z.string().optional().nullable(),
  isCaptain: z.boolean().default(false),
  isActive: z.boolean().default(true),
  sortOrder: z.number().default(0),
});

export const getPlayers = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const players = await prisma.player.findMany({
      where: { isActive: true },
      orderBy: [{ isCaptain: "desc" }, { sortOrder: "asc" }],
    });
    res.json({ success: true, data: players });
  } catch (error) {
    next(error);
  }
};

export const getAllPlayersAdmin = async (_req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const players = await prisma.player.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
    res.json({ success: true, data: players });
  } catch (error) {
    next(error);
  }
};

export const createPlayer = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = playerSchema.parse(req.body);

    const player = await prisma.player.create({
      data: {
        ...data,
        ign: data.ign.toUpperCase(),
      },
    });

    res.status(201).json({ success: true, message: "Player profile created", data: player });
  } catch (error) {
    next(error);
  }
};

export const updatePlayer = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const data = playerSchema.partial().parse(req.body);

    const player = await prisma.player.update({
      where: { id },
      data: {
        ...data,
        ...(data.ign ? { ign: data.ign.toUpperCase() } : {}),
      },
    });

    res.json({ success: true, message: "Player profile updated", data: player });
  } catch (error) {
    next(error);
  }
};

export const deletePlayer = async (_req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = _req.params;
    await prisma.player.delete({ where: { id } });
    res.json({ success: true, message: "Player profile deleted" });
  } catch (error) {
    next(error);
  }
};
