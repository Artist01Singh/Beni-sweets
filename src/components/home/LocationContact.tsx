import React from 'react';
import { MapPin, Phone, Mail, Clock, Navigation, MessageCircle, ExternalLink } from 'lucide-react';
import { BusinessSettings } from '../../types';
import { WhatsAppService } from '../../services/whatsappService';

interface LocationContactProps {
  settings: BusinessSettings;
  onOpenReservation: () => void;
  onOpenCatering: () => void;
}

export const LocationContact: React.FC<LocationContactProps> = ({
  settings,
  onOpenReservation,
  onOpenCatering
}) => {
  return (
    <section className="py-20 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <div className="text-xs font-semibold tracking-widest uppercase text-[#9E742A]">
            Dine In · Takeaway · Home Delivery
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#350A11]">
            Visit Us at Vijay Chowk
          </h2>
          <p className="text-sm text-[#66544F]">
            Centrally located in the heart of Laxmi Nagar, easily reachable via Laxmi Nagar & Nirman Vihar Metro Stations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Contact Details Card (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-[#E8DDCD] p-8 shadow-sm flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#350A11]">
                  Beni Sweets Corner & Restaurant
                </h3>
                <p className="text-xs text-[#9E742A] uppercase tracking-wider font-semibold mt-1">
                  Pure Vegetarian Dining & Mithai Shop
                </p>
              </div>

              <div className="space-y-4 text-sm text-[#4A3B37]">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-[#FAF7F2] border border-[#E8DDCD] flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-[#741727]" />
                  </div>
                  <div>
                    <div className="font-semibold text-[#350A11]">Address</div>
                    <div className="text-xs text-[#6B5A55] leading-relaxed mt-0.5">
                      {settings.address}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-[#FAF7F2] border border-[#E8DDCD] flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-4 h-4 text-[#741727]" />
                  </div>
                  <div>
                    <div className="font-semibold text-[#350A11]">Phone & Orders</div>
                    <a
                      href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
                      className="text-xs font-semibold text-[#5A121F] hover:underline mt-0.5 inline-block"
                    >
                      {settings.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-[#FAF7F2] border border-[#E8DDCD] flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4 text-[#741727]" />
                  </div>
                  <div>
                    <div className="font-semibold text-[#350A11]">Shop Timings</div>
                    <div className="text-xs text-[#6B5A55] mt-0.5">
                      {settings.openingHours}
                    </div>
                    <div className="text-[11px] text-emerald-700 font-medium mt-0.5 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                      Open All 7 Days
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-4 border-t border-[#F2EBE0] space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
                  className="flex items-center justify-center gap-2 py-3 px-4 bg-[#5A121F] hover:bg-[#460E18] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Store</span>
                </a>

                <a
                  href={WhatsAppService.getDirectChatUrl()}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  onClick={onOpenReservation}
                  className="py-2.5 px-3 border border-[#D6B26C] text-[#350A11] hover:bg-[#FAF7F2] text-xs font-semibold rounded-xl transition-colors text-center"
                >
                  Table Enquiry
                </button>
                <button
                  onClick={onOpenCatering}
                  className="py-2.5 px-3 border border-[#D6B26C] text-[#350A11] hover:bg-[#FAF7F2] text-xs font-semibold rounded-xl transition-colors text-center"
                >
                  Bulk Catering
                </button>
              </div>
            </div>
          </div>

          {/* Map Preview & Directions Card (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E8DDCD] overflow-hidden shadow-sm flex flex-col">
            <div className="p-6 bg-[#FAF7F2] border-b border-[#E8DDCD] flex flex-wrap items-center justify-between gap-4">
              <div>
                <h4 className="font-serif text-lg font-bold text-[#350A11]">
                  Google Maps Location
                </h4>
                <p className="text-xs text-[#7B6A65]">
                  L-35, Vijay Chowk, Laxmi Nagar, Delhi 110092
                </p>
              </div>

              <a
                href="https://maps.google.com/?q=Beni+Sweets+Corner+Vijay+Chowk+Laxmi+Nagar+Delhi"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5A121F] bg-white border border-[#D6B26C] px-3.5 py-2 rounded-lg hover:bg-[#F2EBE0] transition-colors"
              >
                <Navigation className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Get Driving Directions</span>
                <ExternalLink className="w-3 h-3 text-[#7B6A65]" />
              </a>
            </div>

            {/* Embedded Responsive Interactive Map */}
            <div className="relative flex-1 min-h-[340px] bg-[#EAE2D5]">
              <iframe
                title="Beni Sweets Corner Google Map"
                src="https://maps.google.com/maps?q=Vijay%20Chowk,%20Laxmi%20Nagar,%20Delhi%20110092&t=&z=15&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full min-h-[340px] border-0"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
