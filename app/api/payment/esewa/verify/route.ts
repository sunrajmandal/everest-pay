import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { decodeEsewaResponse, verifyEsewaTransaction } from '@/lib/esewa';
import { sendOrderConfirmation } from '@/lib/email';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const encodedData = searchParams.get('data');

    if (!encodedData) {
      return NextResponse.redirect(
        new URL('/payment/failure?error=missing_data', req.url)
      );
    }

    const decoded = decodeEsewaResponse(encodedData);
    if (!decoded) {
      return NextResponse.redirect(
        new URL('/payment/failure?error=invalid_data', req.url)
      );
    }

    // Find the order by transaction UUID
    const order = await prisma.order.findFirst({
      where: { esewaTransactionUuid: decoded.transaction_uuid },
      include: { service: true, customer: true },
    });

    if (!order) {
      return NextResponse.redirect(
        new URL('/payment/failure?error=order_not_found', req.url)
      );
    }

    // Server-side verification
    const verification = await verifyEsewaTransaction(
      decoded.product_code,
      order.amount,
      decoded.transaction_uuid
    );

    if (verification && (verification.status === 'COMPLETE' || verification.status === 'complete')) {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: 'completed',
          transactionId: decoded.ref_id,
          paymentDetails: decoded as unknown as Record<string, unknown>,
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
        new URL(`/payment/success?orderId=${order.id}&method=esewa`, req.url)
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
    console.error('eSewa verify error:', error);
    return NextResponse.redirect(
      new URL('/payment/failure?error=server_error', req.url)
    );
  }
}
