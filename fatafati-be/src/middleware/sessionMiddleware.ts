import { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Request {
      sessionId?: string;
    }
  }
}

export function sessionMiddleware(req: Request, res: Response, next: NextFunction): void {
  const headerSession = req.headers['x-session-id'] as string | undefined;
  const querySession = req.query.sessionId as string | undefined;
  const sessionId = headerSession || querySession || 'anon_' + Math.random().toString(36).substring(2, 10);
  
  req.sessionId = sessionId;
  res.setHeader('x-session-id', sessionId);
  next();
}
