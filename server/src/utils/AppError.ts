import { ErrorCodes, ErrorMessages } from './errorCodes';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: keyof typeof ErrorCodes;
  public readonly isOperational: boolean;
  public readonly details?: any;

  constructor(
    code: keyof typeof ErrorCodes,
    statusCode: number,
    message?: string,
    details?: any
  ) {
    super(message || ErrorMessages[code]);

    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(code: keyof typeof ErrorCodes, message?: string, details?: any) {
    return new AppError(code, 400, message, details);
  }

  static notFound(code: keyof typeof ErrorCodes, message?: string) {
    return new AppError(code, 404, message);
  }

  static internal(code: keyof typeof ErrorCodes, message?: string) {
    return new AppError(code, 500, message);
  }
}
