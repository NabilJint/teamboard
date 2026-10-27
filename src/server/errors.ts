import { TRPCError } from "@trpc/server";

export class DomainError extends Error {
  constructor(public readonly code: string, message: string) {
    super(message);
    this.name = "DomainError";
  }
}

export function mapDomainError(error: unknown): TRPCError {
  if (!(error instanceof DomainError)) {
    console.error("Unexpected error caught by mapDomainError:", error);
  }
  if (error instanceof DomainError) {
    return new TRPCError({
      code: error.code as "BAD_REQUEST" | "NOT_FOUND" | "FORBIDDEN" | "CONFLICT",
      message: error.message,
    });
  }
  return new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Unexpected error" });
}
