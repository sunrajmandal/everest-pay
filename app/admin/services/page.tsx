'use client';

import { useEffect, useState } from 'react';

interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number;
  costPrice: number | null;
  category: string | null;
  icon: string | null;
  isActive: boolean;
  sortOrder: number;
  _count: { orders: number };
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [saving, setSaving] = useState(false);

  // Form
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formCost, setFormCost] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formIcon, setFormIcon] = useState('');
  const [formSort, setFormSort] = useState('0');
  const [formActive, setFormActive] = useState(true);

  const fetchServices = () => {
    setLoading(true);
    fetch('/api/admin/services')
      .then(res => res.json())
      .then(data => { setServices(data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchServices(); }, []);

  const openAdd = () => {
    setEditing(null);
    setFormName(''); setFormDesc(''); setFormPrice(''); setFormCost('');
    setFormCategory('streaming'); setFormIcon('📱'); setFormSort('0'); setFormActive(true);
    setShowModal(true);
  };

  const openEdit = (s: Service) => {
    setEditing(s);
    setFormName(s.name); setFormDesc(s.description || ''); setFormPrice(String(s.price));
    setFormCost(s.costPrice ? String(s.costPrice) : ''); setFormCategory(s.category || '');
    setFormIcon(s.icon || ''); setFormSort(String(s.sortOrder)); setFormActive(s.isActive);
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const body = {
      name: formName, description: formDesc, price: parseFloat(formPrice),
      costPrice: formCost ? parseFloat(formCost) : null, category: formCategory,
      icon: formIcon, sortOrder: parseInt(formSort), isActive: formActive,
    };

    try {
      if (editing) {
        await fetch(`/api/admin/services/${editing.id}`, {
          method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
        });
      } else {
        await fetch('/api/admin/services', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
        });
      }
      setShowModal(false);
      fetchServices();
    } catch { /* ignore */ }
    setSaving(false);
  };

  const toggleActive = async (s: Service) => {
    await fetch(`/api/admin/services/${s.id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !s.isActive }),
    });
    fetchServices();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Services</h1>
          <p className="text-sm text-[var(--text-muted)]">Manage subscription services</p>
        </div>
        <button onClick={openAdd} className="btn-primary" style={{ padding: '10px 20px' }}>+ Add Service</button>
      </div>

      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16"><div className="spinner" style={{ width: 28, height: 28 }}></div></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead><tr><th>Service</th><th>Price</th><th>Cost</th><th>Profit</th><th>Category</th><th>Orders</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {services.map(s => (
                  <tr key={s.id}>
                    <td><span className="flex items-center gap-2 font-medium text-white">{s.icon} {s.name}</span></td>
                    <td className="font-medium">NPR {s.price}</td>
                    <td>{s.costPrice ? `NPR ${s.costPrice}` : '—'}</td>
                    <td className="text-[var(--success)]">{s.costPrice ? `NPR ${s.price - s.costPrice}` : '—'}</td>
                    <td className="capitalize text-xs">{s.category || '—'}</td>
                    <td>{s._count.orders}</td>
                    <td>
                      <button onClick={() => toggleActive(s)} className={`badge ${s.isActive ? 'badge-active' : 'badge-cancelled'}`} style={{ cursor: 'pointer' }}>
                        {s.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td>
                      <button onClick={() => openEdit(s)} className="text-xs text-[var(--accent-primary)] hover:underline">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-semibold mb-6">{editing ? 'Edit Service' : 'Add Service'}</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-3">
                <div className="col-span-1">
                  <label className="block text-xs text-[var(--text-muted)] mb-1">Icon</label>
                  <input value={formIcon} onChange={e => setFormIcon(e.target.value)} className="input-field text-center text-2xl" style={{ padding: '8px' }} />
                </div>
                <div className="col-span-3">
                  <label className="block text-xs text-[var(--text-muted)] mb-1">Name *</label>
                  <input value={formName} onChange={e => setFormName(e.target.value)} className="input-field" placeholder="Netflix" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-[var(--text-muted)] mb-1">Description</label>
                <textarea value={formDesc} onChange={e => setFormDesc(e.target.value)} className="input-field" rows={2} placeholder="Service description..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[var(--text-muted)] mb-1">Price (NPR) *</label>
                  <input type="number" value={formPrice} onChange={e => setFormPrice(e.target.value)} className="input-field" placeholder="399" />
                </div>
                <div>
                  <label className="block text-xs text-[var(--text-muted)] mb-1">Cost Price (NPR)</label>
                  <input type="number" value={formCost} onChange={e => setFormCost(e.target.value)} className="input-field" placeholder="250" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[var(--text-muted)] mb-1">Category</label>
                  <select value={formCategory} onChange={e => setFormCategory(e.target.value)} className="input-field">
                    <option value="streaming">Streaming</option>
                    <option value="music">Music</option>
                    <option value="gaming">Gaming</option>
                    <option value="productivity">Productivity</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-[var(--text-muted)] mb-1">Sort Order</label>
                  <input type="number" value={formSort} onChange={e => setFormSort(e.target.value)} className="input-field" />
                </div>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={formActive} onChange={e => setFormActive(e.target.checked)}
                  className="w-4 h-4 rounded" />
                <span className="text-sm">Active (visible to customers)</span>
              </label>
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
                {saving ? <><div className="spinner"></div> Saving...</> : (editing ? 'Update Service' : 'Create Service')}
              </button>
              <button onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
