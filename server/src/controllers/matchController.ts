import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma.js";
import { AuthenticatedRequest } from "../middleware/auth.js";

const matchSchema = z.object({
  tournamentId: z.string().optional().nullable(),
  tournamentName: z.string().optional().nullable(),
  status: z.enum(["LIVE", "UPCOMING", "RESULT"]).default("UPCOMING"),
  stage: z.string().default("GRAND FINALS"),
  game: z.string().default("FREE FIRE MAX"),
  map: z.string().default("BERMUDA"),
  teamAName: z.string().default("LORD ESPORTS"),
  teamATag: z.string().default("LORD"),
  teamAScore: z.number().default(0),
  teamAPoints: z.number().default(0),
  teamBName: z.string(),
  teamBTag: z.string(),
  teamBScore: z.number().default(0),
  teamBPoints: z.number().default(0),
  winner: z.string().optional().nullable(),
  startTime: z.string().optional().nullable(),
  countdownSeconds: z.number().optional().nullable(),
  streamUrl: z.string().optional().nullable(),
});

export const getMatches = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status } = req.query;
    const where: any = {};
    if (status && status !== "ALL") where.status = String(status);

    const matches = await prisma.match.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    res.json({ success: true, data: matches });
  } catch (error) {
    next(error);
  }
};

export const createMatch = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = matchSchema.parse(req.body);
    const match = await prisma.match.create({ data });

    res.status(201).json({ success: true, message: "Match created successfully", data: match });
  } catch (error) {
    next(error);
  }
};

export const updateMatch = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const data = matchSchema.partial().parse(req.body);

    const match = await prisma.match.update({
      where: { id },
      data,
    });

    res.json({ success: true, message: "Match updated successfully", data: match });
  } catch (error) {
    next(error);
  }
};

export const deleteMatch = async (_req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = _req.params;
    await prisma.match.delete({ where: { id } });

    res.json({ success: true, message: "Match deleted successfully" });
  } catch (error) {
    next(error);
  }
};
