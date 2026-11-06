import React from 'react';
import { Phone, Mail, MapPin, Clock, ShieldCheck, Heart, ExternalLink } from 'lucide-react';
import { BusinessSettings } from '../../types';
import { WhatsAppService } from '../../services/whatsappService';

interface FooterProps {
  settings: BusinessSettings;
  onNavigate: (view: 'home' | 'menu' | 'gifting' | 'story' | 'contact' | 'admin' | 'tracking') => void;
  onOpenReservation: () => void;
  onOpenCatering: () => void;
  onOpenQrMenu: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onNavigate,
  onOpenReservation,
  onOpenCatering,
  onOpenQrMenu
}) => {
  return (
    <footer className="bg-[#350A11] text-[#F5EFEB] pt-16 pb-12 border-t border-[#C5A059]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Brand Banner Strip */}
        <div className="pb-12 border-b border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#5A121F] border border-[#C5A059] flex items-center justify-center text-[#E8D39E] font-serif font-bold text-2xl shadow-md">
              B
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold tracking-tight text-[#FCFAF7]">
                {settings.brandName}
              </h2>
              <p className="text-xs text-[#D6B26C] tracking-widest uppercase font-medium mt-0.5">
                Authentic Desi Ghee Confectionery & Restaurant · Established 1970
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              100% Pure Vegetarian
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-[#C5A059]/30 text-[#E8D39E] text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              Pure Desi Ghee Assured
            </span>
          </div>
        </div>

        {/* 4 Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 py-12 border-b border-white/10">
          {/* Col 1: Heritage & Location */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold text-[#FCFAF7]">Visit Our Shop</h3>
            <div className="space-y-3 text-sm text-[#D5C8B7]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-1" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C5A059] shrink-0" />
                <a href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`} className="hover:text-white transition-colors">
                  {settings.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C5A059] shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-white transition-colors">
                  {settings.email}
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#C5A059] shrink-0 mt-1" />
                <span>{settings.openingHours}</span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={WhatsAppService.getDirectChatUrl()}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#350A11] bg-[#C5A059] hover:bg-[#D6B26C] px-3.5 py-2 rounded-lg transition-colors"
              >
                <span>WhatsApp Instant Support</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Col 2: Sweets & Specialities */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold text-[#FCFAF7]">Traditional Delicacies</h3>
            <ul className="space-y-2 text-sm text-[#D5C8B7]">
              <li>
                <button onClick={() => onNavigate('menu')} className="hover:text-white transition-colors">
                  Royal Malai Ghevar (Seasonal)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('menu')} className="hover:text-white transition-colors">
                  Diamond Cut Pure Kaju Katli
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('menu')} className="hover:text-white transition-colors">
                  Desi Ghee Motichoor Laddu
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('menu')} className="hover:text-white transition-colors">
                  Kesariya Rasmalai & Gulab Jamun
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('menu')} className="hover:text-white transition-colors">
                  Famous Delhi Chole Bhature
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('menu')} className="hover:text-white transition-colors">
                  Fresh Khasta Kachori & Samosa
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Navigation & Services */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold text-[#FCFAF7]">Services & Enquiries</h3>
            <ul className="space-y-2 text-sm text-[#D5C8B7]">
              <li>
                <button onClick={() => onNavigate('gifting')} className="hover:text-white transition-colors">
                  Diwali & Festive Hampers
                </button>
              </li>
              <li>
                <button onClick={onOpenCatering} className="hover:text-white transition-colors text-[#E8D39E]">
                  Bulk Wedding & Corporate Catering
                </button>
              </li>
              <li>
                <button onClick={onOpenReservation} className="hover:text-white transition-colors">
                  Table Reservation Request
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('tracking')} className="hover:text-white transition-colors">
                  Track Live Order
                </button>
              </li>
              <li>
                <button onClick={onOpenQrMenu} className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>Contactless QR Menu</span>
                  <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-[#D6B26C]">Dine-In</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin')} className="hover:text-white transition-colors text-xs text-white/50">
                  Staff & Admin Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Service Areas & Assurance */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold text-[#FCFAF7]">Delivery Pincodes</h3>
            <p className="text-xs text-[#D5C8B7] leading-relaxed">
              Fast local delivery across East Delhi including Laxmi Nagar (110092), Nirman Vihar, Shakarpur, Preet Vihar, Krishna Nagar, and Mayur Vihar.
            </p>
            <div className="flex flex-wrap gap-1.5 text-[11px] font-mono text-[#D6B26C]">
              {settings.servicePincodes.map(pin => (
                <span key={pin} className="px-2 py-0.5 bg-white/5 rounded border border-white/10">
                  {pin}
                </span>
              ))}
            </div>

            <div className="p-3 rounded-lg bg-white/5 border border-white/10 space-y-1">
              <div className="text-xs font-semibold text-[#FCFAF7] flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-[#E8D39E]" />
                <span>Our Heritage Promise</span>
              </div>
              <p className="text-[11px] text-[#D5C8B7]">
                Made fresh every morning using 100% pure desi ghee, organic dry fruits, and heritage halwai recipes passed down since 1970.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <div>
            © {new Date().getFullYear()} Beni Sweets Corner & Restaurant. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-white">L-35 Vijay Chowk, Laxmi Nagar</span>
            <span>·</span>
            <a href="https://maps.google.com/?q=Beni+Sweets+Corner+Laxmi+Nagar+Delhi" target="_blank" rel="noreferrer" className="hover:text-[#D6B26C]">
              Find on Google Maps
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
