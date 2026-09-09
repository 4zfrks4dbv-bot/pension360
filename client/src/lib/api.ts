export type ApiClient = {
  id: number;
  nss: string;
  curp: string;
  name: string;
  service: string;
  followUp: string;
  contract: string;
  visit: string;
  cost: string;
  observations: string;
  advisor: string;
  createdAt?: string;
};

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  const response = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new ApiError(payload.error || "No se pudo completar la solicitud", response.status);
  return payload as T;
}

export async function login(user: string, pass: string) {
  return request<{ ok: boolean; token: string }>("/api/login", {
    method: "POST",
    body: JSON.stringify({ user, pass }),
  });
}

export async function listClients(token: string) {
  const payload = await request<{ clients: ApiClient[] }>("/api/clients", {}, token);
  return payload.clients;
}

export async function createClient(token: string, client: Omit<ApiClient, "id" | "createdAt">) {
  const payload = await request<{ ok: boolean; client: ApiClient }>("/api/clients", {
    method: "POST",
    body: JSON.stringify(client),
  }, token);
  return payload.client;
}

export async function updateClient(token: string, id: number, client: Omit<ApiClient, "id" | "createdAt">) {
  const payload = await request<{ ok: boolean; client: ApiClient }>(`/api/clients/${id}`, {
    method: "PUT",
    body: JSON.stringify(client),
  }, token);
  return payload.client;
}
