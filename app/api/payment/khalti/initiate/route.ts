import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { initiateKhaltiPayment } from '@/lib/khalti';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { service: true, customer: true },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const returnUrl = `${appUrl}/api/payment/khalti/verify`;

    const result = await initiateKhaltiPayment(
      order.amount,
      order.orderNumber,
      order.service.name,
      returnUrl,
      order.customer.email,
      order.customer.phone || undefined
    );

    if (!result) {
      return NextResponse.json({ error: 'Failed to initiate Khalti payment' }, { status: 500 });
    }

    // Save pidx for verification
    await prisma.order.update({
      where: { id: orderId },
      data: { khaltiPidx: result.pidx },
    });

    return NextResponse.json({
      paymentUrl: result.payment_url,
      pidx: result.pidx,
    });
  } catch (error) {
    console.error('Khalti initiate error:', error);
    return NextResponse.json({ error: 'Failed to initiate Khalti payment' }, { status: 500 });
  }
}
