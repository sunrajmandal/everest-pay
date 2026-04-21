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

export default function HomePage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(data => { 
        if (Array.isArray(data)) {
          setServices(data.slice(0, 6)); 
        } else {
          setServices([]);
        }
        setLoaded(true); 
      })
      .catch(() => setLoaded(true));
  }, []);

  return (
    <div className="hero-gradient min-h-screen">
      {/* Nav */}
      <nav style={{ borderBottom: '1px solid var(--border-color)' }} className="sticky top-0 z-40 backdrop-blur-xl bg-[rgba(10,14,26,0.8)]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold gradient-text" style={{ textDecoration: 'none' }}>
            ✦ Everest Pay
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/services" className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors" style={{ textDecoration: 'none' }}>
              Services
            </Link>
            <Link href="/services" className="btn-primary text-sm" style={{ textDecoration: 'none', padding: '8px 20px' }}>
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16">
        <div className="text-center max-w-3xl mx-auto animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-6"
               style={{ background: 'var(--accent-glow)', color: 'var(--accent-primary)', border: '1px solid rgba(129,140,248,0.2)' }}>
            🇳🇵 Trusted by 1000+ Nepali Customers
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            Premium Subscriptions
            <br />
            <span className="gradient-text">at Nepali Prices</span>
          </h1>
          <p className="text-lg text-[var(--text-secondary)] mb-8 max-w-xl mx-auto leading-relaxed">
            Get Netflix, Spotify, Xbox Game Pass & more — pay easily with eSewa, Khalti or Cards. Activated instantly.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/services" className="btn-primary text-base" style={{ textDecoration: 'none', padding: '14px 36px' }}>
              Browse Services →
            </Link>
            <a href="#how-it-works" className="btn-secondary text-base" style={{ textDecoration: 'none' }}>
              How it Works
            </a>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Us</h2>
          <p className="text-[var(--text-secondary)]">The most reliable subscription partner in Nepal</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: '🚀', title: 'Fast Delivery', desc: 'Most orders are processed within 1-4 hours of payment.' },
            { icon: '🔒', title: 'Secure Payments', desc: 'Your transactions are protected with industry-standard encryption.' },
            { icon: '🎧', title: '24/7 Support', desc: 'Our dedicated team is always here to help you with any issues.' },
            { icon: '⭐️', title: 'Trusted Service', desc: '100% genuine subscriptions with full warranty and support.' },
          ].map((item, i) => (
            <div key={i} className="glass-card p-8 text-center hover:translate-y-[-8px] transition-all duration-300">
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Services */}
      {loaded && services.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">Popular Services</h2>
              <p className="text-[var(--text-secondary)]">Choose from our most popular subscription plans</p>
            </div>
            <Link href="/services" className="text-[var(--accent-primary)] font-semibold hover:underline" style={{ textDecoration: 'none' }}>
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <Link
                key={service.id}
                href={`/checkout/${service.id}`}
                className={`glass-card p-6 flex flex-col hover:border-[var(--accent-primary)] transition-all`}
                style={{ textDecoration: 'none' }}
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{service.name}</h3>
                <p className="text-sm text-[var(--text-secondary)] mb-6 line-clamp-2 flex-1">{service.description}</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-2xl font-bold text-[var(--accent-primary)]">
                    NPR {service.price}
                  </span>
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[rgba(255,255,255,0.05)] text-[var(--text-muted)] uppercase tracking-widest">
                    {service.category}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* How it Works */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-6 py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--border-color)] to-transparent -z-10 hidden md:block"></div>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-[var(--text-secondary)]">Getting your subscription is easier than ever</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { step: '01', icon: '🎯', title: 'Choose Subscription', desc: 'Browse and select the plan that fits your needs.' },
            { step: '02', icon: '💳', title: 'Pay Securely', desc: 'Pay instantly with eSewa, Khalti, or Bank Cards.' },
            { step: '03', icon: '⚙️', title: 'Order Processed', desc: 'Our team verifies your payment and activates your account.' },
            { step: '04', icon: '📧', title: 'Receive Email', desc: 'Get your login credentials delivered straight to your inbox.' },
          ].map((item, i) => (
            <div key={i} className="text-center relative">
              <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-[28px] text-3xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-xl relative z-10">
                {item.icon}
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-[var(--accent-primary)] text-white text-xs font-bold rounded-full flex items-center justify-center border-4 border-[var(--bg-primary)]">
                  {item.step}
                </div>
              </div>
              <h3 className="text-lg font-bold mb-2">{item.title}</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-[var(--text-secondary)]">Trusted by thousands of users across Nepal</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: 'Anish Shrestha', rating: 5, feedback: 'Best service in Nepal! My Netflix was activated within an hour. Highly recommended!' },
            { name: 'Priya Thapa', rating: 5, feedback: 'I was worried about shared accounts, but their Spotify Family plan works perfectly. Great support!' },
            { name: 'Rohan Gurung', rating: 4, feedback: 'Very easy to pay with eSewa. The Game Pass activation took a bit longer but the support team kept me updated.' },
          ].map((item, i) => (
            <div key={i} className="glass-card p-8 relative">
              <div className="text-[var(--accent-primary)] text-4xl absolute top-6 right-8 opacity-20">“</div>
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <span key={j} className={j < item.rating ? "text-yellow-500" : "text-gray-600"}>★</span>
                ))}
              </div>
              <p className="text-[var(--text-secondary)] italic mb-6 leading-relaxed">"{item.feedback}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center font-bold text-white uppercase">
                  {item.name[0]}
                </div>
                <span className="font-bold text-white">{item.name}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Referral Banner */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="rounded-[40px] p-12 relative overflow-hidden text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8"
             style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.2) 0%, rgba(99,102,241,0.2) 100%)', border: '1px solid rgba(139,92,246,0.3)' }}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent-primary)] opacity-10 blur-[100px] -z-10"></div>
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Earn Money by Referring Friends</h2>
            <p className="text-[var(--text-secondary)] text-lg max-w-xl">
              Join our affiliate program today and earn up to 10% commission on every successful subscription purchase made through your link.
            </p>
          </div>
          <Link href="/affiliate" className="btn-primary whitespace-nowrap" style={{ textDecoration: 'none', padding: '16px 40px', fontSize: '1.1rem' }}>
            Join Affiliate Program
          </Link>
        </div>
      </section>

      {/* Contact Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-4">Need Help?</h2>
            <p className="text-[var(--text-secondary)] mb-8 text-lg">
              Have questions about a subscription or need technical support? Our team is available 24/7 to assist you.
            </p>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[rgba(34,197,94,0.1)] flex items-center justify-center text-xl">💬</div>
                <div>
                  <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider">WhatsApp / eSewa</p>
                  <p className="font-semibold text-lg">+977 9848718246</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[rgba(34,197,94,0.1)] flex items-center justify-center text-xl">📱</div>
                <div>
                  <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Direct Call / eSewa</p>
                  <p className="font-semibold text-lg">+977 9766194370</p>
                </div>
              </div>
            </div>
          </div>
          <div className="glass-card p-8 flex flex-col items-center justify-center text-center">
            <div className="text-6xl mb-6">🇳🇵</div>
            <h3 className="text-xl font-bold mb-3">Quick Support</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-6">
              The fastest way to get help is via WhatsApp. Click below to start a chat with our support team.
            </p>
            <a 
              href="https://wa.me/9779848718246" 
              target="_blank" 
              className="btn-primary w-full py-4 flex items-center justify-center gap-2 font-bold"
              style={{ background: '#25D366', color: 'white', border: 'none' }}
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Professional Footer */}
      <footer className="bg-[#0a0e1a] pt-20 pb-10 border-t border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Column 1: Brand Info */}
            <div className="space-y-6">
              <div className="text-2xl font-bold gradient-text">✦ Everest Pay</div>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                Secure and trusted subscription platform in Nepal. We provide genuine subscriptions at the most affordable prices with instant activation.
              </p>
              <div className="flex gap-4">
                {/* Social Icons Placeholder */}
                {['facebook', 'instagram', 'tiktok', 'twitter'].map((social) => (
                  <a key={social} href="#" className="w-10 h-10 rounded-full bg-[rgba(255,255,255,0.05)] border border-[var(--border-color)] flex items-center justify-center hover:bg-[var(--accent-primary)] hover:border-[var(--accent-primary)] transition-all">
                    <span className="text-xs uppercase font-bold text-white">{social[0]}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 className="text-white font-bold mb-6">Quick Links</h4>
              <ul className="space-y-4">
                <li><Link href="/" className="footer-link">Home</Link></li>
                <li><Link href="/services" className="footer-link">Services</Link></li>
                <li><Link href="/services" className="footer-link">Pricing</Link></li>
                <li><Link href="/track" className="footer-link">Track Order</Link></li>
                <li><Link href="/contact" className="footer-link">Contact</Link></li>
              </ul>
            </div>

            {/* Column 3: Support */}
            <div>
              <h4 className="text-white font-bold mb-6">Support</h4>
              <ul className="space-y-4">
                <li><Link href="/faq" className="footer-link">FAQ</Link></li>
                <li><Link href="/refund" className="footer-link">Refund Policy</Link></li>
                <li><Link href="/privacy" className="footer-link">Privacy Policy</Link></li>
                <li><Link href="/terms" className="footer-link">Terms and Conditions</Link></li>
              </ul>
            </div>

            {/* Column 4: Business */}
            <div>
              <h4 className="text-white font-bold mb-6">Business</h4>
              <ul className="space-y-4">
                <li><Link href="/affiliate" className="footer-link">Affiliate Program</Link></li>
                <li><Link href="/partner" className="footer-link">Partner With Us</Link></li>
                <li><Link href="/reseller" className="footer-link">Reseller Program</Link></li>
                <li><Link href="/api" className="footer-link">API Access</Link></li>
              </ul>
            </div>
          </div>

          {/* Payment Badges & Copyright */}
          <div className="pt-10 border-t border-[rgba(255,255,255,0.05)] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 flex-wrap justify-center md:justify-start">
              <div className="px-3 py-1 bg-white rounded text-[#60bb46] font-bold text-xs">eSewa</div>
              <div className="px-3 py-1 bg-[#5c2d91] rounded text-white font-bold text-xs">Khalti</div>
              <div className="px-3 py-1 bg-[rgba(255,255,255,0.1)] rounded text-white font-bold text-xs italic">VISA</div>
              <div className="px-3 py-1 bg-[rgba(255,255,255,0.1)] rounded text-white font-bold text-xs italic">mastercard</div>
            </div>
            <div className="text-[var(--text-muted)] text-sm text-center md:text-right">
              © 2026 Everest Pay. All rights reserved. <br className="md:hidden" />
              Crafted with ❤️ for Nepal.
            </div>
          </div>
        </div>
      </footer>

      {/* Global Styles for Footer Links */}
      <style jsx>{`
        .footer-link {
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 14px;
          transition: color 0.2s;
        }
        .footer-link:hover {
          color: white;
        }
      `}</style>
    </div>
  );
}
