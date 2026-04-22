'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { SessionProvider } from 'next-auth/react';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Layers, 
  CreditCard, 
  Users, 
  Ticket, 
  Bell, 
  Settings, 
  ExternalLink, 
  LogOut,
  Package,
  Menu,
  X,
  ShieldCheck
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/platforms', label: 'Platforms', icon: Layers },
  { href: '/admin/plans', label: 'Plans', icon: Package },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/payments', label: 'Payments', icon: CreditCard },
  { href: '/admin/coupons', label: 'Coupons', icon: Ticket },
  { href: '/admin/admins', label: 'Admins', icon: ShieldCheck },
  { href: '/admin/notifications', label: 'Notifications', icon: Bell },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (pathname === '/admin/login') return <>{children}</>;

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className="min-h-screen flex" style={{ background: '#070a13' }}>
      {/* Mobile Toggle */}
      <button 
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 right-4 z-[60] p-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-white"
      >
        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside 
        className={`w-72 fixed h-screen flex flex-col z-50 transition-transform duration-300 lg:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ 
          background: 'rgba(13, 17, 34, 0.8)', 
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(255, 255, 255, 0.05)',
          boxShadow: '20px 0 50px rgba(0,0,0,0.5)'
        }}
      >
        <div className="p-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center font-bold text-white text-lg">
              E
            </div>
            <Link href="/admin/dashboard" className="text-xl font-bold tracking-tight text-white" style={{ textDecoration: 'none' }}>
              Everest Pay
            </Link>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)] ml-11">
            Admin Console
          </p>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-gradient-to-r from-[rgba(139,92,246,0.15)] to-transparent text-white border-l-4 border-[var(--accent-primary)]' 
                    : 'text-[var(--text-secondary)] hover:text-white hover:bg-[rgba(255,255,255,0.03)]'
                }`}
                style={{ textDecoration: 'none' }}
              >
                <Icon size={18} className={isActive ? 'text-[var(--accent-primary)]' : 'group-hover:scale-110 transition-transform'} />
                <span className="text-sm font-medium">{item.label}</span>
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] shadow-[0_0_10px_var(--accent-primary)]" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 space-y-3" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <Link 
            href="/" 
            className="flex items-center gap-3 px-4 py-2 text-xs text-[var(--text-muted)] hover:text-white transition-colors" 
            style={{ textDecoration: 'none' }} 
            target="_blank"
          >
            <ExternalLink size={14} />
            View Storefront
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 lg:ml-72 flex flex-col min-h-screen">
        {/* Header/Top Bar */}
        <header 
          className="h-16 px-8 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md"
          style={{ background: 'rgba(7, 10, 19, 0.5)', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}
        >
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--text-muted)]">Pages /</span>
            <span className="text-xs text-white font-medium capitalize">
              {pathname.split('/').pop()?.replace(/-/g, ' ')}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs font-bold text-white leading-none">System Admin</p>
              <p className="text-[10px] text-[var(--text-muted)] mt-1">Full Access</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 border-2 border-white/10 flex items-center justify-center font-bold text-white text-sm">
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8 flex-1 animate-fade-in">
          {children}
        </main>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </SessionProvider>
  );
}
