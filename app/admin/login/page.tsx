'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError('Invalid email or password');
      setLoading(false);
    } else {
      router.push('/admin/dashboard');
    }
  };

  return (
    <div className="hero-gradient min-h-screen flex items-center justify-center px-6">
      <div className="glass-card p-10 max-w-sm w-full animate-fade-in-up border border-white/5 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[var(--accent-primary)] opacity-5 rounded-full blur-3xl" />
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 text-[var(--accent-primary)]">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">Admin Access</h1>
          <p className="text-sm text-[var(--text-muted)]">Securely manage your platform</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em]">Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[var(--accent-primary)] transition-all" 
              placeholder="sunraz56@gmail.com" 
              required 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em]">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={password} 
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[var(--accent-primary)] transition-all" 
                placeholder="••••••••" 
                required 
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl text-xs font-bold bg-red-500/10 text-red-400 animate-pulse">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full py-4 rounded-2xl bg-[var(--accent-primary)] text-white font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-all disabled:opacity-50"
          >
            {loading ? <div className="spinner w-5 h-5"></div> : 'Sign In to Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}
