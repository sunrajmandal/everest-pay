import { PrismaClient } from '@prisma/client';
import prismaMock from './db';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables immediately
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const isPostgres = process.env.DATABASE_URL?.startsWith('postgres');

const prisma = (process.env.NODE_ENV === 'production' || isPostgres)
  ? new PrismaClient() 
  : prismaMock as any;

export { prisma };
export default prisma;

