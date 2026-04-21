import { Resend } from 'resend';
import prisma from './prisma';

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'SubNepal';
const FROM_EMAIL = `${APP_NAME} <noreply@subnepal.com>`;

async function logEmail(
  to: string,
  subject: string,
  body: string,
  orderId: string | null,
  status: string,
  error?: string
) {
  try {
    await prisma.emailLog.create({
      data: { to, subject, body, orderId, status, error },
    });
  } catch (e) {
    console.error('Failed to log email:', e);
  }
}

async function sendEmail(to: string, subject: string, html: string, orderId?: string) {
  if (!resend) {
    console.log(`[EMAIL DEV] To: ${to}\nSubject: ${subject}\nBody: ${html}`);
    await logEmail(to, subject, html, orderId || null, 'sent');
    return true;
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });
    await logEmail(to, subject, html, orderId || null, 'sent');
    return true;
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Email send error:', errMsg);
    await logEmail(to, subject, html, orderId || null, 'failed', errMsg);
    return false;
  }
}

export async function sendOrderConfirmation(
  email: string,
  orderNumber: string,
  serviceName: string,
  amount: number,
  orderId: string
) {
  const subject = `${APP_NAME} — Order #${orderNumber} Confirmed`;
  const html = `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #e2e8f0; padding: 32px; border-radius: 12px;">
      <h1 style="color: #818cf8; margin-bottom: 8px;">✅ Payment Received!</h1>
      <p style="font-size: 16px; color: #94a3b8;">Thank you for your order.</p>
      <div style="background: #1e293b; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <p><strong style="color: #c7d2fe;">Order:</strong> #${orderNumber}</p>
        <p><strong style="color: #c7d2fe;">Service:</strong> ${serviceName}</p>
        <p><strong style="color: #c7d2fe;">Amount:</strong> NPR ${amount.toLocaleString()}</p>
      </div>
      <p style="color: #94a3b8;">Your subscription is being activated. You'll receive your login details within <strong style="color: #818cf8;">24 hours</strong>.</p>
      <p style="color: #64748b; font-size: 13px; margin-top: 32px;">— ${APP_NAME}</p>
    </div>
  `;
  return sendEmail(email, subject, html, orderId);
}

export async function sendActivationEmail(
  email: string,
  orderNumber: string,
  serviceName: string,
  accountEmail: string,
  accountPassword: string,
  endDate: string,
  orderId: string
) {
  const subject = `${APP_NAME} — Your ${serviceName} is Active! 🎉`;
  const html = `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #e2e8f0; padding: 32px; border-radius: 12px;">
      <h1 style="color: #34d399; margin-bottom: 8px;">🎉 Subscription Activated!</h1>
      <p style="font-size: 16px; color: #94a3b8;">Your ${serviceName} subscription is now live.</p>
      <div style="background: #1e293b; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <p><strong style="color: #c7d2fe;">Order:</strong> #${orderNumber}</p>
        <p><strong style="color: #c7d2fe;">Service:</strong> ${serviceName}</p>
        <p><strong style="color: #c7d2fe;">Email:</strong> ${accountEmail}</p>
        <p><strong style="color: #c7d2fe;">Password:</strong> ${accountPassword}</p>
        <p><strong style="color: #c7d2fe;">Valid Until:</strong> ${endDate}</p>
      </div>
      <p style="color: #f59e0b;">⚠️ Please do not change the password or share these credentials.</p>
      <p style="color: #64748b; font-size: 13px; margin-top: 32px;">— ${APP_NAME}</p>
    </div>
  `;
  return sendEmail(email, subject, html, orderId);
}

export async function sendRenewalReminder(
  email: string,
  orderNumber: string,
  serviceName: string,
  endDate: string,
  orderId: string
) {
  const subject = `${APP_NAME} — ${serviceName} Renewal Reminder`;
  const html = `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #e2e8f0; padding: 32px; border-radius: 12px;">
      <h1 style="color: #f59e0b; margin-bottom: 8px;">⏰ Renewal Reminder</h1>
      <p style="font-size: 16px; color: #94a3b8;">Your ${serviceName} subscription is expiring soon.</p>
      <div style="background: #1e293b; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <p><strong style="color: #c7d2fe;">Order:</strong> #${orderNumber}</p>
        <p><strong style="color: #c7d2fe;">Service:</strong> ${serviceName}</p>
        <p><strong style="color: #c7d2fe;">Expires:</strong> ${endDate}</p>
      </div>
      <p style="color: #94a3b8;">Visit our website to renew your subscription and enjoy uninterrupted service.</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/services" style="display: inline-block; background: #818cf8; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 16px; font-weight: 600;">Renew Now</a>
      <p style="color: #64748b; font-size: 13px; margin-top: 32px;">— ${APP_NAME}</p>
    </div>
  `;
  return sendEmail(email, subject, html, orderId);
}
