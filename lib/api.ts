// lib/api.ts

const BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1"
).replace(/\/+$/, "");

/* ------------------------------ Error ------------------------------ */

export class ApiError<TBody = unknown> extends Error {
  status: number;
  body: TBody | null;

  constructor(message: string, status: number, body: TBody | null = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

export function isApiError(err: unknown): err is ApiError {
  return err instanceof ApiError;
}

/* ------------------------------ Types ------------------------------ */

export type ApiOptions = Omit<RequestInit, "headers"> & {
  /** Bearer token, otomatis jadi header Authorization */
  token?: string | null;
  /** Query string, nilai undefined/null dibuang */
  params?: Record<string, string | number | boolean | null | undefined>;
  /** Header tambahan (mis. Idempotency-Key) */
  headers?: Record<string, string>;
};

/* ----------------------------- Helpers ----------------------------- */

function buildUrl(path: string, params?: ApiOptions["params"]): string {
  let cleanPath = path.startsWith("/") ? path : `/${path}`;

  // hindari /api/v1/api/v1 kalau path masih diawali /api/v1
  if (BASE_URL.endsWith("/api/v1") && cleanPath.startsWith("/api/v1")) {
    cleanPath = cleanPath.slice("/api/v1".length) || "/";
  }

  const url = new URL(BASE_URL + cleanPath);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    }
  }

  return url.toString();
}

async function parseBody(res: Response): Promise<unknown> {
  if (res.status === 204) return null;

  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return res.json().catch(() => null);
  }
  return res.text().catch(() => null);
}

function extractMessage(body: unknown, fallback: string): string {
  if (body && typeof body === "object") {
    const b = body as Record<string, unknown>;
    if (typeof b.message === "string") return b.message;
    if (typeof b.error === "string") return b.error;
  }
  if (typeof body === "string" && body) return body;
  return fallback;
}

/* ------------------------------- api ------------------------------- */

/**
 * Fetcher global untuk semua endpoint BE.
 */
export async function api<T>(
  path: string,
  options: ApiOptions = {}
): Promise<T> {
  const { token, params, headers, body, ...rest } = options;

  const finalHeaders: Record<string, string> = {
    Accept: "application/json",
    ...headers,
  };

  if (body && !(body instanceof FormData) && !finalHeaders["Content-Type"]) {
    finalHeaders["Content-Type"] = "application/json";
  }

  if (token) {
    finalHeaders["Authorization"] = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(buildUrl(path, params), {
      ...rest,
      body,
      headers: finalHeaders,
    });
  } catch {
    throw new ApiError("Tidak dapat terhubung ke server", 0);
  }

  const data = await parseBody(res);

  if (!res.ok) {
    throw new ApiError(
      extractMessage(data, `Request gagal (${res.status})`),
      res.status,
      data
    );
  }

  return data as T;
}

/* Envelope standar response BE */
export type ApiMeta = {
  request_id: string;
  timestamp: string;
};

export type ApiResponse<TData = unknown> = {
  status: number;
  success: boolean;
  message: string;
  data: TData;
  meta: ApiMeta;
};