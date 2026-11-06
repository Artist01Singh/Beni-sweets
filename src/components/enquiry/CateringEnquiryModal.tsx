import React, { useState } from 'react';
import { X, Calendar, Users, Phone, Mail, Sparkles, CheckCircle2 } from 'lucide-react';
import { BulkCateringInquiry } from '../../types';
import { StorageService } from '../../services/storage';
import { WhatsAppService } from '../../services/whatsappService';

interface CateringEnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CateringEnquiryModal: React.FC<CateringEnquiryModalProps> = ({
  isOpen,
  onClose
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [eventType, setEventType] = useState<'Wedding' | 'Corporate' | 'Diwali/Festive' | 'Birthday' | 'Other'>('Wedding');
  const [eventDate, setEventDate] = useState('');
  const [guestCount, setGuestCount] = useState(150);
  const [budgetRange, setBudgetRange] = useState('₹50,000 - ₹1,00,000');
  const [requirements, setRequirements] = useState('');
  const [submittedInquiry, setSubmittedInquiry] = useState<BulkCateringInquiry | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newInquiry: BulkCateringInquiry = {
      id: `INQ-${Date.now().toString().slice(-6)}`,
      name,
      phone,
      email,
      eventType,
      eventDate,
      guestCount,
      budgetRange,
      requirements: requirements || 'Custom royal sweets boxes and live halwai counter quotation.',
      createdAt: new Date().toISOString()
    };

    StorageService.saveInquiry(newInquiry);
    setSubmittedInquiry(newInquiry);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl border border-[#E8DDCD] max-w-lg w-full overflow-hidden shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-[#E8DDCD]">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#9E742A]">
              Beni Confectionery Services
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#350A11]">
              Bulk Wedding & Corporate Catering
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedInquiry ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-serif text-xl font-bold text-[#350A11]">
              Enquiry Received!
            </h4>
            <p className="text-xs text-[#55433E] max-w-sm mx-auto">
              Thank you, {submittedInquiry.name}. Our master catering director will review your guest count ({submittedInquiry.guestCount} Pax) and contact you shortly with customized menu options.
            </p>

            <div className="pt-2 flex flex-col gap-2">
              <a
                href={WhatsAppService.getCateringInquiryWhatsAppUrl(submittedInquiry)}
                target="_blank"
                rel="noreferrer"
                className="py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl transition-colors text-center"
              >
                Connect Instantly on WhatsApp
              </a>

              <button
                onClick={onClose}
                className="py-2.5 px-4 text-xs font-medium text-[#7B6A65] hover:text-[#350A11]"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <p className="text-[#6B5A55] text-xs leading-relaxed">
              Serving Delhi NCR with pure desi ghee wedding sweet hampers, live jalebi & rabri stations, and corporate gift distribution.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-[#350A11] block mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Ramesh Aggarwal"
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8DDCD] rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-[#350A11] block mb-1">Contact Phone *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="e.g. 9811100486"
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8DDCD] rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-[#350A11] block mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="For menu quotation PDF"
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8DDCD] rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-[#350A11] block mb-1">Occasion / Event *</label>
                <select
                  value={eventType}
                  onChange={e => setEventType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8DDCD] rounded-xl"
                >
                  <option value="Wedding">Wedding Shagun & Reception</option>
                  <option value="Corporate">Corporate Diwali / Employee Gifting</option>
                  <option value="Diwali/Festive">Diwali & Holi Festivities</option>
                  <option value="Birthday">Milestone Birthday / Anniversary</option>
                  <option value="Other">Other Celebration</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-[#350A11] block mb-1">Tentative Event Date *</label>
                <input
                  type="date"
                  required
                  value={eventDate}
                  onChange={e => setEventDate(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8DDCD] rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-[#350A11] block mb-1">Estimated Guests (Pax) *</label>
                <input
                  type="number"
                  min={25}
                  value={guestCount}
                  onChange={e => setGuestCount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8DDCD] rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-[#350A11] block mb-1">Special Requirements & Sweets Preference</label>
              <textarea
                rows={2}
                value={requirements}
                onChange={e => setRequirements(e.target.value)}
                placeholder="e.g. Need 200 custom gold-embossed boxes with Kaju Katli and Motichoor, plus live samosa and lassi counter in Laxmi Nagar..."
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8DDCD] rounded-xl"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#5A121F] hover:bg-[#460E18] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#E8D39E]" />
              <span>Submit Catering & Bulk Request</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
