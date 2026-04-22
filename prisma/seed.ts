import prisma from '../lib/prisma';
import { initSchema } from '../lib/db';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('🌱 Seeding database...');
  
  const isPostgres = process.env.DATABASE_URL?.startsWith('postgres');
  if (!isPostgres) {
    await initSchema();
  }

  // Seed Admin
  const adminEmail = process.env.ADMIN_EMAIL || 'sunraz56@gmail.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: { password: hashedPassword },
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: 'Admin',
    },
  });
  console.log(`✅ Admin created: ${adminEmail}`);

  // Seed Services
  const services = [
    { id: 's1', name: 'Netflix Premium', description: '4K+HDR, 4 Screens, All devices. Shared account.', price: 499, category: 'Entertainment', icon: '🍿', durations: [
      { name: '1 Month', price: 499 },
      { name: '3 Months', price: 1399, popular: true },
      { name: '6 Months', price: 2599 },
      { name: '12 Months', price: 4899 }
    ]},
    { id: 's2', name: 'Spotify Family', description: 'Premium for 1 account. Your own email.', price: 199, category: 'Music', icon: '🎧', durations: [
      { name: '1 Month', price: 199 },
      { name: '3 Months', price: 549 },
      { name: '6 Months', price: 999, popular: true },
      { name: '12 Months', price: 1799 }
    ]},
    { id: 's3', name: 'YouTube Premium', description: 'Ad-free, Background play, YT Music. Your own email.', price: 249, category: 'Entertainment', icon: '📺', durations: [
      { name: '1 Month', price: 249 },
      { name: '3 Months', price: 699 },
      { name: '12 Months', price: 2499, popular: true }
    ]},
    { id: 's4', name: 'Disney+ Hotstar', description: 'Premium Plan, 4K, 4 Screens. Shared account.', price: 399, category: 'Entertainment', icon: '🏰', durations: [
      { name: '1 Month', price: 399 },
      { name: '3 Months', price: 1099 },
      { name: '12 Months', price: 3899, popular: true }
    ]},
    { id: 's5', name: 'Canva Pro', description: 'Full access to Pro features. Your own email.', price: 149, category: 'Design', icon: '🎨', durations: [
      { name: '1 Month', price: 149 },
      { name: '12 Months', price: 999, popular: true },
      { name: 'Lifetime', price: 2499 }
    ]},
    { id: 's6', name: 'Microsoft 365', description: 'Word, Excel, PPT + 1TB OneDrive. Shared Family.', price: 299, category: 'Productivity', icon: '📁', durations: [
      { name: '1 Month', price: 299 },
      { name: '12 Months', price: 2499, popular: true }
    ]},
    { id: 's7', name: 'Prime Video', description: '4K, All devices. Shared account.', price: 249, category: 'Entertainment', icon: '📦', durations: [
      { name: '1 Month', price: 249 },
      { name: '3 Months', price: 649 },
      { name: '12 Months', price: 2299, popular: true }
    ]},
    { id: 's8', name: 'Xbox Game Pass', description: 'Ultimate Plan, PC + Console. Shared account.', price: 599, category: 'Gaming', icon: '🎮', durations: [
      { name: '1 Month', price: 599 },
      { name: '3 Months', price: 1699, popular: true },
      { name: '12 Months', price: 5999 }
    ]},
  ];

  for (const service of services) {
    const { durations, ...rest } = service;
    await prisma.service.upsert({
      where: { name: rest.name },
      update: { ...rest, durations: JSON.stringify(durations) },
      create: { ...rest, durations: JSON.stringify(durations) },
    });
  }
  console.log(`✅ ${services.length} services seeded`);

  // Seed Settings
  const settings = [
    { key: 'site_name', value: 'Everest Pay' },
    { key: 'contact_email', value: 'support@everestpay.com' },
    { key: 'contact_phone', value: '+977-9800000000' },
    { key: 'whatsapp', value: '+977-9800000000' },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }
  console.log('✅ Settings seeded');

  console.log('🎉 Seed complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
