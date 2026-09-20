import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "../config/prisma.js";
import { AuthenticatedRequest } from "../middleware/auth.js";

const JWT_SECRET = process.env.JWT_SECRET || "lordz-esports-ultra-secure-jwt-secret-key-2026-prod";

const loginSchema = z.object({
  identifier: z.string().optional(),
  email: z.string().optional(),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must not exceed 30 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please provide a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().min(7, "Please provide a valid mobile number"),
  gamingExperience: z.string().optional().default("1-2 Years (Semi-Pro)"),
  primaryGame: z.string().optional().default("FREE FIRE MAX"),
  ign: z.string().optional(),
  gameUid: z.string().optional().nullable(),
  discord: z.string().optional().nullable(),
  device: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
});

const updateProfileSchema = z.object({
  fullName: z.string().min(2).optional(),
  phone: z.string().optional().nullable(),
  ign: z.string().optional().nullable(),
  gameUid: z.string().optional().nullable(),
  discord: z.string().optional().nullable(),
  gamingExperience: z.string().optional().nullable(),
  primaryGame: z.string().optional().nullable(),
  device: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  avatarUrl: z.string().optional().nullable(),
});

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { identifier, email, password } = loginSchema.parse(req.body);
    const loginId = (identifier || email || "").toLowerCase().trim();

    if (!loginId) {
      res.status(400).json({ success: false, message: "Please provide your username or email" });
      return;
    }

    // Support logging in via email, unique username, or IGN
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: loginId },
          { username: loginId },
          { ign: { equals: loginId, mode: "insensitive" } },
        ],
      },
    });

    if (!user) {
      res.status(401).json({ success: false, message: "Invalid username/email or password" });
      return;
    }

    if (user.status === "SUSPENDED") {
      res.status(403).json({ success: false, message: "Your athlete account has been suspended. Contact support." });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ success: false, message: "Invalid username/email or password" });
      return;
    }

    const payload = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      ign: user.ign,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
    });

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        ign: user.ign,
        gameUid: user.gameUid,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
        phone: user.phone,
        discord: user.discord,
        gamingExperience: user.gamingExperience,
        primaryGame: user.primaryGame,
        device: user.device,
        bio: user.bio,
        status: user.status,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = registerSchema.parse(req.body);
    const email = data.email.toLowerCase().trim();
    const username = data.username.toLowerCase().trim();

    // 1. Check if email already registered
    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingEmail) {
      res.status(409).json({ success: false, message: "This email address is already registered. Please sign in." });
      return;
    }

    // 2. Check if username already taken
    const existingUsername = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUsername) {
      res.status(409).json({ success: false, message: "This username is already taken. Please choose another one." });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
        role: "PLAYER",
        ign: data.ign?.trim() || username.toUpperCase(),
        fullName: data.fullName.trim(),
        phone: data.phone.trim(),
        discord: data.discord?.trim() || null,
        gamingExperience: data.gamingExperience || "1-2 Years (Semi-Pro)",
        primaryGame: data.primaryGame || "FREE FIRE MAX",
        device: data.device?.trim() || null,
        bio: data.bio?.trim() || null,
        status: "ACTIVE",
      },
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username, role: user.role, ign: user.ign },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
    });

    res.status(201).json({
      success: true,
      message: "Player account registered successfully!",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        ign: user.ign,
        gameUid: user.gameUid,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
        phone: user.phone,
        discord: user.discord,
        gamingExperience: user.gamingExperience,
        primaryGame: user.primaryGame,
        device: user.device,
        bio: user.bio,
        status: user.status,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    let user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        ign: true,
        gameUid: true,
        fullName: true,
        avatarUrl: true,
        phone: true,
        discord: true,
        gamingExperience: true,
        primaryGame: true,
        device: true,
        bio: true,
        status: true,
        createdAt: true,
      },
    });

    if (!user && req.user.email) {
      user = await prisma.user.findUnique({
        where: { email: req.user.email },
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          ign: true,
          gameUid: true,
          fullName: true,
          avatarUrl: true,
          phone: true,
          discord: true,
          gamingExperience: true,
          primaryGame: true,
          device: true,
          bio: true,
          status: true,
          createdAt: true,
        },
      });
    }

    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const data = updateProfileSchema.parse(req.body);

    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data,
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        ign: true,
        gameUid: true,
        fullName: true,
        avatarUrl: true,
        phone: true,
        discord: true,
        gamingExperience: true,
        primaryGame: true,
        device: true,
        bio: true,
        status: true,
        createdAt: true,
      },
    });

    res.json({ success: true, message: "Profile updated successfully", user: updated });
  } catch (error) {
    next(error);
  }
};

export const logout = (_req: Request, res: Response): void => {
  res.clearCookie("token");
  res.json({ success: true, message: "Logged out successfully" });
};
