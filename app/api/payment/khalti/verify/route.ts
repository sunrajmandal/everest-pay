import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { lookupKhaltiPayment } from '@/lib/khalti';
import { sendOrderConfirmation } from '@/lib/email';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const pidx = searchParams.get('pidx');

    if (!pidx) {
      return NextResponse.redirect(
        new URL('/payment/failure?error=missing_pidx', req.url)
      );
    }

    // Find order by khaltiPidx
    const order = await prisma.order.findFirst({
      where: { khaltiPidx: pidx },
      include: { service: true, customer: true },
    });

    if (!order) {
      return NextResponse.redirect(
        new URL('/payment/failure?error=order_not_found', req.url)
      );
    }

    // Server-side verification via Khalti Lookup API
    const lookup = await lookupKhaltiPayment(pidx);

    if (lookup && lookup.status === 'Completed') {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: 'completed',
          transactionId: lookup.transaction_id,
          paymentDetails: lookup as unknown as Record<string, unknown>,
        },
      });

      // Send confirmation email
      await sendOrderConfirmation(
        order.customer.email,
        order.orderNumber,
        order.service.name,
        order.amount,
        order.id
      );

      return NextResponse.redirect(
        new URL(`/payment/success?orderId=${order.id}&method=khalti`, req.url)
      );
    } else {
      await prisma.order.update({
        where: { id: order.id },
        data: { paymentStatus: 'failed' },
      });

      return NextResponse.redirect(
        new URL(`/payment/failure?orderId=${order.id}&error=verification_failed`, req.url)
      );
    }
  } catch (error) {
    console.error('Khalti verify error:', error);
    return NextResponse.redirect(
      new URL('/payment/failure?error=server_error', req.url)
    );
  }
}
