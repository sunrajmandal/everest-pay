import { PrismaClient } from '@prisma/client';
import prismaMock from './db';

const prisma = process.env.NODE_ENV === 'production' 
  ? new PrismaClient() 
  : prismaMock as any;

export { prisma };
export default prisma;

