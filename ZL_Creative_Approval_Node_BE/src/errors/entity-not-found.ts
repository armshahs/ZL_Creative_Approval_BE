import { AppError } from "../errors";

class EntityNotFoundError extends AppError<ErrorCode> {}
export default EntityNotFoundError;
