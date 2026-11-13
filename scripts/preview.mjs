import { createServer } from "node:http";
import worker from "../dist/server/index.js";

const port = Number(process.argv[2] ?? 4173);
createServer(async (incoming, outgoing) => {
  try {
    const request = new Request("http://127.0.0.1:" + port + incoming.url, {
      method: incoming.method, headers: incoming.headers
    });
    const response = await worker.fetch(request, {});
    outgoing.writeHead(response.status, Object.fromEntries(response.headers));
    outgoing.end(Buffer.from(await response.arrayBuffer()));
  } catch {
    outgoing.writeHead(500).end();
  }
}).listen(port, "127.0.0.1", () => console.log("http://127.0.0.1:" + port));
