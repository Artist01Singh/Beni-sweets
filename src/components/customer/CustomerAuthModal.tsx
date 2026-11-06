import React, { useState } from 'react';
import { X, User, Phone, MapPin, Package, RefreshCw, LogOut, CheckCircle2 } from 'lucide-react';
import { CustomerUser, Order, Product } from '../../types';
import { StorageService } from '../../services/storage';

interface CustomerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: CustomerUser | null;
  onCustomerUpdate: (customer: CustomerUser | null) => void;
  orders: Order[];
  onReorder: (order: Order) => void;
  onTrackOrder: (order: Order) => void;
}

export const CustomerAuthModal: React.FC<CustomerAuthModalProps> = ({
  isOpen,
  onClose,
  customer,
  onCustomerUpdate,
  orders,
  onReorder,
  onTrackOrder
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [pincode, setPincode] = useState('110092');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.trim();
    if (!cleanPhone || !name.trim()) return;

    const user: CustomerUser = {
      id: `cust-${Date.now()}`,
      name: name.trim(),
      phone: cleanPhone,
      email: email.trim(),
      addresses: streetAddress
        ? [
            {
              id: 'addr-1',
              label: 'Home',
              address: streetAddress,
              landmark: 'Laxmi Nagar Area',
              pincode: pincode || '110092'
            }
          ]
        : [],
      savedOrderIds: [],
      wishlistProductIds: []
    };

    StorageService.saveCustomer(user);
    onCustomerUpdate(user);
  };

  const handleLogout = () => {
    StorageService.logoutCustomer();
    onCustomerUpdate(null);
  };

  // Find customer orders
  const myOrders = customer
    ? orders.filter(
        o =>
          o.customer.phone.replace(/[^0-9]/g, '') === customer.phone.replace(/[^0-9]/g, '') ||
          customer.savedOrderIds.includes(o.id)
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl border border-[#E8DDCD] max-w-lg w-full overflow-hidden shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-[#E8DDCD]">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#9E742A]">
              Beni Patron Account
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#350A11]">
              {customer ? `Namaste, ${customer.name}` : 'Sign In / Register'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {customer ? (
          <div className="space-y-6">
            {/* Patron Profile Info */}
            <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E8DDCD] space-y-2 text-xs text-[#55433E]">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-[#350A11]">{customer.name}</div>
                  <div>Phone: {customer.phone}</div>
                  {customer.email && <div>Email: {customer.email}</div>}
                </div>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1 text-xs text-rose-700 hover:underline"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>

              {customer.addresses.length > 0 && (
                <div className="pt-2 border-t border-[#E8DDCD]">
                  <div className="font-semibold text-[#350A11]">Default Delivery Address:</div>
                  <div className="text-[11px] text-[#7B6A65]">
                    {customer.addresses[0].address} ({customer.addresses[0].pincode})
                  </div>
                </div>
              )}
            </div>

            {/* Past Orders & Reorder */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <h4 className="font-serif font-bold text-base text-[#350A11]">
                  Your Past Purchases ({myOrders.length})
                </h4>
              </div>

              {myOrders.length === 0 ? (
                <div className="p-6 text-center text-xs text-[#7B6A65] bg-[#FAF7F2] rounded-2xl border border-[#E8DDCD]">
                  No previous orders found for this phone number yet. Place your first order to track it here!
                </div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {myOrders.map(order => (
                    <div
                      key={order.id}
                      className="p-3.5 bg-white rounded-xl border border-[#E8DDCD] space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-[#350A11]">{order.orderNumber}</span>
                        <span className="text-[10px] font-semibold text-[#741727] bg-[#F2EBE0] px-2 py-0.5 rounded">
                          {order.status}
                        </span>
                      </div>

                      <div className="text-[11px] text-[#55433E]">
                        {order.items.map(i => `${i.product.name} (x${i.quantity})`).join(', ')}
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-[#F2EBE0]">
                        <span className="font-serif font-bold text-sm text-[#350A11]">
                          ₹{order.totalAmount.toFixed(0)}
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              onTrackOrder(order);
                              onClose();
                            }}
                            className="px-2.5 py-1 text-[11px] font-medium text-[#741727] hover:underline"
                          >
                            Live Status
                          </button>
                          <button
                            onClick={() => {
                              onReorder(order);
                              onClose();
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-[#5A121F] hover:bg-[#460E18] text-white text-[11px] font-semibold rounded-lg shadow-2xs"
                          >
                            <RefreshCw className="w-3 h-3 text-[#E8D39E]" />
                            <span>Reorder</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <p className="text-[#6B5A55] text-xs">
              Save your delivery addresses, reorder your favorite delicacies in 1-click, and track live kitchen dispatch.
            </p>

            <div>
              <label className="font-semibold text-[#350A11] block mb-1">Your Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Meenakshi Gupta"
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8DDCD] rounded-xl"
              />
            </div>

            <div>
              <label className="font-semibold text-[#350A11] block mb-1">Mobile Number *</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="e.g. 9811100486"
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8DDCD] rounded-xl"
              />
            </div>

            <div>
              <label className="font-semibold text-[#350A11] block mb-1">Email Address (Optional)</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="For order receipts"
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8DDCD] rounded-xl"
              />
            </div>

            <div>
              <label className="font-semibold text-[#350A11] block mb-1">Primary Delivery Address (Optional)</label>
              <input
                type="text"
                value={streetAddress}
                onChange={e => setStreetAddress(e.target.value)}
                placeholder="House, building, street in Delhi"
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8DDCD] rounded-xl"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#5A121F] hover:bg-[#460E18] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
            >
              Sign In to Beni Sweets
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
