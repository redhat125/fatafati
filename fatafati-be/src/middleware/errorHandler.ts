import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { ApiResponse } from '@fatafati/common';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction): void {
  console.error(`❌ [Error ${req.method} ${req.url}]:`, err);

  if (err instanceof ZodError || err?.name === 'ZodError' || Array.isArray(err?.issues)) {
    const issues = err.issues || err.errors || [];
    const message = issues.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', ');
    const response: ApiResponse<null> = {
      success: false,
      error: 'Validation failed',
      message: message || err.message,
    };
    res.status(400).json(response);
    return;
  }

  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  const response: ApiResponse<null> = {
    success: false,
    error: statusCode === 500 ? 'Server Error' : err.name || 'Error',
    message,
  };

  res.status(statusCode).json(response);
}
