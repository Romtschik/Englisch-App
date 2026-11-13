import { readFile, writeFile, readdir, mkdir, copyFile } from "node:fs/promises";

const mime = {
  html: "text/html; charset=utf-8", css: "text/css; charset=utf-8",
  js: "text/javascript; charset=utf-8", svg: "image/svg+xml",
  woff2: "font/woff2", txt: "text/plain; charset=utf-8"
};
const root = new URL("../", import.meta.url);
const from = path => new URL(path, root);
const webFiles = await readdir(from("web"), { recursive: true, withFileTypes: true });
const entries = [];
for (const file of webFiles) {
  if (!file.isFile()) continue;
  const path = file.parentPath.endsWith("fonts") ? "fonts/" + file.name : file.name;
  const ext = path.split(".").at(-1);
  if (!mime[ext]) throw Error("Unbekannter Dateityp: " + path);
  const data = await readFile(from("web/" + path));
  const body = ext === "woff2"
    ? "Uint8Array.from(atob(" + JSON.stringify(data.toString("base64")) + "), c => c.charCodeAt(0))"
    : JSON.stringify(data.toString("utf8"));
  entries.push(JSON.stringify("/" + path) + ": { type: " + JSON.stringify(mime[ext]) + ", body: () => " + body + " }");
}
const embedded = "const assets = Object.assign(Object.create(null), {" + entries.join(",\n") + "});\n";
await mkdir(from("dist/server"), { recursive: true });
await mkdir(from("dist/.openai"), { recursive: true });
await copyFile(from(".openai/hosting.json"), from("dist/.openai/hosting.json"));

const content = (await readFile(from("web/content.js"), "utf8")).replace(/^export const /gm, "const ");
const learning = (await readFile(from("web/learning.js"), "utf8")).replace(/^export function /gm, "function ");
const worker = (await readFile(from("worker/index.js"), "utf8")).replace(/^import .*;\r?\n/gm, "");
await writeFile(from("dist/server/index.js"), embedded + content + "\n" + learning + "\n" + worker);
console.log("Worker gebaut, " + entries.length + " Webdateien.");
