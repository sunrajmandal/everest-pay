'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Duration {
  name: string;
  price: number;
  popular?: boolean;
}

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
  category: string;
  durations?: string; // JSON string in DB
}

export default function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [service, setService] = useState<Service | null>(null);
  const [durations, setDurations] = useState<Duration[]>([]);
  const [selectedDuration, setSelectedDuration] = useState<Duration | null>(null);
  const [email, setEmail] = useState('');
  const [deliveryOption, setDeliveryOption] = useState<'ready_made' | 'own_account'>('ready_made');
  const [providedEmail, setProvidedEmail] = useState('');
  const [providedPassword, setProvidedPassword] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'esewa' | 'khalti' | 'manual'>('esewa');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetch(`/api/services/${id}`)
      .then(res => res.json())
      .then(data => {
        setService(data);
        if (data.durations && data.durations.length > 0) {
          const parsed = typeof data.durations === 'string' ? JSON.parse(data.durations) : data.durations;
          setDurations(parsed);
          // Auto-select popular or first duration
          const initial = parsed.find((d: any) => d.popular) || parsed[0];
          setSelectedDuration(initial);
        } else {
          // Fallback if no durations are defined for this service
          const defaultDuration = { name: '1 Month', price: data.price };
          setDurations([defaultDuration]);
          setSelectedDuration(defaultDuration);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDuration || !email) return;
    if (deliveryOption === 'own_account' && (!providedEmail || !providedPassword)) {
      alert('Please provide the account credentials to upgrade your own account.');
      return;
    }

    setProcessing(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: id,
          email,
          paymentMethod: paymentMethod === 'manual' ? 'esewa' : paymentMethod,
          amount: selectedDuration.price,
          duration: selectedDuration.name,
          deliveryOption,
          providedAccountEmail: deliveryOption === 'own_account' ? providedEmail : null,
          providedAccountPassword: deliveryOption === 'own_account' ? providedPassword : null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create order');

      if (paymentMethod === 'manual') {
        alert(`Order placed! Please send NPR ${selectedDuration.price.toLocaleString()} to eSewa: 9766194370 and share the screenshot on WhatsApp.`);
        window.location.href = `https://wa.me/9779848718246?text=I paid NPR ${selectedDuration.price} for ${service?.name} (${selectedDuration.name}). Order: ${data.orderNumber}`;
      } else {
        // Initiate Auto Payment (eSewa or Khalti)
        const initRes = await fetch(`/api/payment/${paymentMethod}/initiate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: data.id }),
        });
        
        const initData = await initRes.json();
        if (!initRes.ok) throw new Error(initData.error || 'Failed to initiate payment');

        if (paymentMethod === 'khalti') {
          window.location.href = initData.paymentUrl;
        } else if (paymentMethod === 'esewa') {
          // For eSewa v2, we need to POST a form
          const form = document.createElement('form');
          form.method = 'POST';
          form.action = initData.paymentUrl;

          Object.entries(initData.formFields).forEach(([key, value]) => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = value as string;
            form.appendChild(input);
          });

          document.body.appendChild(form);
          form.submit();
        }
      }
    } catch (err: any) {
      alert(err.message || 'Something went wrong');
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner" style={{ width: 40, height: 40 }}></div>
      </div>
    );
  }

  if (!service) return <div className="text-center py-20">Service not found</div>;

  const basePrice = durations[0]?.price || service.price;

  return (
    <div className="hero-gradient min-h-screen pb-20">
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center">
        <Link href="/services" className="text-sm text-[var(--text-secondary)] hover:text-white transition-colors" style={{ textDecoration: 'none' }}>
          ← Back to Services
        </Link>
      </nav>

      <div className="max-w-4xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* Main Form */}
          <div className="lg:col-span-3 space-y-8 animate-fade-in-up">
            <div className="glass-card p-8">
              <h1 className="text-2xl font-bold mb-6">Complete Your Order</h1>
              
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Step 1: Customer Info */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-[var(--text-secondary)]">
                    Enter your Email Address
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="example@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field py-4 text-lg"
                  />
                  <p className="text-xs text-[var(--text-muted)]">
                    We will send the subscription credentials to this email.
                  </p>
                </div>

                {/* Step 2: Delivery Option */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">Select Delivery Option</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setDeliveryOption('ready_made')}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        deliveryOption === 'ready_made' ? 'border-[var(--accent-primary)] bg-[rgba(139,92,246,0.1)]' : 'border-[var(--border-color)] bg-[rgba(255,255,255,0.02)]'
                      }`}
                    >
                      <div className="font-bold mb-1">Get a ready-made account</div>
                      <div className="text-xs text-[var(--text-secondary)]">We provide a new account with the subscription activated.</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeliveryOption('own_account')}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        deliveryOption === 'own_account' ? 'border-[var(--accent-primary)] bg-[rgba(139,92,246,0.1)]' : 'border-[var(--border-color)] bg-[rgba(255,255,255,0.02)]'
                      }`}
                    >
                      <div className="font-bold mb-1">Use my own account</div>
                      <div className="text-xs text-[var(--text-secondary)]">We will upgrade your existing account. Requires login credentials.</div>
                    </button>
                  </div>

                  {deliveryOption === 'own_account' && (
                    <div className="mt-4 p-5 rounded-xl bg-[rgba(0,0,0,0.2)] border border-[var(--border-color)] space-y-4 animate-fade-in-up">
                      <div className="text-sm font-medium text-amber-400 mb-2">⚠️ Please provide your account details to be upgraded:</div>
                      <div>
                        <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Account Email</label>
                        <input
                          required
                          type="email"
                          placeholder="your-netflix@email.com"
                          value={providedEmail}
                          onChange={(e) => setProvidedEmail(e.target.value)}
                          className="input-field py-3 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">Account Password</label>
                        <input
                          required
                          type="text"
                          placeholder="Your account password"
                          value={providedPassword}
                          onChange={(e) => setProvidedPassword(e.target.value)}
                          className="input-field py-3 text-sm"
                        />
                      </div>
                      <div className="text-[10px] text-[var(--text-muted)]">
                        Your credentials are encrypted and only used once for activation. You can change your password after the upgrade is complete.
                      </div>
                    </div>
                  )}
                </div>

                {/* Step 3: Duration Selection */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">Select Duration</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {durations.map((d, i) => {
                      const savings = (basePrice * parseInt(d.name) || basePrice) - d.price;
                      const isBestValue = d.name.includes('12') || d.name.includes('Lifetime');
                      
                      return (
                        <div
                          key={i}
                          onClick={() => setSelectedDuration(d)}
                          className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer hover:translate-y-[-2px] ${
                            selectedDuration?.name === d.name
                              ? 'border-[var(--accent-primary)] bg-[rgba(139,92,246,0.1)] shadow-[0_0_20px_rgba(139,92,246,0.2)]'
                              : 'border-[var(--border-color)] bg-[rgba(255,255,255,0.02)]'
                          }`}
                        >
                          {d.popular && (
                            <span className="absolute -top-3 left-4 px-3 py-1 bg-[var(--accent-primary)] text-white text-[10px] font-bold rounded-full uppercase tracking-widest">
                              Popular
                            </span>
                          )}
                          {isBestValue && (
                            <span className="absolute -top-3 left-4 px-3 py-1 bg-[#10b981] text-white text-[10px] font-bold rounded-full uppercase tracking-widest">
                              Best Value
                            </span>
                          )}
                          
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-bold text-lg">{d.name}</span>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              selectedDuration?.name === d.name ? 'border-[var(--accent-primary)]' : 'border-[var(--text-muted)]'
                            }`}>
                              {selectedDuration?.name === d.name && <div className="w-2.5 h-2.5 rounded-full bg-[var(--accent-primary)]" />}
                            </div>
                          </div>
                          
                          <div className="flex items-baseline gap-2">
                            <span className="text-xl font-extrabold text-white">NPR {d.price}</span>
                            {savings > 0 && (
                              <span className="text-[10px] font-bold text-[#10b981] bg-[rgba(16,185,129,0.1)] px-2 py-0.5 rounded">
                                SAVE NPR {savings}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Step 3: Payment Method */}
                <div className="space-y-4 pt-4 border-t border-[var(--border-color)]">
                  <h2 className="text-lg font-semibold">Choose Payment Method</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('esewa')}
                      className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                        paymentMethod === 'esewa' ? 'border-green-500 bg-[rgba(34,197,94,0.1)]' : 'border-[var(--border-color)] bg-[rgba(255,255,255,0.02)]'
                      }`}
                    >
                      <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center font-bold text-white text-[10px]">Auto</div>
                      <span className="text-xs font-bold">eSewa Auto</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('khalti')}
                      className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                        paymentMethod === 'khalti' ? 'border-[#5c2d91] bg-[rgba(92,45,145,0.1)]' : 'border-[var(--border-color)] bg-[rgba(255,255,255,0.02)]'
                      }`}
                    >
                      <div className="w-8 h-8 bg-[#5c2d91] rounded flex items-center justify-center font-bold text-white text-[10px]">K</div>
                      <span className="text-xs font-bold">Khalti</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('manual')}
                      className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                        paymentMethod === 'manual' ? 'border-[var(--accent-primary)] bg-[rgba(139,92,246,0.1)]' : 'border-[var(--border-color)] bg-[rgba(255,255,255,0.02)]'
                      }`}
                    >
                      <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center font-bold text-white text-[10px]">Direct</div>
                      <span className="text-xs font-bold">eSewa Direct</span>
                    </button>
                  </div>
                </div>

                <button
                  disabled={processing || !selectedDuration}
                  className="btn-primary w-full py-5 text-lg font-bold shadow-[0_10px_30px_rgba(139,92,246,0.3)] disabled:opacity-50"
                >
                  {processing ? 'Processing...' : `Place Order (NPR ${selectedDuration?.price || 0})`}
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar Order Summary */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card p-6 sticky top-24">
              <h2 className="text-lg font-bold mb-6 pb-4 border-b border-[var(--border-color)]">Order Summary</h2>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4">
                  <div className="text-4xl bg-[rgba(255,255,255,0.03)] p-3 rounded-2xl border border-[var(--border-color)]">
                    {service.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{service.name}</h3>
                    <p className="text-xs text-[var(--text-muted)]">{service.category}</p>
                  </div>
                </div>
                
                <div className="space-y-3 pt-4 text-sm">
                  <div className="flex justify-between text-[var(--text-secondary)]">
                    <span>Subscription</span>
                    <span className="text-white font-medium">{selectedDuration?.name || '—'}</span>
                  </div>
                  <div className="flex justify-between text-[var(--text-secondary)]">
                    <span>Base Price</span>
                    <span className="text-white">NPR {basePrice}</span>
                  </div>
                  {selectedDuration && (basePrice * (parseInt(selectedDuration.name) || 1)) > selectedDuration.price && (
                    <div className="flex justify-between text-[#10b981]">
                      <span>Discount</span>
                      <span>-NPR {(basePrice * (parseInt(selectedDuration.name) || 1)) - selectedDuration.price}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="pt-6 border-t border-[var(--border-color)] flex justify-between items-end">
                <span className="text-[var(--text-muted)] text-sm font-medium">Total Amount</span>
                <div className="text-right">
                  <span className="block text-3xl font-extrabold text-[var(--accent-primary)]">
                    NPR {selectedDuration?.price || 0}
                  </span>
                </div>
              </div>
              
              <div className="mt-8 p-4 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[var(--border-color)] space-y-3">
                <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                  <span className="text-green-500">🛡️</span> Encrypted Payment
                </div>
                <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                  <span className="text-green-500">⚡</span> Instant Activation
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
