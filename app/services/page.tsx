'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
  category: string;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setServices(data);
        } else {
          setServices([]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const servicesArray = Array.isArray(services) ? services : [];
  const categories = ['all', ...Array.from(new Set(servicesArray.map(s => s.category).filter(Boolean)))];
  
  const filtered = servicesArray.filter(s => {
    const matchesFilter = filter === 'all' || s.category === filter;
    const matchesSearch = (s.name || '').toLowerCase().includes(search.toLowerCase()) || 
                          (s.description || '').toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="hero-gradient min-h-screen">
      <nav style={{ borderBottom: '1px solid var(--border-color)' }} className="sticky top-0 z-40 backdrop-blur-xl bg-[rgba(10,14,26,0.8)]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold gradient-text" style={{ textDecoration: 'none' }}>
            ✦ Everest Pay
          </Link>
          <Link href="/services" className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors" style={{ textDecoration: 'none' }}>
            Services
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-4xl font-bold mb-3">All Services</h1>
          <p className="text-[var(--text-secondary)]">Choose your subscription and get started instantly</p>
        </div>

        {/* Search and Filters */}
        <div className="max-w-2xl mx-auto mb-10 space-y-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search services (e.g. Netflix, Spotify...)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-12 py-4 text-lg w-full shadow-lg"
              style={{ borderRadius: '20px' }}
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl">🔍</span>
            {search && (
              <button 
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center justify-center gap-3 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  filter === cat
                    ? 'bg-[var(--accent-secondary)] text-white'
                    : 'bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-white border border-[var(--border-color)]'
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="spinner mx-auto mb-4" style={{ width: 32, height: 32 }}></div>
            <p className="text-[var(--text-muted)]">Loading services...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((service, i) => (
              <div
                key={service.id}
                className={`glass-card p-6 flex flex-col animate-fade-in-up stagger-${Math.min(i + 1, 8)}`}
                style={{ opacity: 0 }}
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-1">{service.name}</h3>
                <span className="text-xs text-[var(--text-muted)] uppercase tracking-wide mb-3">{service.category}</span>
                <p className="text-sm text-[var(--text-secondary)] mb-5 flex-1">{service.description}</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-2xl font-bold text-[var(--accent-primary)]">
                    NPR {service.price}
                  </span>
                  <Link
                    href={`/checkout/${service.id}`}
                    className="btn-primary text-sm"
                    style={{ textDecoration: 'none', padding: '8px 20px' }}
                  >
                    Buy Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20 text-[var(--text-muted)]">
            No services found in this category.
          </div>
        )}
      </div>
    </div>
  );
}
