// Dependency-free, local-only preview. This file is not needed on GitHub Pages.
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const root = __dirname;
const mime = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".svg": "image/svg+xml", ".pdf": "application/pdf" };
const publicFiles = new Set(["index.html", "styles.css", "profile.js", "site.js"]);
http.createServer((request, response) => {
  let relative;
  try { relative = decodeURIComponent(new URL(request.url, "http://localhost").pathname).replace(/^\/+/, "") || "index.html"; }
  catch { response.writeHead(400); response.end("Bad request"); return; }
  const allowed = publicFiles.has(relative) || /^(?:assets|documents)\/[a-zA-Z0-9 _.-]+\.(?:pdf|svg|png|jpe?g|webp)$/i.test(relative);
  const filename = path.resolve(root, relative);
  if (!allowed || !filename.startsWith(root + path.sep)) { response.writeHead(404); response.end("Not found"); return; }
  fs.readFile(filename, (error, data) => {
    if (error) { response.writeHead(404); response.end("Not found"); return; }
    response.writeHead(200, { "Content-Type": mime[path.extname(filename)] || "application/octet-stream", "Cache-Control": "no-store" });
    response.end(data);
  });
}).listen(4173, "127.0.0.1", () => console.log("Portfolio preview: http://127.0.0.1:4173"));
