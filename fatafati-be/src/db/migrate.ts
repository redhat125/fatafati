import postgres from 'postgres';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load .env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function migrate() {
  const dbUrl = process.env.DATABASE_URL;

  if (!dbUrl) {
    console.error('❌ ERROR: Missing DATABASE_URL in fatafati-be/.env');
    console.error('To use this automated migration script, you must add your Postgres connection string.');
    console.error('Example for local Supabase: DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres');
    console.error('Example for production: DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres');
    process.exit(1);
  }

  console.log('🔄 Connecting to database...');
  const sql = postgres(dbUrl, { max: 1 });

  try {
    const schemaPath = path.resolve(__dirname, './schema.sql');
    console.log(`📄 Reading schema from ${schemaPath}...`);
    
    const schemaContent = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('⚡ Executing schema...');
    
    // We execute the SQL query using postgres.js. 
    // postgres.js handles multiple statements natively using the `sql.unsafe` method.
    await sql.unsafe(schemaContent);
    
    console.log('✅ Schema updated successfully!');
  } catch (err: any) {
    console.error('❌ Error executing schema:', err.message || err);
  } finally {
    await sql.end();
  }
}

migrate();
