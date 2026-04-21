'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Package, ChevronDown, ChevronUp } from 'lucide-react';

interface Duration {
  name: string;
  price: number;
  popular?: boolean;
}

interface Platform {
  id: string;
  name: string;
  icon: string;
  durations: Duration[];
}

export default function PlansPage() {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetchPlatforms();
  }, []);

  const fetchPlatforms = async () => {
    try {
      const res = await fetch('/api/admin/services');
      const data = await res.json();
      if (Array.isArray(data)) {
        setPlatforms(data.map((p: any) => ({
          ...p,
          durations: typeof p.durations === 'string' ? JSON.parse(p.durations) : (p.durations || [])
        })));
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleAddDuration = (platformId: string) => {
    setPlatforms(prev => prev.map(p => {
      if (p.id === platformId) {
        return {
          ...p,
          durations: [...p.durations, { name: 'New Plan', price: 0 }]
        };
      }
      return p;
    }));
  };

  const handleRemoveDuration = (platformId: string, index: number) => {
    setPlatforms(prev => prev.map(p => {
      if (p.id === platformId) {
        const newDurations = [...p.durations];
        newDurations.splice(index, 1);
        return { ...p, durations: newDurations };
      }
      return p;
    }));
  };

  const handleUpdateDuration = (platformId: string, index: number, field: keyof Duration, value: any) => {
    setPlatforms(prev => prev.map(p => {
      if (p.id === platformId) {
        const newDurations = [...p.durations];
        newDurations[index] = { ...newDurations[index], [field]: value };
        return { ...p, durations: newDurations };
      }
      return p;
    }));
  };

  const handleSave = async (platform: Platform) => {
    try {
      const res = await fetch('/api/admin/services', {
        method: 'POST',
        body: JSON.stringify({
          name: platform.name,
          durations: JSON.stringify(platform.durations)
        })
      });
      if (res.ok) {
        alert(`${platform.name} plans updated successfully!`);
      }
    } catch (error) {
      alert('Failed to save');
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="spinner" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Service Plans</h1>
        <p className="text-sm text-[var(--text-muted)]">Configure durations and pricing for each platform</p>
      </div>

      <div className="space-y-4">
        {platforms.map(platform => (
          <div key={platform.id} className="rounded-3xl border border-white/5 bg-white/2 overflow-hidden transition-all">
            <div 
              className="p-6 flex items-center justify-between cursor-pointer hover:bg-white/2"
              onClick={() => setExpanded(expanded === platform.id ? null : platform.id)}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl">
                  {platform.icon}
                </div>
                <div>
                  <h3 className="font-bold text-white">{platform.name}</h3>
                  <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-bold">
                    {platform.durations.length} Active Plans
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={(e) => { e.stopPropagation(); handleSave(platform); }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 text-green-400 text-xs font-bold hover:bg-green-500/20 transition-all"
                >
                  <Save size={14} />
                  Save Changes
                </button>
                {expanded === platform.id ? <ChevronUp className="text-[var(--text-muted)]" /> : <ChevronDown className="text-[var(--text-muted)]" />}
              </div>
            </div>

            {expanded === platform.id && (
              <div className="p-6 border-t border-white/5 bg-black/20 space-y-4 animate-fade-in">
                <div className="grid grid-cols-12 gap-4 px-4 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em]">
                  <div className="col-span-5">Plan Name / Duration</div>
                  <div className="col-span-4">Price (NPR)</div>
                  <div className="col-span-2 text-center">Popular</div>
                  <div className="col-span-1"></div>
                </div>

                {platform.durations.map((d, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-4 items-center bg-white/5 p-3 rounded-2xl border border-white/5 group">
                    <div className="col-span-5">
                      <input 
                        type="text" 
                        className="w-full bg-transparent border-none outline-none text-sm text-white font-medium"
                        value={d.name}
                        onChange={(e) => handleUpdateDuration(platform.id, idx, 'name', e.target.value)}
                        placeholder="e.g. 1 Month"
                      />
                    </div>
                    <div className="col-span-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[var(--text-muted)] text-sm">NPR</span>
                        <input 
                          type="number" 
                          className="w-full bg-transparent border-none outline-none text-sm text-[var(--accent-primary)] font-bold"
                          value={d.price}
                          onChange={(e) => handleUpdateDuration(platform.id, idx, 'price', parseFloat(e.target.value))}
                        />
                      </div>
                    </div>
                    <div className="col-span-2 flex justify-center">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-white/10 bg-white/5 text-[var(--accent-primary)] focus:ring-0"
                        checked={d.popular}
                        onChange={(e) => handleUpdateDuration(platform.id, idx, 'popular', e.target.checked)}
                      />
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <button 
                        onClick={() => handleRemoveDuration(platform.id, idx)}
                        className="p-2 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}

                <button 
                  onClick={() => handleAddDuration(platform.id)}
                  className="w-full py-4 rounded-2xl border border-dashed border-white/10 text-[var(--text-muted)] text-xs font-bold hover:border-[var(--accent-primary)] hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <Plus size={16} />
                  Add New Plan Tier
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
