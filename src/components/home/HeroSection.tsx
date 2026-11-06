import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Heart, Award } from 'lucide-react';

interface HeroSectionProps {
  onExploreMenu: () => void;
  onExploreGifting: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreMenu,
  onExploreGifting
}) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:py-20 bg-gradient-to-b from-[#FAF7F2] via-[#F6EFE5] to-[#FAF7F2] border-b border-[#E8DDCD]">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#5A121F]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Typography & CTAs (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Heritage Kicker */}
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#9E742A] bg-[#F2EBE0] px-3.5 py-1.5 rounded-full border border-[#D6B26C]/40">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Vijay Chowk, Laxmi Nagar · Est. 1970</span>
            </div>

            {/* Display Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#350A11] leading-[1.12] text-balance">
              Crafted in Tradition, <br />
              <span className="italic font-normal text-[#741727]">Wrapped in Luxury.</span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-[#55433E] max-w-2xl leading-relaxed">
              For over five decades, <strong className="font-semibold text-[#350A11]">Beni Sweets Corner & Restaurant</strong> has been synonymous with pure desi ghee craftsmanship, melt-in-mouth artisanal mithai, piping hot Delhi street snacks, and timeless festive celebrations.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={onExploreMenu}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-[#5A121F] hover:bg-[#460E18] text-[#FCFAF7] text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                <span>Order Fresh Sweets & Food</span>
                <ArrowRight className="w-4 h-4 text-[#E8D39E]" />
              </button>

              <button
                onClick={onExploreGifting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#FAF7F2] hover:bg-[#F2EBE0] text-[#350A11] border border-[#C5A059] text-sm font-semibold rounded-lg transition-colors"
              >
                <span>Festive & Wedding Gifting</span>
              </button>
            </div>

            {/* Trust Markers */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-[#6B5A55]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                <span className="font-medium text-[#350A11]">100% Pure Vegetarian</span>
              </div>
              <span className="text-gray-300">·</span>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                <span>Made in Pure Desi Ghee</span>
              </div>
              <span className="text-gray-300">·</span>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#C5A059]" />
                <span>Generational Halwai Recipes</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Asset (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer gold border card */}
              <div className="relative rounded-2xl overflow-hidden border-2 border-[#C5A059]/40 shadow-xl bg-white p-2">
                <div className="relative aspect-4/3 sm:aspect-16/10 lg:aspect-4/3 rounded-xl overflow-hidden bg-[#F2EBE0]">
                  <img
                    src="/src/assets/images/hero_luxury_mithai_spread_1793965253133.jpg"
                    alt="Artisanal Indian Sweets Platter by Beni Sweets Corner"
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                  {/* Caption on image */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-xs uppercase tracking-wider text-[#E8D39E] font-medium">Signature Collection</p>
                    <h3 className="font-serif text-lg font-semibold leading-snug">Silver Vark Kaju Katli & Kesariya Rasmalai</h3>
                  </div>
                </div>
              </div>

              {/* Floating Decorative Stamp */}
              <div className="absolute -bottom-5 -left-4 sm:-left-6 bg-[#350A11] text-[#FAF7F2] p-4 rounded-xl border border-[#C5A059] shadow-lg flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#5A121F] border border-[#C5A059] flex items-center justify-center text-[#E8D39E] font-serif font-bold text-lg">
                  50+
                </div>
                <div className="text-left">
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#E8D39E]">Years of Heritage</div>
                  <div className="text-[11px] text-[#D5C8B7]">Since 1970 at Vijay Chowk</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Column KPI Trust Strip */}
        <div className="mt-16 pt-8 border-t border-[#E8DDCD] grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <div className="font-serif text-2xl sm:text-3xl font-bold text-[#350A11] tabular-nums">1970</div>
            <div className="text-xs text-[#7B6A65] font-medium">Established in Delhi</div>
          </div>
          <div className="space-y-1">
            <div className="font-serif text-2xl sm:text-3xl font-bold text-[#350A11] tabular-nums">100%</div>
            <div className="text-xs text-[#7B6A65] font-medium">Pure Desi Ghee & Veg</div>
          </div>
          <div className="space-y-1">
            <div className="font-serif text-2xl sm:text-3xl font-bold text-[#350A11] tabular-nums">50,000+</div>
            <div className="text-xs text-[#7B6A65] font-medium">Celebrations Served</div>
          </div>
          <div className="space-y-1">
            <div className="font-serif text-2xl sm:text-3xl font-bold text-[#350A11] tabular-nums">4.9 ★</div>
            <div className="text-xs text-[#7B6A65] font-medium">Delhi Patron Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
};
