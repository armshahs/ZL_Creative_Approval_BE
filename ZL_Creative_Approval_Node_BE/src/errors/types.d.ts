type ErrorCode = "ERR_NF" | "ERR_VALID";
type DBQueryErrorCode =
  | "DB_UNIQUE"
  | "DB_FK"
  | "DB_CHECK"
  | "DB_SYNTAX"
  | "DB_UNKNOWN"
  | "DB_CONNECTION_ERROR"
  | "DB_DNS_FAILED"
  | "DB_TIMEOUT";

type DBConnectionErrorCode = "DB_CONNECTION_ERROR";
// ERR_NF = Error not found
// ERR_VALID = Error due to validation failure
