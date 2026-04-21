'use client';

import { useState, useEffect } from 'react';
import { Search, Users, ShoppingBag, CreditCard, Calendar, ChevronRight, Mail } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  orderCount: number;
  totalSpend: number;
  lastOrder: string;
  createdAt: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/admin/customers')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCustomers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = customers.filter(c => 
    c.email.toLowerCase().includes(search.toLowerCase()) || 
    (c.name && c.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Customers</h1>
          <p className="text-sm text-[var(--text-muted)]">Analyze and manage your customer base</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: 'Total Customers', count: customers.length, icon: Users, color: '#8b5cf6' },
          { label: 'Avg Spend', count: `NPR ${customers.length ? Math.round(customers.reduce((acc, c) => acc + c.totalSpend, 0) / customers.length) : 0}`, icon: CreditCard, color: '#10b981' },
          { label: 'Repeat Customers', count: customers.filter(c => c.orderCount > 1).length, icon: ShoppingBag, color: '#3b82f6' },
        ].map((stat, i) => (
          <div key={i} className="p-6 rounded-3xl bg-white/2 border border-white/5 flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-white/5">
              <stat.icon size={24} style={{ color: stat.color }} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">{stat.label}</p>
              <p className="text-2xl font-bold text-white">{stat.count}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/2 border border-white/5">
        <Search className="text-[var(--text-muted)]" size={20} />
        <input 
          type="text" 
          placeholder="Search by name or email..." 
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
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">Customer</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">Orders</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">Total Spend</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">Last Order</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">Member Since</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}><td colSpan={6} className="px-8 py-8"><div className="h-4 bg-white/5 animate-pulse rounded" /></td></tr>
                ))
              ) : filtered.map(c => (
                <tr key={c.id} className="hover:bg-white/[0.01] transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/5 flex items-center justify-center font-bold text-white uppercase">
                        {c.name ? c.name[0] : (c.email ? c.email[0] : '?')}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-white">{c.name || 'Anonymous'}</span>
                        <span className="text-[10px] text-[var(--text-muted)]">{c.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <ShoppingBag size={12} className="text-[var(--text-muted)]" />
                      <span className="text-sm font-bold text-white">{c.orderCount}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-sm font-bold text-[var(--accent-primary)]">NPR {c.totalSpend.toLocaleString()}</span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <Calendar size={12} className="text-[var(--text-muted)]" />
                      <span className="text-xs text-white">
                        {c.lastOrder ? new Date(c.lastOrder).toLocaleDateString() : 'Never'}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-xs text-[var(--text-muted)]">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <a href={`mailto:${c.email}`} className="p-2 rounded-lg bg-white/5 text-[var(--text-muted)] hover:text-white transition-all">
                        <Mail size={16} />
                      </a>
                      <button className="p-2 rounded-lg bg-white/5 text-[var(--text-muted)] hover:text-white transition-all">
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-[var(--text-muted)]">
                    No customers found matching your search.
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
