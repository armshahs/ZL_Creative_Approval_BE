import { GaxiosError } from "gaxios";
import { AppError } from "../errors";
// import {
//   CannotConnectAlreadyConnectedError,
//   ConnectionNotFoundError,
//   RepositoryNotFoundError,
//   QueryFailedError,
// } from "typeorm";
// import { DatabaseQueryError } from "../errors/database-query-error";
// import { DatabaseEntityNotFoundError } from "../errors/database-entity-not-found-error";
// import { DatabaseConnectionError } from "../errors/database-connection-error";
// import { AxiosError } from "axios";
// import { AxiosAppError } from "../errors/axios-app-error";

export class CustomError extends Error {
  message: string;
  status: number;
  apiResponseMessage: string;

  constructor({
    message,
    status,
    apiResponseMessage,
  }: {
    message: string;
    status: number;
    apiResponseMessage: string;
  }) {
    super();
    this.message = message;
    this.status = status;
    this.apiResponseMessage = apiResponseMessage;
  }
}

// Function will return a CustomError instance when provided with a GAxiosError instance
export function getCustomErrorInstanceFromGaxiosError(
  error: GaxiosError,
): CustomError {
  const errorStatus = error.response?.status || 500;
  let apiResponseMessage: string;

  switch (errorStatus) {
    case 404:
      apiResponseMessage = "Google Sheets ID is incorrect!";
      break;
    case 403:
      apiResponseMessage =
        "You are not authorized to access this Google Sheet!";
      break;
    case 400:
      apiResponseMessage =
        "There seems to be some formatting issue with the Google Sheet. Ex: 1) Sheet name could be incorrect (currently we only support the following names: rawDataDayLevel and rawDataTransactionLevel) 2) Data is not in correct format etc.";
      break;
    default:
      apiResponseMessage = "An error occurred";
      break;
  }
  return new CustomError({
    message: error.response?.data || "An error occurred",
    status: error.response?.status || 500,
    apiResponseMessage,
  });
}

// Function will return a CustomError instance when provided with a GAxiosError instance
export function getAppErrorInstanceFromGaxiosError(
  error: GaxiosError,
): AppError<string> {
  const errorStatus = error.response?.status || 500;
  let apiResponseMessage: string;

  switch (errorStatus) {
    case 404:
      apiResponseMessage = "Google Sheets ID is incorrect!";
      break;
    case 403:
      apiResponseMessage =
        "You are not authorized to access this Google Sheet!";
      break;
    case 400:
      apiResponseMessage =
        "There seems to be some formatting issue with the Google Sheet. Ex: 1) Sheet name could be incorrect (currently we only support the following names: rawDataDayLevel and rawDataTransactionLevel) 2) Data is not in correct format etc.";
      break;
    default:
      apiResponseMessage = "An error occurred";
      break;
  }
  return new AppError({
    // message: error.response?.data || "An error occurred",
    message: apiResponseMessage,
    statusCode: error.response?.status || 500,
  });
}

export function isGaxiosError(err: unknown): err is GaxiosError {
  return (
    typeof err === "object" &&
    err !== null &&
    "config" in err &&
    "response" in err &&
    (err as any).isAxiosError !== true // differentiate from AxiosError if needed
  );
}

// Types for the result object with discriminated union
type Success<T> = {
  data: T;
  error: null;
};

type Failure<E> = {
  data: null;
  error: E;
};

export type Result<T, E = CustomError> = Success<T> | Failure<E>;

// Main Wrapper Function
// Even if you don't provide the definition of T, E it will get inferred
export async function tryCatch<T, E = CustomError>(
  promise: Promise<T>,
): Promise<Result<T, E>> {
  try {
    const data = await promise;
    return { data, error: null };
  } catch (error) {
    if (isGaxiosError(error)) {
      return {
        data: null,
        error: getCustomErrorInstanceFromGaxiosError(error) as E,
      };
    }
    return { data: null, error: error as E };
  }
}

// // Error Mapping Function for Db Errors
// /**
//  * Maps TypeORM / database errors to custom AppError classes
//  */
// export function mapDbErrorToAppError(params: {
//   error: unknown;
//   functionName?: string;
// }): AppError<any> {
//   const { error, functionName } = params;

//   // Query / contraint error
//   if (error instanceof QueryFailedError) {
//     return new DatabaseQueryError(error, functionName);
//   }

//   // Entity not found (findOne / getRawOne returns 0 results)
//   if (error instanceof DatabaseEntityNotFoundError) {
//     return new DatabaseEntityNotFoundError(error, functionName);
//   }

//   // Programming Error / Config Error - fail fast
//   // ConnectionNotFoundError - db is not registered properly (human coding error)
//   // CannotConnectAlreadyConnectedError - db is already connected but you are trying to initialize once again (human coding error)
//   if (
//     error instanceof ConnectionNotFoundError ||
//     error instanceof CannotConnectAlreadyConnectedError
//   ) {
//     throw error;
//   }

//   // Operational connection issues (driver/network level)
//   const code = (error as any)?.code;
//   if (code === "ECONNREFUSED" || code === "ETIMEDOUT" || code === "ENOTFOUND") {
//     return new DatabaseConnectionError({
//       message: "Database server is unreachable",
//       statusCode: 503,
//       functionName,
//     });
//   }

//   // Fallback for unknown database errors
//   return new AppError({
//     message: error instanceof Error ? error.message : "Unknown database error",
//     statusCode: 500,
//     code: "DB_UNKNOWN_ERROR",
//     functionName,
//   });
// }

// /**
//  * Maps Axios errors to custom AppError class
//  */
// export function mapAxiosErrorToAppError(params: {
//   error: unknown;
//   functionName?: string;
//   serviceName?: string;
// }): AppError<any> {
//   const { error, functionName, serviceName } = params;

//   if ((error as any)?.isAxiosError) {
//     const axiosError = error as AxiosError;

//     const statusCode =
//       axiosError.response?.status ??
//       (axiosError.code === "ECONNREFUSED" ? 503 : 500);

//     const message =
//       (axiosError.response?.data as any)?.message ??
//       axiosError.message ??
//       "External API request failed";

//     return new AxiosAppError({
//       message,
//       statusCode,
//       code: axiosError.code,
//       functionName,
//       serviceName,
//       originalError: axiosError,
//     });
//   }

//   // Not an Axios error — just fallback
//   return new AppError({
//     message: error instanceof Error ? error.message : "Unknown error",
//     statusCode: 500,
//     code: "UNKNOWN_ERROR",
//     functionName,
//   });
// }

// export function handleRespositoryError(params: {
//   error: unknown;
//   functionName?: string;
// }) {
//   const { error, functionName } = params;

//   if (error instanceof AppError) {
//     throw error;
//   }

//   throw mapDbErrorToAppError({ error, functionName });
// }
