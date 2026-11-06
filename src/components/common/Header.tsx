import React, { useState } from 'react';
import { ShoppingBag, Search, Clock, Phone, MapPin, ShieldCheck, User, Menu as MenuIcon, X } from 'lucide-react';
import { BusinessSettings } from '../../types';

interface HeaderProps {
  settings: BusinessSettings;
  cartCount: number;
  onOpenCart: () => void;
  onNavigate: (view: 'home' | 'menu' | 'gifting' | 'story' | 'contact' | 'admin' | 'tracking') => void;
  currentView: string;
  onOpenSearch: () => void;
  onOpenCustomerAuth: () => void;
  customerName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  cartCount,
  onOpenCart,
  onNavigate,
  currentView,
  onOpenSearch,
  onOpenCustomerAuth,
  customerName
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8DDCD] transition-all">
      {/* Top Announcement Bar */}
      <div className="bg-[#460E18] text-[#F9F5EE] text-xs py-2 px-4 border-b border-[#350A11]/40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2 font-medium tracking-wide">
            <span className="text-[#D6B26C]">✦</span>
            <span>Pure Desi Ghee Confectionery & Pure Veg Restaurant Since 1970</span>
            <span className="hidden md:inline text-white/40">|</span>
            <span className="hidden md:inline text-[#E8D39E]">Free Delhi Delivery Above ₹{settings.freeDeliveryThreshold}</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-normal text-white/90">
            <a 
              href="tel:+919811100486" 
              className="flex items-center gap-1.5 hover:text-[#D6B26C] transition-colors whitespace-nowrap"
            >
              <Phone className="w-3 h-3 text-[#D6B26C]" />
              <span>+91 98111 00486</span>
            </a>
            <span className="text-white/30">·</span>
            <span className="flex items-center gap-1 text-white/80 whitespace-nowrap">
              <MapPin className="w-3 h-3 text-[#D6B26C]" />
              <span>Laxmi Nagar, Delhi</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Top Bar Contract: 3 Zones */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => {
            onNavigate('home');
            setMobileMenuOpen(false);
          }}
          className="text-left group flex items-center gap-3 shrink-0 focus:outline-none"
        >
          <div className="w-10 h-10 rounded-full bg-[#5A121F] border border-[#C5A059] flex items-center justify-center text-[#E8D39E] font-serif font-bold text-xl shadow-xs group-hover:scale-105 transition-transform">
            B
          </div>
          <div>
            <div className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#460E18] leading-tight">
              Beni Sweets Corner
            </div>
            <div className="text-[11px] font-sans tracking-widest uppercase text-[#9E742A] font-semibold">
              & Restaurant · Est. 1970
            </div>
          </div>
        </button>

        {/* Zone 2: Clean Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#4A3B37]">
          <button
            onClick={() => onNavigate('home')}
            className={`transition-colors whitespace-nowrap py-1 hover:text-[#741727] ${
              currentView === 'home' ? 'text-[#741727] font-semibold border-b-2 border-[#741727]' : ''
            }`}
          >
            Home
          </button>
          <button
            onClick={() => onNavigate('menu')}
            className={`transition-colors whitespace-nowrap py-1 hover:text-[#741727] ${
              currentView === 'menu' ? 'text-[#741727] font-semibold border-b-2 border-[#741727]' : ''
            }`}
          >
            Digital Menu
          </button>
          <button
            onClick={() => onNavigate('gifting')}
            className={`transition-colors whitespace-nowrap py-1 hover:text-[#741727] ${
              currentView === 'gifting' ? 'text-[#741727] font-semibold border-b-2 border-[#741727]' : ''
            }`}
          >
            Festive Gifting
          </button>
          <button
            onClick={() => onNavigate('story')}
            className={`transition-colors whitespace-nowrap py-1 hover:text-[#741727] ${
              currentView === 'story' ? 'text-[#741727] font-semibold border-b-2 border-[#741727]' : ''
            }`}
          >
            Our Story
          </button>
          <button
            onClick={() => onNavigate('tracking')}
            className={`transition-colors whitespace-nowrap py-1 hover:text-[#741727] ${
              currentView === 'tracking' ? 'text-[#741727] font-semibold border-b-2 border-[#741727]' : ''
            }`}
          >
            Track Order
          </button>
          <button
            onClick={() => onNavigate('contact')}
            className={`transition-colors whitespace-nowrap py-1 hover:text-[#741727] ${
              currentView === 'contact' ? 'text-[#741727] font-semibold border-b-2 border-[#741727]' : ''
            }`}
          >
            Visit & Contact
          </button>
        </nav>

        {/* Zone 3: Primary Actions (Search, Account, Cart, Mobile Toggle) */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <button
            onClick={onOpenSearch}
            className="p-2 text-[#5C4D49] hover:text-[#741727] hover:bg-[#F2EBE0] rounded-lg transition-colors"
            title="Search sweets & menu"
          >
            <Search className="w-5 h-5" />
          </button>

          <button
            onClick={onOpenCustomerAuth}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#4A3B37] hover:bg-[#F2EBE0] rounded-lg transition-colors border border-[#E6DBCB]"
          >
            <User className="w-4 h-4 text-[#741727]" />
            <span className="truncate max-w-[100px]">{customerName ? customerName.split(' ')[0] : 'Sign In'}</span>
          </button>

          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2 px-3.5 py-2 bg-[#5A121F] hover:bg-[#460E18] text-[#FCFAF7] rounded-lg transition-all shadow-xs hover:shadow-md"
          >
            <ShoppingBag className="w-4 h-4 text-[#E8D39E]" />
            <span className="hidden sm:inline text-xs font-semibold tracking-wide">Bag</span>
            {cartCount > 0 && (
              <span className="w-5 h-5 flex items-center justify-center bg-[#C5A059] text-[#350A11] text-xs font-bold rounded-full">
                {cartCount}
              </span>
            )}
          </button>

          {/* Admin link */}
          <button
            onClick={() => onNavigate('admin')}
            className="hidden md:inline-flex px-2.5 py-1 text-[11px] font-medium text-[#741727] hover:bg-[#F2EBE0] rounded border border-[#D6B26C]/60 transition-colors"
            title="Admin Portal"
          >
            Admin
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#4A3B37] hover:bg-[#F2EBE0] rounded-lg"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF7F2] border-b border-[#E8DDCD] px-4 pt-2 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-[#E8DDCD]">
            <button
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 text-sm font-medium text-[#4A3B37] hover:bg-[#F2EBE0] rounded-md"
            >
              Home
            </button>
            <button
              onClick={() => {
                onNavigate('menu');
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 text-sm font-medium text-[#4A3B37] hover:bg-[#F2EBE0] rounded-md"
            >
              Full Menu
            </button>
            <button
              onClick={() => {
                onNavigate('gifting');
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 text-sm font-medium text-[#4A3B37] hover:bg-[#F2EBE0] rounded-md"
            >
              Festive Gifting
            </button>
            <button
              onClick={() => {
                onNavigate('story');
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 text-sm font-medium text-[#4A3B37] hover:bg-[#F2EBE0] rounded-md"
            >
              Our Story
            </button>
            <button
              onClick={() => {
                onNavigate('tracking');
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 text-sm font-medium text-[#4A3B37] hover:bg-[#F2EBE0] rounded-md"
            >
              Track Order
            </button>
            <button
              onClick={() => {
                onNavigate('contact');
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 text-sm font-medium text-[#4A3B37] hover:bg-[#F2EBE0] rounded-md"
            >
              Contact & Map
            </button>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => {
                onOpenCustomerAuth();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 text-xs font-medium text-[#4A3B37] py-2"
            >
              <User className="w-4 h-4 text-[#741727]" />
              <span>{customerName || 'Sign In / Register'}</span>
            </button>

            <button
              onClick={() => {
                onNavigate('admin');
                setMobileMenuOpen(false);
              }}
              className="text-xs font-medium text-[#741727] py-2 px-3 bg-[#F2EBE0] rounded border border-[#D6B26C]/40"
            >
              Admin Dashboard
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
