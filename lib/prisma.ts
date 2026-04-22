import { PrismaClient } from '@prisma/client';
import prismaMock from './db';

const prisma = process.env.NODE_ENV === 'production' 
  ? new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL
        }
      }
    } as any) 
  : prismaMock as any;

export { prisma };
export default prisma;

