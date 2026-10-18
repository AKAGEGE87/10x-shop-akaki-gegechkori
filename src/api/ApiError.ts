export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export function isApiError(e: unknown): e is ApiError {
  return (
    e instanceof ApiError ||
    (typeof e === "object" &&
      e !== null &&
      "status" in e &&
      typeof (e as { status: unknown }).status === "number" &&
      "message" in e &&
      typeof (e as { message: unknown }).message === "string")
  );
}
