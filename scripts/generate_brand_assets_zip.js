const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const publicDir = path.join(process.cwd(), "public");
const assetsDir = path.join(publicDir, "brand-assets");
const zipPath = path.join(publicDir, "brand-assets.zip");

if (!fs.existsSync(assetsDir)) {
  console.warn(
    "[generate_brand_assets_zip] Skipping: public/brand-assets not found.",
  );
  process.exit(0);
}

if (fs.existsSync(zipPath)) {
  fs.rmSync(zipPath, { force: true });
}

const result = spawnSync(
  "zip",
  ["-q", "-r", "brand-assets.zip", "brand-assets", "-x", "*/.DS_Store"],
  {
    cwd: publicDir,
    encoding: "utf8",
  },
);

if (result.error) {
  console.error(
    "[generate_brand_assets_zip] Failed to run zip command:",
    result.error.message,
  );
  process.exit(1);
}

if (result.status !== 0) {
  const detail = (result.stderr || result.stdout || "").trim();
  console.error(
    `[generate_brand_assets_zip] zip command failed with status ${result.status}.${detail ? ` ${detail}` : ""}`,
  );
  process.exit(result.status || 1);
}

const sizeMb = (fs.statSync(zipPath).size / (1024 * 1024)).toFixed(1);
console.log(
  `[generate_brand_assets_zip] Created public/brand-assets.zip (${sizeMb} MB)`,
);
