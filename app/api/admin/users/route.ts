import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const admins = await prisma.admin.findMany({
      select: { id: true, email: true, name: true, createdAt: true }
    });
    return NextResponse.json(admins);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch admins' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name, id } = body;

    if (id) {
      // Update existing
      const updateData: any = { email, name };
      if (password) {
        updateData.password = await bcrypt.hash(password, 12);
      }
      const admin = await prisma.admin.update({
        where: { id },
        data: updateData
      });
      return NextResponse.json(admin);
    } else {
      // Create new
      if (!password) return NextResponse.json({ error: 'Password required' }, { status: 400 });
      const hashedPassword = await bcrypt.hash(password, 12);
      const admin = await prisma.admin.create({
        data: { email, name, password: hashedPassword }
      });
      return NextResponse.json(admin);
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save admin' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    
    // Prevent self-deletion or at least warn (logic simplified)
    await prisma.admin.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete admin' }, { status: 500 });
  }
}
