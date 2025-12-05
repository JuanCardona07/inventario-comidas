import { NextFunction, Request, Response } from 'express';
import { ZodError, ZodIssue } from 'zod';
import { AppError } from '../utils/AppError';
import { ErrorCodes } from '../utils/errorCodes';

export const errorHandler = (
  err: Error | AppError | ZodError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      code: ErrorCodes.VALIDATION_ERROR,
      message: 'Error de validación',
      errors: err.issues.map((e: ZodIssue) => ({
        field: e.path.join('.'),
        message: e.message
      }))
    });
  }

  // Error personalizado (AppError)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      code: err.code,
      message: err.message,
      ...(err.details && { details: err.details })
    });
  }

  // Error genérico
  console.error('❌ Error no manejado:', err);

  return res.status(500).json({
    success: false,
    code: ErrorCodes.INTERNAL_ERROR,
    message: 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// Middleware para rutas no encontradas
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    code: ErrorCodes.NOT_FOUND,
    message: `Ruta ${req.originalUrl} no encontrada`
  });
};
