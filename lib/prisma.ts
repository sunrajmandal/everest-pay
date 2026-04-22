import { PrismaClient } from '@prisma/client';
import prismaMock from './db';

const isPostgres = process.env.DATABASE_URL?.startsWith('postgres');

const prisma = (process.env.NODE_ENV === 'production' || isPostgres)
  ? new PrismaClient() 
  : prismaMock as any;

export { prisma };
export default prisma;

