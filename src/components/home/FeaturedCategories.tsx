import React from 'react';
import { ArrowRight } from 'lucide-react';
import { ProductCategory } from '../../types';
import { ImageWithFallback } from '../common/ImageWithFallback';

interface FeaturedCategoriesProps {
  onSelectCategory: (category: ProductCategory) => void;
}

export const FeaturedCategories: React.FC<FeaturedCategoriesProps> = ({
  onSelectCategory
}) => {
  const categories = [
    {
      id: 'sweets' as ProductCategory,
      title: 'Sweets & Mithai',
      hindi: 'पारंपरिक मिठाइयाँ',
      tagline: 'Kaju Katli, Rasmalai, Malai Ghevar & Desi Ghee Laddoos',
      itemCount: '9 Varieties',
      image: 'images/sweets_royal_ghevar.jpg'
    },
    {
      id: 'namkeen' as ProductCategory,
      title: 'Namkeen & Snacks',
      hindi: 'नमकीन एवं चाट',
      tagline: 'Fresh Samosas, Khasta Kachori, Paneer Patties & Mixtures',
      itemCount: '5 Specialties',
      image: 'images/savories_samosa_chole.jpg'
    },
    {
      id: 'breakfast' as ProductCategory,
      title: 'Breakfast & Dining',
      hindi: 'नाश्ता एवं भोजन',
      tagline: 'Legendary Chole Bhature, Bedmi Puri, Pav Bhaji & Dosas',
      itemCount: '6 Specialties',
      image: 'images/dish_chole_bhature.jpg'
    },
    {
      id: 'gifting' as ProductCategory,
      title: 'Festive & Gifting',
      hindi: 'उपहार एवं शादी बॉक्सेस',
      tagline: 'Diwali, Wedding Shagun & Luxury Corporate Hamper Boxes',
      itemCount: 'Custom Boxes',
      image: 'images/gift_luxury_mithai_box.jpg'
    }
  ];

  return (
    <section className="py-16 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <div className="text-xs font-semibold tracking-widest uppercase text-[#9E742A]">
            Generations of Authentic Recipes
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#350A11]">
            Discover Our Categories
          </h2>
          <p className="text-sm text-[#66544F]">
            Every recipe is prepared fresh every morning in our Vijay Chowk kitchen using authentic pure desi ghee and hand-selected ingredients.
          </p>
        </div>

        {/* 4 Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map(cat => (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="group cursor-pointer rounded-2xl overflow-hidden bg-white border border-[#E8DDCD] hover:border-[#C5A059] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              {/* Category Image */}
              <div className="relative aspect-4/3 overflow-hidden bg-[#F2EBE0]">
                <ImageWithFallback
                  src={cat.image}
                  alt={cat.title}
                  fallbackTitle={cat.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                <span className="absolute bottom-3 left-3 text-[11px] font-medium text-white/90 bg-black/40 backdrop-blur-xs px-2.5 py-0.5 rounded-full">
                  {cat.itemCount}
                </span>
              </div>

              {/* Category Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-xs text-[#9E742A] font-medium mb-1 font-serif">
                    {cat.hindi}
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#350A11] group-hover:text-[#741727] transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-[#6B5A55] mt-1.5 line-clamp-2 leading-relaxed">
                    {cat.tagline}
                  </p>
                </div>

                <div className="pt-4 mt-2 border-t border-[#F2EBE0] flex items-center justify-between text-xs font-semibold text-[#5A121F] group-hover:text-[#8E1F32]">
                  <span>Explore Menu</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
