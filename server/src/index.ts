/**
 * Local development entry point.
 * This file is NOT used by Vercel — it only runs when you do `npm run dev` locally.
 * Vercel uses vercel.json + server.ts (which exports the Express app directly).
 */
import app from "./server.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`⚡ LORDZ ESPORTS REST API SERVER RUNNING`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🛡️  Health check: http://localhost:${PORT}/health`);
  console.log(`📂 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`=========================================`);
});
