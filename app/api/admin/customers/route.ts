import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const customers = await prisma.customer.findMany();
    
    // Enrich with order counts and spend
    const enriched = await Promise.all(customers.map(async (c: any) => {
      const orders = await prisma.order.findMany({
        where: { customerId: c.id }
      });
      return {
        ...c,
        orderCount: orders.length,
        totalSpend: orders.reduce((acc: number, o: any) => acc + o.amount, 0),
        lastOrder: orders.length > 0 ? orders.sort((a: any, b: any) => b.createdAt - a.createdAt)[0].createdAt : null
      };
    }));

    return NextResponse.json(enriched);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}
