import React from 'react';
import { ShieldCheck, Award, HeartHandshake } from 'lucide-react';

export const HeritageStory: React.FC = () => {
  return (
    <section className="py-20 bg-[#FAF7F2] border-b border-[#E8DDCD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Craft Photography (5 cols) */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative">
              <div className="rounded-2xl overflow-hidden border border-[#D6B26C]/50 shadow-xl bg-white p-2">
                <img
                  src="/src/assets/images/heritage_sweets_craft_1793965254490.jpg"
                  alt="Heritage Halwai Confectionery Craft at Beni Sweets Delhi"
                  className="w-full aspect-4/3 sm:aspect-16/11 object-cover rounded-xl"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-6 right-6 bg-[#350A11] text-white p-4 rounded-xl border border-[#C5A059] shadow-lg max-w-xs hidden sm:block">
                <div className="text-xs uppercase tracking-wider text-[#E8D39E] font-semibold">Traditional Woodfire Mawa</div>
                <div className="text-[11px] text-[#D5C8B7] mt-0.5">Slow-simmered in copper cauldrons with pure country milk</div>
              </div>
            </div>
          </div>

          {/* Narrative (7 cols) */}
          <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
            <div className="space-y-2">
              <div className="text-xs font-semibold tracking-widest uppercase text-[#9E742A]">
                Since 1970 · Vijay Chowk, Laxmi Nagar
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#350A11] leading-tight">
                Fifty-Four Years of Pure Devotion to Delhi’s Sweet Tooth
              </h2>
            </div>

            <p className="text-base text-[#55433E] leading-relaxed">
              In 1970, <strong className="font-semibold text-[#350A11]">Beni Sweets Corner</strong> opened its humble wooden shutter at Vijay Chowk in Laxmi Nagar. Founded on the unbending principle of using only pure desi ghee, fresh buffalo milk chenna, and genuine spices, our shop quickly grew from a neighborhood favorite into an East Delhi culinary landmark.
            </p>

            <p className="text-base text-[#55433E] leading-relaxed">
              Every morning at 5:00 AM, our master halwais begin firing up the copper kadais. Fresh milk is slowly simmered down to rich golden khoya, cashews are stone-ground for our signature diamond Kaju Katli, and our secret amchur-hing spice mix is steeped for the legendary Delhi Chole Bhature.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#E8DDCD]">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-bold text-[#350A11]">
                  <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                  <span>Pure Desi Ghee</span>
                </div>
                <p className="text-xs text-[#7B6A65]">Zero adulteration, 100% natural clarifed butter only.</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-bold text-[#350A11]">
                  <Award className="w-4 h-4 text-[#C5A059]" />
                  <span>Pure Vegetarian</span>
                </div>
                <p className="text-xs text-[#7B6A65]">Dedicated sattvic pure veg kitchen premises.</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-bold text-[#350A11]">
                  <HeartHandshake className="w-4 h-4 text-[#C5A059]" />
                  <span>Delhi Heritage</span>
                </div>
                <p className="text-xs text-[#7B6A65]">Beloved by generations of families across Delhi NCR.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
