import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma.js";
import { AuthenticatedRequest } from "../middleware/auth.js";

const orderSchema = z.object({
  productId: z.string().optional().nullable(),
  productName: z.string().default("LORDZ PRO COMBAT JERSEY 2026"),
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(8),
  address: z.string().min(5),
  city: z.string().min(2),
  state: z.string().min(2),
  pincode: z.string().min(4),
  size: z.string().default("L"),
  customIgn: z.string().optional().nullable(),
  customNumber: z.string().optional().nullable(),
  totalAmount: z.number().default(1299),
  paymentMethod: z.string().default("ONLINE"),
});

export const createOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = orderSchema.parse(req.body);
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `LZ-${new Date().getFullYear()}-${randomSuffix}`;

    const order = await prisma.order.create({
      data: {
        ...data,
        orderNumber,
        paymentStatus: "PAID", // Default to paid for pre-order demo/sim
        orderStatus: "PENDING",
      },
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully!",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status, search } = req.query;

    const where: any = {};
    if (status && status !== "ALL") where.orderStatus = String(status);
    if (search) {
      where.OR = [
        { orderNumber: { contains: String(search) } },
        { customerName: { contains: String(search) } },
        { customerPhone: { contains: String(search) } },
        { customerEmail: { contains: String(search) } },
        { customIgn: { contains: String(search) } },
      ];
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    res.json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { orderStatus, trackingNumber, paymentStatus } = req.body;

    const order = await prisma.order.update({
      where: { id },
      data: {
        ...(orderStatus ? { orderStatus } : {}),
        ...(trackingNumber !== undefined ? { trackingNumber } : {}),
        ...(paymentStatus ? { paymentStatus } : {}),
      },
    });

    if (req.user) {
      await prisma.auditLog.create({
        data: {
          adminId: req.user.id,
          adminEmail: req.user.email,
          action: "UPDATE_ORDER_STATUS",
          resource: "Order",
          details: `Updated order ${order.orderNumber} to ${orderStatus}`,
        },
      });
    }

    res.json({ success: true, message: `Order updated to ${orderStatus}`, data: order });
  } catch (error) {
    next(error);
  }
};
