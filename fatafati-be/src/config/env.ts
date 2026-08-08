import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

// Load .env locally if present (ignored on Vercel)
try {
  dotenv.config({ path: path.resolve(process.cwd(), '.env') });
} catch {
  // Ignore in serverless environments
}

const envSchema = z.object({
  PORT: z.union([z.string(), z.number()]).default('4000').transform((val) => typeof val === 'number' ? val : parseInt(val, 10) || 4000),
  NODE_ENV: z.string().default('production'),
  CORS_ORIGIN: z.string().default('*'),
  SUPABASE_URL: z.string().optional().default(''),
  SUPABASE_ANON_KEY: z.string().optional().default(''),
  STATIC_BASE_URL: z.string().default('http://localhost:4000/static'),
});

const parsed = envSchema.safeParse(process.env);

export const env = parsed.success
  ? parsed.data
  : {
      PORT: 4000,
      NODE_ENV: 'production',
      CORS_ORIGIN: '*',
      SUPABASE_URL: process.env.SUPABASE_URL || '',
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || '',
      STATIC_BASE_URL: 'http://localhost:4000/static',
    };
