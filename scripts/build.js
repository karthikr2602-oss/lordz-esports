import { execSync } from "child_process";
import fs from "fs";
import path from "path";

console.log("🚀 Building Lordz Esports Main Website...");
execSync("npm run build:web", { stdio: "inherit" });

const adminDir = path.resolve("admin");

console.log("⚙️ Building Lordz Esports Admin Portal...");
execSync("npm install --include=dev", {
  cwd: adminDir,
  stdio: "inherit",
  env: { ...process.env, NODE_ENV: "development" }
});
execSync("npm run build", { cwd: adminDir, stdio: "inherit" });

console.log("📦 Packaging Admin Portal into dist/admin...");
const adminDist = path.resolve("admin", "dist");
const targetDist = path.resolve("dist", "admin");

if (fs.existsSync(adminDist)) {
  fs.cpSync(adminDist, targetDist, { recursive: true });
  console.log("✅ Admin Portal successfully merged into dist/admin!");
} else {
  console.error("❌ admin/dist not found!");
  process.exit(1);
}

console.log("🎉 Full production build completed successfully!");
