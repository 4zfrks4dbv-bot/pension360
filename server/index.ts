import "dotenv/config";
import express from "express";
import crypto from "crypto";
import path from "path";
import { fileURLToPath } from "url";
import { listClients, createClient, updateClient } from "./db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.use(express.json());

function asyncHandler(fn: (req: express.Request, res: express.Response) => Promise<void>) {
  return (req: express.Request, res: express.Response) => {
    fn(req, res).catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Error interno del servidor" });
    });
  };
}

function makeRateLimiter({ windowMs, max, message }: { windowMs: number; max: number; message: string }) {
  const hits = new Map<string, { count: number; resetAt: number }>();
  return function rateLimiter(req: express.Request, res: express.Response, next: express.NextFunction) {
    const ip = req.ip || "unknown";
    const now = Date.now();
    let entry = hits.get(ip);
    if (!entry || now > entry.resetAt) entry = { count: 0, resetAt: now + windowMs };
    entry.count += 1;
    hits.set(ip, entry);
    if (entry.count > max) return res.status(429).json({ error: message });
    next();
  };
}

const loginRateLimit = makeRateLimiter({ windowMs: 15 * 60 * 1000, max: 10, message: "Demasiados intentos de inicio de sesión. Espera unos minutos." });
const validTokens = new Set<string>();

app.post("/api/login", loginRateLimit, (req, res) => {
  const { user, pass } = req.body || {};
  const ok = Boolean(process.env.TEAM_USER && process.env.TEAM_PASS) && user === process.env.TEAM_USER && pass === process.env.TEAM_PASS;
  if (!ok) return res.status(401).json({ ok: false, error: "Usuario o contraseña incorrectos" });
  const token = crypto.randomBytes(24).toString("hex");
  validTokens.add(token);
  res.json({ ok: true, token });
});

function requireAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token || !validTokens.has(token)) return res.status(401).json({ error: "No autorizado" });
  next();
}

app.get("/api/clients", requireAuth, asyncHandler(async (_req, res) => {
  res.json({ clients: await listClients() });
}));

function sanitizeClientInput(body: any) {
  const clean = (value: unknown) => String(value ?? "").slice(0, 500);
  return { nss: clean(body.nss), curp: clean(body.curp), name: clean(body.name).slice(0, 120), service: clean(body.service), followUp: clean(body.followUp) || "En proceso", contract: clean(body.contract), visit: clean(body.visit), cost: clean(body.cost), observations: clean(body.observations).slice(0, 2000), advisor: clean(body.advisor) };
}

app.post("/api/clients", requireAuth, asyncHandler(async (req, res) => {
  const data = sanitizeClientInput(req.body || {});
  if (!data.name) { res.status(400).json({ error: "Falta el nombre del cliente" }); return; }
  res.json({ ok: true, client: await createClient(data) });
}));

app.put("/api/clients/:id", requireAuth, asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) { res.status(400).json({ error: "ID inválido" }); return; }
  const data = sanitizeClientInput(req.body || {});
  if (!data.name) { res.status(400).json({ error: "Falta el nombre del cliente" }); return; }
  const client = await updateClient(id, data);
  if (!client) { res.status(404).json({ error: "Cliente no encontrado" }); return; }
  res.json({ ok: true, client });
}));

const staticPath = process.env.NODE_ENV === "production" ? path.resolve(__dirname, "public") : path.resolve(__dirname, "..", "dist", "public");
app.use(express.static(staticPath));
app.get("*", (_req, res) => res.sendFile(path.join(staticPath, "index.html")));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Pensión 360 corriendo en el puerto ${port}`));
