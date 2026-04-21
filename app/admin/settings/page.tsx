'use client';

import { useState, useEffect } from 'react';
import { Save, Globe, Shield, CreditCard, Share2, Mail, Info, CheckCircle } from 'lucide-react';

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'social', label: 'Social', icon: Share2 },
  ];

  return (
    <div className="max-w-5xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">System Settings</h1>
          <p className="text-sm text-[var(--text-muted)]">Configure platform-wide parameters and integrations</p>
        </div>
        {success && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 text-green-400 text-xs font-bold animate-fade-in">
            <CheckCircle size={14} />
            Settings saved successfully
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="lg:w-64 flex flex-row lg:flex-col gap-2 p-2 rounded-[2rem] bg-white/2 border border-white/5 h-fit">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-bold transition-all ${
                  activeTab === tab.id 
                    ? 'bg-[var(--accent-primary)] text-white shadow-lg shadow-indigo-500/20' 
                    : 'text-[var(--text-muted)] hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 p-10 rounded-[2.5rem] border border-white/5 bg-white/2">
          <form onSubmit={handleSave} className="space-y-8">
            {activeTab === 'general' && (
              <div className="space-y-6 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Site Name</label>
                    <input type="text" defaultValue="Sub Reseller" className="w-full px-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:border-[var(--accent-primary)] transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Support Email</label>
                    <input type="email" defaultValue="support@subreseller.com" className="w-full px-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:border-[var(--accent-primary)] transition-all" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Site Description</label>
                  <textarea rows={3} defaultValue="Premium subscription reseller platform in Nepal." className="w-full px-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:border-[var(--accent-primary)] transition-all resize-none" />
                </div>
              </div>
            )}

            {activeTab === 'payments' && (
              <div className="space-y-6 animate-fade-in">
                <div className="p-6 rounded-2xl bg-green-500/5 border border-green-500/10 flex items-start gap-4 mb-4">
                  <Info className="text-green-400 mt-1" size={20} />
                  <div>
                    <h4 className="text-sm font-bold text-white">Payment Gateway Mode</h4>
                    <p className="text-xs text-[var(--text-muted)] mt-1">Switch between Test and Live modes for eSewa and Khalti integrations.</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" /> eSewa Integration
                    </h4>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Merchant ID</label>
                      <input type="password" defaultValue="EPAYTEST" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-[var(--accent-primary)]" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-purple-500" /> Khalti Integration
                    </h4>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Public Key</label>
                      <input type="password" defaultValue="Key_Live_xxxx" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-[var(--accent-primary)]" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between p-6 rounded-2xl bg-white/2 border border-white/5">
                  <div>
                    <h4 className="text-sm font-bold text-white">Maintenance Mode</h4>
                    <p className="text-xs text-[var(--text-muted)] mt-1">Disable front-end access for regular users.</p>
                  </div>
                  <div className="w-12 h-6 bg-white/10 rounded-full relative cursor-pointer">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white/50 rounded-full" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-6 rounded-2xl bg-white/2 border border-white/5">
                  <div>
                    <h4 className="text-sm font-bold text-white">Two-Factor Auth</h4>
                    <p className="text-xs text-[var(--text-muted)] mt-1">Force 2FA for all administrator accounts.</p>
                  </div>
                  <div className="w-12 h-6 bg-green-500 rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'social' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Facebook Page</label>
                  <input type="text" placeholder="https://facebook.com/..." className="w-full px-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:border-[var(--accent-primary)]" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Instagram Username</label>
                  <input type="text" placeholder="@subreseller" className="w-full px-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:border-[var(--accent-primary)]" />
                </div>
              </div>
            )}

            <div className="pt-8 border-t border-white/5 flex justify-end">
              <button 
                type="submit"
                disabled={loading}
                className="px-10 py-4 rounded-2xl bg-[var(--accent-primary)] text-white font-bold flex items-center gap-3 hover:scale-105 transition-transform disabled:opacity-50"
              >
                {loading ? <div className="spinner w-5 h-5" /> : <Save size={20} />}
                {loading ? 'Saving Changes...' : 'Save Settings'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
