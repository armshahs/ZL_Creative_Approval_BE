class AppError<C extends string> extends Error {
  message: string;
  statusCode: number;
  code?: C;
  functionName?: string;

  constructor({
    message,
    statusCode,
    code,
    functionName,
  }: {
    message: string;
    statusCode: number;
    code?: C;
    functionName?: string;
  }) {
    super();
    this.message = message;
    this.statusCode = statusCode;
    this.code = code;
    this.functionName = functionName;
  }
}

export default AppError;
