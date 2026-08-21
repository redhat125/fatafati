# Fatafati Backend

This is the backend API for the Fatafati project, built with [Express.js](https://expressjs.com/) and [TypeScript](https://www.typescriptlang.org/).

## Technologies Used
- Express.js
- TypeScript
- Supabase (Database)
- Zod (Schema validation)
- Vitest & Supertest (for testing)

## Getting Started

First, install the dependencies from the root directory:
```bash
npm install
```

Make sure you have your environment variables set up, especially for the Supabase connection (e.g., in a `.env` file at the root or within this directory depending on your setup).

### Local Docker Database Setup (Recommended for Dev)

To run a fully isolated local Supabase stack using Docker Desktop:

1. Ensure Docker Desktop is running.
2. Initialize and start Supabase locally (inside the `fatafati-be` directory):
   ```bash
   npx supabase start
   ```
3. Update your `.env` file with the local credentials outputted by the start command (API URL, anon key, service role key).
4. Run the seed script to populate the local database with mock data:
   ```bash
   npm run seed
   ```
5. To access the local Supabase Studio dashboard, go to [http://127.0.0.1:54323](http://127.0.0.1:54323).
6. When you are done, you can stop the containers with `npx supabase stop`.

Then, run the development server:
```bash
npm run dev
```

The server will start with hot-reloading using `tsx`.

## Database Seeding

To seed the database with initial data, you can run:
```bash
npm run seed
```
This will execute the `src/db/seedSupabase.ts` script.

## Available Scripts

- `npm run dev`: Starts the development server with hot-reloading.
- `npm run build`: Compiles TypeScript to JavaScript into the `dist` directory.
- `npm run start`: Starts the compiled production server.
- `npm run seed`: Runs the database seed script for Supabase.
- `npm run test`: Runs tests using Vitest.
