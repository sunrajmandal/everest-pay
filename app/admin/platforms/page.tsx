'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Check, X, Layers, ImageIcon } from 'lucide-react';

interface Platform {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  icon: string;
  isActive: boolean;
  sortOrder: number;
}

export default function PlatformsPage() {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Platform | null>(null);
  const [formData, setFormData] = useState<Partial<Platform>>({
    name: '',
    description: '',
    price: 0,
    category: 'Entertainment',
    icon: '🍿',
    isActive: true,
    sortOrder: 0
  });

  useEffect(() => {
    fetchPlatforms();
  }, []);

  const fetchPlatforms = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/services');
      const data = await res.json();
      if (Array.isArray(data)) setPlatforms(data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/services', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setShowModal(false);
        fetchPlatforms();
        setEditing(null);
      }
    } catch (error) {
      alert('Failed to save');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure? This cannot be undone.')) return;
    try {
      const res = await fetch(`/api/admin/services?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchPlatforms();
    } catch (error) {
      alert('Failed to delete');
    }
  };

  const openEdit = (p: Platform) => {
    setEditing(p);
    setFormData(p);
    setShowModal(true);
  };

  const openAdd = () => {
    setEditing(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      category: 'Entertainment',
      icon: '🍿',
      isActive: true,
      sortOrder: platforms.length
    });
    setShowModal(true);
  };

  const filtered = platforms.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Platforms</h1>
          <p className="text-sm text-[var(--text-muted)]">Manage streaming services and platforms</p>
        </div>
        <button 
          onClick={openAdd}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[var(--accent-primary)] text-white font-bold hover:scale-105 transition-transform"
        >
          <Plus size={20} />
          Add Platform
        </button>
      </div>

      <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
        <Search className="text-[var(--text-muted)]" size={20} />
        <input 
          type="text" 
          placeholder="Search by name or category..." 
          className="bg-transparent border-none outline-none text-white text-sm w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="h-64 rounded-3xl bg-white/5 animate-pulse" />
          ))
        ) : filtered.map(p => (
          <div key={p.id} className="group p-6 rounded-3xl border border-white/5 bg-white/2 hover:bg-white/4 transition-all relative">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-3xl">
                {p.icon}
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => openEdit(p)}
                  className="p-2 rounded-xl bg-white/5 text-[var(--text-muted)] hover:text-white hover:bg-indigo-500/20"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(p.id)}
                  className="p-2 rounded-xl bg-white/5 text-[var(--text-muted)] hover:text-red-400 hover:bg-red-500/20"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <h3 className="text-lg font-bold text-white mb-1">{p.name}</h3>
            <p className="text-xs text-[var(--text-muted)] line-clamp-2 mb-4 h-8">{p.description}</p>
            
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/5">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-bold">Category</span>
                <span className="text-xs text-white font-medium">{p.category}</span>
              </div>
              <div className="flex flex-col items-end text-right">
                <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-bold">Base Price</span>
                <span className="text-xs text-[var(--accent-primary)] font-bold">NPR {p.price}</span>
              </div>
            </div>

            <div className={`absolute top-6 left-24 px-2 py-0.5 rounded-full text-[10px] font-bold ${p.isActive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
              {p.isActive ? 'ACTIVE' : 'INACTIVE'}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#070a13]/80 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-xl rounded-3xl border border-white/10 bg-[#0d1122] p-8 shadow-2xl animate-fade-in-up">
            <h2 className="text-xl font-bold text-white mb-6">{editing ? 'Edit Platform' : 'Add New Platform'}</h2>
            
            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Name</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[var(--accent-primary)] transition-colors"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Icon (Emoji)</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[var(--accent-primary)] transition-colors"
                    value={formData.icon}
                    onChange={(e) => setFormData({...formData, icon: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Description</label>
                <textarea 
                  required
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[var(--accent-primary)] transition-colors resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Category</label>
                  <select 
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[var(--accent-primary)] transition-colors"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="Entertainment">Entertainment</option>
                    <option value="Music">Music</option>
                    <option value="Productivity">Productivity</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Design">Design</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Base Price (NPR)</label>
                  <input 
                    type="number" 
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[var(--accent-primary)] transition-colors"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 py-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="hidden"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  />
                  <div className={`w-12 h-6 rounded-full relative transition-colors ${formData.isActive ? 'bg-green-500' : 'bg-white/10'}`}>
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${formData.isActive ? 'left-7' : 'left-1'}`} />
                  </div>
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Active Status</span>
                </label>
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
                  {editing ? 'Save Changes' : 'Create Platform'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
