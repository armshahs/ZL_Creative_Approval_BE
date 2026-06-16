import DatabaseEntityNotFoundError from "./database-entity-not-found-error";
import DatabaseQueryError from "./database-query-error";
import AppError from "./custom-error";
import { QueryFailedError, EntityNotFoundError } from "typeorm";
import { AxiosError } from "axios";
import AxiosAppError from "./axios-app-error";

export default function mapErrorToAppError(params: {
  error: unknown;
  functionName?: string;
  serviceName?: string;
}): AppError<any> {
  const { error, functionName, serviceName } = params;

  // CASE WHEN THE ERROR OBJECT IS ALREADY MODIFIED
  if (error instanceof AppError) {
    return error;
  }

  // ERROR 1: TYPEORM ERROR - QUERY/CONSTRAINT ERROR (UNIQUE KEY CONSTRAINT, FK CONSTRAINT, CHECK CONSTRAINT, WRONG SYNTAX ETC)
  if (error instanceof QueryFailedError) {
    return new DatabaseQueryError(error, functionName);
  }

  // ERROR 2: TYPEORM ERROR - ENTITY NOT FOUND (FINDONE AND GETRAWONE RETURN 0 RESULTS)
  if (error instanceof EntityNotFoundError) {
    return new DatabaseEntityNotFoundError(error, functionName);
  }

  // ERROR 3: AXIOS ERROR
  if ((error as any)?.isAxiosError) {
    const axiosError = error as AxiosError;

    const statusCode =
      axiosError.response?.status ??
      (axiosError.code === "ECONNREFUSED" ? 503 : 500);

    const message =
      (axiosError.response?.data as any)?.message ??
      axiosError.message ??
      "External API request failed";

    return new AxiosAppError({
      message,
      statusCode,
      code: axiosError.code,
      functionName,
      serviceName,
      originalError: axiosError,
    });
  }

  // Fallback for unknown errors
  return new AppError({
    message: error instanceof Error ? error.message : "Unknown error",
    statusCode: 500,
    code: "UNKNOWN_ERROR",
    functionName,
  });
}
