import { env } from '@/config/env';

export class ApiError extends Error {
  public readonly status: number;

  public constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

type RequestOptions = RequestInit & {
  timeoutMs?: number;
};

export async function requestJson<TResponse>(
  path: string,
  { timeoutMs = 15_000, headers, ...options }: RequestOptions = {},
): Promise<TResponse> {
  if (!env.apiUrl) {
    throw new ApiError('API URL is not configured.', 0);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${env.apiUrl}${path}`, {
      ...options,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...headers,
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new ApiError(`Request failed with status ${response.status}.`, response.status);
    }

    return (await response.json()) as TResponse;
  } finally {
    clearTimeout(timeout);
  }
}
