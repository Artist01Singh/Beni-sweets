import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  Printer, 
  Share2, 
  Search, 
  Package, 
  ChevronRight, 
  ArrowLeft,
  Truck,
  CookingPot,
  Sparkles,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { WhatsAppService } from '../../services/whatsappService';
import { ImageWithFallback } from '../common/ImageWithFallback';

interface OrderTrackingModalProps {
  initialOrder?: Order | null;
  allOrders: Order[];
  onClose?: () => void;
  onSelectOrder?: (order: Order) => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  initialOrder,
  allOrders,
  onClose,
  onSelectOrder
}) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(
    initialOrder || (allOrders.length > 0 ? allOrders[0] : null)
  );
  const [searchInput, setSearchInput] = useState('');
  const [searchError, setSearchError] = useState('');

  const STAGES: { status: OrderStatus; label: string; desc: string; icon: any }[] = [
    {
      status: 'Order Received',
      label: 'Order Received',
      desc: 'Received by kitchen counter at Vijay Chowk',
      icon: Clock
    },
    {
      status: 'Order Confirmed',
      label: 'Order Confirmed',
      desc: 'Accepted by store manager and verified',
      icon: CheckCircle2
    },
    {
      status: 'Preparing Your Order',
      label: 'Preparing Your Order',
      desc: 'Master halwai packing fresh sweets & cooking hot food',
      icon: CookingPot
    },
    {
      status: 'Ready for Pickup',
      label: 'Ready for Pickup',
      desc: 'Sealed with hygiene seal, waiting at counter / rider dispatch',
      icon: Package
    },
    {
      status: 'Out for Delivery',
      label: 'Out for Delivery',
      desc: 'Delivery partner on route with thermal food box',
      icon: Truck
    },
    {
      status: 'Delivered',
      label: 'Delivered',
      desc: 'Enjoy your authentic sweets & meal!',
      icon: Sparkles
    }
  ];

  const getStageIndex = (status: OrderStatus) => {
    return STAGES.findIndex(s => s.status === status);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');
    const query = searchInput.trim().toUpperCase();
    if (!query) return;

    const match = allOrders.find(
      o =>
        o.id.toUpperCase() === query ||
        o.orderNumber.toUpperCase() === query ||
        o.customer.phone.replace(/[^0-9]/g, '').includes(query.replace(/[^0-9]/g, ''))
    );

    if (match) {
      setSelectedOrder(match);
      if (onSelectOrder) onSelectOrder(match);
      setSearchInput('');
    } else {
      setSearchError(`No order found for "${searchInput}". Please check Order ID (e.g. #1042) or mobile number.`);
    }
  };

  const handlePrintInvoice = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const currentStageIndex = selectedOrder ? getStageIndex(selectedOrder.status) : -1;

  return (
    <div className="py-12 bg-[#FAF7F2] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="text-xs font-semibold tracking-widest uppercase text-[#9E742A]">
            Real-Time Kitchen Updates
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#350A11]">
            Track Your Food & Sweets Order
          </h1>
          <p className="text-sm text-[#66544F]">
            Check live preparation status, dispatch updates, and view your tax invoice.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-[#E8DDCD] shadow-xs">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#8C7A75] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder="Enter Order Number (#1042) or 10-digit Mobile..."
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#FAF7F2] border border-[#E8DDCD] rounded-xl focus:outline-none focus:border-[#741727]"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#5A121F] hover:bg-[#460E18] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors shrink-0"
            >
              Track Order
            </button>
          </form>

          {searchError && (
            <div className="text-xs text-rose-600 mt-2 px-1">{searchError}</div>
          )}

          {/* Recent orders pill selector if available */}
          {allOrders.length > 0 && (
            <div className="pt-3 mt-3 border-t border-[#F2EBE0] flex items-center gap-2 overflow-x-auto text-xs text-[#7B6A65]">
              <span className="shrink-0 text-[11px] font-semibold">Your Recent Orders:</span>
              {allOrders.slice(0, 4).map(o => (
                <button
                  key={o.id}
                  onClick={() => setSelectedOrder(o)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium shrink-0 transition-colors ${
                    selectedOrder?.id === o.id
                      ? 'bg-[#5A121F] text-white'
                      : 'bg-[#FAF7F2] hover:bg-[#F2EBE0] text-[#350A11] border border-[#E8DDCD]'
                  }`}
                >
                  {o.orderNumber} ({o.status})
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selected Order Content */}
        {selectedOrder ? (
          <div className="bg-white rounded-3xl border border-[#E8DDCD] shadow-sm overflow-hidden space-y-8 p-6 sm:p-8">
            {/* Order Top Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8DDCD]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif text-2xl font-bold text-[#350A11]">
                    Order {selectedOrder.orderNumber}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#F2EBE0] text-[#741727] border border-[#D6B26C]/40">
                    {selectedOrder.orderType.toUpperCase()}
                  </span>
                </div>
                <div className="text-xs text-[#7B6A65] mt-1">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintInvoice}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#F2EBE0] border border-[#E8DDCD] text-xs font-semibold text-[#350A11] transition-colors"
                  title="Print Tax Invoice"
                >
                  <Printer className="w-3.5 h-3.5 text-[#741727]" />
                  <span>Print Receipt</span>
                </button>

                <a
                  href={WhatsAppService.getOrderWhatsAppUrl(selectedOrder)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>WhatsApp Updates</span>
                </a>
              </div>
            </div>

            {/* Smart 6-Stage Visual Timeline */}
            <div className="space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#350A11]">
                Live Preparation & Delivery Timeline
              </h3>

              <div className="relative pl-6 sm:pl-8 border-l-2 border-[#D6B26C]/40 space-y-6 my-4 ml-3">
                {STAGES.map((stage, idx) => {
                  const isDone = currentStageIndex >= idx;
                  const isCurrent = currentStageIndex === idx;
                  const StageIcon = stage.icon;

                  return (
                    <div key={stage.status} className="relative">
                      {/* Milestone Dot / Icon */}
                      <div
                        className={`absolute -left-[35px] sm:-left-[43px] top-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors border ${
                          isDone
                            ? 'bg-[#5A121F] text-[#FAF7F2] border-[#C5A059]'
                            : 'bg-white text-gray-300 border-[#E8DDCD]'
                        } ${isCurrent ? 'ring-4 ring-[#741727]/20 scale-110' : ''}`}
                      >
                        <StageIcon className="w-4 h-4" />
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4
                            className={`text-sm font-bold ${
                              isDone ? 'text-[#350A11]' : 'text-gray-400'
                            }`}
                          >
                            {idx + 1}. {stage.label}
                          </h4>
                          {isCurrent && (
                            <span className="text-[10px] font-semibold uppercase tracking-wider bg-[#5A121F] text-white px-2 py-0.5 rounded">
                              Current Status
                            </span>
                          )}
                        </div>
                        <p className={`text-xs ${isDone ? 'text-[#6B5A55]' : 'text-gray-400'}`}>
                          {stage.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Customer & Delivery Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#E8DDCD]">
              <div className="space-y-2 text-xs">
                <div className="font-semibold text-[#350A11] uppercase tracking-wider text-[11px] text-[#9E742A]">
                  Customer Details
                </div>
                <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8DDCD] space-y-1 text-[#55433E]">
                  <div className="font-bold text-[#350A11]">{selectedOrder.customer.name}</div>
                  <div>Phone: {selectedOrder.customer.phone}</div>
                  {selectedOrder.customer.email && <div>Email: {selectedOrder.customer.email}</div>}
                  <div className="text-[11px] text-[#741727] font-semibold mt-1">
                    Slot: {selectedOrder.preferredTime}
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="font-semibold text-[#350A11] uppercase tracking-wider text-[11px] text-[#9E742A]">
                  {selectedOrder.orderType === 'delivery' ? 'Delivery Address' : 'Pickup Address'}
                </div>
                <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8DDCD] space-y-1 text-[#55433E]">
                  {selectedOrder.orderType === 'delivery' ? (
                    <>
                      <div className="font-bold text-[#350A11]">{selectedOrder.customer.address}</div>
                      <div>Landmark: {selectedOrder.customer.landmark || 'None specified'}</div>
                      <div>Delhi - {selectedOrder.customer.pincode}</div>
                    </>
                  ) : (
                    <>
                      <div className="font-bold text-[#350A11]">Beni Sweets Corner & Restaurant</div>
                      <div>L-35, Vijay Chowk, Laxmi Nagar, Delhi 110092</div>
                      <div className="text-emerald-700 font-semibold mt-1">Ready for pickup at counter</div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Itemized Order Details */}
            <div className="space-y-3 pt-4 border-t border-[#E8DDCD]">
              <h4 className="font-serif text-base font-bold text-[#350A11]">
                Items in This Order
              </h4>
              <div className="divide-y divide-[#F2EBE0] border border-[#E8DDCD] rounded-2xl overflow-hidden bg-white">
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="p-3.5 flex items-center justify-between text-xs gap-4">
                    <div className="flex items-center gap-3">
                      <ImageWithFallback
                        src={item.product.image}
                        alt={item.product.name}
                        fallbackTitle={item.product.name}
                        className="w-12 h-12 rounded-lg object-cover bg-[#FAF7F2] shrink-0"
                      />
                      <div>
                        <div className="font-semibold text-[#350A11]">{item.product.name}</div>
                        <div className="text-[11px] text-[#7B6A65]">
                          {item.quantity} x {item.selectedVariant || item.product.weightOrServing}
                        </div>
                      </div>
                    </div>
                    <div className="font-serif font-bold text-sm text-[#350A11] tabular-nums">
                      ₹{item.itemTotal}
                    </div>
                  </div>
                ))}
              </div>

              {/* Financial Summary */}
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DDCD] space-y-1.5 text-xs text-[#55433E]">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-[#350A11]">₹{selectedOrder.subtotal}</span>
                </div>
                {selectedOrder.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount ({selectedOrder.couponCode}):</span>
                    <span>-₹{selectedOrder.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>GST (5%):</span>
                  <span>₹{selectedOrder.taxes.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge:</span>
                  <span>{selectedOrder.deliveryCharge === 0 ? 'FREE' : `₹${selectedOrder.deliveryCharge}`}</span>
                </div>
                <div className="pt-2 border-t border-[#E8DDCD] flex justify-between font-bold text-sm text-[#350A11]">
                  <span>Total Paid ({selectedOrder.paymentMethod.toUpperCase()}):</span>
                  <span className="font-serif text-base text-[#5A121F]">₹{selectedOrder.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#E8DDCD] p-8 space-y-3">
            <Package className="w-12 h-12 text-gray-400 mx-auto" />
            <h3 className="font-serif text-xl font-bold text-[#350A11]">No Order Selected</h3>
            <p className="text-xs text-[#7B6A65]">
              Enter your Order Number or mobile number above to view live progress.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
