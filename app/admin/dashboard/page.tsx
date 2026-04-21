'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  ArrowUpRight,
  MoreVertical,
  ChevronRight
} from 'lucide-react';

interface Stats {
  totalOrders: number;
  pendingActivation: number;
  completedPayments: number;
  activeSubscriptions: number;
  totalCustomers: number;
  expiringSoon: number;
  totalRevenue: number;
  dailyOrders: Array<{ date: string; orders: number }>;
  revenueGrowth: Array<{ month: string; revenue: number }>;
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    amount: number;
    paymentStatus: string;
    activationStatus: string;
    paymentMethod: string;
    duration: string;
    createdAt: string;
    service: { name: string; icon: string };
    customer: { email: string; name: string | null };
  }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(data => { setStats(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 rounded-2xl bg-white/5 animate-pulse" />
          <div className="h-80 rounded-2xl bg-white/5 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!stats) return <div className="text-center py-20 text-red-400">Failed to load dashboard data</div>;

  const kpis = [
    { label: 'Total Revenue', value: `NPR ${stats.totalRevenue.toLocaleString()}`, trend: '+12.5%', icon: TrendingUp, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
    { label: 'Total Orders', value: stats.totalOrders, trend: '+8.2%', icon: ShoppingBag, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
    { label: 'Active Subs', value: stats.activeSubscriptions, trend: '+5.4%', icon: CheckCircle, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
    { label: 'Total Customers', value: stats.totalCustomers, trend: '+14.1%', icon: Users, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 rounded-xl border border-white/10 bg-[#0d1122]/90 backdrop-blur-md shadow-2xl">
          <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-1">{label}</p>
          <p className="text-sm font-bold text-white">
            {payload[0].name === 'revenue' ? `NPR ${payload[0].value.toLocaleString()}` : `${payload[0].value} Orders`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div 
              key={i} 
              className="group p-6 rounded-3xl border border-white/5 bg-white/2 hover:bg-white/4 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-5 transition-transform group-hover:scale-150" style={{ background: kpi.color }} />
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-2xl" style={{ background: kpi.bg }}>
                  <Icon size={24} style={{ color: kpi.color }} />
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/5 text-[10px] font-bold text-green-400">
                  <ArrowUpRight size={12} />
                  {kpi.trend}
                </div>
              </div>
              <p className="text-3xl font-extrabold text-white mb-1">{kpi.value}</p>
              <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">{kpi.label}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Volume Chart */}
        <div className="p-8 rounded-3xl border border-white/5 bg-white/2">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Order Volume</h3>
              <p className="text-xs text-[var(--text-muted)]">Daily orders for the last 7 days</p>
            </div>
            <div className="p-2 rounded-xl bg-white/5 text-[var(--text-muted)] cursor-pointer hover:text-white transition-colors">
              <MoreVertical size={18} />
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.dailyOrders}>
                <defs>
                  <linearGradient id="orderGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 10 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 10 }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(139,92,246,0.2)', strokeWidth: 2 }} />
                <Area 
                  type="monotone" 
                  dataKey="orders" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#orderGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Growth Chart */}
        <div className="p-8 rounded-3xl border border-white/5 bg-white/2">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Revenue Growth</h3>
              <p className="text-xs text-[var(--text-muted)]">Monthly revenue breakdown</p>
            </div>
            <div className="p-2 rounded-xl bg-white/5 text-[var(--text-muted)] cursor-pointer hover:text-white transition-colors">
              <MoreVertical size={18} />
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.revenueGrowth}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 10 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 10 }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar 
                  dataKey="revenue" 
                  fill="#10b981" 
                  radius={[6, 6, 0, 0]}
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="rounded-3xl border border-white/5 bg-white/2 overflow-hidden">
        <div className="p-8 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Recent Activity</h3>
            <p className="text-xs text-[var(--text-muted)]">Latest orders from all platforms</p>
          </div>
          <Link 
            href="/admin/orders" 
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-xs font-bold text-white hover:bg-white/10 transition-all"
            style={{ textDecoration: 'none' }}
          >
            View Full History
            <ChevronRight size={14} />
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/2 border-y border-white/5">
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">Order</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">Customer</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">Service</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">Amount</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">Status</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">Date</th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {stats.recentOrders.map(order => (
                <tr key={order.id} className="hover:bg-white/[0.01] transition-colors">
                  <td className="px-8 py-5">
                    <span className="font-mono text-xs font-bold text-white">#{order.orderNumber}</span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-white">{order.customer.name || 'Anonymous'}</span>
                      <span className="text-[10px] text-[var(--text-muted)]">{order.customer.email}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-lg">
                        {order.service.icon}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-white">{order.service.name}</span>
                        <span className="text-[10px] text-[var(--text-muted)]">{order.duration}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-sm font-bold text-white">NPR {order.amount}</span>
                  </td>
                  <td className="px-8 py-5">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      order.activationStatus === 'active' ? 'bg-green-500/10 text-green-400' :
                      order.activationStatus === 'pending' ? 'bg-amber-500/10 text-amber-400' :
                      'bg-white/5 text-[var(--text-muted)]'
                    }`}>
                      {order.activationStatus === 'active' ? <CheckCircle size={10} /> : <Clock size={10} />}
                      {order.activationStatus}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-xs text-[var(--text-muted)]">
                      {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <Link 
                      href={`/admin/orders/${order.id}`}
                      className="p-2 rounded-lg bg-white/5 text-[var(--text-muted)] hover:text-white hover:bg-[var(--accent-primary)] transition-all flex items-center justify-center w-8 h-8"
                    >
                      <ChevronRight size={16} />
                    </Link>
                  </td>
                </tr>
              ))}
              {stats.recentOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-8 py-20 text-center text-[var(--text-muted)]">
                    <div className="flex flex-col items-center gap-3">
                      <AlertCircle size={40} className="opacity-20" />
                      <p>No orders found yet. Time to market your platforms!</p>
                    </div>
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
