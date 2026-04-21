import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { buildEsewaFormFields, getEsewaPaymentUrl } from '@/lib/esewa';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { service: true },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const transactionUuid = `${order.orderNumber}-${Date.now()}`;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const successUrl = `${appUrl}/payment/success?method=esewa`;
    const failureUrl = `${appUrl}/payment/failure?method=esewa&orderId=${order.id}`;

    // Save transaction UUID for later verification
    await prisma.order.update({
      where: { id: orderId },
      data: { esewaTransactionUuid: transactionUuid },
    });

    const formFields = buildEsewaFormFields(
      order.amount,
      transactionUuid,
      successUrl,
      failureUrl
    );

    return NextResponse.json({
      paymentUrl: getEsewaPaymentUrl(),
      formFields,
    });
  } catch (error) {
    console.error('eSewa initiate error:', error);
    return NextResponse.json({ error: 'Failed to initiate eSewa payment' }, { status: 500 });
  }
}
