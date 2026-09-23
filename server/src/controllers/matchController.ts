import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma.js";
import { AuthenticatedRequest } from "../middleware/auth.js";

const matchSchema = z.object({
  tournamentId: z.string().optional().nullable(),
  tournamentName: z.string().optional().nullable(),
  roundId: z.string().optional().nullable(),
  matchNumber: z.number().optional().nullable(),
  status: z.enum(["LIVE", "UPCOMING", "RESULT"]).default("UPCOMING"),
  stage: z.string().default("GRAND FINALS"),
  game: z.string().default("FREE FIRE MAX"),
  map: z.string().default("BERMUDA"),
  serverRegion: z.string().optional().nullable().default("INDIA"),
  roomId: z.string().optional().nullable(),
  roomPassword: z.string().optional().nullable(),
  credentialsReleaseTime: z.any().optional().nullable(),
  teamAName: z.string().default("LORD ESPORTS"),
  teamATag: z.string().default("LORD"),
  teamAScore: z.number().default(0),
  teamAPoints: z.number().default(0),
  teamBName: z.string().default("OPPONENT"),
  teamBTag: z.string().default("OPP"),
  teamBScore: z.number().default(0),
  teamBPoints: z.number().default(0),
  winner: z.string().optional().nullable(),
  startTime: z.string().optional().nullable(),
  countdownSeconds: z.number().optional().nullable(),
  streamUrl: z.string().optional().nullable(),
});

export const getMatches = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status, tournamentId, roundId } = req.query;
    const where: any = {};
    if (status && status !== "ALL") where.status = String(status);
    if (tournamentId) where.tournamentId = String(tournamentId);
    if (roundId) where.roundId = String(roundId);

    const matches = await prisma.match.findMany({
      where,
      orderBy: [{ startTime: "asc" }, { createdAt: "desc" }],
    });

    res.json({ success: true, data: matches });
  } catch (error) {
    next(error);
  }
};

export const createMatch = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = matchSchema.parse(req.body);
    const parsedData: any = { ...data };
    if (data.credentialsReleaseTime) {
      parsedData.credentialsReleaseTime = new Date(data.credentialsReleaseTime);
    }
    const match = await prisma.match.create({ data: parsedData });

    res.status(201).json({ success: true, message: "Match created successfully", data: match });
  } catch (error) {
    next(error);
  }
};

export const updateMatch = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const data = matchSchema.partial().parse(req.body);
    const parsedData: any = { ...data };
    if (data.credentialsReleaseTime) {
      parsedData.credentialsReleaseTime = new Date(data.credentialsReleaseTime);
    }

    const match = await prisma.match.update({
      where: { id },
      data: parsedData,
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

/**
 * GET /api/matches/:id/credentials
 * Securely returns room ID and password if user is authorized and release time has arrived.
 */
export const getMatchCredentials = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const user = req.user;

    const match = await prisma.match.findUnique({
      where: { id },
    });

    if (!match) {
      res.status(404).json({ success: false, message: "Match not found" });
      return;
    }

    const isAdmin = user && (user.role === "SUPER_ADMIN" || user.role === "TOURNAMENT_ADMIN" || user.role === "ADMIN");

    if (isAdmin) {
      res.json({
        success: true,
        data: {
          released: true,
          roomId: match.roomId || "NOT_SET",
          roomPassword: match.roomPassword || "NOT_SET",
          serverRegion: match.serverRegion,
          releaseTime: match.credentialsReleaseTime,
        },
      });
      return;
    }

    // Check release time
    const now = new Date();
    const isReleased = !match.credentialsReleaseTime || now >= new Date(match.credentialsReleaseTime);

    if (!isReleased) {
      res.json({
        success: true,
        data: {
          released: false,
          releaseTime: match.credentialsReleaseTime,
          message: `Room credentials will be revealed at ${new Date(match.credentialsReleaseTime!).toLocaleTimeString("en-IN")}`,
        },
      });
      return;
    }

    res.json({
      success: true,
      data: {
        released: true,
        roomId: match.roomId || "Pending host creation",
        roomPassword: match.roomPassword || "Pending host creation",
        serverRegion: match.serverRegion,
      },
    });
  } catch (error) {
    next(error);
  }
};

