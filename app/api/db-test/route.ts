import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: process.env.DATABASE_URL
    });
    
    // Test connection
    await prisma.$connect();
    
    // Count services
    const count = await prisma.service.count();
    
    await prisma.$disconnect();
    
    return NextResponse.json({ 
      status: 'success', 
      message: 'Connected to Database!',
      servicesInDb: count,
      env: {
        hasDbUrl: !!process.env.DATABASE_URL,
        dbUrlStart: process.env.DATABASE_URL?.substring(0, 15) + '...'
      }
    });
  } catch (error: any) {
    return NextResponse.json({ 
      status: 'error', 
      message: error.message,
      code: error.code,
      meta: error.meta
    }, { status: 500 });
  }
}
