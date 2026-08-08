import { createApp } from './app';
import { env } from './config/env';

const app = createApp();

const server = app.listen(env.PORT, () => {
  console.log(`\n=================================================`);
  console.log(`🚀 FataFati Backend API is running!`);
  console.log(`📡 URL: http://localhost:${env.PORT}`);
  console.log(`🌐 Health Check: http://localhost:${env.PORT}/api/health`);
  console.log(`🎬 Series API: http://localhost:${env.PORT}/api/series`);
  console.log(`=================================================\n`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received. Closing HTTP server...');
  server.close(() => {
    console.log('HTTP server closed.');
  });
});
