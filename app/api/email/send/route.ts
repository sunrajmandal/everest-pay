import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendRenewalReminder } from '@/lib/email';
import { formatDate } from '@/lib/utils';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, type } = body;

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

    if (type === 'reminder' && order.endDate) {
      const sent = await sendRenewalReminder(
        order.customer.email,
        order.orderNumber,
        order.service.name,
        formatDate(order.endDate),
        order.id
      );

      if (sent) {
        await prisma.order.update({
          where: { id: orderId },
          data: { reminderSent: true },
        });
      }

      return NextResponse.json({ success: sent });
    }

    return NextResponse.json({ error: 'Invalid email type' }, { status: 400 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
