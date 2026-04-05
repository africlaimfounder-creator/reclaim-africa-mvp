import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Landing = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: '#0A0908' }}
    >
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1761437856554-3072a8143bc3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njd8MHwxfHNlYXJjaHwyfHxibGFjayUyMGFuZCUyMGdvbGQlMjBsdXh1cnklMjBhYnN0cmFjdCUyMGJhY2tncm91bmR8ZW58MHx8fHwxNzc1NDIxMjUxfDA&ixlib=rb-4.1.0&q=85)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.2
        }}
      />
      <div
        className="absolute inset-0 z-10"
        style={{
          background: 'linear-gradient(to top, #0A0908, rgba(10, 9, 8, 0.8), transparent)'
        }}
      />

      <div className="relative z-20 max-w-4xl mx-auto px-6 text-left">
        <div className="mb-8 flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ backgroundColor: '#D4AF37' }}
          >
            <span className="text-[#0A0908] font-bold text-2xl" style={{ fontFamily: 'Outfit, sans-serif' }}>
              RA
            </span>
          </div>
        </div>

        <h1
          className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
          style={{ fontFamily: 'Outfit, sans-serif' }}
          data-testid="landing-title"
        >
          Reclaim Africa
        </h1>

        <p
          className="text-xl sm:text-2xl mb-4"
          style={{ color: '#D4AF37', fontFamily: 'JetBrains Mono, monospace' }}
          data-testid="landing-tagline"
        >
          We only get paid when you get paid.
        </p>

        <p className="text-lg text-[#A3A099] mb-12 max-w-2xl" style={{ fontFamily: 'Manrope, sans-serif' }}>
          Discover and recover your forgotten financial assets in Nigeria. From unclaimed dividends to dormant accounts, we help you reclaim what's rightfully yours.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/signup"
            className="px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(212,175,55,0.5)] active:scale-95 flex items-center justify-center gap-2"
            style={{
              backgroundColor: '#D4AF37',
              color: '#0A0908',
              fontFamily: 'Manrope, sans-serif'
            }}
            data-testid="create-account-btn"
          >
            Create Account
            <ArrowRight size={20} />
          </Link>
          <Link
            to="/login"
            className="px-8 py-4 rounded-xl font-semibold text-lg border-2 transition-all duration-300 hover:bg-[#D4AF37] hover:text-[#0A0908] active:scale-95 flex items-center justify-center gap-2"
            style={{
              backgroundColor: 'transparent',
              color: '#D4AF37',
              borderColor: '#D4AF37',
              fontFamily: 'Manrope, sans-serif'
            }}
            data-testid="login-btn"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;
