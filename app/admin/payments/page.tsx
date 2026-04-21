'use client';

import { useState, useEffect } from 'react';
import { CreditCard, DollarSign, CheckCircle, XCircle, Search, Download, ExternalLink, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

interface Payment {
  id: string;
  orderNumber: string;
  amount: number;
  paymentMethod: string;
  paymentStatus: string;
  transactionId: string;
  khaltiPidx: string;
  esewaTransactionUuid: string;
  createdAt: string;
  customer: { email: string };
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/orders') // Reusing orders API but filtering for payments
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setPayments(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const totalRevenue = payments.reduce((acc, p) => p.paymentStatus === 'completed' ? acc + p.amount : acc, 0);
  const successRate = payments.length ? Math.round((payments.filter(p => p.paymentStatus === 'completed').length / payments.length) * 100) : 0;

  const filtered = payments.filter(p => 
    p.orderNumber.toLowerCase().includes(search.toLowerCase()) || 
    p.customer.email.toLowerCase().includes(search.toLowerCase()) ||
    (p.transactionId && p.transactionId.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Payment Transactions</h1>
          <p className="text-sm text-[var(--text-muted)]">Real-time ledger of all incoming revenue</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-xs font-bold text-white hover:bg-white/10 transition-all">
          <Download size={14} />
          Export Ledger
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-3xl bg-white/2 border border-white/5 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)]">Total Revenue</p>
            <div className="p-2 rounded-lg bg-green-500/10 text-green-400"><ArrowUpRight size={14} /></div>
          </div>
          <p className="text-2xl font-bold text-white">NPR {totalRevenue.toLocaleString()}</p>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 w-[70%]" />
          </div>
        </div>
        
        <div className="p-6 rounded-3xl bg-white/2 border border-white/5 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)]">Payment Success</p>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400"><CheckCircle size={14} /></div>
          </div>
          <p className="text-2xl font-bold text-white">{successRate}%</p>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500" style={{ width: `${successRate}%` }} />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white/2 border border-white/5 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)]">eSewa Volume</p>
            <div className="text-green-500 font-bold text-xs">eSewa</div>
          </div>
          <p className="text-2xl font-bold text-white">
            NPR {payments.reduce((acc, p) => p.paymentMethod === 'esewa' && p.paymentStatus === 'completed' ? acc + p.amount : acc, 0).toLocaleString()}
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white/2 border border-white/5 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)]">Khalti Volume</p>
            <div className="text-purple-500 font-bold text-xs">Khalti</div>
          </div>
          <p className="text-2xl font-bold text-white">
            NPR {payments.reduce((acc, p) => p.paymentMethod === 'khalti' && p.paymentStatus === 'completed' ? acc + p.amount : acc, 0).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/2 border border-white/5">
        <Search className="text-[var(--text-muted)]" size={20} />
        <input 
          type="text" 
          placeholder="Search by Order #, Transaction ID, or Customer Email..." 
          className="bg-transparent border-none outline-none text-white text-sm w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="rounded-3xl border border-white/5 bg-white/2 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/2 border-y border-white/5">
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">Transaction</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">Customer</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">Amount</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">Gateway</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">Status</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">Date</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">Ref ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}><td colSpan={7} className="px-8 py-8"><div className="h-4 bg-white/5 animate-pulse rounded" /></td></tr>
                ))
              ) : filtered.map(p => (
                <tr key={p.id} className="hover:bg-white/[0.01] transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-white">#{p.orderNumber}</span>
                      <span className="text-[9px] text-[var(--text-muted)] font-mono">{p.id}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm text-white">{p.customer.email}</td>
                  <td className="px-8 py-5 font-bold text-white">NPR {p.amount}</td>
                  <td className="px-8 py-5">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${p.paymentMethod === 'esewa' ? 'text-green-500' : 'text-purple-500'}`}>
                      {p.paymentMethod}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                      p.paymentStatus === 'completed' ? 'bg-green-500/10 text-green-400' :
                      p.paymentStatus === 'pending' ? 'bg-amber-500/10 text-amber-400' :
                      'bg-red-500/10 text-red-400'
                    }`}>
                      {p.paymentStatus === 'completed' ? <CheckCircle size={10} /> : <XCircle size={10} />}
                      {p.paymentStatus}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-xs text-[var(--text-muted)]">
                    {new Date(p.createdAt).toLocaleString()}
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-[10px] font-mono text-[var(--text-muted)] max-w-[100px] block truncate" title={p.khaltiPidx || p.esewaTransactionUuid}>
                      {p.khaltiPidx || p.esewaTransactionUuid || '—'}
                    </span>
                  </td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-8 py-20 text-center text-[var(--text-muted)]">
                    No transactions recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
