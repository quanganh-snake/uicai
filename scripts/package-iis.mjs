#!/usr/bin/env node
// Assembles the IIS deployment payload from a finished `next build`:
//   dist-iis/app   -> standalone server + .next/static + public (copy to the
//                     service working directory, C:\inetpub\aiesi2027\app)
//   dist-iis/site  -> web.config for the IIS site root
//   dist-iis/service -> WinSW service definition
import { cp, mkdir, readdir, rm, stat } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const out = path.join(root, "dist-iis");
const standalone = path.join(root, ".next", "standalone");

try {
  await stat(path.join(standalone, "server.js"));
} catch {
  console.error(
    "Missing .next/standalone/server.js — run `pnpm build` with output: \"standalone\" first.",
  );
  process.exit(1);
}

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });

// dereference: the payload is copied/zipped to a Windows server, where symlinks
// do not survive. `.npmrc` keeps node_modules hoisted so a plain copy resolves.
await cp(standalone, path.join(out, "app"), {
  recursive: true,
  dereference: true,
});
await cp(path.join(root, ".next", "static"), path.join(out, "app", ".next", "static"), {
  recursive: true,
});
await cp(path.join(root, "public"), path.join(out, "app", "public"), {
  recursive: true,
});

// Next's file tracer includes the Windows Sharp addon but omits the libvips
// DLLs when the build runs on a non-Windows host. Copy the complete optional
// package installed by pnpm so /_next/image works after transfer to IIS.
const sharpSource = path.join(root, "node_modules", "@img", "sharp-win32-x64");
const sharpDestination = path.join(out, "app", "node_modules", "@img", "sharp-win32-x64");
try {
  await stat(path.join(sharpSource, "package.json"));
} catch {
  throw new Error(
    "Missing @img/sharp-win32-x64. Run `pnpm install` with this repository's pnpm-workspace.yaml, then rebuild.",
  );
}
await cp(sharpSource, sharpDestination, {
  recursive: true,
  dereference: true,
});
await cp(path.join(root, "deploy", "iis", "web.config"), path.join(out, "site", "web.config"));
await cp(
  path.join(root, "deploy", "iis", "aiesi2027-next.xml"),
  path.join(out, "service", "aiesi2027-next.xml"),
);
for (const file of ["setup-iis.bat", "deploy.bat", "write-service-xml.ps1"]) {
  await cp(path.join(root, "deploy", "iis", file), path.join(out, file));
}
await mkdir(path.join(out, "tools"), { recursive: true });
await cp(
  path.join(root, "scripts", "check-auth-upstream.mjs"),
  path.join(out, "tools", "check-auth-upstream.mjs"),
);

console.log(`IIS payload ready: ${path.relative(root, out)}`);
console.log("  app/     -> service working directory (node server.js)");
console.log("  site/    -> IIS site physical path (web.config only)");
console.log("  service/ -> WinSW definition (set secrets before install)");
console.log("  deploy.bat    -> one-click deploy, run as administrator on the server");
console.log("  setup-iis.bat -> IIS-only setup, run as administrator on the server");
console.log("  tools/    -> check-auth-upstream.mjs (kiểm chứng PRIVATE_KEY_ENCRYPT)");

const sharpFiles = await readdir(path.join(sharpDestination, "lib"));
if (
  !sharpFiles.some((file) => file.endsWith(".node")) ||
  !sharpFiles.some((file) => file.toLowerCase().endsWith(".dll"))
) {
  throw new Error(
    "IIS payload has an incomplete @img/sharp-win32-x64 package: native .node or libvips .dll file missing.",
  );
}
console.log("  sharp     -> @img/sharp-win32-x64 addon and libvips DLLs included");
