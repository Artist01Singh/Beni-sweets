import React from 'react';
import { Sparkles, ShoppingBag, Check } from 'lucide-react';
import { Product } from '../../types';
import { ImageWithFallback } from '../common/ImageWithFallback';

interface SpecialGhevarHighlightProps {
  ghevarProduct?: Product;
  onAddToCart: (product: Product) => void;
}

export const SpecialGhevarHighlight: React.FC<SpecialGhevarHighlightProps> = ({
  ghevarProduct,
  onAddToCart
}) => {
  if (!ghevarProduct) return null;

  return (
    <section className="py-16 bg-[#F6EFE5] border-y border-[#E8DDCD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF7F2] rounded-3xl border border-[#D6B26C]/50 shadow-lg p-6 sm:p-10 lg:p-12 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Visual Box on Left (6 cols) */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border-2 border-[#C5A059] bg-white">
                <ImageWithFallback
                  src={ghevarProduct.image || 'images/sweets_royal_ghevar.jpg'}
                  alt={ghevarProduct.name}
                  fallbackTitle={ghevarProduct.name}
                  className="w-full aspect-4/3 object-cover hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4 bg-[#5A121F] text-[#FAF7F2] px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase border border-[#C5A059]">
                  Royal Seasonal Delicacy
                </div>
              </div>
            </div>

            {/* Content on Right (6 cols) */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-[#9E742A]">
                  <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>The Crown Jewel of Beni Sweets</span>
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#350A11] leading-tight">
                  Royal Rajasthani Malai Ghevar
                </h2>
                <div className="text-sm font-serif italic text-[#741727]">
                  शाही मलाई घेवर · Handcrafted in Pure Desi Ghee
                </div>
              </div>

              <p className="text-sm sm:text-base text-[#55433E] leading-relaxed">
                A marvel of heritage halwai skill. Intricate honeycomb discs deep-fried in golden desi ghee to a crisp, airy crunch, steeped in perfumed saffron syrup, and crowned with dense slow-churned rabri, slivered California almonds, and pure silver vark.
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs text-[#4A3B37] pt-1">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#5A121F] text-white flex items-center justify-center text-[10px]">✓</div>
                  <span>Pure Buffalo Milk Rabri</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#5A121F] text-white flex items-center justify-center text-[10px]">✓</div>
                  <span>Luxury Gold-Foil Tin Box</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#5A121F] text-white flex items-center justify-center text-[10px]">✓</div>
                  <span>Fresh Batch Made Daily</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#5A121F] text-white flex items-center justify-center text-[10px]">✓</div>
                  <span>100% Desi Ghee</span>
                </div>
              </div>

              {/* Price & Purchase Module */}
              <div className="pt-4 border-t border-[#E8DDCD] flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-[#7B6A65]">Per Piece in Royal Tin (~500g)</div>
                  <div className="font-serif text-3xl font-bold text-[#350A11] tabular-nums">
                    ₹{ghevarProduct.price}
                  </div>
                </div>

                <button
                  onClick={() => onAddToCart(ghevarProduct)}
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#5A121F] hover:bg-[#460E18] text-[#FCFAF7] text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  <ShoppingBag className="w-4 h-4 text-[#E8D39E]" />
                  <span>Add Royal Tin to Bag</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
