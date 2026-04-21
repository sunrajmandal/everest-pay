import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateOrderNumber } from '@/lib/utils';

// POST: Public — create a new order
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      email, name, phone, serviceId, paymentMethod, amount, duration,
      deliveryOption, providedAccountEmail, providedAccountPassword 
    } = body;

    if (!email || !serviceId || !paymentMethod) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service || !service.isActive) {
      return NextResponse.json({ error: 'Service not found or inactive' }, { status: 404 });
    }

    // Upsert customer
    const customer = await prisma.customer.upsert({
      where: { email },
      update: { name: name || undefined, phone: phone || undefined },
      create: { email, name, phone },
    });

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        customerId: customer.id,
        serviceId: service.id,
        amount: amount || service.price,
        duration: duration || '1 Month',
        deliveryOption: deliveryOption || 'ready_made',
        providedAccountEmail: providedAccountEmail || null,
        providedAccountPassword: providedAccountPassword || null,
        paymentMethod,
        paymentStatus: 'pending',
        activationStatus: 'pending',
      },
      include: { service: true, customer: true },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

// GET: Admin — list all orders
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const paymentStatus = searchParams.get('paymentStatus');
    const search = searchParams.get('search');

    const where: Record<string, unknown> = {};
    if (status) where.activationStatus = status;
    if (paymentStatus) where.paymentStatus = paymentStatus;
    if (search) {
      where.OR = [
        { orderNumber: { contains: search } },
        { customer: { email: { contains: search } } },
        { customer: { name: { contains: search } } },
      ];
    }

    const orders = await prisma.order.findMany({
      where,
      include: { service: true, customer: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
