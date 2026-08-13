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
