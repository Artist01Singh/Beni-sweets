import React from 'react';
import { Star, Quote } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const reviews = [
    {
      name: 'Dr. Harshvardhan Mehra',
      location: 'Preet Vihar, Delhi',
      tag: 'Regular Patron for 22 Years',
      rating: 5,
      comment:
        'My family has been buying sweets from Beni Sweets since 2002. Their Kaju Katli is simply unmatched—you can actually taste the pure cashew without sugary filler. During festivals, their Royal Malai Ghevar is an absolute must.'
    },
    {
      name: 'Ananya Saxena',
      location: 'Laxmi Nagar, Delhi',
      tag: 'Wedding Gifting Order',
      rating: 5,
      comment:
        'We ordered 250 custom Shagun sweet boxes for my brother’s wedding reception. Every single guest complimented the freshness of the Motichoor laddoos and the elegant velvet-gold packaging. Delivered right on schedule!'
    },
    {
      name: 'Rajesh Bansal',
      location: 'Nirman Vihar, Delhi',
      tag: 'Weekend Breakfast Fan',
      rating: 5,
      comment:
        'Best Chole Bhature in East Delhi without doubt! Fluffy bhature that aren’t greasy, coupled with piping hot spicy pindi chole and their sweet kulhad lassi. It is our Sunday morning family ritual.'
    }
  ];

  return (
    <section className="py-16 bg-[#F6EFE5] border-b border-[#E8DDCD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <div className="text-xs font-semibold tracking-widest uppercase text-[#9E742A]">
            Words From Our Patrons
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#350A11]">
            Trusted Across Generations
          </h2>
          <p className="text-sm text-[#66544F]">
            Proudly maintaining a 4.9-star rating across local Delhi food guides and catering thousands of landmark family celebrations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((r, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-white border border-[#E8DDCD] shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between relative"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[#C5A059]">
                    {[...Array(r.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-[#D6B26C]/40" />
                </div>

                <p className="text-sm text-[#55433E] leading-relaxed italic">
                  "{r.comment}"
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-[#F2EBE0]">
                <div className="font-serif font-bold text-base text-[#350A11]">
                  {r.name}
                </div>
                <div className="text-xs text-[#741727] font-medium">
                  {r.location}
                </div>
                <div className="text-[11px] text-[#8C7A75] mt-0.5">
                  {r.tag}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
