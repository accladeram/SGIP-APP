const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

async function request<T>(
  endpoint: string,
  method: string = 'GET',
  body?: unknown,
  extraHeaders?: Record<string, string>,
): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...extraHeaders,
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  if (!res.ok) {
    const msg = await res.text().catch(() => `HTTP ${res.status}`);
    throw new Error(msg || `HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export const api = {
  get: <T>(endpoint: string): Promise<T> => request<T>(endpoint),
  post: <T>(
    endpoint: string,
    body: unknown,
    idempotencyKey?: string,
  ): Promise<T> =>
    request<T>(
      endpoint,
      'POST',
      body,
      idempotencyKey ? { 'X-Idempotency-Key': idempotencyKey } : undefined,
    ),
};
