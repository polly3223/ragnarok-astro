// Downloads every asset listed in assets.manifest.json into public/ (skips files that already exist).
// Usage: bun scripts/fetch-assets.ts [--force]
import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

interface Asset {
  path: string;
  source: string;
}

const root = fileURLToPath(new URL("..", import.meta.url));
const assets: Asset[] = JSON.parse(await readFile(join(root, "assets.manifest.json"), "utf8"));
const force = process.argv.includes("--force");
const exists = (file: string) => access(file).then(() => true, () => false);
let fetched = 0;

for (const { path, source } of assets) {
  const target = join(root, "public", path);
  if (!force && (await exists(target))) continue;
  const response = await fetch(source);
  if (!response.ok) throw new Error(`${response.status} ${source}`);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, new Uint8Array(await response.arrayBuffer()));
  fetched++;
}

console.log(`${assets.length} assets in manifest, ${fetched} downloaded`);
