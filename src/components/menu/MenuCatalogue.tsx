import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ShoppingBag, 
  Sparkles, 
  Flame, 
  Clock, 
  ShieldCheck, 
  Eye, 
  X, 
  Check, 
  Plus, 
  Minus 
} from 'lucide-react';
import { Product, ProductCategory } from '../../types';

interface MenuCatalogueProps {
  products: Product[];
  onAddToCart: (product: Product, quantity?: number, selectedVariant?: string) => void;
  selectedCategory?: ProductCategory | 'all';
  searchQuery?: string;
}

export const MenuCatalogue: React.FC<MenuCatalogueProps> = ({
  products,
  onAddToCart,
  selectedCategory = 'all',
  searchQuery: initialSearchQuery = ''
}) => {
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all'>(selectedCategory);
  const [searchTerm, setSearchTerm] = useState(initialSearchQuery);
  const [sortBy, setSortBy] = useState<'recommended' | 'price-low' | 'price-high' | 'rating'>('recommended');
  const [bestsellerOnly, setBestsellerOnly] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [quickViewQty, setQuickViewQty] = useState(1);

  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'sweets', label: 'Sweets & Mithai' },
    { id: 'namkeen', label: 'Namkeen & Snacks' },
    { id: 'breakfast', label: 'Breakfast & Dining' },
    { id: 'chinese', label: 'Chinese & Fast Food' },
    { id: 'beverages', label: 'Beverages' },
    { id: 'gifting', label: 'Festive Hampers' }
  ];

  // Filtering & Sorting
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Category filter
      if (activeCategory !== 'all' && p.category !== activeCategory) {
        return false;
      }
      // Bestseller filter
      if (bestsellerOnly && !p.isBestseller) {
        return false;
      }
      // Search term
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(term);
        const matchesDesc = p.description.toLowerCase().includes(term);
        const matchesHindi = p.hindiName ? p.hindiName.includes(term) : false;
        return matchesName || matchesDesc || matchesHindi;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      // Default: bestsellers first
      if (a.isBestseller && !b.isBestseller) return -1;
      if (!a.isBestseller && b.isBestseller) return 1;
      return 0;
    });
  }, [products, activeCategory, searchTerm, sortBy, bestsellerOnly]);

  const openQuickView = (product: Product) => {
    setQuickViewProduct(product);
    setQuickViewQty(1);
  };

  return (
    <div className="py-12 bg-[#FAF7F2] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Title & Description */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs font-semibold tracking-widest uppercase text-[#9E742A]">
            Fresh Daily From Our Delhi Kitchen
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#350A11]">
            Digital Menu & Sweets Catalogue
          </h1>
          <p className="text-sm text-[#66544F]">
            Handcrafted with pure desi ghee, fresh buffalo milk chenna, and genuine spices. Guaranteed pure vegetarian.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-2xl border border-[#E8DDCD] p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#8C7A75] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search Kaju Katli, Samosa, Chole Bhature, Ghevar..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#FAF7F2] border border-[#E8DDCD] rounded-xl focus:outline-none focus:border-[#741727] text-[#350A11] placeholder:text-[#9B8C86]"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort & Bestseller Toggle */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setBestsellerOnly(!bestsellerOnly)}
                className={`px-3.5 py-2 text-xs font-medium rounded-xl border transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  bestsellerOnly
                    ? 'bg-[#5A121F] text-[#FAF7F2] border-[#5A121F]'
                    : 'bg-[#FAF7F2] text-[#4A3B37] border-[#E8DDCD] hover:bg-[#F2EBE0]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#E8D39E]" />
                <span>Bestsellers Only</span>
              </button>

              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="text-xs font-medium text-[#4A3B37] bg-[#FAF7F2] border border-[#E8DDCD] rounded-xl px-3 py-2 focus:outline-none focus:border-[#741727]"
              >
                <option value="recommended">Featured / Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Patron Rating</option>
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-2 border-t border-[#F2EBE0]">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? 'bg-[#5A121F] text-[#FCFAF7] shadow-xs'
                    : 'bg-[#FAF7F2] text-[#55433E] hover:bg-[#F2EBE0] border border-[#E8DDCD]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Count Header */}
        <div className="flex items-center justify-between text-xs text-[#7B6A65]">
          <div>
            Showing <strong className="text-[#350A11]">{filteredProducts.length}</strong> delicacies
            {activeCategory !== 'all' && (
              <span> in {categories.find(c => c.id === activeCategory)?.label}</span>
            )}
          </div>
          <div className="flex items-center gap-1 text-emerald-800 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span>100% Pure Vegetarian Kitchen</span>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#E8DDCD] p-8 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#FAF7F2] border border-[#E8DDCD] flex items-center justify-center text-gray-400">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#350A11]">No matching dishes found</h3>
            <p className="text-xs text-[#7B6A65] max-w-sm mx-auto">
              We couldn't find items matching "{searchTerm}". Try checking your spelling or explore another category.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setActiveCategory('all');
                setBestsellerOnly(false);
              }}
              className="px-5 py-2 text-xs font-semibold text-[#5A121F] bg-[#FAF7F2] hover:bg-[#F2EBE0] border border-[#D6B26C] rounded-xl transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                className="group rounded-2xl bg-white border border-[#E8DDCD] hover:border-[#C5A059] shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* Product Image & Badges */}
                <div className="relative aspect-4/3 overflow-hidden bg-[#F2EBE0]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                  {/* Veg Badge */}
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs p-1 rounded-sm border border-emerald-600 shadow-xs" title="100% Pure Veg">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-600"></div>
                  </div>

                  {/* Bestseller / Seasonal Tags */}
                  <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
                    {product.isSeasonal && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-[#5A121F] text-[#FAF7F2] px-2 py-0.5 rounded shadow-xs border border-[#C5A059]">
                        Seasonal
                      </span>
                    )}
                    {product.isBestseller && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-[#C5A059] text-[#350A11] px-2 py-0.5 rounded shadow-xs">
                        Bestseller
                      </span>
                    )}
                  </div>

                  {/* Quick View Button */}
                  <button
                    onClick={() => openQuickView(product)}
                    className="absolute bottom-3 right-3 p-2 rounded-xl bg-white/90 hover:bg-white text-[#350A11] shadow-xs transition-colors opacity-0 group-hover:opacity-100"
                    title="Quick View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-[#8C7A75]">
                      <span className="uppercase tracking-wider font-semibold text-[#9E742A]">
                        {product.category}
                      </span>
                      <span className="font-medium text-[#4A3B37]">{product.weightOrServing}</span>
                    </div>

                    <h3 className="font-serif text-base font-bold text-[#350A11] group-hover:text-[#741727] transition-colors mt-1 leading-snug">
                      {product.name}
                    </h3>

                    {product.hindiName && (
                      <div className="text-[11px] font-serif italic text-[#741727]/80">
                        {product.hindiName}
                      </div>
                    )}

                    <p className="text-xs text-[#6B5A55] line-clamp-2 mt-1.5 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Price & Add to Cart Button */}
                  <div className="pt-3 border-t border-[#F2EBE0] flex items-center justify-between gap-3">
                    <div>
                      <div className="font-serif text-xl font-bold text-[#350A11] tabular-nums">
                        ₹{product.price}
                      </div>
                      <div className="text-[10px] text-[#8C7A75]">
                        {product.inStock ? (
                          <span className="text-emerald-700 font-medium">In Stock</span>
                        ) : (
                          <span className="text-rose-600 font-medium">Sold Out Today</span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => onAddToCart(product)}
                      disabled={!product.inStock}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all shadow-xs ${
                        product.inStock
                          ? 'bg-[#5A121F] hover:bg-[#460E18] text-[#FAF7F2] active:scale-95'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <Plus className="w-3.5 h-3.5 text-[#E8D39E]" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-[#E8DDCD] max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="relative aspect-16/10 bg-[#F2EBE0]">
              <img
                src={quickViewProduct.image}
                alt={quickViewProduct.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <button
                onClick={() => setQuickViewProduct(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-3 left-4 bg-white/95 px-3 py-1 rounded-full text-xs font-semibold text-[#350A11]">
                Serving: {quickViewProduct.weightOrServing}
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-[#9E742A] uppercase tracking-wider font-semibold">
                  <span>{quickViewProduct.category}</span>
                  <span>·</span>
                  <span className="text-emerald-700">100% Pure Veg</span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#350A11] mt-1">
                  {quickViewProduct.name}
                </h3>
                {quickViewProduct.hindiName && (
                  <div className="text-xs font-serif text-[#741727] italic">
                    {quickViewProduct.hindiName}
                  </div>
                )}
              </div>

              <p className="text-sm text-[#55433E] leading-relaxed">
                {quickViewProduct.description}
              </p>

              {quickViewProduct.ingredients && quickViewProduct.ingredients.length > 0 && (
                <div className="space-y-1 text-xs">
                  <div className="font-semibold text-[#350A11]">Ingredients:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {quickViewProduct.ingredients.map((ing, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-[#FAF7F2] border border-[#E8DDCD] text-[#55433E]">
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {quickViewProduct.shelfLife && (
                <div className="text-xs text-[#7B6A65]">
                  <strong className="text-[#350A11]">Shelf Life:</strong> {quickViewProduct.shelfLife}
                </div>
              )}

              {/* Quantity stepper & Add CTA */}
              <div className="pt-4 border-t border-[#F2EBE0] flex items-center justify-between gap-4">
                <div>
                  <div className="font-serif text-2xl font-bold text-[#350A11] tabular-nums">
                    ₹{quickViewProduct.price * quickViewQty}
                  </div>
                  <div className="text-[11px] text-[#7B6A65]">
                    ₹{quickViewProduct.price} each
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-[#E8DDCD] rounded-xl bg-[#FAF7F2] p-1">
                    <button
                      onClick={() => setQuickViewQty(Math.max(1, quickViewQty - 1))}
                      className="p-1 text-[#350A11] hover:bg-white rounded-lg transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-3 text-xs font-bold tabular-nums text-[#350A11]">
                      {quickViewQty}
                    </span>
                    <button
                      onClick={() => setQuickViewQty(quickViewQty + 1)}
                      className="p-1 text-[#350A11] hover:bg-white rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      onAddToCart(quickViewProduct, quickViewQty);
                      setQuickViewProduct(null);
                    }}
                    className="px-5 py-2.5 bg-[#5A121F] hover:bg-[#460E18] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
                  >
                    Add to Bag
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
