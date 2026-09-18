import { Request, Response, NextFunction } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, "lordz-" + uniqueSuffix + ext);
  },
});

export const uploadMiddleware = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are supported"));
    }
  },
}).single("file");

export const handleUpload = (req: Request, res: Response, next: NextFunction): void => {
  uploadMiddleware(req, res, (err) => {
    if (err) {
      res.status(400).json({ success: false, message: err.message });
      return;
    }

    if (!req.file) {
      res.status(400).json({ success: false, message: "No file uploaded" });
      return;
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({
      success: true,
      message: "File uploaded successfully",
      url: fileUrl,
      filename: req.file.filename,
    });
  });
};
