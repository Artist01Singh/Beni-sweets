import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Phone, 
  User, 
  CreditCard, 
  QrCode, 
  Banknote, 
  Store, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  Copy,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  CartItem, 
  Coupon, 
  BusinessSettings, 
  CustomerDetails, 
  PaymentMethod, 
  Order 
} from '../../types';
import { PaymentService } from '../../services/paymentService';
import { StorageService } from '../../services/storage';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  appliedCoupon: Coupon | null;
  specialInstructions: string;
  settings: BusinessSettings;
  onOrderPlaced: (order: Order) => void;
  initialCustomer?: CustomerDetails;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  appliedCoupon,
  specialInstructions,
  settings,
  onOrderPlaced,
  initialCustomer
}) => {
  const [orderType, setOrderType] = useState<'delivery' | 'takeaway'>('delivery');
  const [preferredTime, setPreferredTime] = useState<string>('Express (Within 30-45 mins)');
  const [customer, setCustomer] = useState<CustomerDetails>({
    name: initialCustomer?.name || '',
    phone: initialCustomer?.phone || '',
    email: initialCustomer?.email || '',
    address: initialCustomer?.address || '',
    landmark: initialCustomer?.landmark || '',
    pincode: initialCustomer?.pincode || '110092',
    city: 'Delhi'
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [upiUtr, setUpiUtr] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Razorpay card state
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('123');

  if (!isOpen) return null;

  // Financial Calculations
  const subtotal = items.reduce((sum, item) => sum + item.itemTotal, 0);
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
  const isFreeDelivery = orderType === 'takeaway' || subtotal >= settings.freeDeliveryThreshold;
  const deliveryCharge = isFreeDelivery ? 0 : settings.deliveryFee;
  const finalTotal = taxableAmount + taxes + deliveryCharge;

  // Validation
  const validateForm = (): boolean => {
    setErrorMessage('');
    if (!customer.name.trim()) {
      setErrorMessage('Please enter your full name');
      return false;
    }
    const cleanPhone = customer.phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number for order updates');
      return false;
    }
    if (orderType === 'delivery') {
      if (!customer.address?.trim()) {
        setErrorMessage('Please provide complete delivery street address');
        return false;
      }
      if (!customer.pincode?.trim() || customer.pincode.length !== 6) {
        setErrorMessage('Please provide a valid 6-digit Delhi pincode');
        return false;
      }
    }
    return true;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsProcessing(true);
    setErrorMessage('');

    try {
      // Server-like payment verification
      const verifyResult = await PaymentService.verifyTestPayment(paymentMethod, {
        utrOrTransactionId: upiUtr,
        razorpayPaymentId: `pay_${Date.now()}`
      });

      if (!verifyResult.success) {
        throw new Error(verifyResult.message || 'Payment verification failed');
      }

      // Generate realistic order
      const orderId = `BENI-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const orderNumber = `#${orderId.slice(-4)}`;

      const newOrder: Order = {
        id: orderId,
        orderNumber,
        items,
        customer,
        orderType,
        preferredTime,
        specialInstructions,
        couponCode: appliedCoupon?.code,
        discountAmount: discount,
        subtotal,
        taxes,
        deliveryCharge,
        totalAmount: finalTotal,
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' || paymentMethod === 'pay_at_store' ? 'pending' : 'verified',
        status: 'Order Received',
        statusHistory: [
          {
            status: 'Order Received',
            timestamp: new Date().toISOString(),
            note: `Payment confirmed via ${paymentMethod.toUpperCase()}`
          }
        ],
        createdAt: new Date().toISOString()
      };

      // Save order to persistent store
      StorageService.saveOrder(newOrder);

      // Trigger Confetti
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 }
      });

      setIsProcessing(false);
      onOrderPlaced(newOrder);
      onClose();
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMessage(err.message || 'Unable to place order. Please try again.');
    }
  };

  // Generate UPI details
  const upiDetails = PaymentService.createUpiPaymentDetails(finalTotal, 'NEW_ORDER', settings.upiVpa);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FAF7F2] rounded-3xl border border-[#E8DDCD] shadow-2xl max-w-2xl w-full overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 bg-white border-b border-[#E8DDCD] flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#350A11]">
              Complete Your Order
            </h2>
            <p className="text-xs text-[#7B6A65] mt-0.5">
              Beni Sweets Corner & Restaurant · Laxmi Nagar, Delhi
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handlePlaceOrder} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2.5 text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Delivery or Takeaway Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#9E742A] block">
              1. Choose Order Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setOrderType('delivery')}
                className={`py-3 px-4 rounded-xl text-left border transition-all flex items-center gap-3 ${
                  orderType === 'delivery'
                    ? 'bg-[#5A121F] text-white border-[#5A121F] shadow-xs'
                    : 'bg-white text-[#350A11] border-[#E8DDCD] hover:bg-[#FAF7F2]'
                }`}
              >
                <MapPin className="w-4 h-4 text-[#E8D39E]" />
                <div>
                  <div className="text-xs font-bold">Home Delivery</div>
                  <div className="text-[10px] opacity-80">Delhi NCR Service</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setOrderType('takeaway')}
                className={`py-3 px-4 rounded-xl text-left border transition-all flex items-center gap-3 ${
                  orderType === 'takeaway'
                    ? 'bg-[#5A121F] text-white border-[#5A121F] shadow-xs'
                    : 'bg-white text-[#350A11] border-[#E8DDCD] hover:bg-[#FAF7F2]'
                }`}
              >
                <Store className="w-4 h-4 text-[#E8D39E]" />
                <div>
                  <div className="text-xs font-bold">Takeaway / Pickup</div>
                  <div className="text-[10px] opacity-80">Collect at Vijay Chowk</div>
                </div>
              </button>
            </div>
          </div>

          {/* Preferred Time Slot */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#9E742A] block">
              2. Preferred Timing
            </label>
            <select
              value={preferredTime}
              onChange={e => setPreferredTime(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#E8DDCD] rounded-xl focus:outline-none focus:border-[#741727] text-[#350A11]"
            >
              <option value="Express (Within 30-45 mins)">Express Hot & Fresh (30–45 mins)</option>
              <option value="Today Evening (5:00 PM – 7:00 PM)">Today Evening (5:00 PM – 7:00 PM)</option>
              <option value="Tomorrow Morning (9:00 AM – 11:00 AM)">Tomorrow Morning (9:00 AM – 11:00 AM)</option>
              <option value="Festival / Specific Celebration Time">Specific Celebration Slot (Specify in note)</option>
            </select>
          </div>

          {/* Customer Contact & Address */}
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#9E742A] block">
              3. Customer Contact & Details
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <input
                  type="text"
                  required
                  value={customer.name}
                  onChange={e => setCustomer({ ...customer, name: e.target.value })}
                  placeholder="Full Name *"
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#E8DDCD] rounded-xl focus:outline-none focus:border-[#741727]"
                />
              </div>

              <div>
                <input
                  type="tel"
                  required
                  value={customer.phone}
                  onChange={e => setCustomer({ ...customer, phone: e.target.value })}
                  placeholder="Mobile Number (e.g. 9811100486) *"
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#E8DDCD] rounded-xl focus:outline-none focus:border-[#741727]"
                />
              </div>
            </div>

            <div>
              <input
                type="email"
                value={customer.email || ''}
                onChange={e => setCustomer({ ...customer, email: e.target.value })}
                placeholder="Email Address (Optional for invoice)"
                className="w-full px-3.5 py-2 text-xs bg-white border border-[#E8DDCD] rounded-xl focus:outline-none focus:border-[#741727]"
              />
            </div>

            {orderType === 'delivery' && (
              <div className="space-y-3 pt-2">
                <textarea
                  rows={2}
                  required
                  value={customer.address || ''}
                  onChange={e => setCustomer({ ...customer, address: e.target.value })}
                  placeholder="Delivery Address (House/Flat No, Building, Street) *"
                  className="w-full px-3.5 py-2 text-xs bg-white border border-[#E8DDCD] rounded-xl focus:outline-none focus:border-[#741727]"
                />

                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={customer.landmark || ''}
                    onChange={e => setCustomer({ ...customer, landmark: e.target.value })}
                    placeholder="Nearby Landmark (e.g. Near Metro)"
                    className="w-full px-3.5 py-2 text-xs bg-white border border-[#E8DDCD] rounded-xl focus:outline-none focus:border-[#741727]"
                  />

                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={customer.pincode || ''}
                    onChange={e => setCustomer({ ...customer, pincode: e.target.value })}
                    placeholder="Delhi Pincode (e.g. 110092) *"
                    className="w-full px-3.5 py-2 text-xs bg-white border border-[#E8DDCD] rounded-xl focus:outline-none focus:border-[#741727]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#9E742A] block">
              4. Payment Method
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  paymentMethod === 'upi'
                    ? 'bg-[#5A121F] text-white border-[#5A121F] shadow-xs'
                    : 'bg-white text-[#350A11] border-[#E8DDCD] hover:bg-[#FAF7F2]'
                }`}
              >
                <QrCode className="w-5 h-5 mx-auto mb-1 text-[#E8D39E]" />
                <div className="text-xs font-bold">UPI / QR</div>
                <div className="text-[10px] opacity-80">GPay, PhonePe, Paytm</div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('razorpay')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  paymentMethod === 'razorpay'
                    ? 'bg-[#5A121F] text-white border-[#5A121F] shadow-xs'
                    : 'bg-white text-[#350A11] border-[#E8DDCD] hover:bg-[#FAF7F2]'
                }`}
              >
                <CreditCard className="w-5 h-5 mx-auto mb-1 text-[#E8D39E]" />
                <div className="text-xs font-bold">Cards / Netbanking</div>
                <div className="text-[10px] opacity-80">Razorpay Gateway</div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  paymentMethod === 'cod'
                    ? 'bg-[#5A121F] text-white border-[#5A121F] shadow-xs'
                    : 'bg-white text-[#350A11] border-[#E8DDCD] hover:bg-[#FAF7F2]'
                }`}
              >
                <Banknote className="w-5 h-5 mx-auto mb-1 text-[#E8D39E]" />
                <div className="text-xs font-bold">Cash on Delivery</div>
                <div className="text-[10px] opacity-80">Pay upon delivery</div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('pay_at_store')}
                className={`p-3 rounded-xl border text-center transition-all ${
                  paymentMethod === 'pay_at_store'
                    ? 'bg-[#5A121F] text-white border-[#5A121F] shadow-xs'
                    : 'bg-white text-[#350A11] border-[#E8DDCD] hover:bg-[#FAF7F2]'
                }`}
              >
                <Store className="w-5 h-5 mx-auto mb-1 text-[#E8D39E]" />
                <div className="text-xs font-bold">Pay at Store</div>
                <div className="text-[10px] opacity-80">Counter settlement</div>
              </button>
            </div>

            {/* UPI Dynamic Details Box */}
            {paymentMethod === 'upi' && (
              <div className="p-4 rounded-2xl bg-white border border-[#C5A059]/40 space-y-3">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Clean SVG/CSS rendered QR code representation */}
                  <div className="w-28 h-28 bg-[#FAF7F2] p-2 rounded-xl border border-[#D6B26C] flex flex-col items-center justify-center shrink-0 text-center">
                    <QrCode className="w-16 h-16 text-[#350A11]" />
                    <span className="text-[9px] font-mono text-[#741727] font-bold mt-1">UPI: {settings.upiVpa}</span>
                  </div>

                  <div className="space-y-1 text-xs text-[#55433E]">
                    <div className="font-semibold text-[#350A11]">Pay ₹{finalTotal.toFixed(2)} via Any UPI App</div>
                    <p className="text-[11px] text-[#7B6A65]">
                      Scan with Google Pay, PhonePe, Paytm, or BHIM. Enter optional UTR / Reference ID below for instant reconciliation.
                    </p>
                    <div className="flex items-center gap-2 pt-1 font-mono text-[11px] text-[#5A121F]">
                      <span>VPA: {settings.upiVpa}</span>
                    </div>
                  </div>
                </div>

                <input
                  type="text"
                  value={upiUtr}
                  onChange={e => setUpiUtr(e.target.value)}
                  placeholder="Enter 12-digit UPI Reference / UTR No. (Optional)"
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E8DDCD] rounded-xl focus:outline-none focus:border-[#741727]"
                />
              </div>
            )}

            {/* Razorpay Test Mode Box */}
            {paymentMethod === 'razorpay' && (
              <div className="p-4 rounded-2xl bg-white border border-[#C5A059]/40 space-y-3 text-xs">
                <div className="flex items-center justify-between text-[#7B6A65]">
                  <span className="font-semibold text-[#350A11]">Razorpay Test Mode Integration</span>
                  <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 text-[10px] font-bold">Sandbox Active</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value)}
                    placeholder="Card Number"
                    className="col-span-2 px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E8DDCD] rounded-xl"
                  />
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={e => setCardExpiry(e.target.value)}
                    placeholder="MM/YY"
                    className="px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E8DDCD] rounded-xl"
                  />
                  <input
                    type="password"
                    maxLength={3}
                    value={cardCvv}
                    onChange={e => setCardCvv(e.target.value)}
                    placeholder="CVV"
                    className="px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E8DDCD] rounded-xl"
                  />
                </div>
                <p className="text-[10px] text-gray-500">
                  Pre-filled with test credentials for immediate evaluation. No real card will be charged.
                </p>
              </div>
            )}
          </div>

          {/* Order Summary & Submit Button */}
          <div className="pt-4 border-t border-[#E8DDCD] space-y-3">
            <div className="flex items-center justify-between text-xs text-[#55433E]">
              <span>Items Subtotal ({items.length} items):</span>
              <span className="font-semibold text-[#350A11]">₹{subtotal}</span>
            </div>
            {discount > 0 && (
              <div className="flex items-center justify-between text-xs text-emerald-700">
                <span>Coupon Discount ({appliedCoupon?.code}):</span>
                <span className="font-semibold">-₹{discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-xs text-[#55433E]">
              <span>GST (5%):</span>
              <span className="font-semibold text-[#350A11]">₹{taxes.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-[#55433E]">
              <span>Delivery Charges:</span>
              <span className="font-semibold text-[#350A11]">
                {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
              </span>
            </div>
            <div className="pt-2 border-t border-[#F2EBE0] flex items-center justify-between text-base font-bold text-[#350A11]">
              <span>Grand Total to Pay:</span>
              <span className="font-serif text-2xl text-[#5A121F] tabular-nums">
                ₹{finalTotal.toFixed(2)}
              </span>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className={`w-full py-4 px-6 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-md ${
                isProcessing
                  ? 'bg-gray-400 text-white cursor-wait'
                  : 'bg-[#5A121F] hover:bg-[#460E18] text-[#FCFAF7] active:scale-98'
              }`}
            >
              {isProcessing ? (
                <span>Confirming Order with Delhi Kitchen...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 text-[#E8D39E]" />
                  <span>Place Order · ₹{finalTotal.toFixed(2)}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
