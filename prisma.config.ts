import { defineConfig } from '@prisma/config';
import dotenv from 'dotenv';
import path from 'path';

// Load .env.local as it is used in Next.js
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
