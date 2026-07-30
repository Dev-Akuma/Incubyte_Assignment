import React from 'react';
import { Link } from 'react-router-dom';
import PillNav from './PillNav';

const LandingPage: React.FC = () => {
  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Features', href: '#features' },
    { label: 'Integrations', href: '#integrations' },
    { label: 'Pricing', href: '#pricing' }
  ];

  return (
    <div className="min-h-screen bg-[#0d0f14] text-white flex flex-col font-sans relative overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[500px] bg-gradient-to-b from-[rgba(112,0,255,0.1)] to-transparent blur-[100px] pointer-events-none -z-10" />

      {/* Navigation */}
      <div className="w-full flex justify-center pt-6 z-50">
        <PillNav
          items={navItems}
          activeHref="/"
          baseColor="#1a1c23"
          pillColor="#2d303a"
          hoveredPillTextColor="#ffffff"
          pillTextColor="#a0a0ab"
        />
        <div className="absolute top-8 right-8 z-50 hidden md:block">
          <Link to="/login" className="bg-white text-black px-6 py-2 rounded-full font-medium hover:bg-gray-200 transition-colors">
            Login
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 text-center mt-32 mb-20 z-10">
        <div className="inline-flex items-center gap-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-full px-4 py-1.5 mb-8">
          <span className="text-[#a0a0ab] text-sm font-medium">✨ Get Started</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl leading-tight">
          Ready to Take Control <br /> of Your Workflow?
        </h1>
        
        <p className="text-[#a0a0ab] text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
          Say goodbye to scattered tasks, missed deadlines, and team confusion. Start organizing, prioritizing, and delivering with ease — all in one place.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/register" className="bg-[#5a4aff] hover:bg-[#4a3aef] text-white px-8 py-3.5 rounded-lg font-medium transition-all shadow-[0_0_20px_rgba(90,74,255,0.3)]">
            Start for Free
          </Link>
          <a href="#demo" className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.1)] text-white px-8 py-3.5 rounded-lg font-medium transition-all">
            Try Demo &rsaquo;
          </a>
        </div>
      </main>

      {/* Bento Grid Features */}
      <section id="features" className="max-w-6xl mx-auto px-4 py-20 w-full z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-[#14161c] border border-[rgba(255,255,255,0.05)] rounded-2xl p-8 relative overflow-hidden group hover:border-[rgba(255,255,255,0.1)] transition-colors">
            <div className="absolute inset-0 bg-gradient-to-br from-[rgba(112,0,255,0.05)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <h3 className="text-2xl font-bold mb-2">Automated Workflows</h3>
            <p className="text-[#a0a0ab]">Turn repeated tasks into flows that run themselves.</p>
            <div className="mt-8 h-48 bg-[#0d0f14] rounded-xl border border-[rgba(255,255,255,0.05)] relative overflow-hidden">
               {/* Mock flowchart lines */}
               <div className="absolute top-1/2 left-1/4 w-1/2 h-0.5 bg-[rgba(255,255,255,0.1)]" />
               <div className="absolute top-1/4 left-1/4 w-8 h-8 rounded bg-[#1a1c23] border border-[rgba(255,255,255,0.1)] shadow-[0_0_15px_rgba(255,255,255,0.05)]" />
               <div className="absolute bottom-1/4 right-1/4 w-8 h-8 rounded bg-[#1a1c23] border border-[rgba(255,255,255,0.1)] shadow-[0_0_15px_rgba(255,255,255,0.05)]" />
            </div>
          </div>
          
          <div className="bg-[#14161c] border border-[rgba(255,255,255,0.05)] rounded-2xl p-8 relative overflow-hidden group hover:border-[rgba(255,255,255,0.1)] transition-colors">
             <h3 className="text-2xl font-bold mb-2">Real-time Analytics</h3>
             <p className="text-[#a0a0ab]">Track your team's velocity.</p>
             <div className="mt-8 h-48 bg-[#0d0f14] rounded-xl border border-[rgba(255,255,255,0.05)] p-4 flex items-end justify-between gap-2">
                {[40, 70, 45, 90, 60, 100, 80].map((h, i) => (
                  <div key={i} className="w-full bg-gradient-to-t from-[#5a4aff] to-[#7000ff] rounded-t-sm opacity-80" style={{ height: `${h}%` }} />
                ))}
             </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-[rgba(255,255,255,0.05)] bg-[#0d0f14] pt-16 pb-8 z-10">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-[#5a4aff]">✦</span> Auto-AI
            </h4>
            <p className="text-[#a0a0ab] text-sm leading-relaxed">
              Your all-in-one task management solution — helping teams stay organized, collaborate in real time, and get more done.
            </p>
          </div>
          
          <div>
            <h5 className="font-semibold mb-4">Product</h5>
            <ul className="space-y-3 text-sm text-[#a0a0ab]">
              <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold mb-4">Company</h5>
            <ul className="space-y-3 text-sm text-[#a0a0ab]">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold mb-4">Resources</h5>
            <ul className="space-y-3 text-sm text-[#a0a0ab]">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API Docs</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 pt-8 border-t border-[rgba(255,255,255,0.05)] flex flex-col md:flex-row justify-between items-center text-[#a0a0ab] text-xs">
          <div className="flex gap-4 mb-4 md:mb-0">
            <div className="w-8 h-8 rounded-full bg-[rgba(255,255,255,0.05)] flex items-center justify-center hover:bg-[rgba(255,255,255,0.1)] cursor-pointer transition-colors">IG</div>
            <div className="w-8 h-8 rounded-full bg-[rgba(255,255,255,0.05)] flex items-center justify-center hover:bg-[rgba(255,255,255,0.1)] cursor-pointer transition-colors">TW</div>
            <div className="w-8 h-8 rounded-full bg-[rgba(255,255,255,0.05)] flex items-center justify-center hover:bg-[rgba(255,255,255,0.1)] cursor-pointer transition-colors">IN</div>
          </div>
          <p>Copyright © 2024 Auto-AI. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
