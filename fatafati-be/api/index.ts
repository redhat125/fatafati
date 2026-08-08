import { createApp } from '../src/app';

let appInstance: any = null;

function getApp() {
  if (!appInstance) {
    appInstance = createApp();
  }
  return appInstance;
}

export default function handler(req: any, res: any) {
  try {
    const app = getApp();
    return app(req, res);
  } catch (err: any) {
    console.error('Serverless Execution Error:', err);
    res.status(500).json({
      success: false,
      error: 'Serverless Handler Error',
      message: err?.message || 'Unknown serverless runtime error',
    });
  }
}

module.exports = handler;
module.exports.default = handler;
