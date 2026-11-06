import React, { useState } from 'react';
import { X, Calendar, Clock, Users, CheckCircle2 } from 'lucide-react';
import { TableReservation } from '../../types';
import { StorageService } from '../../services/storage';
import { WhatsAppService } from '../../services/whatsappService';

interface TableReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TableReservationModal: React.FC<TableReservationModalProps> = ({
  isOpen,
  onClose
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [guestCount, setGuestCount] = useState(4);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState('19:30');
  const [specialRequests, setSpecialRequests] = useState('');
  const [submitted, setSubmitted] = useState<TableReservation | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReservation: TableReservation = {
      id: `RES-${Date.now().toString().slice(-5)}`,
      name,
      phone,
      guestCount,
      date,
      time,
      specialRequests,
      status: 'Confirmed',
      createdAt: new Date().toISOString()
    };

    StorageService.saveReservation(newReservation);
    setSubmitted(newReservation);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-[#E8DDCD] max-w-md w-full overflow-hidden shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-[#E8DDCD]">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#9E742A]">
              Restaurant Dining · Vijay Chowk
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#350A11]">
              Table Reservation Request
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-serif text-xl font-bold text-[#350A11]">
              Table Request Confirmed!
            </h4>
            <p className="text-xs text-[#55433E]">
              We have reserved seating for <strong>{submitted.guestCount} Guests</strong> on <strong>{submitted.date} at {submitted.time}</strong> under the name of <strong>{submitted.name}</strong>.
            </p>

            <div className="pt-2 flex flex-col gap-2">
              <a
                href={WhatsAppService.getTableReservationWhatsAppUrl(submitted)}
                target="_blank"
                rel="noreferrer"
                className="py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl transition-colors text-center"
              >
                Send Booking Details on WhatsApp
              </a>

              <button
                onClick={onClose}
                className="py-2.5 px-4 text-xs font-medium text-[#7B6A65] hover:text-[#350A11]"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-[#350A11] block mb-1">Your Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Alok Sharma"
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8DDCD] rounded-xl"
              />
            </div>

            <div>
              <label className="font-semibold text-[#350A11] block mb-1">Mobile Number *</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="e.g. 9811100486"
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8DDCD] rounded-xl"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="font-semibold text-[#350A11] block mb-1">Guests *</label>
                <select
                  value={guestCount}
                  onChange={e => setGuestCount(Number(e.target.value))}
                  className="w-full px-2.5 py-2 bg-[#FAF7F2] border border-[#E8DDCD] rounded-xl"
                >
                  {[1, 2, 3, 4, 5, 6, 8, 10, 12, 16].map(n => (
                    <option key={n} value={n}>{n} Pax</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-[#350A11] block mb-1">Date *</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full px-2 py-2 bg-[#FAF7F2] border border-[#E8DDCD] rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-[#350A11] block mb-1">Time *</label>
                <input
                  type="time"
                  required
                  value={time}
                  onChange={e => setTime(e.target.value)}
                  className="w-full px-2 py-2 bg-[#FAF7F2] border border-[#E8DDCD] rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-[#350A11] block mb-1">Special Table Requests (Optional)</label>
              <input
                type="text"
                value={specialRequests}
                onChange={e => setSpecialRequests(e.target.value)}
                placeholder="e.g. High chair needed, quiet family booth"
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8DDCD] rounded-xl"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#5A121F] hover:bg-[#460E18] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
            >
              Request Table Seating
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
