import { access, mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const diagramsDirectory = path.join(projectRoot, "doc", "diagramas");
const imagesDirectory = path.join(projectRoot, "doc", "img");
const requestedName = process.argv[2];

if (!requestedName || requestedName.startsWith("-")) {
  console.error("Uso: npm run convert:diagram -- nombre-del-diagrama.md");
  process.exit(1);
}

const sourceName = requestedName.endsWith(".md")
  ? requestedName
  : `${requestedName}.md`;

if (path.basename(sourceName) !== sourceName) {
  console.error("El nombre debe corresponder a un archivo dentro de doc/diagramas.");
  process.exit(1);
}

const sourcePath = path.join(diagramsDirectory, sourceName);
const outputName = `${path.basename(sourceName, ".md")}.svg`;
const outputPath = path.join(imagesDirectory, outputName);
const temporaryInputPath = path.join(
  diagramsDirectory,
  `.${path.basename(sourceName, ".md")}.mmd`
);

try {
  await access(sourcePath);
  const markdown = await readFile(sourcePath, "utf8");
  const mermaidBlock = markdown.match(/```mermaid\s*\r?\n([\s\S]*?)\r?\n```/i);

  if (!mermaidBlock) {
    throw new Error("El archivo no contiene un bloque ```mermaid ... ```." );
  }

  await writeFile(temporaryInputPath, `${mermaidBlock[1].trimEnd()}\n`, "utf8");
  await mkdir(imagesDirectory, { recursive: true });

  try {
    const mmdcCommand = process.platform === "win32" ? "mmdc.cmd" : "mmdc";
    await execFileAsync(
      mmdcCommand,
      ["-i", temporaryInputPath, "-o", outputPath, "-b", "transparent"],
      {
        cwd: projectRoot,
        shell: process.platform === "win32",
        windowsHide: true
      }
    );
  } finally {
    await unlink(temporaryInputPath).catch(() => {});
  }

  console.log(`SVG generado: ${path.relative(projectRoot, outputPath)}`);
} catch (error) {
  console.error(`No se pudo convertir '${sourceName}': ${error.message}`);
  process.exit(1);
}