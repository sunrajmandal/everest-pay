'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface OrderDetail {
  id: string;
  orderNumber: string;
  amount: number;
  paymentStatus: string;
  activationStatus: string;
  paymentMethod: string;
  duration: string;
  transactionId: string | null;
  externalAccountEmail: string | null;
  externalAccountPassword: string | null;
  activationNotes: string | null;
  startDate: string | null;
  endDate: string | null;
  deliveryOption: string;
  providedAccountEmail: string | null;
  providedAccountPassword: string | null;
  reminderSent: boolean;
  createdAt: string;
  updatedAt: string;
  service: { id: string; name: string; icon: string; price: number };
  customer: { id: string; email: string; name: string | null; phone: string | null };
}

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sendingReminder, setSendingReminder] = useState(false);
  const [message, setMessage] = useState('');

  // Form state
  const [activationStatus, setActivationStatus] = useState('');
  const [extEmail, setExtEmail] = useState('');
  const [extPassword, setExtPassword] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetch(`/api/orders/${orderId}`)
      .then(res => res.json())
      .then(data => {
        setOrder(data);
        setActivationStatus(data.activationStatus);
        setExtEmail(data.externalAccountEmail || '');
        setExtPassword(data.externalAccountPassword || '');
        setStartDate(data.startDate ? data.startDate.split('T')[0] : '');
        setEndDate(data.endDate ? data.endDate.split('T')[0] : '');
        setNotes(data.activationNotes || '');
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [orderId]);

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activationStatus,
          externalAccountEmail: extEmail || undefined,
          externalAccountPassword: extPassword || undefined,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          activationNotes: notes || undefined,
        }),
      });
      if (!res.ok) throw new Error('Failed to update');
      const updated = await res.json();
      setOrder(updated);
      setMessage('Order updated successfully!' + (activationStatus === 'active' && extEmail ? ' Activation email sent to customer.' : ''));
    } catch {
      setMessage('Failed to update order.');
    }
    setSaving(false);
  };

  const handleSendReminder = async () => {
    setSendingReminder(true);
    try {
      const res = await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, type: 'reminder' }),
      });
      if (res.ok) setMessage('Renewal reminder sent!');
      else setMessage('Failed to send reminder.');
    } catch {
      setMessage('Failed to send reminder.');
    }
    setSendingReminder(false);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="spinner" style={{ width: 32, height: 32 }}></div></div>;
  }

  if (!order) return <p>Order not found</p>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/orders" className="text-sm text-[var(--text-muted)] hover:text-white" style={{ textDecoration: 'none' }}>← Orders</Link>
        <span className="text-[var(--text-muted)]">/</span>
        <span className="text-sm font-mono">{order.orderNumber}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-6">
            <h2 className="font-semibold mb-4">Order Info</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-[var(--text-muted)]">Order #</span><span className="font-mono">{order.orderNumber}</span></div>
              <div className="flex justify-between"><span className="text-[var(--text-muted)]">Service</span><span>{order.service.icon} {order.service.name}</span></div>
              <div className="flex justify-between"><span className="text-[var(--text-muted)]">Duration</span><span className="font-bold text-[var(--accent-primary)]">{order.duration}</span></div>
              <div className="flex justify-between"><span className="text-[var(--text-muted)]">Amount</span><span className="font-medium">NPR {order.amount}</span></div>
              <div className="flex justify-between"><span className="text-[var(--text-muted)]">Method</span><span className="capitalize">{order.paymentMethod}</span></div>
              <div className="flex justify-between"><span className="text-[var(--text-muted)]">Payment</span><span className={`badge badge-${order.paymentStatus}`}>{order.paymentStatus}</span></div>
              <div className="flex justify-between"><span className="text-[var(--text-muted)]">Txn ID</span><span className="font-mono text-xs">{order.transactionId || '—'}</span></div>
              <div className="flex justify-between"><span className="text-[var(--text-muted)]">Created</span><span>{new Date(order.createdAt).toLocaleString()}</span></div>
              <div className="pt-4 mt-4 border-t border-[var(--border-color)]">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[var(--text-muted)]">Delivery Method</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    order.deliveryOption === 'own_account' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {order.deliveryOption === 'own_account' ? 'Upgrade Own Account' : 'Ready-made Account'}
                  </span>
                </div>
                {order.deliveryOption === 'own_account' && (
                  <div className="mt-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 space-y-2">
                    <p className="text-[10px] text-amber-500 font-bold uppercase tracking-widest mb-1">Customer Credentials:</p>
                    <div className="flex justify-between text-xs">
                      <span className="text-[var(--text-muted)]">Email:</span>
                      <span className="font-mono text-white select-all cursor-pointer" title="Click to copy">{order.providedAccountEmail}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-[var(--text-muted)]">Pass:</span>
                      <span className="font-mono text-white select-all cursor-pointer" title="Click to copy">{order.providedAccountPassword}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="font-semibold mb-4">Customer</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-[var(--text-muted)]">Name</span><span>{order.customer.name || '—'}</span></div>
              <div className="flex justify-between"><span className="text-[var(--text-muted)]">Email</span><span>{order.customer.email}</span></div>
              <div className="flex justify-between"><span className="text-[var(--text-muted)]">Phone</span><span>{order.customer.phone || '—'}</span></div>
            </div>
          </div>
        </div>

        {/* Activation Form */}
        <div className="lg:col-span-2">
          <div className="glass-card p-6">
            <h2 className="font-semibold mb-6">Activate Subscription</h2>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Activation Status</label>
                <select value={activationStatus} onChange={e => setActivationStatus(e.target.value)} className="input-field">
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="active">Active</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="expired">Expired</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Account Email</label>
                  <input type="email" value={extEmail} onChange={e => setExtEmail(e.target.value)} placeholder="netflix-account@email.com" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Account Password</label>
                  <input type="text" value={extPassword} onChange={e => setExtPassword(e.target.value)} placeholder="Account password" className="input-field" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Start Date</label>
                  <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">End Date</label>
                  <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="input-field" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Admin Notes</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="Internal notes..." className="input-field" style={{ resize: 'vertical' }} />
              </div>

              {message && (
                <div className="p-3 rounded-lg text-sm" style={{ background: message.includes('success') || message.includes('sent') ? 'rgba(52,211,153,0.1)' : 'rgba(248,113,113,0.1)', color: message.includes('success') || message.includes('sent') ? '#34d399' : '#f87171' }}>
                  {message}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
                  {saving ? <><div className="spinner"></div> Saving...</> : 'Save & Activate'}
                </button>
                {order.endDate && (
                  <button onClick={handleSendReminder} disabled={sendingReminder} className="btn-secondary flex items-center gap-2">
                    {sendingReminder ? <><div className="spinner"></div> Sending...</> : '📧 Send Renewal Reminder'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
