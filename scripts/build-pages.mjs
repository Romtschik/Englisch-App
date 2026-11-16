import { cp, mkdir, readFile, writeFile } from "node:fs/promises";

const source = new URL("../web/", import.meta.url);
const output = new URL("../dist/pages/", import.meta.url);
const syncApp = "https://rail-english-lernapp.hopefulmatch8.chatgpt.site/#fortschritt";

await mkdir(output, { recursive: true });
await cp(source, output, { recursive: true });

const indexPath = new URL("index.html", output);
const index = await readFile(indexPath, "utf8");
await writeFile(indexPath, index.replace("</head>", `  <meta name="sync-app" content="${syncApp}">\n</head>`));
await writeFile(new URL(".nojekyll", output), "");
console.log("GitHub-Pages-Version steht in dist/pages.");
