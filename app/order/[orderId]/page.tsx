'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function OrderStatusPage() {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const lookupOrder = async () => {
    if (!orderId.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/orders/${orderId}`);
      if (!res.ok) throw new Error('Order not found');
      const data = await res.json();
      setOrder(data);
    } catch {
      setError('Order not found. Please check your order ID.');
      setOrder(null);
    }
    setLoading(false);
  };

  const getStatusBadge = (status: string) => `badge badge-${status}`;

  return (
    <div className="hero-gradient min-h-screen">
      <nav style={{ borderBottom: '1px solid var(--border-color)' }} className="sticky top-0 z-40 backdrop-blur-xl bg-[rgba(10,14,26,0.8)]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold gradient-text" style={{ textDecoration: 'none' }}>✦ Everest Pay</Link>
          <Link href="/services" className="text-sm text-[var(--text-secondary)]" style={{ textDecoration: 'none' }}>Services</Link>
        </div>
      </nav>

      <div className="max-w-lg mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold mb-2 text-center">Track Your Order</h1>
        <p className="text-center text-[var(--text-secondary)] mb-8">Enter your order ID to check the status</p>

        <div className="flex gap-3 mb-8">
          <input type="text" value={orderId} onChange={e => setOrderId(e.target.value)}
            placeholder="Enter Order ID" className="input-field flex-1"
            onKeyDown={e => e.key === 'Enter' && lookupOrder()} />
          <button onClick={lookupOrder} disabled={loading} className="btn-primary" style={{ padding: '12px 24px' }}>
            {loading ? <div className="spinner"></div> : 'Search'}
          </button>
        </div>

        {error && <div className="p-4 rounded-xl text-sm mb-6" style={{ background: 'rgba(248,113,113,0.1)', color: '#f87171' }}>{error}</div>}

        {order && (
          <div className="glass-card p-6 animate-fade-in-up">
            <div className="flex items-center gap-4 mb-6">
              <div className="text-3xl">{(order.service as Record<string, string>)?.icon || '📱'}</div>
              <div>
                <h3 className="font-semibold">{(order.service as Record<string, string>)?.name}</h3>
                <p className="text-xs text-[var(--text-muted)]">#{order.orderNumber as string}</p>
              </div>
            </div>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Payment</span>
                <span className={getStatusBadge(order.paymentStatus as string)}>{(order.paymentStatus as string)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Activation</span>
                <span className={getStatusBadge(order.activationStatus as string)}>{(order.activationStatus as string)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Amount</span>
                <span className="font-medium">NPR {order.amount as number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Method</span>
                <span className="font-medium capitalize">{order.paymentMethod as string}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
