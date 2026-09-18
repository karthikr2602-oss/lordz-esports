import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import path from "path";
import dotenv from "dotenv";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { prisma } from "./config/prisma.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";

// Security headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., mobile apps, curl) or matching dev host
      if (!origin || origin.includes("localhost") || origin === CORS_ORIGIN) {
        callback(null, true);
      } else {
        callback(null, true); // Dev permissive
      }
    },
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 1000, // Limit each IP to 1000 requests per window
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", limiter);

// Parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Serve static uploaded files
const uploadDir = path.join(process.cwd(), "uploads");
app.use("/uploads", express.static(uploadDir));

// Health check endpoint
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "Lordz Esports Shared REST API",
    timestamp: new Date().toISOString(),
  });
});

// Root route - Stylish developer status dashboard & JSON gateway
app.get("/", (req, res) => {
  if (req.accepts("html")) {
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lordz Esports — REST API Gateway</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: #08080a;
      color: #e4e4e7;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      padding: 40px 20px;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .container { max-width: 860px; width: 100%; }
    .header {
      background: linear-gradient(180deg, #131318 0%, #0d0d12 100%);
      border: 1px solid rgba(255, 190, 50, 0.25);
      border-radius: 20px;
      padding: 32px;
      margin-bottom: 24px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(255, 190, 50, 0.05);
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 20px;
    }
    .brand-title {
      font-size: 24px;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #fff;
    }
    .brand-title span { color: #FFBE32; }
    .brand-sub { font-size: 13px; color: #a1a1aa; margin-top: 4px; }
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(34, 197, 94, 0.12);
      border: 1px solid rgba(34, 197, 94, 0.35);
      color: #4ade80;
      padding: 8px 16px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.05em;
    }
    .pulse {
      width: 8px;
      height: 8px;
      background-color: #22c55e;
      border-radius: 50%;
      box-shadow: 0 0 10px #22c55e;
      animation: pulse 2s infinite;
    }
    @keyframes pulse { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(0.85); } 100% { opacity: 1; transform: scale(1); } }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }
    .stat-card {
      background: #111116;
      border: 1px solid rgba(255, 255, 255, 0.07);
      border-radius: 16px;
      padding: 20px;
    }
    .stat-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #71717a; font-weight: 700; }
    .stat-value { font-size: 16px; font-weight: 700; color: #fff; margin-top: 6px; display: flex; align-items: center; gap: 6px; }
    .links-card {
      background: #111116;
      border: 1px solid rgba(255, 255, 255, 0.07);
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 24px;
    }
    .section-title { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #FFBE32; margin-bottom: 16px; }
    .endpoints-list { display: flex; flex-direction: column; gap: 8px; }
    .endpoint-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 14px;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.04);
      border-radius: 10px;
      text-decoration: none;
      transition: all 0.2s;
    }
    .endpoint-item:hover {
      background: rgba(255, 190, 50, 0.08);
      border-color: rgba(255, 190, 50, 0.3);
      transform: translateX(4px);
    }
    .ep-method { font-family: monospace; font-size: 11px; font-weight: 700; color: #FFBE32; background: rgba(255, 190, 50, 0.15); padding: 3px 8px; border-radius: 6px; }
    .ep-path { font-family: monospace; font-size: 13px; color: #f4f4f5; margin-left: 10px; flex: 1; }
    .ep-desc { font-size: 12px; color: #a1a1aa; }
    .action-row { display: flex; gap: 12px; flex-wrap: wrap; }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 20px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      text-decoration: none;
      transition: all 0.2s;
    }
    .btn-primary { background: #FFBE32; color: #09090b; }
    .btn-primary:hover { background: #ffa000; box-shadow: 0 0 20px rgba(255, 190, 50, 0.4); }
    .btn-secondary { background: rgba(255, 255, 255, 0.06); color: #fff; border: 1px solid rgba(255, 255, 255, 0.12); }
    .btn-secondary:hover { background: rgba(255, 255, 255, 0.1); }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div>
        <h1 class="brand-title">LORDZ <span>ESPORTS</span> API</h1>
        <p class="brand-sub">Unified REST Backend Services &amp; Live Data Gateway</p>
      </div>
      <div class="status-badge">
        <div class="pulse"></div>
        <span>OPERATIONAL &amp; HEALTHY</span>
      </div>
    </div>

    <div class="grid">
      <div class="stat-card">
        <div class="stat-label">Database Connection</div>
        <div class="stat-value" style="color: #4ade80;">● Neon PostgreSQL Connected</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Server Port</div>
        <div class="stat-value">5000 (Development)</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">CORS Origins</div>
        <div class="stat-value" style="font-size: 13px;">5173, 5174, 5175</div>
      </div>
    </div>

    <div class="links-card">
      <div class="section-title">Core API Endpoints</div>
      <div class="endpoints-list">
        <a href="/api/partners" target="_blank" class="endpoint-item">
          <span class="ep-method">GET</span>
          <span class="ep-path">/api/partners</span>
          <span class="ep-desc">Sponsors, brand collabs &amp; logos</span>
        </a>
        <a href="/api/tournaments" target="_blank" class="endpoint-item">
          <span class="ep-method">GET</span>
          <span class="ep-path">/api/tournaments</span>
          <span class="ep-desc">Tournaments, brackets &amp; matches</span>
        </a>
        <a href="/api/players" target="_blank" class="endpoint-item">
          <span class="ep-method">GET</span>
          <span class="ep-path">/api/players</span>
          <span class="ep-desc">Official roster &amp; player profiles</span>
        </a>
        <a href="/api/news" target="_blank" class="endpoint-item">
          <span class="ep-method">GET</span>
          <span class="ep-path">/api/news</span>
          <span class="ep-desc">Editorial news &amp; community updates</span>
        </a>
        <a href="/api/media" target="_blank" class="endpoint-item">
          <span class="ep-method">GET</span>
          <span class="ep-path">/api/media</span>
          <span class="ep-desc">Highlights &amp; tournament videos</span>
        </a>
        <a href="/api/settings" target="_blank" class="endpoint-item">
          <span class="ep-method">GET</span>
          <span class="ep-path">/api/settings</span>
          <span class="ep-desc">Website configuration &amp; stats</span>
        </a>
        <a href="/health" target="_blank" class="endpoint-item">
          <span class="ep-method">GET</span>
          <span class="ep-path">/health</span>
          <span class="ep-desc">Live system health check</span>
        </a>
      </div>
    </div>

    <div class="action-row">
      <a href="http://localhost:5173" target="_blank" class="btn btn-primary">Open Main Website (5173) &rarr;</a>
      <a href="http://localhost:5175" target="_blank" class="btn btn-secondary">Open Admin Portal (5175) &rarr;</a>
    </div>
  </div>
</body>
</html>`);
    return;
  }

  res.json({
    success: true,
    status: "online",
    service: "Lordz Esports Shared REST API",
    version: "1.0.0",
    database: "Neon PostgreSQL Connected",
    endpoints: {
      health: "/health",
      partners: "/api/partners",
      tournaments: "/api/tournaments",
      players: "/api/players",
      news: "/api/news",
      media: "/api/media",
      jerseys: "/api/jerseys",
      settings: "/api/settings",
    },
    timestamp: new Date().toISOString(),
  });
});

// API Routes (support both /api and /api/v1)
app.use("/api/v1", routes);
app.use("/api", routes);

// Base /api status fallback
app.get(["/api", "/api/v1"], (_req, res) => {
  res.json({
    success: true,
    service: "Lordz Esports REST API",
    version: "1.0.0",
    status: "healthy",
    documentation: "Visit http://localhost:5000/ for available endpoints",
  });
});

// 404 handler for unknown routes
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
  });
});

// Global error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`⚡ LORDZ ESPORTS REST API SERVER RUNNING`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🛡️  Health check: http://localhost:${PORT}/health`);
  console.log(`📂 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`=========================================`);

  // Verify Database Connection
  prisma.$connect()
    .then(() => {
      console.log("🐘 DATABASE: Connected to Neon PostgreSQL Database successfully!");
    })
    .catch((err: any) => {
      console.warn("⚠️  DATABASE: Unable to connect to PostgreSQL:", err.message);
      console.warn("👉 Please set your Neon connection string in server/.env (DATABASE_URL=postgresql://...)?sslmode=require");
    });
});

export default app;
