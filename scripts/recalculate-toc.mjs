import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const defaultTarget = path.join(
  projectRoot,
  "doc",
  "PRESENTACION_CURSO_MCP.md"
);
const targetPath = process.argv[2]
  ? path.resolve(projectRoot, process.argv[2])
  : defaultTarget;

const raw = await readFile(targetPath, "utf8");
const lines = raw.split(/\r?\n/);

// El front-matter Marp ocupa las primeras líneas entre "---" y "---".
let contentStart = 0;
if (lines[0]?.trim() === "---") {
  const closingIndex = lines.findIndex(
    (line, index) => index > 0 && line.trim() === "---"
  );
  contentStart = closingIndex === -1 ? 0 : closingIndex + 1;
}

const headingToSlide = new Map();
let slide = 1;
let inFence = false;

for (let index = contentStart; index < lines.length; index++) {
  const line = lines[index];

  if (/^```/.test(line.trim())) {
    inFence = !inFence;
    continue;
  }
  if (inFence) continue;

  if (line.trim() === "---") {
    slide++;
    continue;
  }

  const headingMatch = line.match(/^#{1,6}\s+(.*)$/);
  if (headingMatch) {
    const headingText = headingMatch[1].trim();
    if (!headingToSlide.has(headingText)) {
      headingToSlide.set(headingText, slide);
    }
  }
}

let updatedCount = 0;
const unmatched = new Set();

const linkPattern = /\[([^\]]+)\]\(#(\d+)\)/g;
const updatedContent = raw.replace(linkPattern, (fullMatch, linkText, oldSlide) => {
  const trimmedText = linkText.trim();
  const newSlide = headingToSlide.get(trimmedText);

  if (newSlide === undefined) {
    unmatched.add(trimmedText);
    return fullMatch;
  }

  if (String(newSlide) === oldSlide) {
    return fullMatch;
  }

  updatedCount++;
  return `[${linkText}](#${newSlide})`;
});

if (updatedCount > 0) {
  await writeFile(targetPath, updatedContent, "utf8");
}

console.log(`Enlaces actualizados: ${updatedCount}`);
if (unmatched.size > 0) {
  console.log("Enlaces sin apartado correspondiente (revisar manualmente):");
  for (const text of unmatched) {
    console.log(`  - ${text}`);
  }
}
console.log(`Archivo: ${path.relative(projectRoot, targetPath)}`);
