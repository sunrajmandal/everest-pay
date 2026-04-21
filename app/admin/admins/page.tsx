'use client';

import { useState, useEffect } from 'react';
import { Plus, UserPlus, Shield, Mail, Key, Trash2, Edit2, Check, X, ShieldCheck } from 'lucide-react';

interface Admin {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Admin | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: ''
  });

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (Array.isArray(data)) setAdmins(data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        body: JSON.stringify(editing ? { ...formData, id: editing.id } : formData)
      });
      if (res.ok) {
        setShowModal(false);
        fetchAdmins();
        setEditing(null);
        setFormData({ email: '', name: '', password: '' });
      }
    } catch (error) {
      alert('Failed to save admin');
    }
  };

  const openEdit = (admin: Admin) => {
    setEditing(admin);
    setFormData({ email: admin.email, name: admin.name || '', password: '' });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this admin? They will lose all access immediately.')) return;
    try {
      const res = await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchAdmins();
    } catch (error) {
      alert('Failed to delete');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Administrative Team</h1>
          <p className="text-sm text-[var(--text-muted)]">Manage authorized access to the admin panel</p>
        </div>
        <button 
          onClick={() => { setEditing(null); setFormData({email:'', name:'', password:''}); setShowModal(true); }}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[var(--accent-primary)] text-white font-bold hover:scale-105 transition-transform shadow-lg shadow-indigo-500/20"
        >
          <UserPlus size={20} />
          Add Admin
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          [...Array(3)].map((_, i) => <div key={i} className="h-48 rounded-3xl bg-white/5 animate-pulse" />)
        ) : admins.map(admin => (
          <div key={admin.id} className="p-6 rounded-3xl border border-white/5 bg-white/2 hover:bg-white/4 transition-all relative group overflow-hidden">
             <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-500 opacity-5 rounded-full group-hover:scale-150 transition-transform" />
             
             <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                  <ShieldCheck size={24} />
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => openEdit(admin)} className="p-2 rounded-lg bg-white/5 text-[var(--text-muted)] hover:text-white transition-colors">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(admin.id)} className="p-2 rounded-lg bg-white/5 text-[var(--text-muted)] hover:text-red-400 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
             </div>

             <div className="space-y-1">
                <h3 className="font-bold text-white text-lg">{admin.name || 'Admin'}</h3>
                <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                  <Mail size={12} />
                  {admin.email}
                </div>
             </div>

             <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)]">Joined</span>
                <span className="text-xs text-white">{new Date(admin.createdAt).toLocaleDateString()}</span>
             </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#070a13]/80 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#0d1122] p-8 shadow-2xl animate-fade-in-up">
            <h2 className="text-xl font-bold text-white mb-6">{editing ? 'Edit Admin' : 'Add New Admin'}</h2>
            
            <form onSubmit={handleSave} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Full Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[var(--accent-primary)]"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Email Address</label>
                <input 
                  type="email" 
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[var(--accent-primary)]"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                  {editing ? 'New Password (Leave blank to keep current)' : 'Password'}
                </label>
                <input 
                  type="password" 
                  required={!editing}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[var(--accent-primary)]"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-6 py-3 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5">
                  Cancel
                </button>
                <button type="submit" className="flex-1 px-6 py-3 rounded-xl bg-[var(--accent-primary)] text-white font-bold hover:scale-[1.02] transition-transform">
                  {editing ? 'Update Admin' : 'Create Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
