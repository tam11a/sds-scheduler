import { Prisma } from "@/lib/generated/prisma/client";

export interface ApiErrorResponse {
  success: false;
  error: string;
  code?: string;
  fields?: string[];
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export function handlePrismaError(
  error: Prisma.PrismaClientKnownRequestError
): ApiErrorResponse {
  // Prisma Client Known Request Error
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        // Unique constraint violation (e.g., duplicate email)
        const fields = ["email", "phone"];
        return {
          success: false,
          error: `A record with this data may already exists.`,
          code: error.code,
          fields,
        };

      case "P2003":
        // Foreign key constraint failed
        return {
          success: false,
          error: "Related record not found.",
          code: error.code,
        };

      case "P2025":
        // Record not found
        return {
          success: false,
          error: "Record not found.",
          code: error.code,
        };

      case "P2014":
        // Required relation violation
        return {
          success: false,
          error: "The change would violate a required relation.",
          code: error.code,
        };

      case "P2016":
        // Query interpretation error
        return {
          success: false,
          error: "Invalid query parameters.",
          code: error.code,
        };

      default:
        return {
          success: false,
          error: "Database operation failed.",
          code: error.code,
        };
    }
  }

  // Prisma Client Validation Error
  if (error as Prisma.PrismaClientValidationError) {
    return {
      success: false,
      error: "Invalid data provided.",
      code: "VALIDATION_ERROR",
    };
  }

  // Prisma Client Initialization Error
  if (error as Prisma.PrismaClientInitializationError) {
    return {
      success: false,
      error: "Database connection failed.",
      code: "CONNECTION_ERROR",
    };
  }

  // Generic Error
  if (error as Error) {
    return {
      success: false,
      error:
        (
          error as {
            message: string;
          }
        ).message || "An unexpected error occurred.",
      code: "UNKNOWN_ERROR",
    };
  }

  // Unknown error type
  return {
    success: false,
    error: "An unexpected error occurred.",
    code: "UNKNOWN_ERROR",
  };
}
