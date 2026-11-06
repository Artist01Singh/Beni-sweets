import React from 'react';
import { X, QrCode, Printer, Sparkles, Smartphone, ShieldCheck } from 'lucide-react';
import { BusinessSettings } from '../../types';

interface QRCodeMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: BusinessSettings;
}

export const QRCodeMenuModal: React.FC<QRCodeMenuModalProps> = ({
  isOpen,
  onClose,
  settings
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    if (typeof window !== 'undefined') window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-[#E8DDCD] max-w-sm w-full overflow-hidden shadow-2xl p-6 text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-[#E8DDCD]">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9E742A]">
            Contactless Dine-In
          </span>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Brand Lockup */}
        <div className="space-y-1">
          <div className="w-10 h-10 rounded-full bg-[#5A121F] border border-[#C5A059] flex items-center justify-center text-[#E8D39E] font-serif font-bold text-lg mx-auto shadow-sm">
            B
          </div>
          <h3 className="font-serif text-xl font-bold text-[#350A11]">
            {settings.brandName}
          </h3>
          <p className="text-xs text-[#7B6A65]">
            L-35, Vijay Chowk, Laxmi Nagar · Est. 1970
          </p>
        </div>

        {/* QR Card representation */}
        <div className="p-6 rounded-2xl bg-[#FAF7F2] border-2 border-dashed border-[#D6B26C] space-y-3">
          <div className="w-40 h-40 mx-auto bg-white p-3 rounded-xl border border-[#E8DDCD] shadow-sm flex flex-col items-center justify-center">
            <QrCode className="w-28 h-28 text-[#350A11]" />
            <div className="text-[10px] font-mono text-[#741727] font-semibold mt-1">Scan for Live Menu</div>
          </div>
          <div className="text-xs text-[#55433E] flex items-center justify-center gap-1.5 font-medium">
            <Smartphone className="w-4 h-4 text-[#741727]" />
            <span>Point phone camera to view full menu</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-emerald-800 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
          <span>100% Pure Vegetarian Kitchen</span>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-[#F2EBE0]">
          <button
            onClick={handlePrint}
            className="flex-1 py-2.5 px-3 bg-[#FAF7F2] hover:bg-[#F2EBE0] border border-[#E8DDCD] text-xs font-semibold text-[#350A11] rounded-xl flex items-center justify-center gap-1.5 transition-colors"
          >
            <Printer className="w-4 h-4 text-[#741727]" />
            <span>Print QR Card</span>
          </button>

          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-3 bg-[#5A121F] hover:bg-[#460E18] text-white text-xs font-semibold rounded-xl transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
