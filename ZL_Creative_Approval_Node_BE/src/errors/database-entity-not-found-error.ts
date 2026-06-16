import { EntityNotFoundError } from "typeorm";
import AppError from "./custom-error";

class DatabaseEntityNotFoundError extends AppError<"DB_ENTITY_NOT_FOUND"> {
  originalError?: EntityNotFoundError;

  constructor(error: EntityNotFoundError, functionName?: string) {
    super({
      message: `Entity not found: ${error.message}`,
      statusCode: 404,
      code: "DB_ENTITY_NOT_FOUND",
      functionName,
    });

    this.name = "DatabaseEntityNotFoundError";
    this.originalError = error;
  }
}

export default DatabaseEntityNotFoundError;
