import * as fs from 'node:fs';
import * as path from 'node:path';

// Minimal .env parser for tests (avoid extra deps).
export function loadEnvFile(relativePath: string): boolean {
  const filePath = path.join(__dirname, '..', relativePath);
  if (!fs.existsSync(filePath)) return false;

  const raw = fs.readFileSync(filePath, 'utf8');
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }

  return true;
}
