'use client';
import { useRef, useState, Suspense, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { Shield, Zap, Wallet, Gamepad2, Star, ArrowRight, Headphones, CreditCard } from 'lucide-react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Environment, ScrollControls, Scroll, useScroll as useDreiScroll, Sparkles, Cloud, Stars, RoundedBox, Text } from '@react-three/drei';
import * as THREE from 'three';

/* ── DATA ── */
const stats = [
  { label: 'Customers', value: '10,000+' },
  { label: 'Success Rate', value: '99.9%' },
  { label: 'Support', value: '24/7' },
  { label: 'Delivery', value: 'Instant' },
];
const serviceList = ['Netflix','Spotify','ChatGPT Plus','Canva Pro','Gaming Topups','Wallet Loads'];
const reasons = [
  { icon: Shield, title: 'Secure Payments', desc: 'Protected checkout and trusted processing.' },
  { icon: Zap, title: 'Instant Delivery', desc: 'Fast fulfillment for most services.' },
  { icon: Wallet, title: 'Best Rates', desc: 'Competitive pricing for premium services.' },
  { icon: Headphones, title: 'Friendly Support', desc: 'Quick responses when you need help.' },
];

/* ── PROCEDURAL MOUNTAIN ── */
function ProceduralEverest() {
  const meshRef = useRef<THREE.Mesh>(null);
  const geo = useMemo(() => {
    const g = new THREE.ConeGeometry(8, 22, 8, 12);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const noise = (Math.sin(i * 1.7) * 0.5 + Math.cos(i * 3.1) * 0.3) * (1 - y / 22);
      pos.setX(i, pos.getX(i) + noise);
      pos.setZ(i, pos.getZ(i) + noise * 0.8);
    }
    g.computeVertexNormals();
    return g;
  }, []);

  const snowGeo = useMemo(() => {
    const g = new THREE.ConeGeometry(3.2, 7, 8, 6);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const noise = Math.sin(i * 2.3) * 0.15;
      pos.setX(i, pos.getX(i) + noise);
    }
    g.computeVertexNormals();
    return g;
  }, []);

  return (
    <group position={[0, -12, -18]}>
      {/* Main peak */}
      <mesh geometry={geo} rotation={[0, Math.PI / 5, 0]}>
        <meshStandardMaterial color="#cbd5e1" roughness={0.8} flatShading />
      </mesh>
      {/* Snow cap */}
      <mesh geometry={snowGeo} position={[0, 7.5, 0]} rotation={[0, Math.PI / 5, 0]}>
        <meshStandardMaterial color="#ffffff" roughness={0.2} flatShading />
      </mesh>
      {/* Left ridge */}
      <mesh position={[-12, -3, 4]} rotation={[0, 0.3, 0]}>
        <coneGeometry args={[6, 16, 6, 8]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[-12, 4, 4]}>
        <coneGeometry args={[2.5, 5, 6]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.4} flatShading />
      </mesh>
      {/* Right ridge */}
      <mesh position={[11, -4, 2]} rotation={[0, -0.4, 0]}>
        <coneGeometry args={[7, 14, 5, 8]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[11, 3.5, 2]}>
        <coneGeometry args={[2.8, 4.5, 5]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.4} flatShading />
      </mesh>
      {/* Far background peaks */}
      <mesh position={[-22, -6, -10]}>
        <coneGeometry args={[10, 18, 5]} />
        <meshStandardMaterial color="#cbd5e1" roughness={1} flatShading />
      </mesh>
      <mesh position={[20, -7, -12]}>
        <coneGeometry args={[9, 15, 5]} />
        <meshStandardMaterial color="#cbd5e1" roughness={1} flatShading />
      </mesh>
      {/* Ground plane */}
      <mesh position={[0, -11, 5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[80, 60]} />
        <meshStandardMaterial color="#f8fafc" roughness={1} />
      </mesh>
    </group>
  );
}

/* ── SCROLL CAMERA CONTROLLER ── */
function ScrollCamera() {
  const scroll = useDreiScroll();
  const { camera } = useThree();
  const sunRef = useRef<THREE.DirectionalLight>(null);

  useFrame(() => {
    const t = scroll.offset;
    // Stage 1: far establishing shot
    // Stage 2: zoom in
    // Stage 3: rise along mountain
    // Stage 4: summit
    const x = Math.sin(t * Math.PI) * 3;
    const y = THREE.MathUtils.lerp(2, 18, Math.pow(t, 1.4));
    const z = THREE.MathUtils.lerp(22, -2, t);
    camera.position.set(x, y, z);
    const lookY = THREE.MathUtils.lerp(5, 20, t);
    camera.lookAt(0, lookY, -18);

    // Daytime brightness: Soft blueish-grey → Bright white
    if (sunRef.current) {
      sunRef.current.intensity = 2 + t * 2;
      const c = new THREE.Color().lerpColors(
        new THREE.Color('#94a3b8'), // Slate grey
        new THREE.Color('#f8fafc'), // Bright white
        t
      );
      sunRef.current.color = c;
      sunRef.current.position.y = THREE.MathUtils.lerp(8, 35, t);
    }
  });

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight ref={sunRef} position={[15, 8, -10]} intensity={1.5} color="#f8fafc" castShadow />
      <pointLight position={[-8, 5, 10]} intensity={0.5} color="#e2e8f0" />
    </>
  );
}

/* ── 3D PAYMENT CARD ── */
function FloatingCard() {
  const ref = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (!ref.current) return;
    ref.current.rotation.y = Math.sin(s.clock.elapsedTime * 0.4) * 0.25;
    ref.current.rotation.x = Math.cos(s.clock.elapsedTime * 0.3) * 0.1;
  });
  return (
    <Float speed={1.5} rotationIntensity={0.15} floatIntensity={1.2} position={[0, 3, 14]}>
      <group ref={ref} rotation={[0.15, -0.2, 0]}>
        <RoundedBox args={[3.2, 2, 0.04]} radius={0.08} smoothness={4}>
          <meshPhysicalMaterial color="#1e293b" metalness={0.9} roughness={0.1} clearcoat={1} />
        </RoundedBox>
        <RoundedBox args={[0.35, 0.28, 0.05]} radius={0.04} position={[-1.1, 0.4, 0]}>
          <meshStandardMaterial color="#3b82f6" metalness={1} roughness={0.3} />
        </RoundedBox>
        <Text position={[-0.5, 0.65, 0.025]} fontSize={0.18} color="#fff" anchorX="left">✦ Everest Pay</Text>
        <Text position={[-1.1, -0.15, 0.025]} fontSize={0.14} color="#e2e8f0" anchorX="left" letterSpacing={0.12}>•••• •••• •••• 2026</Text>
        <Text position={[-1.1, -0.5, 0.025]} fontSize={0.1} color="#94a3b8" anchorX="left">PREMIUM MEMBER</Text>
        <Text position={[0.9, -0.7, 0.025]} fontSize={0.1} color="#94a3b8" anchorX="left">12/30</Text>
      </group>
    </Float>
  );
}

/* ── ATMOSPHERE (fog, snow, clouds, stars, aurora) ── */
function Atmosphere() {
  const scroll = useDreiScroll();
  const fogRef = useRef<THREE.FogExp2>(null);

  useFrame(() => {
    if (fogRef.current) {
      const t = scroll.offset;
      fogRef.current.density = THREE.MathUtils.lerp(0.035, 0.015, t);
    }
  });

  return (
    <>
      <fogExp2 ref={fogRef} attach="fog" args={['#f8fafc', 0.025]} />
      <Sparkles count={400} scale={50} size={1.2} speed={0.2} opacity={0.3} color="#cbd5e1" position={[0, 10, -5]} />
      <Cloud position={[-10, 4, -8]} speed={0.1} opacity={0.6} color="#ffffff" />
      <Cloud position={[10, 6, -5]} speed={0.08} opacity={0.5} color="#f1f5f9" />
      <Cloud position={[0, 8, -15]} speed={0.12} opacity={0.7} color="#ffffff" />
      <Cloud position={[-5, 12, -20]} speed={0.1} opacity={0.4} color="#f8fafc" />
    </>
  );
}

/* ── FULL 3D SCENE ── */
function Scene3D() {
  return (
    <>
      <ScrollCamera />
      <Atmosphere />
      <ProceduralEverest />
      <FloatingCard />
      <Environment preset="city" />
    </>
  );
}

/* ── HTML OVERLAY INSIDE DREI SCROLL ── */
function HTMLContent() {
  return (
    <Scroll html style={{ width: '100%' }}>
      {/* ─── NAVBAR ─── */}
      <header className="fixed top-0 w-full z-50 backdrop-blur-xl bg-white/20 border-b border-black/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-slate-900 tracking-wider">✦ Everest Pay</Link>
          <nav className="hidden md:flex gap-8 text-sm text-slate-700 font-medium">
            <a href="#services" className="hover:text-black transition">Services</a>
            <a href="#why" className="hover:text-black transition">Why Us</a>
          </nav>
          <Link href="/login" className="px-5 py-2 rounded-full bg-slate-900 border border-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition shadow-lg">Login</Link>
        </div>
      </header>

      {/* ─── PAGE 1: HERO ─── */}
      <div className="h-screen w-full flex items-center justify-center px-6 pointer-events-none">
        <div className="max-w-4xl text-center pointer-events-auto">
          <span className="px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 text-xs font-semibold tracking-widest uppercase shadow-sm">Nepal&apos;s Premium Fintech</span>
          <h1 className="mt-8 text-5xl sm:text-6xl md:text-8xl font-black text-slate-900 leading-[1.1]">Elevate Your<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">Digital Experience</span></h1>
          <p className="mt-6 text-lg text-slate-600 max-w-xl mx-auto">Fast, secure, and trusted payments for subscriptions, gaming top-ups, wallets and premium digital services.</p>
          <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
            <Link href="/services" className="px-8 py-4 rounded-full bg-slate-900 text-white font-bold hover:scale-105 transition-transform shadow-xl flex items-center gap-2">Explore Services <ArrowRight size={18} /></Link>
            <Link href="/register" className="px-8 py-4 rounded-full border border-slate-200 bg-white/50 text-slate-900 font-bold hover:bg-white transition backdrop-blur-md">Get Started</Link>
          </div>
          <div className="mt-16 flex items-center justify-center gap-2 animate-bounce opacity-40">
            <span className="text-xs text-slate-900 uppercase tracking-[0.3em]">Scroll to Explore</span>
          </div>
        </div>
      </div>

      {/* ─── PAGE 2: CINEMATIC TRANSITION ─── */}
      <div className="h-screen w-full flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <p className="text-3xl md:text-5xl font-bold text-slate-800 drop-shadow-sm">Trusted by thousands<br /><span className="text-blue-600">across Nepal</span></p>
        </div>
      </div>

      {/* ─── PAGE 3: STATS + WHY US ─── */}
      <div id="why" className="min-h-screen w-full flex flex-col items-center justify-center px-6 py-20 pointer-events-none">
        <div className="max-w-6xl w-full pointer-events-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-24">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl border border-black/5 bg-white/40 backdrop-blur-xl p-6 text-center shadow-sm">
                <div className="text-3xl font-black text-blue-600">{s.value}</div>
                <div className="mt-2 text-slate-500 text-sm font-medium">{s.label}</div>
              </div>
            ))}
          </div>
          <h3 className="text-3xl md:text-4xl font-black text-slate-900 text-center mb-12">Why Choose Everest Pay</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {reasons.map((r) => {
              const Icon = r.icon;
              return (
                <div key={r.title} className="rounded-2xl border border-black/5 bg-white/40 backdrop-blur-xl p-6 hover:bg-white/60 transition group">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition"><Icon className="text-blue-600" size={24} /></div>
                  <h4 className="text-xl font-bold text-slate-900 mb-1">{r.title}</h4>
                  <p className="text-slate-600 text-sm">{r.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── PAGE 4: SERVICES ─── */}
      <div id="services" className="min-h-screen w-full flex flex-col items-center justify-center px-6 py-20 pointer-events-none">
        <div className="max-w-6xl w-full pointer-events-auto">
          <h3 className="text-3xl md:text-4xl font-black text-slate-900 text-center mb-4">Premium Services</h3>
          <p className="text-slate-500 text-center mb-12">Instant access to global digital platforms.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceList.map((name) => (
              <div key={name} className="rounded-2xl border border-black/5 bg-white/40 backdrop-blur-xl p-6 hover:bg-white/70 transition group shadow-sm">
                <Gamepad2 className="text-blue-600 mb-4 group-hover:scale-110 transition" />
                <h4 className="text-xl font-bold text-slate-900 mb-1">{name}</h4>
                <p className="text-slate-500 text-sm mb-4">Secure checkout &amp; instant delivery.</p>
                <Link href="/services" className="inline-flex items-center gap-1 text-blue-600 text-sm font-semibold hover:gap-2 transition-all">Buy Now <ArrowRight size={14} /></Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── PAGE 5: SUMMIT CTA + FOOTER ─── */}
      <div className="h-screen w-full flex flex-col items-center justify-center px-6 pointer-events-none">
        <div className="max-w-3xl text-center pointer-events-auto mb-32">
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-slate-900 mb-6">Reach the<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">Summit of Convenience</span></h2>
          <p className="text-lg text-slate-600 mb-10">Join thousands of premium members across Nepal.</p>
          <Link href="/register" className="inline-flex items-center gap-2 px-10 py-5 rounded-full bg-slate-900 text-white font-bold text-lg hover:scale-105 transition-transform shadow-xl">Start with Everest Pay <ArrowRight size={20} /></Link>
        </div>
        <footer className="absolute bottom-0 w-full border-t border-black/5 py-6 pointer-events-auto">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm">&copy; 2026 Everest Pay. All rights reserved.</p>
            <div className="flex gap-6 text-sm text-slate-400">
              <Link href="/terms" className="hover:text-slate-900 transition">Terms</Link>
              <Link href="/privacy" className="hover:text-slate-900 transition">Privacy</Link>
              <Link href="/support" className="hover:text-slate-900 transition">Support</Link>
            </div>
          </div>
        </footer>
      </div>
    </Scroll>
  );
}

/* ── LOADING SCREEN ── */
function Loader() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#f8fafc] text-slate-900">
      <div className="w-14 h-14 border-4 border-blue-500/10 border-t-blue-600 rounded-full animate-spin mb-4" />
      <p className="text-sm text-slate-400 animate-pulse tracking-widest uppercase">Preparing Experience</p>
    </div>
  );
}

/* ── MAIN PAGE ── */
export default function Page() {
  const [mounted, setMounted] = useState(false);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    setMobile(window.innerWidth < 768);
  }, []);

  if (!mounted) return <Loader />;

  // Mobile fallback: lightweight 2D version
  if (mobile) {
    return (
      <main className="min-h-screen bg-[#f8fafc] text-slate-900">
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/60 border-b border-black/5">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <span className="text-lg font-bold text-slate-900">✦ Everest Pay</span>
            <Link href="/login" className="px-4 py-2 rounded-full bg-slate-900 text-white text-sm">Login</Link>
          </div>
        </header>
        <section className="px-6 pt-20 pb-16 text-center">
          <h1 className="text-4xl font-black leading-tight text-slate-900">Elevate Your<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">Digital Experience</span></h1>
          <p className="mt-4 text-slate-600">Fast, secure digital services in Nepal.</p>
          <div className="mt-8 flex flex-col gap-3">
            <Link href="/services" className="px-6 py-3 rounded-full bg-slate-900 text-white font-bold text-center">Explore Services</Link>
            <Link href="/register" className="px-6 py-3 rounded-full border border-slate-200 font-bold text-center">Get Started</Link>
          </div>
        </section>
        <section className="px-6 py-12">
          <div className="grid grid-cols-2 gap-3">
            {stats.map((s) => (
              <div key={s.label} className="rounded-xl border border-black/5 bg-white p-4 text-center shadow-sm">
                <div className="text-2xl font-black text-blue-600">{s.value}</div>
                <div className="text-xs text-slate-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </section>
        <section className="px-6 py-12">
          <h3 className="text-2xl font-bold mb-6 text-slate-900">Services</h3>
          <div className="grid grid-cols-2 gap-3">
            {serviceList.map((n) => (
              <Link key={n} href="/services" className="rounded-xl border border-black/5 bg-white p-4 text-center hover:bg-slate-50 transition shadow-sm">
                <Gamepad2 className="text-blue-600 mx-auto mb-2" size={20} />
                <span className="text-sm font-semibold text-slate-800">{n}</span>
              </Link>
            ))}
          </div>
        </section>
        <section className="px-6 py-12">
          <h3 className="text-2xl font-bold mb-6 text-slate-900">Why Us</h3>
          {reasons.map((r) => { const I = r.icon; return (
            <div key={r.title} className="rounded-xl border border-black/5 bg-white p-4 mb-3 shadow-sm">
              <div className="flex items-center gap-3"><I className="text-blue-600" size={20} /><h4 className="font-bold text-slate-900">{r.title}</h4></div>
              <p className="text-slate-600 text-sm mt-1">{r.desc}</p>
            </div>
          ); })}
        </section>
        <section className="px-6 py-16 text-center">
          <h2 className="text-3xl font-black mb-4 text-slate-900">Ready to Ascend?</h2>
          <Link href="/register" className="inline-block px-8 py-3 rounded-full bg-slate-900 text-white font-bold">Get Started</Link>
        </section>
        <footer className="border-t border-black/5 px-6 py-6 text-center text-slate-400 text-xs">&copy; 2026 Everest Pay</footer>
      </main>
    );
  }

  // Desktop: Full 3D cinematic experience
  return (
    <main className="w-full h-screen bg-[#f8fafc] overflow-hidden">
      <Suspense fallback={<Loader />}>
        <Canvas dpr={[1, 1.5]} camera={{ position: [0, 2, 22], fov: 50 }} shadows>
          <ScrollControls pages={5} damping={0.18} distance={1.2}>
            <Scene3D />
            <HTMLContent />
          </ScrollControls>
        </Canvas>
      </Suspense>
    </main>
  );
}
