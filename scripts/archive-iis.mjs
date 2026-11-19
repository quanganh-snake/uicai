#!/usr/bin/env node
import { createWriteStream } from "node:fs";
import { readdir, rm, stat } from "node:fs/promises";
import path from "node:path";
import { ZipArchive } from "archiver";

const root = process.cwd();
const payloadDir = path.join(root, "dist-iis");
const archivePath = path.join(root, "aiesi2027-dist.zip");

const requiredFiles = [
  "app/server.js",
  "app/.next/required-server-files.json",
  "site/web.config",
  "service/aiesi2027-next.xml",
  "deploy.bat",
  "setup-iis.bat",
  "write-service-xml.ps1",
];

for (const relativePath of requiredFiles) {
  const filePath = path.join(payloadDir, ...relativePath.split("/"));
  try {
    if (!(await stat(filePath)).isFile()) throw new Error("not a file");
  } catch {
    console.error(`Missing IIS payload file: dist-iis/${relativePath}`);
    process.exit(1);
  }
}

const sharpLibDir = path.join(
  payloadDir,
  "app",
  "node_modules",
  "@img",
  "sharp-win32-x64",
  "lib",
);

let sharpFiles;
try {
  sharpFiles = await readdir(sharpLibDir);
} catch {
  console.error(
    "Missing @img/sharp-win32-x64 in the IIS payload. Run `pnpm install` with the repository pnpm-workspace.yaml before building.",
  );
  process.exit(1);
}

if (
  !sharpFiles.some((file) => file.endsWith(".node")) ||
  !sharpFiles.some((file) => file.toLowerCase().endsWith(".dll"))
) {
  console.error(
    "The @img/sharp-win32-x64 package is incomplete: its native .node or libvips .dll file is missing.",
  );
  process.exit(1);
}

await rm(archivePath, { force: true });

const output = createWriteStream(archivePath);
const archive = new ZipArchive({ zlib: { level: 9 } });
const completed = new Promise((resolve, reject) => {
  output.on("close", resolve);
  output.on("error", reject);
  archive.on("warning", reject);
  archive.on("error", reject);
});

archive.pipe(output);
archive.directory(payloadDir, false);
await archive.finalize();
await completed;

const archiveSize = (await stat(archivePath)).size;
console.log(`IIS ZIP ready: ${path.relative(root, archivePath)}`);
console.log(`  ${(archiveSize / 1024 / 1024).toFixed(1)} MiB`);
console.log("  includes @img/sharp-win32-x64 native binary and libvips DLLs");
