'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function FailureContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const orderId = searchParams.get('orderId');

  return (
    <div className="hero-gradient min-h-screen flex items-center justify-center px-6">
      <div className="glass-card p-10 max-w-md w-full text-center animate-fade-in-up">
        <div className="text-6xl mb-6">❌</div>
        <h1 className="text-2xl font-bold mb-3">Payment Failed</h1>
        <p className="text-[var(--text-secondary)] mb-6">
          Something went wrong with your payment. Don&apos;t worry — no money has been charged.
        </p>
        {error && (
          <div className="p-4 rounded-xl mb-6" style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)' }}>
            <p className="text-sm text-[var(--danger)]">Error: {error.replace(/_/g, ' ')}</p>
          </div>
        )}
        {orderId && <p className="text-xs text-[var(--text-muted)] mb-6">Order ID: {orderId}</p>}
        <div className="flex flex-col gap-3">
          <Link href="/services" className="btn-primary" style={{ textDecoration: 'none' }}>
            Try Again
          </Link>
          <Link href="/" className="btn-secondary" style={{ textDecoration: 'none' }}>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentFailurePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="spinner" style={{ width: 32, height: 32 }}></div></div>}>
      <FailureContent />
    </Suspense>
  );
}
