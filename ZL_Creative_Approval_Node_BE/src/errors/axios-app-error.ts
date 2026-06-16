import AppError from "./custom-error";

interface AxiosErrorContext {
  message?: string;
  statusCode?: number;
  code?: string;
  functionName?: string;
  serviceName?: string; // e.g. "TikTok Ads API", "Meta Ads API"
  originalError?: any;
}

class AxiosAppError extends AppError<"AXIOS_ERROR"> {
  serviceName?: string;
  originalError?: any;

  constructor({
    message,
    statusCode,
    code,
    functionName,
    serviceName,
    originalError,
  }: AxiosErrorContext) {
    super({
      message: message ?? "External API request failed",
      statusCode: statusCode ?? 502, // Bad Gateway by default
      code: (code as "AXIOS_ERROR") ?? "AXIOS_ERROR",
      functionName,
    });

    this.name = "AxiosError";
    this.serviceName = serviceName;
    this.originalError = originalError;

    // Keep stack trace clean
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AxiosAppError);
    }
  }
}

export default AxiosAppError;
