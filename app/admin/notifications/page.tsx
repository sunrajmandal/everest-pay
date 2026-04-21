'use client';

import { useState } from 'react';
import { Send, Bell, Mail, Megaphone, AlertTriangle, Users, Target } from 'lucide-react';

export default function NotificationsPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    type: 'promo',
    target: 'all',
    subject: '',
    message: ''
  });

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulation of sending
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Notifications Center</h1>
        <p className="text-sm text-[var(--text-muted)]">Communicate directly with your customer base</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white/2 border border-white/5 space-y-3">
          <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 w-fit"><Megaphone size={24} /></div>
          <h3 className="font-bold text-white">Promotional</h3>
          <p className="text-xs text-[var(--text-muted)]">Send discount codes and new platform announcements.</p>
        </div>
        <div className="p-6 rounded-3xl bg-white/2 border border-white/5 space-y-3">
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 w-fit"><AlertTriangle size={24} /></div>
          <h3 className="font-bold text-white">Maintenance</h3>
          <p className="text-xs text-[var(--text-muted)]">Alert users about planned system downtime or service updates.</p>
        </div>
        <div className="p-6 rounded-3xl bg-white/2 border border-white/5 space-y-3">
          <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400 w-fit"><Bell size={24} /></div>
          <h3 className="font-bold text-white">Order Updates</h3>
          <p className="text-xs text-[var(--text-muted)]">Send manual status updates regarding specific orders.</p>
        </div>
      </div>

      <div className="p-8 rounded-[2rem] border border-white/5 bg-white/2 relative overflow-hidden">
        {success && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#070a13]/90 backdrop-blur-sm animate-fade-in">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center">
                <CheckCircle size={32} />
              </div>
              <p className="text-xl font-bold text-white">Notifications Dispatched!</p>
              <p className="text-sm text-[var(--text-muted)] text-center max-w-xs">Your messages are being delivered to the selected customer segments.</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSend} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-2">
                <Target size={14} /> Message Type
              </label>
              <select 
                className="w-full px-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:border-[var(--accent-primary)] transition-all"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
              >
                <option value="promo">Promotional Email</option>
                <option value="maintenance">Maintenance Alert</option>
                <option value="order_update">Bulk Order Update</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-2">
                <Users size={14} /> Audience Segment
              </label>
              <select 
                className="w-full px-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:border-[var(--accent-primary)] transition-all"
                value={formData.target}
                onChange={(e) => setFormData({...formData, target: e.target.value})}
              >
                <option value="all">All Customers</option>
                <option value="active">Active Subscribers Only</option>
                <option value="expired">Expired Subscribers Only</option>
                <option value="newsletter">Newsletter Only</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-2">
              <Mail size={14} /> Subject Line
            </label>
            <input 
              type="text" 
              required
              placeholder="Enter email subject..."
              className="w-full px-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:border-[var(--accent-primary)] transition-all"
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Message Content (Rich Text / HTML Supported)</label>
            <textarea 
              required
              rows={8}
              placeholder="Compose your message here..."
              className="w-full px-6 py-6 rounded-[2rem] bg-white/5 border border-white/10 text-white outline-none focus:border-[var(--accent-primary)] transition-all resize-none"
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
            />
          </div>

          <div className="pt-4">
            <button 
              type="submit"
              disabled={loading}
              className="w-full md:w-fit px-12 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold flex items-center justify-center gap-3 hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100"
            >
              {loading ? <div className="spinner w-5 h-5" /> : <Send size={20} />}
              {loading ? 'Dispatching...' : 'Dispatch Notifications'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CheckCircle({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
