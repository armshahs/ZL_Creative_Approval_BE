import { QueryFailedError } from "typeorm";
import AppError from "./custom-error";

class DatabaseQueryError extends AppError<DBQueryErrorCode> {
  originalError?: QueryFailedError;
  query?: string;
  parameters?: any[];

  constructor(error: QueryFailedError, functionName?: string) {
    // Map Postgres error codes to readable identifiers
    const dbErrorCodeMap: Record<string, DBQueryErrorCode> = {
      "23505": "DB_UNIQUE",
      "23503": "DB_FK",
      "23514": "DB_CHECK",
      "42601": "DB_SYNTAX",
      ECONNREFUSED: "DB_CONNECTION_ERROR",
      ETIMEDOUT: "DB_TIMEOUT",
      ENOTFOUND: "DB_DNS_FAILED",
    };

    const codeToStatusMap: Record<DBQueryErrorCode, number> = {
      DB_UNIQUE: 409,
      DB_FK: 400,
      DB_CHECK: 400,
      DB_SYNTAX: 500,
      DB_CONNECTION_ERROR: 503,
      DB_TIMEOUT: 503,
      DB_DNS_FAILED: 500,
      DB_UNKNOWN: 500,
    };

    const pgCode = (error.driverError as any)?.code;
    const mappedCode = dbErrorCodeMap[pgCode] || "DB_UNKNOWN";

    super({
      message: `Database operation failed ${pgCode ? `(code ${pgCode})` : ""} ${error.message}`,
      statusCode: codeToStatusMap[mappedCode], // internal server error; you can adjust per code
      code: mappedCode,
      functionName,
    });

    this.name = "DatabaseQueryError";
    this.originalError = error;
    this.query = (error as any).query;
    this.parameters = (error as any).parameters;
  }
}

export default DatabaseQueryError;
