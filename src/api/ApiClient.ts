import { ApiError } from "./ApiError";

export class ApiClient {
  constructor(private readonly baseUrl: string) {}

  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    const res = await fetch(`${this.baseUrl}${path}`, {
      ...init,
      headers: {
        ...headers,
        ...init.headers,
      },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new ApiError(res.status, text || res.statusText);
    }

    return (await res.json()) as T;
  }

  get<T>(path: string, signal?: AbortSignal): Promise<T> {
    return this.request<T>(path, { signal });
  }

  post<T, B>(path: string, body: B): Promise<T> {
    return this.request<T>(path, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }
}

export const apiClient = new ApiClient("https://dummyjson.com");
