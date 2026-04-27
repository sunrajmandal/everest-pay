'use client';

import React, { useEffect, useState, useRef, Suspense } from 'react';
import Link from 'next/link';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, ContactShadows, Sparkles, Cloud, RoundedBox, Text } from '@react-three/drei';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import * as THREE from 'three';

// --- Types ---
interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
  category: string;
}

// --- 3D Components ---

function PaymentCard() {
  const cardRef = useRef<THREE.Group>(null);
  const [flipped, setFlipped] = useState(false);
  
  useFrame((state) => {
    if (cardRef.current) {
      const baseRotY = Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
      const baseRotX = Math.cos(state.clock.elapsedTime * 0.2) * 0.1;
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const scrollRotation = scrollY * 0.005; 
      const mouseX = (state.mouse.x * Math.PI) / 8;
      const mouseY = (state.mouse.y * Math.PI) / 8;
      const flipRotation = flipped ? Math.PI : 0;
      
      const targetY = baseRotY + scrollRotation + flipRotation + mouseX;
      const targetX = baseRotX + (scrollY * 0.001) - mouseY;
      
      cardRef.current.rotation.y = THREE.MathUtils.lerp(cardRef.current.rotation.y, targetY, 0.08);
      cardRef.current.rotation.x = THREE.MathUtils.lerp(cardRef.current.rotation.x, targetX, 0.08);
      cardRef.current.position.y = THREE.MathUtils.lerp(cardRef.current.position.y, -(scrollY * 0.002), 0.1);
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={1.5}>
      <group 
        ref={cardRef} 
        rotation={[0.2, Math.PI / 6, 0]} 
        position={[0, 0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          setFlipped(!flipped);
        }}
        onPointerOver={() => document.body.style.cursor = 'pointer'}
        onPointerOut={() => document.body.style.cursor = 'auto'}
      >
        {/* --- FRONT OF CARD --- */}
        <RoundedBox args={[3.4, 2.1, 0.05]} radius={0.1} smoothness={4}>
          <meshPhysicalMaterial 
            color="#ffffff" 
            metalness={0.1} 
            roughness={0.1} 
            clearcoat={1} 
            clearcoatRoughness={0.1}
          />
        </RoundedBox>
        {/* Chip */}
        <RoundedBox args={[0.4, 0.3, 0.06]} radius={0.05} position={[-1.2, 0.4, 0]}>
          <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.3} />
        </RoundedBox>
        {/* Contactless Icon */}
        <Text position={[1.2, 0.4, 0.03]} fontSize={0.15} color="#333" fillOpacity={0.5}>
          )))
        </Text>
        {/* Card Number */}
        <Text position={[0, -0.2, 0.03]} fontSize={0.2} color="#333" letterSpacing={0.1}>
          **** **** **** 2026
        </Text>
        {/* Brand */}
        <Text position={[-0.7, 0.7, 0.03]} fontSize={0.25} color="#3b82f6" outlineWidth={0.005} outlineColor="#3b82f6">
          ✦ Everest Pay
        </Text>
        {/* Card holder */}
        <Text position={[-1.0, -0.6, 0.03]} fontSize={0.12} color="#666" letterSpacing={0.05}>
          PREMIUM MEMBER
        </Text>

        {/* --- BACK OF CARD --- */}
        {/* Magnetic Strip */}
        <RoundedBox args={[3.4, 0.4, 0.06]} radius={0} position={[0, 0.5, -0.01]}>
          <meshStandardMaterial color="#222" roughness={0.8} />
        </RoundedBox>
        {/* Signature Box */}
        <RoundedBox args={[2.2, 0.3, 0.06]} radius={0.05} position={[-0.4, 0, -0.01]}>
          <meshStandardMaterial color="#f0f0f0" roughness={0.9} />
        </RoundedBox>
        <Text position={[-0.4, 0, -0.04]} rotation={[0, Math.PI, 0]} fontSize={0.15} color="#000" fontStyle="italic">
          Authorized Signature
        </Text>
        {/* CVV Box */}
        <RoundedBox args={[0.6, 0.3, 0.06]} radius={0.05} position={[1.1, 0, -0.01]}>
          <meshStandardMaterial color="#ddd" />
        </RoundedBox>
        <Text position={[1.1, 0, -0.04]} rotation={[0, Math.PI, 0]} fontSize={0.15} color="#000">
          123
        </Text>
        <Text position={[0, -0.7, -0.03]} rotation={[0, Math.PI, 0]} fontSize={0.08} color="#666">
          Issued by Everest Pay Nepal. If found, please return to any branch.
        </Text>
      </group>
    </Float>
  );
}

function MountEverest() {
  return (
    <group position={[0, -4, -15]} scale={1.2}>
      {/* Main Base Mountain (Everest) */}
      <mesh position={[0, 0, 0]} rotation={[0, Math.PI / 6, 0]}>
        <coneGeometry args={[6, 14, 5]} />
        <meshStandardMaterial color="#64748b" roughness={0.9} />
      </mesh>
      {/* Snow Cap Everest */}
      <mesh position={[0, 5.01, 0]} rotation={[0, Math.PI / 6, 0]}>
        <coneGeometry args={[2.14, 5, 5]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} />
      </mesh>

      {/* Lhotse (Side Peak Left) */}
      <mesh position={[-5, -2, 2]} rotation={[0, 0, 0]}>
        <coneGeometry args={[4, 9, 4]} />
        <meshStandardMaterial color="#475569" roughness={0.9} />
      </mesh>
      {/* Snow Cap Lhotse */}
      <mesh position={[-5, 1.51, 2]} rotation={[0, 0, 0]}>
        <coneGeometry args={[1.56, 3.5, 4]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.2} />
      </mesh>

      {/* Nuptse (Side Peak Right) */}
      <mesh position={[5, -3, 1]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[4.5, 8, 5]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.9} />
      </mesh>
      {/* Snow Cap Nuptse */}
      <mesh position={[5, 0.51, 1]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[1.68, 3, 5]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.2} />
      </mesh>
      
      {/* Clouds wrapping around the peaks */}
      <Cloud position={[-3, 2, 4]} speed={0.1} opacity={0.4} color="#ffffff" />
      <Cloud position={[4, 1, 3]} speed={0.15} opacity={0.3} color="#ffffff" />
      <Cloud position={[0, 0, 6]} speed={0.05} opacity={0.5} color="#e2e8f0" />
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={1.5} color="#ffffff" />
      <pointLight position={[0, -2, -10]} intensity={1} color="#d4af37" distance={20} />
      <pointLight position={[-5, 2, -2]} intensity={1.5} color="#3b82f6" distance={10} />
      
      <Sparkles count={100} scale={15} size={2} speed={0.3} opacity={0.5} color="#3b82f6" />
      
      <MountEverest />
      <PaymentCard />
      
      <Environment preset="city" />
      <ContactShadows position={[0, -2.5, 0]} opacity={0.2} scale={15} blur={2.5} far={4} color="#000" />
      
      <fog attach="fog" args={['#faf9f6', 10, 40]} />
    </>
  );
}

// --- UI Helpers ---

const TiltCard = ({ children, className }: any) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-10, 10]);

  function handleMouse(event: any) {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
      style={{ rotateY, rotateX, transformStyle: "preserve-3d" }}
      className={`relative ${className}`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 hover:from-blue-500/5 hover:to-transparent rounded-2xl transition-all duration-500 z-0 pointer-events-none" />
      <div style={{ transform: "translateZ(30px)" }} className="relative z-10 h-full">
        {children}
      </div>
    </motion.div>
  );
};

const Counter = ({ value, label }: { value: string, label: string }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white/60 backdrop-blur-md rounded-2xl border border-black/5 shadow-sm hover:shadow-md transition-shadow">
      <motion.h3 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 mb-2"
      >
        {value}
      </motion.h3>
      <p className="text-blue-500 font-bold tracking-wide uppercase text-sm">{label}</p>
    </div>
  );
};

// --- Main Page Component ---

export default function PremiumHomePage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(data => { 
        if (Array.isArray(data)) {
          setServices(data.slice(0, 8)); 
        } else {
          setServices([]);
        }
        setLoaded(true); 
      })
      .catch(() => setLoaded(true));
  }, []);

  return (
    <div className="min-h-screen bg-[#faf9f6] text-gray-900 selection:bg-blue-500/30 overflow-x-hidden font-sans">
      {/* --- Ambient Background Glows --- */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-yellow-400/20 rounded-full blur-[120px] pointer-events-none" />
      
      {/* --- Navigation --- */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-white/70 border-b border-black/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <motion.span 
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-2xl text-blue-500"
            >
              ✦
            </motion.span>
            <span className="text-xl font-bold tracking-wide text-gray-900">
              Everest <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-700">Pay</span>
            </span>
          </Link>
          <div className="flex items-center gap-8">
            <Link href="/services" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors">
              Services
            </Link>
            <Link href="/services" className="relative group overflow-hidden rounded-full p-[1px]">
              <span className="absolute inset-0 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 opacity-70 group-hover:opacity-100 transition-opacity animate-[spin_4s_linear_infinite]" />
              <div className="relative px-6 py-2.5 bg-white rounded-full text-sm font-bold group-hover:bg-opacity-90 transition-all duration-300 text-gray-900 shadow-sm">
                Get Started
              </div>
            </Link>
          </div>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <section className="relative h-screen w-full flex items-center justify-center pt-20">
        <div className="absolute inset-0 z-0 opacity-80 mix-blend-multiply pointer-events-none">
          <Suspense fallback={<div className="w-full h-full bg-[#faf9f6]" />}>
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
              <Scene />
            </Canvas>
          </Suspense>
        </div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6 pointer-events-none">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold mb-8 border border-black/10 bg-white/60 backdrop-blur-md shadow-sm"
          >
            <span className="text-yellow-500">⚡</span> The Future of Digital Subscriptions in Nepal
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 text-gray-900"
          >
            Nepal's Smartest <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-gray-800">
              Digital Payment Platform
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto font-medium"
          >
            Premium subscriptions at your fingertips. Instant delivery, secure payments, and 24/7 support—built for Nepal.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex items-center justify-center gap-4 pointer-events-auto"
          >
            <Link href="/services" className="px-8 py-4 bg-gray-900 text-white rounded-full font-bold hover:bg-blue-600 hover:scale-105 transition-all shadow-[0_10px_30px_rgba(59,130,246,0.3)]">
              Explore Services
            </Link>
            <a href="#how-it-works" className="px-8 py-4 rounded-full font-bold text-gray-900 border border-gray-300 hover:bg-black/5 transition-all backdrop-blur-sm">
              How It Works
            </a>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-gray-500 font-bold tracking-widest uppercase">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-gray-400 to-transparent" />
        </motion.div>
      </section>

      {/* --- Trust Stats --- */}
      <section className="py-20 relative z-10 border-y border-black/5 bg-white/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Counter value="10k+" label="Active Users" />
            <Counter value="5min" label="Avg. Delivery" />
            <Counter value="100%" label="Secure Pay" />
            <Counter value="24/7" label="Support" />
          </div>
        </div>
      </section>

      {/* --- Services Grid --- */}
      <section className="py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-900"
            >
              Premium Services
            </motion.h2>
            <p className="text-gray-600 font-medium text-lg">Instant access to global platforms.</p>
          </div>

          {!loaded ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service, idx) => (
                <TiltCard key={service.id} className="h-full">
                  <Link href={`/checkout/${service.id}`} className="block h-full bg-white border border-black/5 shadow-sm rounded-2xl p-6 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/10 transition-all group">
                    <div className="text-5xl mb-6 transform group-hover:scale-110 group-hover:-translate-y-2 transition-transform duration-300 drop-shadow-sm">
                      {service.icon}
                    </div>
                    <h3 className="text-xl font-extrabold text-gray-900 mb-2">{service.name}</h3>
                    <p className="text-sm text-gray-600 mb-8 line-clamp-2 font-medium">{service.description}</p>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-black/5">
                      <span className="text-lg font-bold text-gray-900">
                        <span className="text-xs text-blue-500 mr-1 font-bold">NPR</span>
                        {service.price}
                      </span>
                      <span className="text-blue-600 opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all font-bold">
                        Buy →
                      </span>
                    </div>
                  </Link>
                </TiltCard>
              ))}
            </div>
          )}
          
          <div className="text-center mt-16">
            <Link href="/services" className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-gray-300 bg-white hover:bg-gray-50 transition-colors text-sm font-bold shadow-sm">
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* --- How It Works --- */}
      <section id="how-it-works" className="py-32 bg-white relative z-10 border-y border-black/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-900">How It Works</h2>
            <p className="text-gray-600 font-medium text-lg">Seamless experience from start to finish.</p>
          </div>

          <div className="relative">
            {/* Connecting Line */}
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-200 to-transparent hidden md:block -translate-y-1/2" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
              {[
                { num: '01', title: 'Choose Service', desc: 'Select from our wide range of premium global subscriptions.' },
                { num: '02', title: 'Pay Securely', desc: 'Complete payment using eSewa, Khalti, or Bank Transfer.' },
                { num: '03', title: 'Get Delivered', desc: 'Receive your credentials instantly via email & WhatsApp.' }
              ].map((step, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-20 h-20 rounded-full bg-white border-2 border-blue-100 flex items-center justify-center text-2xl font-black text-blue-500 mb-6 shadow-lg shadow-blue-500/10">
                    {step.num}
                  </div>
                  <h3 className="text-2xl font-extrabold mb-4 text-gray-900">{step.title}</h3>
                  <p className="text-gray-600 font-medium leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- Testimonials --- */}
      <section className="py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-900">Trusted by Thousands</h2>
            <p className="text-gray-600 font-medium text-lg">See what our premium members have to say.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Anish Shrestha', initial: 'A', text: 'Flawless experience. Got my Netflix account instantly. The 3D UI on this site is insane btw.' },
              { name: 'Priya Thapa', initial: 'P', text: 'Best customer service ever. They helped me set up Spotify family in minutes.' },
              { name: 'Rohan Gurung', initial: 'R', text: 'Secure, fast, and very premium feel. Used eSewa and it worked like a charm.' }
            ].map((review, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-gray-200 shadow-sm rounded-2xl p-8 relative overflow-hidden"
              >
                <div className="absolute top-4 right-4 text-blue-100 text-6xl font-serif">"</div>
                <div className="flex gap-1 mb-6 text-yellow-400 text-sm">
                  ★★★★★
                </div>
                <p className="text-gray-700 font-medium mb-8 relative z-10 italic">"{review.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center font-bold text-white shadow-md">
                    {review.initial}
                  </div>
                  <span className="font-bold text-gray-900">{review.name}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-white pt-24 pb-12 border-t border-gray-200 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-6">
                <span className="text-2xl text-blue-600">✦</span>
                <span className="text-xl font-black text-gray-900">Everest Pay</span>
              </Link>
              <p className="text-gray-600 font-medium text-sm leading-relaxed">
                The most secure and premium subscription platform in Nepal. Trusted by thousands.
              </p>
            </div>
            
            <div>
              <h4 className="text-gray-900 font-bold mb-6">Quick Links</h4>
              <ul className="space-y-3">
                <li><Link href="/" className="text-sm font-medium text-gray-500 hover:text-blue-600 hover:translate-x-1 inline-block transition-transform">Home</Link></li>
                <li><Link href="/services" className="text-sm font-medium text-gray-500 hover:text-blue-600 hover:translate-x-1 inline-block transition-transform">Services</Link></li>
                <li><Link href="/services" className="text-sm font-medium text-gray-500 hover:text-blue-600 hover:translate-x-1 inline-block transition-transform">Pricing</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-gray-900 font-bold mb-6">Support</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm font-medium text-gray-500 hover:text-blue-600 hover:translate-x-1 inline-block transition-transform">FAQ</a></li>
                <li><a href="#" className="text-sm font-medium text-gray-500 hover:text-blue-600 hover:translate-x-1 inline-block transition-transform">Contact Us</a></li>
                <li><a href="#" className="text-sm font-medium text-gray-500 hover:text-blue-600 hover:translate-x-1 inline-block transition-transform">Terms of Service</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-gray-900 font-bold mb-6">Secure Payments</h4>
              <div className="flex flex-wrap gap-3">
                <div className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-xs font-bold text-green-600 shadow-sm">eSewa</div>
                <div className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-xs font-bold text-purple-600 shadow-sm">Khalti</div>
                <div className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-xs font-bold text-blue-600 shadow-sm">VISA</div>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-200 text-center flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 font-medium text-sm">© 2026 Everest Pay. All rights reserved.</p>
            <p className="text-gray-500 font-medium text-sm flex items-center gap-2">
              Made with <span className="text-red-500">❤️</span> in Nepal
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
