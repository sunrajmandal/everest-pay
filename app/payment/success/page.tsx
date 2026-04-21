'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const method = searchParams.get('method');

  return (
    <div className="hero-gradient min-h-screen flex items-center justify-center px-6">
      <div className="glass-card p-10 max-w-md w-full text-center animate-fade-in-up">
        <div className="text-6xl mb-6">✅</div>
        <h1 className="text-2xl font-bold mb-3">Payment Successful!</h1>
        <p className="text-[var(--text-secondary)] mb-6">
          Your payment via <strong className="text-white">{method === 'khalti' ? 'Khalti' : 'eSewa'}</strong> has been confirmed.
        </p>
        <div className="p-4 rounded-xl mb-6" style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)' }}>
          <p className="text-sm text-[var(--success)]">
            📧 We&apos;ll send your subscription details to your email within 24 hours.
          </p>
        </div>
        {orderId && (
          <p className="text-xs text-[var(--text-muted)] mb-6">Order ID: {orderId}</p>
        )}
        <div className="flex flex-col gap-3">
          <Link href="/services" className="btn-primary" style={{ textDecoration: 'none' }}>
            Browse More Services
          </Link>
          <Link href="/" className="btn-secondary" style={{ textDecoration: 'none' }}>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="spinner" style={{ width: 32, height: 32 }}></div></div>}>
      <SuccessContent />
    </Suspense>
  );
}
