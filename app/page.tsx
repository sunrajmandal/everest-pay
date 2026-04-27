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
        <meshStandardMaterial color="#0f0a24" roughness={0.85} flatShading />
      </mesh>
      {/* Snow cap */}
      <mesh geometry={snowGeo} position={[0, 7.5, 0]} rotation={[0, Math.PI / 5, 0]}>
        <meshStandardMaterial color="#e0e7ff" roughness={0.3} flatShading />
      </mesh>
      {/* Left ridge */}
      <mesh position={[-12, -3, 4]} rotation={[0, 0.3, 0]}>
        <coneGeometry args={[6, 16, 6, 8]} />
        <meshStandardMaterial color="#030014" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[-12, 4, 4]}>
        <coneGeometry args={[2.5, 5, 6]} />
        <meshStandardMaterial color="#c7d2fe" roughness={0.4} flatShading />
      </mesh>
      {/* Right ridge */}
      <mesh position={[11, -4, 2]} rotation={[0, -0.4, 0]}>
        <coneGeometry args={[7, 14, 5, 8]} />
        <meshStandardMaterial color="#0f0a24" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[11, 3.5, 2]}>
        <coneGeometry args={[2.8, 4.5, 5]} />
        <meshStandardMaterial color="#a5b4fc" roughness={0.4} flatShading />
      </mesh>
      {/* Far background peaks */}
      <mesh position={[-22, -6, -10]}>
        <coneGeometry args={[10, 18, 5]} />
        <meshStandardMaterial color="#030014" roughness={1} flatShading />
      </mesh>
      <mesh position={[20, -7, -12]}>
        <coneGeometry args={[9, 15, 5]} />
        <meshStandardMaterial color="#030014" roughness={1} flatShading />
      </mesh>
      {/* Ground plane */}
      <mesh position={[0, -11, 5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[80, 60]} />
        <meshStandardMaterial color="#030014" roughness={1} />
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

    // Sunrise: Deep Purple → Electric Cyan
    if (sunRef.current) {
      sunRef.current.intensity = 1.5 + t * 3;
      const c = new THREE.Color().lerpColors(
        new THREE.Color('#6366f1'), // Indigo
        new THREE.Color('#22d3ee'), // Cyan
        t
      );
      sunRef.current.color = c;
      sunRef.current.position.y = THREE.MathUtils.lerp(8, 35, t);
    }
  });

  return (
    <>
      <ambientLight intensity={0.25} />
      <directionalLight ref={sunRef} position={[15, 8, -10]} intensity={1.5} color="#6366f1" castShadow />
      <pointLight position={[-8, 5, 10]} intensity={0.4} color="#4f46e5" />
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
          <meshPhysicalMaterial color="#05001a" metalness={0.85} roughness={0.12} clearcoat={1} />
        </RoundedBox>
        <RoundedBox args={[0.35, 0.28, 0.05]} radius={0.04} position={[-1.1, 0.4, 0]}>
          <meshStandardMaterial color="#4f46e5" metalness={1} roughness={0.3} />
        </RoundedBox>
        <Text position={[-0.5, 0.65, 0.025]} fontSize={0.18} color="#fff" anchorX="left">✦ Everest Pay</Text>
        <Text position={[-1.1, -0.15, 0.025]} fontSize={0.14} color="#a5b4fc" anchorX="left" letterSpacing={0.12}>•••• •••• •••• 2026</Text>
        <Text position={[-1.1, -0.5, 0.025]} fontSize={0.1} color="#818cf8" anchorX="left">PREMIUM MEMBER</Text>
        <Text position={[0.9, -0.7, 0.025]} fontSize={0.1} color="#818cf8" anchorX="left">12/30</Text>
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
      <fogExp2 ref={fogRef} attach="fog" args={['#030014', 0.035]} />
      <Stars radius={120} depth={60} count={2500} factor={4} saturation={0.5} fade speed={0.8} />
      <Sparkles count={500} scale={50} size={1.8} speed={0.3} opacity={0.5} color="#fff" position={[0, 10, -5]} />
      <Sparkles count={200} scale={30} size={3} speed={0.15} opacity={0.3} color="#22d3ee" position={[0, 20, -10]} />
      <Cloud position={[-10, 4, -8]} speed={0.15} opacity={0.4} color="#1e1b4b" />
      <Cloud position={[10, 6, -5]} speed={0.1} opacity={0.35} color="#1e1b4b" />
      <Cloud position={[0, 8, -15]} speed={0.2} opacity={0.25} color="#312e81" />
      <Cloud position={[-5, 12, -20]} speed={0.12} opacity={0.2} color="#4338ca" />
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
      <Environment preset="night" />
    </>
  );
}

/* ── HTML OVERLAY INSIDE DREI SCROLL ── */
function HTMLContent() {
  return (
    <Scroll html style={{ width: '100%' }}>
      {/* ─── NAVBAR ─── */}
      <header className="fixed top-0 w-full z-50 backdrop-blur-xl bg-black/30 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-white tracking-wider">✦ Everest Pay</Link>
          <nav className="hidden md:flex gap-8 text-sm text-white/70 font-medium">
            <a href="#services" className="hover:text-white transition">Services</a>
            <a href="#why" className="hover:text-white transition">Why Us</a>
          </nav>
          <Link href="/login" className="px-5 py-2 rounded-full bg-white/10 border border-white/15 text-white text-sm font-medium hover:bg-white/20 transition backdrop-blur-md">Login</Link>
        </div>
      </header>

      {/* ─── PAGE 1: HERO ─── */}
      <div className="h-screen w-full flex items-center justify-center px-6 pointer-events-none">
        <div className="max-w-4xl text-center pointer-events-auto">
          <span className="px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold tracking-widest uppercase shadow-[0_0_20px_rgba(99,102,241,0.15)]">Nepal&apos;s Premium Fintech</span>
          <h1 className="mt-8 text-5xl sm:text-6xl md:text-8xl font-black text-white leading-[1.1] drop-shadow-2xl">Rise Above<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-300 to-white">Ordinary Payments</span></h1>
          <p className="mt-6 text-lg text-white/60 max-w-xl mx-auto">Fast, secure, and trusted payments for subscriptions, gaming top-ups, wallets and premium digital services.</p>
          <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
            <Link href="/services" className="px-8 py-4 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-bold hover:scale-105 transition-transform shadow-[0_8px_30px_rgba(79,70,229,0.4)] flex items-center gap-2">Explore Services <ArrowRight size={18} /></Link>
            <Link href="/register" className="px-8 py-4 rounded-full border border-white/20 text-white font-bold hover:bg-white/10 transition backdrop-blur-md">Get Started</Link>
          </div>
          <div className="mt-16 flex items-center justify-center gap-2 animate-bounce opacity-50">
            <span className="text-xs text-white uppercase tracking-[0.3em]">Scroll to Ascend</span>
          </div>
        </div>
      </div>

      {/* ─── PAGE 2: CINEMATIC TRANSITION ─── */}
      <div className="h-screen w-full flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <p className="text-3xl md:text-5xl font-bold text-white/90 drop-shadow-xl">Trusted by thousands<br /><span className="text-indigo-400">across Nepal</span></p>
        </div>
      </div>

      {/* ─── PAGE 3: STATS + WHY US ─── */}
      <div id="why" className="min-h-screen w-full flex flex-col items-center justify-center px-6 py-20 pointer-events-none">
        <div className="max-w-6xl w-full pointer-events-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-24">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 text-center shadow-xl">
                <div className="text-3xl font-black text-indigo-400 drop-shadow-[0_0_12px_rgba(99,102,241,0.5)]">{s.value}</div>
                <div className="mt-2 text-white/60 text-sm font-medium">{s.label}</div>
              </div>
            ))}
          </div>
          <h3 className="text-3xl md:text-4xl font-black text-white text-center mb-12">Why Choose Everest Pay</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {reasons.map((r) => {
              const Icon = r.icon;
              return (
                <div key={r.title} className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 hover:bg-white/10 transition group">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/15 flex items-center justify-center mb-4 group-hover:scale-110 transition"><Icon className="text-indigo-400" size={24} /></div>
                  <h4 className="text-xl font-bold text-white mb-1">{r.title}</h4>
                  <p className="text-white/60 text-sm">{r.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── PAGE 4: SERVICES ─── */}
      <div id="services" className="min-h-screen w-full flex flex-col items-center justify-center px-6 py-20 pointer-events-none">
        <div className="max-w-6xl w-full pointer-events-auto">
          <h3 className="text-3xl md:text-4xl font-black text-white text-center mb-4">Premium Services</h3>
          <p className="text-white/60 text-center mb-12">Instant access to global digital platforms.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceList.map((name) => (
              <div key={name} className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 hover:border-indigo-500/40 hover:bg-white/10 transition group shadow-xl">
                <Gamepad2 className="text-indigo-400 mb-4 group-hover:scale-110 transition" />
                <h4 className="text-xl font-bold text-white mb-1">{name}</h4>
                <p className="text-white/50 text-sm mb-4">Secure checkout &amp; instant delivery.</p>
                <Link href="/services" className="inline-flex items-center gap-1 text-indigo-400 text-sm font-semibold hover:gap-2 transition-all">Buy Now <ArrowRight size={14} /></Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── PAGE 5: SUMMIT CTA + FOOTER ─── */}
      <div className="h-screen w-full flex flex-col items-center justify-center px-6 pointer-events-none">
        <div className="max-w-3xl text-center pointer-events-auto mb-32">
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-white drop-shadow-2xl mb-6">You&apos;ve Reached<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-300">The Summit</span></h2>
          <p className="text-lg text-white/70 mb-10">Join thousands of premium members across Nepal.</p>
          <Link href="/register" className="inline-flex items-center gap-2 px-10 py-5 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-bold text-lg hover:scale-105 transition-transform shadow-[0_12px_40px_rgba(34,211,238,0.4)]">Start with Everest Pay <ArrowRight size={20} /></Link>
        </div>
        <footer className="absolute bottom-0 w-full border-t border-white/10 py-6 pointer-events-auto">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/40 text-sm">&copy; 2026 Everest Pay. All rights reserved.</p>
            <div className="flex gap-6 text-sm text-white/40">
              <Link href="/terms" className="hover:text-white transition">Terms</Link>
              <Link href="/privacy" className="hover:text-white transition">Privacy</Link>
              <Link href="/support" className="hover:text-white transition">Support</Link>
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
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#030014] text-white">
      <div className="w-14 h-14 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4" />
      <p className="text-sm text-white/50 animate-pulse tracking-widest uppercase">Loading Experience</p>
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
      <main className="min-h-screen bg-[#030014] text-white">
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <span className="text-lg font-bold">✦ Everest Pay</span>
            <Link href="/login" className="px-4 py-2 rounded-full bg-white/10 border border-white/15 text-sm">Login</Link>
          </div>
        </header>
        <section className="px-6 pt-20 pb-16 text-center">
          <h1 className="text-4xl font-black leading-tight">Rise Above<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300">Ordinary Payments</span></h1>
          <p className="mt-4 text-white/60">Fast, secure digital services in Nepal.</p>
          <div className="mt-8 flex flex-col gap-3">
            <Link href="/services" className="px-6 py-3 rounded-full bg-indigo-600 text-white font-bold text-center">Explore Services</Link>
            <Link href="/register" className="px-6 py-3 rounded-full border border-white/20 font-bold text-center">Get Started</Link>
          </div>
        </section>
        <section className="px-6 py-12">
          <div className="grid grid-cols-2 gap-3">
            {stats.map((s) => (
              <div key={s.label} className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
                <div className="text-2xl font-black text-indigo-400">{s.value}</div>
                <div className="text-xs text-white/50 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </section>
        <section className="px-6 py-12">
          <h3 className="text-2xl font-bold mb-6">Services</h3>
          <div className="grid grid-cols-2 gap-3">
            {serviceList.map((n) => (
              <Link key={n} href="/services" className="rounded-xl border border-white/10 bg-white/5 p-4 text-center hover:bg-white/10 transition">
                <Gamepad2 className="text-indigo-400 mx-auto mb-2" size={20} />
                <span className="text-sm font-semibold">{n}</span>
              </Link>
            ))}
          </div>
        </section>
        <section className="px-6 py-12">
          <h3 className="text-2xl font-bold mb-6">Why Us</h3>
          {reasons.map((r) => { const I = r.icon; return (
            <div key={r.title} className="rounded-xl border border-white/10 bg-white/5 p-4 mb-3">
              <div className="flex items-center gap-3"><I className="text-indigo-400" size={20} /><h4 className="font-bold">{r.title}</h4></div>
              <p className="text-white/50 text-sm mt-1">{r.desc}</p>
            </div>
          ); })}
        </section>
        <section className="px-6 py-16 text-center">
          <h2 className="text-3xl font-black mb-4">Start Your Journey</h2>
          <Link href="/register" className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-bold">Get Started</Link>
        </section>
        <footer className="border-t border-white/10 px-6 py-6 text-center text-white/30 text-xs">&copy; 2026 Everest Pay</footer>
      </main>
    );
  }

  // Desktop: Full 3D cinematic experience
  return (
    <main className="w-full h-screen bg-[#030014] overflow-hidden">
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
