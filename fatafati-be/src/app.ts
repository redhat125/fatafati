import express from 'express';
import cors from 'cors';
import path from 'path';
import { env } from './config/env';
import { sessionMiddleware } from './middleware/sessionMiddleware';
import { errorHandler } from './middleware/errorHandler';
import apiRouter from './routes';

export function createApp(): express.Application {
  const app = express();

  // CORS configuration
  app.use(
    cors({
      origin: env.CORS_ORIGIN === '*' ? true : env.CORS_ORIGIN.split(','),
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'x-session-id'],
      exposedHeaders: ['x-session-id'],
    })
  );

  // Standard middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(sessionMiddleware);

  // Serve static assets (videos, posters)
  const publicDir = path.resolve(__dirname, '../public');
  app.use('/static', express.static(publicDir));

  // Root & Health for Vercel
  app.get('/', (req, res) => {
    res.json({
      name: 'FataFati API',
      status: 'online',
      version: '0.1.0',
      endpoints: {
        series: '/api/series',
        health: '/api/health',
      },
    });
  });

  // Mount API router (supports both /api/* and root /* endpoints)
  app.use('/api', apiRouter);
  app.use('/', apiRouter);

  // 404 catch-all
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      error: 'Not Found',
      message: `Cannot ${req.method} ${req.originalUrl}`,
    });
  });

  // Central error handler
  app.use(errorHandler);

  return app;
}
