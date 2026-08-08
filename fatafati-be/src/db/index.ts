import { env } from '../config/env';
import { IStoryRepository } from './repository';
import { MemoryStoryRepository } from './memoryRepository';
import { SupabaseStoryRepository } from './supabaseRepository';

let repositoryInstance: IStoryRepository;

export function getRepository(): IStoryRepository {
  if (!repositoryInstance) {
    if (env.SUPABASE_URL && env.SUPABASE_ANON_KEY) {
      console.log('📡 [Database] Initializing Supabase PostgreSQL repository...');
      repositoryInstance = new SupabaseStoryRepository(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
    } else {
      console.log('⚡ [Database] Supabase credentials not found. Initializing resilient in-memory repository with preloaded seed data.');
      repositoryInstance = new MemoryStoryRepository();
    }
  }
  return repositoryInstance;
}

export * from './repository';
export * from './memoryRepository';
export * from './supabaseRepository';
