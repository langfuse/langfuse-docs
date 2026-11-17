const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const publicDir = path.join(process.cwd(), "public");
const assetsDir = path.join(publicDir, "brand-assets");
const zipPath = path.join(publicDir, "brand-assets.zip");
// Single team photo. The brand page and design.md link this file; the
// download package includes a copy so the zip still contains the photo.
const teamPhotoSrc = path.join(publicDir, "images", "people", "team.jpg");
const teamPhotoZipPath = "brand-assets/team/team.jpg";

function countAssetFiles(dir) {
  if (!fs.existsSync(dir)) {
    return 0;
  }

  let count = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      count += countAssetFiles(entryPath);
    } else if (entry.isFile() && entry.name !== ".DS_Store") {
      count += 1;
    }
  }
  return count;
}

if (!fs.existsSync(assetsDir) || countAssetFiles(assetsDir) === 0) {
  console.error(
    "[generate_brand_assets_zip] Missing brand assets: public/brand-assets is required at build time.",
  );
  process.exit(1);
}

if (!fs.existsSync(teamPhotoSrc)) {
  console.error(
    "[generate_brand_assets_zip] Missing canonical team photo: public/images/people/team.jpg",
  );
  process.exit(1);
}

function runZip(args, cwd) {
  const result = spawnSync("zip", args, {
    cwd,
    encoding: "utf8",
  });

  if (result.error) {
    throw new Error(
      `[generate_brand_assets_zip] Failed to run zip command: ${result.error.message}`,
    );
  }

  if (result.status !== 0) {
    const detail = (result.stderr || result.stdout || "").trim();
    throw new Error(
      `[generate_brand_assets_zip] zip command failed with status ${result.status}.${detail ? ` ${detail}` : ""}`,
    );
  }
}

if (fs.existsSync(zipPath)) {
  fs.rmSync(zipPath, { force: true });
}

// Retired standalone wordmark (wordmark/Langfuse). Do not ship it in the
// public package. The current wordmark lives in wordmark/{light,dark,monochrome}.
try {
  runZip(
    [
      "-q",
      "-r",
      "brand-assets.zip",
      "brand-assets",
      "-x",
      "*/.DS_Store",
      "-x",
      "brand-assets/wordmark/Langfuse/*",
      "-x",
      "brand-assets/wordmark/Langfuse/*/*",
    ],
    publicDir,
  );
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

// Add the canonical team photo under brand-assets/team/. The repo no longer
// keeps a second JPEG in public/brand-assets/team/. Throw on zip failure so
// this finally block still removes the staged copy.
const stageDir = fs.mkdtempSync(path.join(os.tmpdir(), "langfuse-brand-"));
try {
  const stageTeamDir = path.join(stageDir, "brand-assets", "team");
  fs.mkdirSync(stageTeamDir, { recursive: true });
  fs.copyFileSync(teamPhotoSrc, path.join(stageDir, teamPhotoZipPath));
  runZip(["-q", "-r", zipPath, teamPhotoZipPath], stageDir);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  fs.rmSync(stageDir, { recursive: true, force: true });
}

if (process.exitCode) {
  process.exit(process.exitCode);
}

const sizeMb = (fs.statSync(zipPath).size / (1024 * 1024)).toFixed(1);
console.log(
  `[generate_brand_assets_zip] Created public/brand-assets.zip (${sizeMb} MB)`,
);
