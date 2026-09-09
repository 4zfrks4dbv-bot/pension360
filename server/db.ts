import { Pool } from "pg";

export type Client = {
  id: number; nss: string; curp: string; name: string; service: string; followUp: string;
  contract: string; visit: string; cost: string; observations: string; advisor: string; createdAt: string;
};

if (!process.env.DATABASE_URL) console.warn("⚠️ Falta DATABASE_URL. Configúrala antes de iniciar el servidor.");
const isExternalUrl = /\.render\.com/.test(process.env.DATABASE_URL || "");
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: isExternalUrl ? { rejectUnauthorized: false } : false });
let initialized = false;

async function ensureInit() {
  if (initialized) return;
  await pool.query(`CREATE TABLE IF NOT EXISTS clients (id SERIAL PRIMARY KEY, nss TEXT NOT NULL DEFAULT '', curp TEXT NOT NULL DEFAULT '', name TEXT NOT NULL, service TEXT NOT NULL DEFAULT '', follow_up TEXT NOT NULL DEFAULT 'En proceso', contract TEXT NOT NULL DEFAULT '', visit TEXT NOT NULL DEFAULT '', cost TEXT NOT NULL DEFAULT '', observations TEXT NOT NULL DEFAULT '', advisor TEXT NOT NULL DEFAULT '', created_at TIMESTAMPTZ NOT NULL DEFAULT now());`);
  initialized = true;
}

function rowToClient(row: any): Client { return { id: row.id, nss: row.nss, curp: row.curp, name: row.name, service: row.service, followUp: row.follow_up, contract: row.contract, visit: row.visit, cost: row.cost, observations: row.observations, advisor: row.advisor, createdAt: row.created_at }; }
export async function listClients() { await ensureInit(); const { rows } = await pool.query("SELECT * FROM clients ORDER BY created_at DESC"); return rows.map(rowToClient); }
export async function createClient(data: Omit<Client, "id" | "createdAt">) { await ensureInit(); const { rows } = await pool.query(`INSERT INTO clients (nss, curp, name, service, follow_up, contract, visit, cost, observations, advisor) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`, [data.nss, data.curp, data.name, data.service, data.followUp, data.contract, data.visit, data.cost, data.observations, data.advisor]); return rowToClient(rows[0]); }
export async function updateClient(id: number, data: Omit<Client, "id" | "createdAt">) { await ensureInit(); const { rows } = await pool.query(`UPDATE clients SET nss=$1, curp=$2, name=$3, service=$4, follow_up=$5, contract=$6, visit=$7, cost=$8, observations=$9, advisor=$10 WHERE id=$11 RETURNING *`, [data.nss, data.curp, data.name, data.service, data.followUp, data.contract, data.visit, data.cost, data.observations, data.advisor, id]); return rows.length ? rowToClient(rows[0]) : null; }
