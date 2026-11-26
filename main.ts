// Japan Stat Atlas — entry program (Node 24, standard library only).
//
// This program hands the site in. It copies the static site in app/ and the
// screenshots in screenshots/ from beside this file into the output directory
// (/output in the grader, or MAKEFUN_OUTPUT_DIR elsewhere) and writes
// /output/dossier.json with buildDossier from the vendored make.fun library.
// The site itself needs no build step: app/index.html opens in any browser.
//
// The program is deterministic: given the same repository it writes the same
// bytes on every run, so the grader's two runs agree. It prints a one-line
// summary per stage to stdout; nothing it prints lands in /output.

import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

// Where the repository lives (the directory holding this file) and where the
// hand-in goes. Outside the grader MAKEFUN_OUTPUT_DIR stands in for /output.
const REPO_ROOT = resolve(fileURLToPath(new URL('.', import.meta.url)));
const OUTPUT_DIR = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? '/output');

// The dossier library's own caps, matching the scorer's gate: at most four
// screenshots of at most 256 KiB each, app/ at most 993 entries and 16 MiB,
// and the dossier text at most 160 KiB.
const DOSSIER_OPTIONS = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
};
const MAX_DOSSIER_BYTES = 1572864;

function fail(message) {
  throw new Error(`japan-stat-atlas main.ts: ${message}`);
}

function isInside(parent, child) {
  const rel = relative(parent, child);
  return rel === '' || (!rel.startsWith('..' + sep) && rel !== '..' && !rel.startsWith('/'));
}

function requireDir(path, label) {
  if (!existsSync(path)) fail(`missing ${label} directory: ${path}`);
  if (!statSync(path).isDirectory()) fail(`${label} is not a directory: ${path}`);
  return path;
}

function requireFile(path, label) {
  if (!existsSync(path)) fail(`missing ${label} file: ${path}`);
  if (!statSync(path).isFile()) fail(`${label} is not a regular file: ${path}`);
  return path;
}

function listFiles(dir) {
  return readdirSync(dir).filter((name) => {
    if (name.startsWith('.')) return false;
    return statSync(join(dir, name)).isFile();
  });
}

// Refuse a half-built or self-overwriting hand-in before writing anything.
function preflightChecks() {
  if (isInside(REPO_ROOT, OUTPUT_DIR)) {
    fail(`output directory ${OUTPUT_DIR} is inside the repository; refusing to copy the repo into itself`);
  }
  const appDir = requireDir(join(REPO_ROOT, 'app'), 'app');
  requireFile(join(appDir, 'index.html'), 'app/index.html');
  const shotsDir = requireDir(join(REPO_ROOT, 'screenshots'), 'screenshots');
  const shots = listFiles(shotsDir);
  if (shots.length < 3 || shots.length > 4) {
    fail(`expected 3 or 4 screenshots, found ${shots.length}: ${shots.join(', ')}`);
  }
  for (const name of shots) {
    const size = statSync(join(shotsDir, name)).size;
    if (size > DOSSIER_OPTIONS.screenshots.max_bytes) {
      fail(`screenshot ${name} is ${size} bytes, over the 256 KiB cap`);
    }
  }
  return { appDir, shotsDir, shots };
}

// Copy the site and its screenshots, then write the dossier and check it.
function handIn({ appDir, shotsDir, shots }) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  cpSync(appDir, join(OUTPUT_DIR, 'app'), { recursive: true, dereference: false });
  mkdirSync(join(OUTPUT_DIR, 'screenshots'), { recursive: true });
  cpSync(shotsDir, join(OUTPUT_DIR, 'screenshots'), { recursive: true, dereference: false });
  console.log(`copied app/ and ${shots.length} screenshots to ${OUTPUT_DIR}`);

  const dossier = buildDossier(OUTPUT_DIR, DOSSIER_OPTIONS);
  const dossierPath = join(OUTPUT_DIR, 'dossier.json');
  writeFileSync(dossierPath, dossier);
  const bytes = statSync(dossierPath).size;
  if (bytes > MAX_DOSSIER_BYTES) fail(`dossier.json is ${bytes} bytes, over the 1.5 MiB cap`);
  console.log(`wrote dossier.json (${bytes} bytes)`);
}

const checked = preflightChecks();
handIn(checked);
