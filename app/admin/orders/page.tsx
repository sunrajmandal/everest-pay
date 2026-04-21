'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Filter, 
  ChevronRight, 
  Download, 
  ShoppingBag,
  Clock,
  CheckCircle,
  Calendar
} from 'lucide-react';

interface Order {
  id: string;
  orderNumber: string;
  amount: number;
  paymentStatus: string;
  activationStatus: string;
  paymentMethod: string;
  createdAt: string;
  duration: string;
  service: { name: string; icon: string };
  customer: { email: string; name: string | null };
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [platformFilter, setPlatformFilter] = useState('');
  const [platforms, setPlatforms] = useState<any[]>([]);

  const fetchOrders = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (statusFilter) params.set('status', statusFilter);
    if (paymentFilter) params.set('paymentStatus', paymentFilter);
    if (platformFilter) params.set('serviceId', platformFilter);

    fetch(`/api/orders?${params}`)
      .then(res => res.json())
      .then(data => { 
        setOrders(Array.isArray(data) ? data : []);
        setLoading(false); 
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(data => setPlatforms(Array.isArray(data) ? data : []));
  }, []);

  useEffect(() => { fetchOrders(); }, [statusFilter, paymentFilter, platformFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };

  const exportCSV = () => {
    const headers = ['Order #', 'Customer', 'Email', 'Service', 'Amount', 'Status', 'Date'];
    const rows = orders.map(o => [
      o.orderNumber,
      o.customer.name || 'N/A',
      o.customer.email,
      o.service.name,
      o.amount,
      o.activationStatus,
      new Date(o.createdAt).toLocaleDateString()
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `orders_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Orders Management</h1>
          <p className="text-sm text-[var(--text-muted)]">Track and fulfill customer subscriptions</p>
        </div>
        <button 
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-xs font-bold text-white hover:bg-white/10 transition-all"
        >
          <Download size={14} />
          Export CSV
        </button>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Orders', count: orders.length, icon: ShoppingBag, color: 'var(--accent-primary)' },
          { label: 'Pending', count: orders.filter(o => o.activationStatus === 'pending').length, icon: Clock, color: '#fbbf24' },
          { label: 'Completed', count: orders.filter(o => o.activationStatus === 'active').length, icon: CheckCircle, color: '#10b981' },
          { label: 'Revenue', count: `NPR ${orders.reduce((acc, o) => acc + o.amount, 0)}`, icon: Calendar, color: '#8b5cf6' },
        ].map((stat, i) => (
          <div key={i} className="p-4 rounded-2xl bg-white/2 border border-white/5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-white/5">
              <stat.icon size={20} style={{ color: stat.color }} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)]">{stat.label}</p>
              <p className="text-lg font-bold text-white">{stat.count}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col xl:flex-row gap-4 p-4 rounded-2xl bg-white/2 border border-white/5">
        <form onSubmit={handleSearch} className="flex-1 flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/5 min-w-[300px]">
          <Search size={18} className="text-[var(--text-muted)]" />
          <input 
            type="text" 
            placeholder="Search order #, customer email, name..." 
            className="bg-transparent border-none outline-none text-white text-sm w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/5">
            <Filter size={14} className="text-[var(--text-muted)]" />
            <select 
              value={statusFilter} 
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-transparent border-none outline-none text-xs text-white font-medium cursor-pointer pr-4"
            >
              <option value="">All Activation</option>
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <select 
            value={paymentFilter} 
            onChange={e => setPaymentFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white/5 border border-white/5 text-xs text-white font-medium cursor-pointer"
          >
            <option value="">All Payments</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>

          <select 
            value={platformFilter} 
            onChange={e => setPlatformFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white/5 border border-white/5 text-xs text-white font-medium cursor-pointer"
          >
            <option value="">All Platforms</option>
            {platforms.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-3xl border border-white/5 bg-white/2 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/2 border-y border-white/5">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">Order</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">Customer</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">Service</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">Amount</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">Payment</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">Activation</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">Date</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}><td colSpan={8} className="px-6 py-8"><div className="h-4 bg-white/5 animate-pulse rounded" /></td></tr>
                ))
              ) : orders.map(order => (
                <tr key={order.id} className="hover:bg-white/[0.01] transition-colors">
                  <td className="px-6 py-4 font-mono text-xs font-bold text-white">#{order.orderNumber}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-white">{order.customer.name || 'Anonymous'}</span>
                      <span className="text-[10px] text-[var(--text-muted)]">{order.customer.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{order.service.icon}</span>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-white">{order.service.name}</span>
                        <span className="text-[10px] text-[var(--text-muted)]">{order.duration}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-white">NPR {order.amount}</span>
                      <span className="text-[10px] text-[var(--text-muted)] uppercase">{order.paymentMethod}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      order.paymentStatus === 'completed' ? 'bg-green-500/10 text-green-400' :
                      order.paymentStatus === 'pending' ? 'bg-amber-500/10 text-amber-400' :
                      'bg-red-500/10 text-red-400'
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      order.activationStatus === 'active' ? 'bg-green-500/10 text-green-400' :
                      order.activationStatus === 'pending' ? 'bg-amber-500/10 text-amber-400' :
                      'bg-white/5 text-[var(--text-muted)]'
                    }`}>
                      {order.activationStatus === 'active' ? <CheckCircle size={10} /> : <Clock size={10} />}
                      {order.activationStatus}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-[var(--text-muted)]">
                    {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </td>
                  <td className="px-6 py-4">
                    <Link 
                      href={`/admin/orders/${order.id}`}
                      className="p-2 rounded-lg bg-white/5 text-[var(--text-muted)] hover:text-white hover:bg-[var(--accent-primary)] transition-all flex items-center justify-center w-8 h-8"
                    >
                      <ChevronRight size={16} />
                    </Link>
                  </td>
                </tr>
              ))}
              {!loading && orders.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-20 text-center text-[var(--text-muted)]">
                    No orders found matching your filters.
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
