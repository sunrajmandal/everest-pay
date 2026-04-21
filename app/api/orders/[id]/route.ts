import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { encrypt, decrypt } from '@/lib/encryption';
import { sendActivationEmail } from '@/lib/email';
import { formatDate } from '@/lib/utils';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: { service: true, customer: true },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Decrypt password for admin view
    const decryptedOrder = {
      ...order,
      externalAccountPassword: order.externalAccountPassword
        ? decrypt(order.externalAccountPassword)
        : null,
    };

    return NextResponse.json(decryptedOrder);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const order = await prisma.order.findUnique({
      where: { id },
      include: { service: true, customer: true },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};

    if (body.activationStatus) updateData.activationStatus = body.activationStatus;
    if (body.activationNotes !== undefined) updateData.activationNotes = body.activationNotes;
    if (body.externalAccountEmail) updateData.externalAccountEmail = body.externalAccountEmail;
    if (body.externalAccountPassword) {
      updateData.externalAccountPassword = encrypt(body.externalAccountPassword);
    }
    if (body.startDate) updateData.startDate = new Date(body.startDate);
    if (body.endDate) updateData.endDate = new Date(body.endDate);
    if (body.paymentStatus) updateData.paymentStatus = body.paymentStatus;
    if (body.reminderSent !== undefined) updateData.reminderSent = body.reminderSent;

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: updateData,
      include: { service: true, customer: true },
    });

    // If activating, send email to customer with credentials
    if (
      body.activationStatus === 'active' &&
      body.externalAccountEmail &&
      body.externalAccountPassword
    ) {
      await sendActivationEmail(
        updatedOrder.customer.email,
        updatedOrder.orderNumber,
        updatedOrder.service.name,
        body.externalAccountEmail,
        body.externalAccountPassword,
        body.endDate ? formatDate(body.endDate) : 'N/A',
        updatedOrder.id
      );
    }

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
