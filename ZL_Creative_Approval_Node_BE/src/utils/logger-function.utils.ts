import { Logger } from "winston";
import { AuthRequest } from "../interfaces";

export function logError(logger: Logger, req: AuthRequest, error: Error) {
  const userId = req.user?.id || "Unknown user"; // Fallback in case user is not found
  logger
    .child({
      logMetadata: userId,
    })
    .error(error.message);
}
