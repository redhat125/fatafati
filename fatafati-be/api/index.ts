import { createApp } from '../src/app';

const app = createApp();

export default function handler(req: any, res: any) {
  return app(req, res);
}

// Ensure compatibility with both Vercel Serverless CommonJS & ESM loaders
module.exports = handler;
module.exports.default = handler;
