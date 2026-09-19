import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "../config/prisma.js";
import { AuthenticatedRequest } from "../middleware/auth.js";

const JWT_SECRET = process.env.JWT_SECRET || "lordz-esports-ultra-secure-jwt-secret-key-2026-prod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  ign: z.string().min(2),
  fullName: z.string().optional(),
  phone: z.string().optional(),
  discord: z.string().optional(),
});

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      res.status(401).json({ success: false, message: "Invalid email or password" });
      return;
    }

    if (user.status === "SUSPENDED") {
      res.status(403).json({ success: false, message: "Account has been suspended" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ success: false, message: "Invalid email or password" });
      return;
    }

    const payload = {
      id: user.id,
      email: user.email,
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
        email: user.email,
        role: user.role,
        ign: user.ign,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
        phone: user.phone,
        discord: user.discord,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = registerSchema.parse(req.body);

    const existing = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (existing) {
      res.status(409).json({ success: false, message: "Email is already registered" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    const user = await prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        passwordHash,
        role: "PLAYER",
        ign: data.ign,
        fullName: data.fullName,
        phone: data.phone,
        discord: data.discord,
      },
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, ign: user.ign },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        ign: user.ign,
        fullName: user.fullName,
        phone: user.phone,
        discord: user.discord,
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
        email: true,
        role: true,
        ign: true,
        fullName: true,
        avatarUrl: true,
        phone: true,
        discord: true,
        status: true,
        createdAt: true,
      },
    });

    if (!user && req.user.email) {
      user = await prisma.user.findUnique({
        where: { email: req.user.email },
        select: {
          id: true,
          email: true,
          role: true,
          ign: true,
          fullName: true,
          avatarUrl: true,
          phone: true,
          discord: true,
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

export const logout = (_req: Request, res: Response): void => {
  res.clearCookie("token");
  res.json({ success: true, message: "Logged out successfully" });
};
