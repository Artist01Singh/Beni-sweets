import React, { useState } from 'react';
import { Gift, Sparkles, Check, Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Product } from '../../types';

interface GiftingStudioProps {
  sweetsList: Product[];
  onAddToCart: (customProduct: Product, quantity?: number, selectedVariant?: string, note?: string) => void;
  onOpenCatering: () => void;
}

export const GiftingStudio: React.FC<GiftingStudioProps> = ({
  sweetsList,
  onAddToCart,
  onOpenCatering
}) => {
  // Custom Box Builder State
  const [selectedBoxStyle, setSelectedBoxStyle] = useState<'maroon' | 'emerald' | 'ivory'>('maroon');
  const [selectedBoxSize, setSelectedBoxSize] = useState<'500g' | '1kg' | '1.5kg'>('1kg');
  const [selectedSweets, setSelectedSweets] = useState<string[]>([
    'Diamond Kaju Katli (Pure Cashew)',
    'Desi Ghee Saffron Motichoor Laddu',
    'Heritage Alwar Milk Cake',
    'Royal Rajasthani Malai Ghevar'
  ]);
  const [recipientName, setRecipientName] = useState('');
  const [senderName, setSenderName] = useState('');
  const [greetingMessage, setGreetingMessage] = useState('Wishing you sweet moments and prosperous celebrations!');
  const [isAdded, setIsAdded] = useState(false);

  const boxStyles = [
    {
      id: 'maroon' as const,
      name: 'Royal Velvet Maroon',
      desc: 'Embossed with antique gold filigree and silk tassel',
      colorClass: 'bg-[#5A121F] text-[#FAF7F2]'
    },
    {
      id: 'emerald' as const,
      name: 'Emerald Heritage Zari',
      desc: 'Deep jewel green finish with royal peacock crest',
      colorClass: 'bg-[#0E3A2F] text-[#FAF7F2]'
    },
    {
      id: 'ivory' as const,
      name: 'Ivory Gold Brocade',
      desc: 'Subtle textured pearl ivory with warm golden foil',
      colorClass: 'bg-[#F4EFE6] text-[#350A11] border border-[#D6B26C]'
    }
  ];

  const boxSizes = [
    { id: '500g' as const, name: 'Classic (500g)', slots: 2, price: 650 },
    { id: '1kg' as const, name: 'Royal Grand (1kg)', slots: 4, price: 1250 },
    { id: '1.5kg' as const, name: 'Imperial Hamper (1.5kg)', slots: 6, price: 1850 }
  ];

  const currentSizeConfig = boxSizes.find(s => s.id === selectedBoxSize)!;

  const toggleSweetSelection = (sweetName: string) => {
    if (selectedSweets.includes(sweetName)) {
      if (selectedSweets.length > 1) {
        setSelectedSweets(selectedSweets.filter(s => s !== sweetName));
      }
    } else {
      if (selectedSweets.length < currentSizeConfig.slots) {
        setSelectedSweets([...selectedSweets, sweetName]);
      } else {
        // Replace last
        const updated = [...selectedSweets.slice(0, currentSizeConfig.slots - 1), sweetName];
        setSelectedSweets(updated);
      }
    }
  };

  const handleAddCustomBoxToCart = () => {
    const customProduct: Product = {
      id: `custom-box-${Date.now()}`,
      name: `Bespoke ${boxStyles.find(b => b.id === selectedBoxStyle)?.name} Gift Box (${selectedBoxSize})`,
      category: 'gifting',
      description: `Custom curated hamper containing: ${selectedSweets.join(', ')}. Gift Note: "${greetingMessage}" to ${recipientName || 'Patron'} from ${senderName || 'Sender'}`,
      price: currentSizeConfig.price,
      weightOrServing: `${selectedBoxSize} Hamper`,
      isVeg: true,
      inStock: true,
      isGifting: true,
      rating: 5.0,
      reviewsCount: 1,
      image: '/src/assets/images/gift_luxury_mithai_box_1793965254075.jpg'
    };

    onAddToCart(
      customProduct,
      1,
      `${boxStyles.find(b => b.id === selectedBoxStyle)?.name} (${selectedBoxSize})`,
      `To: ${recipientName} | From: ${senderName} | Note: ${greetingMessage}`
    );

    // Confetti celebration
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 3000);
  };

  return (
    <div className="py-12 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-[#9E742A] bg-[#F2EBE0] px-3.5 py-1.5 rounded-full border border-[#D6B26C]/40">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>The Gifting Connoisseur</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#350A11]">
            Custom Sweet Gifting Studio
          </h1>
          <p className="text-sm sm:text-base text-[#66544F] leading-relaxed">
            Curate bespoke celebratory sweet boxes for Diwali, weddings, milestone anniversaries, and corporate partnerships. Hand-assembled with personalized calligraphy notes.
          </p>
        </div>

        {/* Custom Box Builder Section */}
        <div className="bg-white rounded-3xl border border-[#E8DDCD] shadow-sm p-6 sm:p-10 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left: Box Visual Preview (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="relative rounded-2xl overflow-hidden border-2 border-[#C5A059] shadow-lg bg-[#FAF7F2] p-2">
                <img
                  src="/src/assets/images/gift_luxury_mithai_box_1793965254075.jpg"
                  alt="Custom Indian Sweet Gift Hamper"
                  className="w-full aspect-square object-cover rounded-xl"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-[#350A11] text-[#E8D39E] text-xs font-semibold px-3 py-1 rounded-full border border-[#C5A059]">
                  Live Hamper Preview
                </div>
              </div>

              {/* Selected summary card */}
              <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E8DDCD] space-y-3">
                <div className="flex items-center justify-between text-xs text-[#7B6A65]">
                  <span>Box Style:</span>
                  <strong className="text-[#350A11]">{boxStyles.find(b => b.id === selectedBoxStyle)?.name}</strong>
                </div>
                <div className="flex items-center justify-between text-xs text-[#7B6A65]">
                  <span>Capacity:</span>
                  <strong className="text-[#350A11]">{currentSizeConfig.name} ({currentSizeConfig.slots} Sweets)</strong>
                </div>

                <div className="text-xs text-[#7B6A65] space-y-1 pt-1 border-t border-[#E8DDCD]">
                  <span className="font-semibold text-[#350A11]">Included Sweets:</span>
                  <ul className="list-disc list-inside space-y-0.5 text-[#55433E]">
                    {selectedSweets.map((s, i) => (
                      <li key={i} className="truncate">{s}</li>
                    ))}
                  </ul>
                </div>

                {recipientName && (
                  <div className="text-xs text-[#7B6A65] pt-1 border-t border-[#E8DDCD]">
                    <span className="font-semibold text-[#350A11]">Personalized For:</span> {recipientName}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Step-by-Step Customizer (7 cols) */}
            <div className="lg:col-span-7 space-y-8">
              {/* Step 1: Select Box Style */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#9E742A]">
                  <span className="w-5 h-5 rounded-full bg-[#5A121F] text-white flex items-center justify-center text-[10px]">1</span>
                  <span>Select Royal Box Finish</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {boxStyles.map(box => (
                    <button
                      key={box.id}
                      onClick={() => setSelectedBoxStyle(box.id)}
                      className={`p-3.5 rounded-xl text-left transition-all border ${
                        selectedBoxStyle === box.id
                          ? 'border-[#741727] ring-2 ring-[#741727]/20 shadow-xs'
                          : 'border-[#E8DDCD] hover:border-[#D6B26C]'
                      }`}
                    >
                      <div className="font-serif font-bold text-xs text-[#350A11]">{box.name}</div>
                      <div className="text-[11px] text-[#7B6A65] mt-1 line-clamp-2">{box.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Select Box Size */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#9E742A]">
                  <span className="w-5 h-5 rounded-full bg-[#5A121F] text-white flex items-center justify-center text-[10px]">2</span>
                  <span>Select Size & Weight</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {boxSizes.map(sz => (
                    <button
                      key={sz.id}
                      onClick={() => {
                        setSelectedBoxSize(sz.id);
                        if (selectedSweets.length > sz.slots) {
                          setSelectedSweets(selectedSweets.slice(0, sz.slots));
                        }
                      }}
                      className={`p-3 rounded-xl text-center transition-all border ${
                        selectedBoxSize === sz.id
                          ? 'bg-[#5A121F] text-white border-[#5A121F] shadow-xs'
                          : 'bg-[#FAF7F2] text-[#350A11] border-[#E8DDCD] hover:bg-[#F2EBE0]'
                      }`}
                    >
                      <div className="font-bold text-xs">{sz.name}</div>
                      <div className="text-[11px] opacity-80 mt-0.5">{sz.slots} Compartments</div>
                      <div className="font-serif font-bold text-sm mt-1">₹{sz.price}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Pick Sweets to Fill Slots */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#9E742A]">
                    <span className="w-5 h-5 rounded-full bg-[#5A121F] text-white flex items-center justify-center text-[10px]">3</span>
                    <span>Choose Delicacies ({selectedSweets.length}/{currentSizeConfig.slots} Selected)</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto p-1">
                  {sweetsList.map(sweet => {
                    const isSelected = selectedSweets.includes(sweet.name);
                    return (
                      <button
                        key={sweet.id}
                        type="button"
                        onClick={() => toggleSweetSelection(sweet.name)}
                        className={`p-2.5 rounded-xl text-left text-xs transition-colors border flex items-center justify-between gap-2 ${
                          isSelected
                            ? 'bg-[#F6EFE5] border-[#C5A059] text-[#350A11] font-semibold'
                            : 'bg-white border-[#E8DDCD] text-[#55433E] hover:bg-[#FAF7F2]'
                        }`}
                      >
                        <span className="truncate">{sweet.name}</span>
                        {isSelected && <Check className="w-4 h-4 text-[#741727] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 4: Complimentary Gift Note */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#9E742A]">
                  <span className="w-5 h-5 rounded-full bg-[#5A121F] text-white flex items-center justify-center text-[10px]">4</span>
                  <span>Personalized Greeting Card (Included)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={recipientName}
                    onChange={e => setRecipientName(e.target.value)}
                    placeholder="Recipient's Name (e.g. Mr. & Mrs. Kapoor)"
                    className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#E8DDCD] rounded-xl focus:outline-none focus:border-[#741727]"
                  />
                  <input
                    type="text"
                    value={senderName}
                    onChange={e => setSenderName(e.target.value)}
                    placeholder="From (e.g. Rohit & Family)"
                    className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#E8DDCD] rounded-xl focus:outline-none focus:border-[#741727]"
                  />
                </div>
                <textarea
                  rows={2}
                  value={greetingMessage}
                  onChange={e => setGreetingMessage(e.target.value)}
                  placeholder="Your handwritten blessing message..."
                  className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#E8DDCD] rounded-xl focus:outline-none focus:border-[#741727]"
                />
              </div>

              {/* CTA Action */}
              <div className="pt-4 border-t border-[#F2EBE0] flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-[#7B6A65]">Total Hamper Price</div>
                  <div className="font-serif text-3xl font-bold text-[#350A11] tabular-nums">
                    ₹{currentSizeConfig.price}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={onOpenCatering}
                    className="px-4 py-3 text-xs font-semibold text-[#5A121F] hover:bg-[#FAF7F2] border border-[#D6B26C] rounded-xl transition-colors"
                  >
                    Bulk Corporate Order (50+ Boxes)
                  </button>

                  <button
                    onClick={handleAddCustomBoxToCart}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#5A121F] hover:bg-[#460E18] text-[#FCFAF7] text-xs font-semibold rounded-xl shadow-md transition-all active:scale-95"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#E8D39E]" />
                    <span>{isAdded ? 'Added to Bag!' : 'Add Custom Hamper'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
