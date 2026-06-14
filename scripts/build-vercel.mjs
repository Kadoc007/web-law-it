import { cpSync, mkdirSync, rmSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const rootDir = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const frontendDir = path.join(rootDir, "frontend");
const outputDir = path.join(rootDir, "dist");

rmSync(outputDir, { recursive: true, force: true });
mkdirSync(outputDir, { recursive: true });

cpSync(frontendDir, outputDir, {
  recursive: true,
  filter(source) {
    return path.basename(source) !== "vercel.json";
  },
});

console.log(`Copied frontend assets to ${path.relative(rootDir, outputDir)}`);
