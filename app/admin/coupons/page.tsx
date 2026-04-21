'use client';

import { useState, useEffect } from 'react';
import { Plus, Ticket, Trash2, Calendar, Check, X, Tag, Percent } from 'lucide-react';

interface Coupon {
  id: string;
  code: string;
  type: string;
  value: number;
  expiryDate: string;
  usageLimit: number;
  usageCount: number;
  isActive: boolean;
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<Partial<Coupon>>({
    code: '',
    type: 'percentage',
    value: 10,
    usageLimit: 100,
    isActive: true
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const res = await fetch('/api/admin/coupons');
      const data = await res.json();
      if (Array.isArray(data)) setCoupons(data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setShowModal(false);
        fetchCoupons();
      }
    } catch (error) {
      alert('Failed to save');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this coupon?')) return;
    try {
      const res = await fetch(`/api/admin/coupons?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchCoupons();
    } catch (error) {
      alert('Failed to delete');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Coupons & Discounts</h1>
          <p className="text-sm text-[var(--text-muted)]">Create promotional codes for your customers</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[var(--accent-primary)] text-white font-bold hover:scale-105 transition-transform"
        >
          <Plus size={20} />
          Create Coupon
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          [...Array(3)].map((_, i) => <div key={i} className="h-48 rounded-3xl bg-white/5 animate-pulse" />)
        ) : coupons.map(c => (
          <div key={c.id} className="p-6 rounded-3xl border border-white/5 bg-white/2 hover:bg-white/4 transition-all relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-[var(--accent-primary)] opacity-10 rounded-full group-hover:scale-150 transition-transform" />
            
            <div className="flex items-start justify-between mb-6">
              <div className="p-3 rounded-2xl bg-white/5 text-[var(--accent-primary)]">
                <Ticket size={24} />
              </div>
              <button 
                onClick={() => handleDelete(c.id)}
                className="p-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <div className="space-y-1 mb-6">
              <h3 className="text-xl font-black text-white tracking-widest">{c.code}</h3>
              <p className="text-xs text-[var(--text-muted)] uppercase font-bold tracking-tighter">
                {c.type === 'percentage' ? `${c.value}% OFF` : `NPR ${c.value} OFF`}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
              <div>
                <p className="text-[10px] text-[var(--text-muted)] uppercase font-bold">Usage</p>
                <p className="text-sm font-bold text-white">{c.usageCount} / {c.usageLimit || '∞'}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-[var(--text-muted)] uppercase font-bold">Status</p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c.isActive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                  {c.isActive ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </div>
            </div>
          </div>
        ))}
        {!loading && coupons.length === 0 && (
          <div className="col-span-full py-20 rounded-3xl border border-dashed border-white/10 flex flex-col items-center justify-center text-[var(--text-muted)]">
            <Tag size={40} className="mb-4 opacity-20" />
            <p>No active coupons. Create one to boost sales!</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#070a13]/80 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-[#0d1122] p-8 shadow-2xl animate-fade-in-up">
            <h2 className="text-xl font-bold text-white mb-6">New Coupon Code</h2>
            
            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Coupon Code</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. SAVE20"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono uppercase outline-none focus:border-[var(--accent-primary)] transition-colors"
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Type</label>
                  <select 
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[var(--accent-primary)] transition-colors"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Value</label>
                  <input 
                    type="number" 
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[var(--accent-primary)] transition-colors"
                    value={formData.value}
                    onChange={(e) => setFormData({...formData, value: parseFloat(e.target.value)})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Usage Limit</label>
                  <input 
                    type="number" 
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[var(--accent-primary)] transition-colors"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({...formData, usageLimit: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Expiry Date</label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[var(--accent-primary)] transition-colors"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 rounded-2xl border border-white/10 text-white font-bold hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-6 py-3 rounded-2xl bg-[var(--accent-primary)] text-white font-bold hover:scale-[1.02] transition-transform"
                >
                  Create Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
