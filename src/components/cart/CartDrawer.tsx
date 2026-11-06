import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShoppingBag, 
  Tag, 
  Sparkles, 
  ShieldCheck, 
  Check 
} from 'lucide-react';
import { CartItem, Coupon, BusinessSettings } from '../../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
  settings: BusinessSettings;
  coupons: Coupon[];
  appliedCoupon: Coupon | null;
  onApplyCoupon: (coupon: Coupon | null) => void;
  specialInstructions: string;
  onUpdateInstructions: (note: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  settings,
  coupons,
  appliedCoupon,
  onApplyCoupon,
  specialInstructions,
  onUpdateInstructions
}) => {
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isOpen) return null;

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + item.itemTotal, 0);

  // Discount
  let discount = 0;
  if (appliedCoupon && subtotal >= appliedCoupon.minOrderValue) {
    if (appliedCoupon.discountType === 'percentage') {
      discount = (subtotal * appliedCoupon.discountValue) / 100;
      if (appliedCoupon.maxDiscount && discount > appliedCoupon.maxDiscount) {
        discount = appliedCoupon.maxDiscount;
      }
    } else {
      discount = appliedCoupon.discountValue;
    }
  }

  const taxableAmount = Math.max(0, subtotal - discount);
  const taxes = (taxableAmount * settings.gstPercent) / 100;
  const isFreeDelivery = subtotal >= settings.freeDeliveryThreshold || subtotal === 0;
  const deliveryCharge = isFreeDelivery ? 0 : settings.deliveryFee;
  const finalTotal = taxableAmount + taxes + deliveryCharge;

  const freeDeliveryProgress = Math.min(100, (subtotal / settings.freeDeliveryThreshold) * 100);
  const remainingForFreeDelivery = Math.max(0, settings.freeDeliveryThreshold - subtotal);

  const handleApplyCoupon = (code: string) => {
    setCouponError('');
    const found = coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase() && c.isActive);
    if (!found) {
      setCouponError('Invalid coupon code');
      return;
    }
    if (subtotal < found.minOrderValue) {
      setCouponError(`Requires minimum order of ₹${found.minOrderValue}`);
      return;
    }
    onApplyCoupon(found);
    setCouponInput('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF7F2] border-l border-[#E8DDCD] shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-5 bg-white border-b border-[#E8DDCD] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#5A121F] text-[#FAF7F2] flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-[#E8D39E]" />
              </div>
              <div>
                <h2 className="font-serif text-lg font-bold text-[#350A11]">Your Sweet Bag</h2>
                <p className="text-[11px] text-[#7B6A65]">
                  {items.length} {items.length === 1 ? 'item' : 'items'} from Beni Sweets
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-[#350A11] rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Delivery Meter */}
          <div className="bg-[#F6EFE5] px-5 py-3 border-b border-[#E8DDCD] text-xs">
            {remainingForFreeDelivery > 0 ? (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[#55433E]">
                  <span>Add <strong>₹{remainingForFreeDelivery}</strong> more for <strong>FREE Delivery</strong></span>
                  <span className="font-bold text-[#741727]">{Math.round(freeDeliveryProgress)}%</span>
                </div>
                <div className="w-full bg-[#E8DDCD] h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#741727] h-full rounded-full transition-all duration-300" 
                    style={{ width: `${freeDeliveryProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>You unlocked FREE Express Delivery in Delhi!</span>
              </div>
            )}
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-white border border-[#E8DDCD] flex items-center justify-center text-gray-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#350A11]">Your bag is empty</h3>
                <p className="text-xs text-[#7B6A65] max-w-xs mx-auto">
                  Treat yourself or loved ones to our authentic pure desi ghee sweets, samosas or legendary chole bhature.
                </p>
                <button
                  onClick={onClose}
                  className="px-5 py-2 text-xs font-semibold text-[#5A121F] bg-white border border-[#D6B26C] rounded-xl hover:bg-[#FAF7F2] transition-colors"
                >
                  Browse Full Menu
                </button>
              </div>
            ) : (
              items.map(item => (
                <div
                  key={item.product.id}
                  className="p-3.5 bg-white rounded-2xl border border-[#E8DDCD] flex items-start gap-3 shadow-2xs"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-xl object-cover bg-[#F2EBE0] shrink-0 border border-[#E8DDCD]"
                    referrerPolicy="no-referrer"
                  />

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-serif text-xs font-bold text-[#350A11] truncate">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-gray-400 hover:text-rose-600 p-0.5 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-[11px] text-[#7B6A65]">
                      {item.selectedVariant || item.product.weightOrServing}
                    </div>

                    {item.customNote && (
                      <div className="text-[10px] text-[#741727] font-medium truncate">
                        {item.customNote}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center border border-[#E8DDCD] rounded-lg bg-[#FAF7F2] p-0.5">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 text-[#350A11] hover:bg-white rounded transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold tabular-nums text-[#350A11]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 text-[#350A11] hover:bg-white rounded transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="font-serif text-sm font-bold text-[#350A11] tabular-nums">
                        ₹{item.itemTotal}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}

            {items.length > 0 && (
              <div className="space-y-4 pt-2">
                {/* Coupon Box */}
                <div className="bg-white p-3.5 rounded-2xl border border-[#E8DDCD] space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#350A11]">
                    <span className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>Apply Coupon Code</span>
                    </span>
                    {appliedCoupon && (
                      <button
                        onClick={() => onApplyCoupon(null)}
                        className="text-[10px] text-rose-600 hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  {appliedCoupon ? (
                    <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-800">
                      <div>
                        <strong>{appliedCoupon.code}</strong> applied ({appliedCoupon.description})
                      </div>
                      <span className="font-bold text-emerald-700">-₹{discount.toFixed(0)}</span>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponInput}
                          onChange={e => setCouponInput(e.target.value.toUpperCase())}
                          placeholder="e.g. BENI10"
                          className="flex-1 px-3 py-1.5 text-xs bg-[#FAF7F2] border border-[#E8DDCD] rounded-xl focus:outline-none focus:border-[#741727] uppercase"
                        />
                        <button
                          onClick={() => handleApplyCoupon(couponInput)}
                          className="px-3.5 py-1.5 bg-[#5A121F] text-white text-xs font-semibold rounded-xl hover:bg-[#460E18] transition-colors"
                        >
                          Apply
                        </button>
                      </div>
                      {couponError && (
                        <div className="text-[11px] text-rose-600">{couponError}</div>
                      )}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {coupons.map(c => (
                          <button
                            key={c.code}
                            onClick={() => handleApplyCoupon(c.code)}
                            className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#FAF7F2] hover:bg-[#F2EBE0] text-[#741727] border border-[#D6B26C]/40"
                          >
                            {c.code}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Special Instructions Note */}
                <div className="bg-white p-3.5 rounded-2xl border border-[#E8DDCD] space-y-1.5">
                  <label className="text-xs font-semibold text-[#350A11] block">
                    Special Kitchen / Packaging Instructions:
                  </label>
                  <input
                    type="text"
                    value={specialInstructions}
                    onChange={e => onUpdateInstructions(e.target.value)}
                    placeholder="e.g. Extra mint chutney, pack in gift carry bag, less spicy..."
                    className="w-full px-3 py-1.5 text-xs bg-[#FAF7F2] border border-[#E8DDCD] rounded-xl focus:outline-none focus:border-[#741727]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer & Checkout Action */}
          {items.length > 0 && (
            <div className="p-5 bg-white border-t border-[#E8DDCD] space-y-3">
              <div className="space-y-1.5 text-xs text-[#55433E]">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#350A11] tabular-nums">₹{subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex items-center justify-between text-emerald-700">
                    <span>Discount ({appliedCoupon?.code})</span>
                    <span className="font-semibold tabular-nums">-₹{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span>GST ({settings.gstPercent}%)</span>
                  <span className="font-semibold text-[#350A11] tabular-nums">₹{taxes.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Delivery Charge</span>
                  <span className="font-semibold text-[#350A11] tabular-nums">
                    {deliveryCharge === 0 ? (
                      <span className="text-emerald-700 font-bold uppercase">Free</span>
                    ) : (
                      `₹${deliveryCharge}`
                    )}
                  </span>
                </div>
                <div className="pt-2 border-t border-[#F2EBE0] flex items-center justify-between text-base font-bold text-[#350A11]">
                  <span>Total Amount</span>
                  <span className="font-serif text-xl text-[#5A121F] tabular-nums">
                    ₹{finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={onCheckout}
                disabled={subtotal < settings.minOrderValue}
                className={`w-full py-3.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md ${
                  subtotal >= settings.minOrderValue
                    ? 'bg-[#5A121F] hover:bg-[#460E18] text-[#FCFAF7] active:scale-98'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                {subtotal < settings.minOrderValue ? (
                  <span>Min Order ₹{settings.minOrderValue} (Add ₹{settings.minOrderValue - subtotal} more)</span>
                ) : (
                  <>
                    <span>Proceed to Secure Checkout</span>
                    <ArrowRight className="w-4 h-4 text-[#E8D39E]" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
