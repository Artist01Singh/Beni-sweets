import React from 'react';
import { Instagram, ExternalLink } from 'lucide-react';

export const InstagramGallery: React.FC = () => {
  const images = [
    {
      src: '/src/assets/images/hero_luxury_mithai_spread_1793965253133.jpg',
      caption: 'Pure Desi Ghee Diamond Kaju Katli & Saffron Laddoos'
    },
    {
      src: '/src/assets/images/sweets_royal_ghevar_1793965252282.jpg',
      caption: 'The Royal Malai Ghevar in our signature commemorative tin'
    },
    {
      src: '/src/assets/images/savories_samosa_chole_1793965253254.jpg',
      caption: 'Sunday mornings in Delhi: piping hot Chole Bhature & Samosas'
    },
    {
      src: '/src/assets/images/gift_luxury_mithai_box_1793965254075.jpg',
      caption: 'Bespoke celebratory mithai hampers for wedding celebrations'
    }
  ];

  return (
    <section className="py-16 bg-[#FAF7F2] border-b border-[#E8DDCD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-xs font-semibold tracking-widest uppercase text-[#9E742A]">
              @BeniSweetsDelhi
            </div>
            <h2 className="font-serif text-3xl font-bold tracking-tight text-[#350A11] mt-1">
              Celebrations & Craftsmanship
            </h2>
          </div>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#5A121F] hover:text-[#741727] transition-colors"
          >
            <Instagram className="w-4 h-4" />
            <span>Follow Our Journey on Instagram</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((img, i) => (
            <div
              key={i}
              className="group relative aspect-square rounded-2xl overflow-hidden bg-[#F2EBE0] border border-[#E8DDCD] shadow-xs cursor-pointer"
            >
              <img
                src={img.src}
                alt={img.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4 text-center">
                <p className="text-xs text-white font-medium line-clamp-3">
                  {img.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
