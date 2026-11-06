import React from 'react';
import { ShieldCheck, Flame, Truck, Gift } from 'lucide-react';

export const WhyChooseBeni: React.FC = () => {
  const pillars = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#C5A059]" />,
      title: '100% Pure Desi Ghee & Chenna',
      desc: 'We never compromise on purity. Every laddoo, katli, and flaky samosa is made in certified pure cow and buffalo desi ghee with fresh daily dairy.'
    },
    {
      icon: <Flame className="w-6 h-6 text-[#C5A059]" />,
      title: 'Generational Halwai Recipes',
      desc: 'Our sweets and savory chaat recipes are perfected over 54 years by master confectioners who know the exact caramelization and spice balance.'
    },
    {
      icon: <Gift className="w-6 h-6 text-[#C5A059]" />,
      title: 'Artisanal Luxury Packaging',
      desc: 'Every gift box is crafted with velvet touch and gold foil embossing, making your Diwali, wedding, or corporate gifting truly memorable.'
    },
    {
      icon: <Truck className="w-6 h-6 text-[#C5A059]" />,
      title: 'Express Hot & Fresh Delivery',
      desc: 'Packed in insulated thermal food containers so chole bhature arrive piping hot and delicate rasmalai arrives chilled and intact.'
    }
  ];

  return (
    <section className="py-16 bg-[#FAF7F2] border-b border-[#E8DDCD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <div className="text-xs font-semibold tracking-widest uppercase text-[#9E742A]">
            Uncompromising Excellence
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#350A11]">
            Why Delhi Trusts Beni Sweets
          </h2>
          <p className="text-sm text-[#66544F]">
            From morning breakfast to festive celebrations, here is why thousands of families have made us their first choice since 1970.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((p, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-[#E8DDCD] hover:border-[#C5A059] shadow-xs hover:shadow-md transition-all space-y-3"
            >
              <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#E8DDCD] flex items-center justify-center">
                {p.icon}
              </div>
              <h3 className="font-serif text-lg font-bold text-[#350A11]">
                {p.title}
              </h3>
              <p className="text-xs text-[#6B5A55] leading-relaxed">
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
