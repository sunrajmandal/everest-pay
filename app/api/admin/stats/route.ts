import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const [
      totalOrders,
      pendingActivation,
      completedPayments,
      activeSubscriptions,
      totalCustomers,
      expiringSoon,
      recentOrders,
      revenueResult,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({
        where: { paymentStatus: 'completed', activationStatus: 'pending' },
      }),
      prisma.order.count({ where: { paymentStatus: 'completed' } }),
      prisma.order.count({ where: { activationStatus: 'active' } }),
      prisma.customer.count(),
      prisma.order.count({
        where: {
          activationStatus: 'active',
          endDate: { lte: sevenDaysFromNow, gte: now },
        },
      }),
      prisma.order.findMany({
        where: { createdAt: { gte: thirtyDaysAgo } },
        include: { service: true, customer: true },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      prisma.order.aggregate({
        where: { paymentStatus: 'completed' },
        _sum: { amount: true },
      }),
    ]);

    // Daily Orders (Last 7 days)
    const dailyOrders = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - i);
      const nextD = new Date(d);
      nextD.setDate(d.getDate() + 1);

      const count = await prisma.order.count({
        where: { createdAt: { gte: d, lt: nextD } }
      });
      dailyOrders.push({
        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        orders: count
      });
    }

    return NextResponse.json({
      totalOrders,
      pendingActivation,
      completedPayments,
      activeSubscriptions,
      totalCustomers,
      expiringSoon,
      totalRevenue: revenueResult._sum.amount || 0,
      recentOrders,
      dailyOrders,
      revenueGrowth: [
        { month: 'Jan', revenue: 45000 },
        { month: 'Feb', revenue: 52000 },
        { month: 'Mar', revenue: 48000 },
        { month: 'Apr', revenue: (revenueResult._sum.amount || 0) }
      ] // Mock for historical, real for current
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
