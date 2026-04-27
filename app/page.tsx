'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Shield,
  Zap,
  Wallet,
  Gamepad2,
  Star,
  ArrowRight,
  CheckCircle2,
  Headphones,
  CreditCard,
} from 'lucide-react';

const stats = [
  { label: 'Customers', value: '10,000+' },
  { label: 'Success Rate', value: '99.9%' },
  { label: 'Support', value: '24/7' },
  { label: 'Delivery', value: 'Instant' },
];

const services = [
  'Netflix',
  'Spotify',
  'ChatGPT Plus',
  'Canva Pro',
  'Gaming Topups',
  'Wallet Loads',
];

const reasons = [
  { icon: Shield, title: 'Secure Payments', desc: 'Protected checkout and trusted processing.' },
  { icon: Zap, title: 'Instant Delivery', desc: 'Fast fulfillment for most services.' },
  { icon: Wallet, title: 'Best Rates', desc: 'Competitive pricing for premium services.' },
  { icon: Headphones, title: 'Friendly Support', desc: 'Quick responses when you need help.' },
];

export default function Page() {
  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,#1e3a8a_0%,#000_55%)]" />
      <div className="fixed inset-0 -z-10 opacity-20 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/10 bg-black/40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-wide">Everest Pay</h1>
          <nav className="hidden md:flex gap-8 text-sm text-white/80">
            <a href="#services">Services</a>
            <a href="#why">Why Us</a>
            <a href="#how">How It Works</a>
          </nav>
          <Link
            href="/login"
            className="px-4 py-2 rounded-2xl bg-blue-500 hover:bg-blue-400 transition"
          >
            Login
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-20 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="px-4 py-2 rounded-full bg-white/10 border border-white/10 text-sm">
            Premium Digital Payments
          </span>

          <h2 className="mt-6 text-5xl md:text-7xl font-bold leading-tight">
            Pay Smarter with <span className="text-blue-400">Everest Pay</span>
          </h2>

          <p className="mt-6 text-lg text-white/70 max-w-xl">
            Fast, secure and trusted payments for subscriptions, gaming topups,
            wallets and premium digital services in Nepal.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/services"
              className="px-6 py-3 rounded-2xl bg-blue-500 hover:bg-blue-400 transition flex items-center gap-2"
            >
              Explore Services <ArrowRight size={18} />
            </Link>

            <Link
              href="/register"
              className="px-6 py-3 rounded-2xl border border-white/15 hover:bg-white/10 transition"
            >
              Get Started
            </Link>
          </div>
        </motion.div>

        {/* Floating Card */}
        <motion.div
          initial={{ opacity: 0, rotate: -10, scale: 0.8 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative"
        >
          <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="mx-auto w-full max-w-md rounded-3xl border border-white/10 bg-white/10 backdrop-blur-2xl p-8 shadow-2xl"
          >
            <div className="flex justify-between items-center">
              <span className="text-white/70">Everest Pay Card</span>
              <CreditCard className="text-blue-400" />
            </div>

            <div className="mt-10 text-2xl tracking-[0.35em]">
              •••• •••• •••• 2026
            </div>

            <div className="mt-10 flex justify-between text-sm text-white/70">
              <span>SUNRAZ</span>
              <span>12/30</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-4 gap-4">
          {stats.map((item) => (
            <div
              key={item.label}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center"
            >
              <div className="text-3xl font-bold text-blue-400">{item.value}</div>
              <div className="mt-2 text-white/70">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section id="services" className="max-w-7xl mx-auto px-6 py-20">
        <h3 className="text-4xl font-bold">Popular Services</h3>
        <p className="mt-3 text-white/70">Top premium digital products available instantly.</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {services.map((service) => (
            <motion.div
              whileHover={{ y: -8, scale: 1.02 }}
              key={service}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
            >
              <Gamepad2 className="text-blue-400 mb-4" />
              <h4 className="text-xl font-semibold">{service}</h4>
              <p className="text-white/60 mt-2">
                Fast delivery and secure payment checkout.
              </p>
              <Link
                href="/services"
                className="inline-flex mt-6 items-center gap-2 text-blue-400"
              >
                Buy Now <ArrowRight size={16} />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="why" className="max-w-7xl mx-auto px-6 py-20">
        <h3 className="text-4xl font-bold">Why Choose Everest Pay</h3>

        <div className="grid md:grid-cols-2 gap-6 mt-10">
          {reasons.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-3xl border border-white/10 bg-white/5 p-6"
              >
                <Icon className="text-blue-400 mb-4" />
                <h4 className="text-xl font-semibold">{item.title}</h4>
                <p className="mt-2 text-white/70">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="max-w-7xl mx-auto px-6 py-20">
        <h3 className="text-4xl font-bold">How It Works</h3>

        <div className="grid md:grid-cols-3 gap-6 mt-10">
          {[
            'Choose your service',
            'Pay securely',
            'Receive instantly',
          ].map((step, i) => (
            <div
              key={step}
              className="rounded-3xl border border-white/10 bg-white/5 p-8"
            >
              <div className="text-blue-400 text-4xl font-bold">
                0{i + 1}
              </div>
              <p className="mt-4 text-lg">{step}</p>
              <CheckCircle2 className="mt-6 text-green-400" />
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h3 className="text-4xl font-bold">Trusted by Customers</h3>

        <div className="grid md:grid-cols-3 gap-6 mt-10">
          {['Fast service!', 'Very trusted seller.', 'Best prices in Nepal.'].map(
            (review, i) => (
              <div
                key={i}
                className="rounded-3xl border border-white/10 bg-white/5 p-6"
              >
                <Star className="text-yellow-400 fill-yellow-400" />
                <p className="mt-4 text-white/80">{review}</p>
                <p className="mt-4 text-sm text-white/50">Verified Customer</p>
              </div>
            )
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-10">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row gap-6 justify-between">
          <div>
            <h4 className="text-xl font-bold">Everest Pay</h4>
            <p className="text-white/60 mt-2">
              Premium digital payments platform.
            </p>
          </div>

          <div className="text-white/60 space-y-2">
            <p>Contact Support</p>
            <p>Secure Checkout</p>
            <p>Fast Delivery</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
