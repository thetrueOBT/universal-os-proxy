
import express from "express";
import { createBareServer } from "@tomphttp/bare-server-node";
import { createServer } from "node:http";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const app = express();
const server = createServer();
const bareServer = createBareServer("/bare/");

app.get("/", (_req, res) => {
  res.type("html").send(`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <title>Universal OS Proxy</title>
      </head>
      <body style="font-family:system-ui;max-width:700px;margin:50px auto;padding:20px;background:#171633;color:#fff8f4">
        <h1>Universal OS Proxy</h1>
        <p id="status">Checking server status...</p>
        <p>This is the proxy server foundation. The browser interface still needs to be added.</p>
        <script>
          document.getElementById("status").textContent =
            "Web server is running.";
        </script>
      </body>
    </html>
  `);
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use(express.static(join(__dirname, "public")));

server.on("request", (req, res) => {
  app(req, res);
});

server.on("upgrade", (req, socket, head) => {
  if (bareServer.shouldRoute(req)) {
    bareServer.routeUpgrade(req, socket, head);
  } else {
    socket.end();
  }
});

server.listen(process.env.PORT || 3000, () => {
  console.log("Universal OS Proxy server started");
});
