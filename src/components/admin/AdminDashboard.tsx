import React, { useState } from 'react';
import { 
  BarChart3, 
  Package, 
  ShoppingBag, 
  Settings, 
  Users, 
  Calendar, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  X, 
  Printer, 
  DollarSign, 
  TrendingUp, 
  ShieldCheck, 
  AlertCircle,
  Eye,
  LogOut,
  Save,
  Lock
} from 'lucide-react';
import { 
  Order, 
  Product, 
  BusinessSettings, 
  AdminUser, 
  AdminRole, 
  OrderStatus, 
  ProductCategory,
  BulkCateringInquiry,
  TableReservation
} from '../../types';
import { StorageService } from '../../services/storage';
import { ImageWithFallback } from '../common/ImageWithFallback';

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  settings: BusinessSettings;
  inquiries: BulkCateringInquiry[];
  reservations: TableReservation[];
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;
  onUpdateSettings: (settings: BusinessSettings) => void;
  onExitAdmin: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  orders,
  settings,
  inquiries,
  reservations,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
  onUpdateSettings,
  onExitAdmin
}) => {
  // Authentication State
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(() => StorageService.getAdminSession());
  const [selectedRole, setSelectedRole] = useState<AdminRole>('owner');
  const [pinInput, setPinInput] = useState('1970');
  const [authError, setAuthError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'inquiries' | 'settings'>('overview');

  // Product Edit Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);

  // Settings State Form
  const [formSettings, setFormSettings] = useState<BusinessSettings>(settings);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Selected Order for Modal/Invoice
  const [inspectOrder, setInspectOrder] = useState<Order | null>(null);

  // Handlers for Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    // Default Demo PINs: Owner: 1970, Manager: 1234, Staff: 0000
    const validPins: Record<AdminRole, string> = {
      owner: '1970',
      manager: '1234',
      staff: '0000'
    };

    if (pinInput.trim() !== validPins[selectedRole]) {
      setAuthError(`Invalid PIN for ${selectedRole}. (Hint: Owner: 1970, Manager: 1234, Staff: 0000)`);
      return;
    }

    const adminUser: AdminUser = {
      id: `admin-${selectedRole}`,
      name: selectedRole === 'owner' ? 'Shri Beni Ram (Owner)' : selectedRole === 'manager' ? 'Sanjay Kumar (Manager)' : 'Pawan (Kitchen Staff)',
      role: selectedRole,
      pin: pinInput,
      permissions: {
        canEditProducts: selectedRole === 'owner' || selectedRole === 'manager',
        canUpdateOrderStatus: true,
        canEditSettings: selectedRole === 'owner',
        canViewFinancials: selectedRole === 'owner' || selectedRole === 'manager',
        canCancelOrders: selectedRole === 'owner'
      }
    };

    StorageService.saveAdminSession(adminUser);
    setCurrentAdmin(adminUser);
  };

  const handleLogout = () => {
    StorageService.saveAdminSession(null);
    setCurrentAdmin(null);
  };

  // Metrics Calculations
  const todayDateStr = new Date().toISOString().slice(0, 10);
  const todayOrders = orders.filter(o => o.createdAt.startsWith(todayDateStr));
  const todaySales = todayOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingOrdersCount = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length;
  const completedOrdersCount = orders.filter(o => o.status === 'Delivered').length;

  // Order status options
  const statusOptions: OrderStatus[] = [
    'Order Received',
    'Order Confirmed',
    'Preparing Your Order',
    'Ready for Pickup',
    'Out for Delivery',
    'Delivered',
    'Cancelled'
  ];

  // Product Form Save
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    onUpdateProduct(editingProduct);
    setEditingProduct(null);
  };

  // Settings Save
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(formSettings);
    setSettingsSuccess(true);
    setTimeout(() => setSettingsSuccess(false), 3000);
  };

  // If not logged in, render Admin Authentication Screen
  if (!currentAdmin) {
    return (
      <div className="py-20 bg-[#FAF7F2] min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-[#E8DDCD] shadow-xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-[#5A121F] text-[#FAF7F2] border border-[#C5A059] flex items-center justify-center font-serif font-bold text-xl mx-auto shadow-sm">
              B
            </div>
            <h1 className="font-serif text-2xl font-bold text-[#350A11]">
              Beni Sweets Management Portal
            </h1>
            <p className="text-xs text-[#7B6A65]">
              Secure Role-Based Access for Owners, Store Managers & Kitchen Staff
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {authError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#350A11]">Select Role:</label>
              <div className="grid grid-cols-3 gap-2">
                {(['owner', 'manager', 'staff'] as AdminRole[]).map(role => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => {
                      setSelectedRole(role);
                      setPinInput(role === 'owner' ? '1970' : role === 'manager' ? '1234' : '0000');
                    }}
                    className={`py-2 px-2 text-xs font-semibold rounded-xl capitalize transition-all border ${
                      selectedRole === role
                        ? 'bg-[#5A121F] text-white border-[#5A121F]'
                        : 'bg-[#FAF7F2] text-[#55433E] border-[#E8DDCD] hover:bg-[#F2EBE0]'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#350A11]">Security PIN:</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={pinInput}
                  onChange={e => setPinInput(e.target.value)}
                  placeholder="Enter 4-digit PIN"
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#FAF7F2] border border-[#E8DDCD] rounded-xl focus:outline-none focus:border-[#741727]"
                />
              </div>
              <div className="text-[11px] text-[#9E742A] pt-1">
                Demo Credentials: <strong>Owner PIN: 1970</strong> · Manager PIN: 1234 · Staff PIN: 0000
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#5A121F] hover:bg-[#460E18] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
            >
              Sign In to Management Console
            </button>
          </form>

          <div className="pt-2 text-center border-t border-[#F2EBE0]">
            <button
              onClick={onExitAdmin}
              className="text-xs text-[#7B6A65] hover:text-[#350A11]"
            >
              ← Back to Customer Storefront
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      {/* Admin Top Navigation */}
      <header className="sticky top-0 z-30 bg-[#350A11] text-white px-4 sm:px-6 lg:px-8 py-3 shadow-md flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#5A121F] border border-[#C5A059] flex items-center justify-center font-serif font-bold text-sm text-[#E8D39E]">
            B
          </div>
          <div>
            <div className="font-serif font-bold text-sm sm:text-base leading-tight">
              Beni Sweets Management Console
            </div>
            <div className="text-[10px] text-[#E8D39E] font-medium uppercase tracking-wider">
              {currentAdmin.name} ({currentAdmin.role.toUpperCase()})
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onExitAdmin}
            className="text-xs font-medium text-white/80 hover:text-white px-3 py-1.5 rounded-lg border border-white/20 transition-colors"
          >
            Storefront View
          </button>
          <button
            onClick={handleLogout}
            className="p-1.5 text-white/80 hover:text-white transition-colors"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Tabs Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#E8DDCD]">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'overview'
                ? 'bg-[#5A121F] text-white shadow-xs'
                : 'bg-white text-[#55433E] hover:bg-[#F2EBE0] border border-[#E8DDCD]'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Dashboard Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'orders'
                ? 'bg-[#5A121F] text-white shadow-xs'
                : 'bg-white text-[#55433E] hover:bg-[#F2EBE0] border border-[#E8DDCD]'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Orders Management ({pendingOrdersCount} Active)</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'products'
                ? 'bg-[#5A121F] text-white shadow-xs'
                : 'bg-white text-[#55433E] hover:bg-[#F2EBE0] border border-[#E8DDCD]'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Products & Prices ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'inquiries'
                ? 'bg-[#5A121F] text-white shadow-xs'
                : 'bg-white text-[#55433E] hover:bg-[#F2EBE0] border border-[#E8DDCD]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Bulk Catering & Tables ({inquiries.length + reservations.length})</span>
          </button>

          {currentAdmin.permissions.canEditSettings && (
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-colors ${
                activeTab === 'settings'
                  ? 'bg-[#5A121F] text-white shadow-xs'
                  : 'bg-white text-[#55433E] hover:bg-[#F2EBE0] border border-[#E8DDCD]'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Business Settings</span>
            </button>
          )}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* KPI Cards Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl bg-white border border-[#E8DDCD] shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs text-[#7B6A65]">
                  <span>Today's Sales</span>
                  <DollarSign className="w-4 h-4 text-[#C5A059]" />
                </div>
                <div className="font-serif text-2xl sm:text-3xl font-bold text-[#350A11] tabular-nums">
                  ₹{todaySales.toFixed(2)}
                </div>
                <div className="text-[11px] text-emerald-700 font-medium">
                  {todayOrders.length} orders today
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-[#E8DDCD] shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs text-[#7B6A65]">
                  <span>Total Gross Revenue</span>
                  <TrendingUp className="w-4 h-4 text-[#C5A059]" />
                </div>
                <div className="font-serif text-2xl sm:text-3xl font-bold text-[#350A11] tabular-nums">
                  ₹{totalRevenue.toFixed(2)}
                </div>
                <div className="text-[11px] text-[#7B6A65]">
                  {orders.length} total lifetime orders
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-[#E8DDCD] shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs text-[#7B6A65]">
                  <span>Active Kitchen Orders</span>
                  <Clock className="w-4 h-4 text-amber-600" />
                </div>
                <div className="font-serif text-2xl sm:text-3xl font-bold text-amber-700 tabular-nums">
                  {pendingOrdersCount}
                </div>
                <div className="text-[11px] text-[#7B6A65]">
                  Requiring preparation or dispatch
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-[#E8DDCD] shadow-xs space-y-2">
                <div className="flex items-center justify-between text-xs text-[#7B6A65]">
                  <span>Completed Orders</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="font-serif text-2xl sm:text-3xl font-bold text-emerald-800 tabular-nums">
                  {completedOrdersCount}
                </div>
                <div className="text-[11px] text-emerald-700">
                  Successfully delivered
                </div>
              </div>
            </div>

            {/* Live Queue & Best-sellers Split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Active Orders Quick Table (8 cols) */}
              <div className="lg:col-span-8 bg-white rounded-3xl border border-[#E8DDCD] p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-bold text-[#350A11]">
                    Live Kitchen & Dispatch Queue
                  </h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-[#741727] font-semibold hover:underline"
                  >
                    View All Orders →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#E8DDCD] text-[#7B6A65]">
                        <th className="py-2.5 px-3">Order</th>
                        <th className="py-2.5 px-3">Customer</th>
                        <th className="py-2.5 px-3">Type</th>
                        <th className="py-2.5 px-3">Amount</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3 text-right">Quick Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F2EBE0]">
                      {orders.slice(0, 5).map(o => (
                        <tr key={o.id} className="hover:bg-[#FAF7F2] transition-colors">
                          <td className="py-3 px-3 font-mono font-bold text-[#350A11]">{o.orderNumber}</td>
                          <td className="py-3 px-3">
                            <div className="font-semibold text-[#350A11]">{o.customer.name}</div>
                            <div className="text-[10px] text-[#7B6A65]">{o.customer.phone}</div>
                          </td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#F2EBE0] text-[#741727]">
                              {o.orderType}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-serif font-bold tabular-nums">₹{o.totalAmount.toFixed(0)}</td>
                          <td className="py-3 px-3">
                            <span className="text-[11px] font-medium text-[#741727] bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#E8DDCD]">
                              {o.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => setInspectOrder(o)}
                              className="px-2.5 py-1 text-[11px] font-semibold text-[#5A121F] bg-[#FAF7F2] hover:bg-[#F2EBE0] border border-[#D6B26C] rounded-lg"
                            >
                              Manage
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Best-selling Dishes (4 cols) */}
              <div className="lg:col-span-4 bg-white rounded-3xl border border-[#E8DDCD] p-6 shadow-xs space-y-4">
                <h3 className="font-serif text-lg font-bold text-[#350A11]">
                  Best-Selling Specialties
                </h3>

                <div className="space-y-3">
                  {products.filter(p => p.isBestseller).slice(0, 5).map(item => (
                    <div key={item.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#FAF7F2] transition-colors">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        fallbackTitle={item.name}
                        className="w-12 h-12 rounded-lg object-cover bg-[#F2EBE0]"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-xs text-[#350A11] truncate">{item.name}</div>
                        <div className="text-[10px] text-[#7B6A65]">{item.category} · {item.weightOrServing}</div>
                        <div className="font-serif font-bold text-xs text-[#741727]">₹{item.price}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl border border-[#E8DDCD] p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#350A11]">
                  Order Processing System
                </h2>
                <p className="text-xs text-[#7B6A65]">
                  Manage online home deliveries, takeaway pickups, status updates & printed receipts.
                </p>
              </div>

              <div className="text-xs text-[#7B6A65]">
                Total Orders in System: <strong>{orders.length}</strong>
              </div>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E8DDCD] text-[#7B6A65]">
                    <th className="py-3 px-3">Order #</th>
                    <th className="py-3 px-3">Customer & Phone</th>
                    <th className="py-3 px-3">Type & Address</th>
                    <th className="py-3 px-3">Items Summary</th>
                    <th className="py-3 px-3">Amount & Payment</th>
                    <th className="py-3 px-3">Live Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2EBE0]">
                  {orders.map(order => (
                    <tr key={order.id} className="hover:bg-[#FAF7F2] transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-[#350A11]">
                        {order.orderNumber}
                        <div className="text-[10px] text-[#7B6A65] font-sans">
                          {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <div className="font-semibold text-[#350A11]">{order.customer.name}</div>
                        <div className="text-[11px] text-[#55433E]">{order.customer.phone}</div>
                      </td>

                      <td className="py-3 px-3 max-w-[200px]">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-[#F2EBE0] text-[#741727]">
                          {order.orderType}
                        </span>
                        <div className="text-[10px] text-[#7B6A65] truncate mt-1">
                          {order.orderType === 'delivery' ? order.customer.address : 'Store Pickup'}
                        </div>
                      </td>

                      <td className="py-3 px-3 max-w-[180px]">
                        <div className="text-[11px] text-[#350A11] truncate">
                          {order.items.map(i => `${i.product.name} (x${i.quantity})`).join(', ')}
                        </div>
                        <div className="text-[10px] text-[#7B6A65]">
                          {order.items.length} items
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <div className="font-serif font-bold text-sm text-[#350A11] tabular-nums">
                          ₹{order.totalAmount.toFixed(0)}
                        </div>
                        <div className="text-[10px] text-emerald-700 font-medium">
                          {order.paymentMethod.toUpperCase()} ({order.paymentStatus})
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <select
                          value={order.status}
                          onChange={e => onUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                          className="px-2.5 py-1 text-xs rounded-lg border border-[#E8DDCD] bg-[#FAF7F2] text-[#350A11] font-medium focus:outline-none focus:border-[#741727]"
                        >
                          {statusOptions.map(opt => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setInspectOrder(order)}
                            className="p-1.5 rounded-lg text-[#5A121F] hover:bg-[#F2EBE0]"
                            title="Inspect & Print"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: PRODUCTS & PRICE MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-3xl border border-[#E8DDCD] p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#350A11]">
                  Product Catalogue & Pricing
                </h2>
                <p className="text-xs text-[#7B6A65]">
                  Add new items, update prices (INR ₹), manage stock availability, and highlight seasonal specials.
                </p>
              </div>

              {currentAdmin.permissions.canEditProducts && (
                <button
                  onClick={() => {
                    setEditingProduct({
                      id: `product-${Date.now()}`,
                      name: '',
                      category: 'sweets',
                      description: '',
                      price: 250,
                      weightOrServing: '500g Box',
                      isVeg: true,
                      inStock: true,
                      rating: 4.8,
                      reviewsCount: 1,
                      image: '/src/assets/images/hero_luxury_mithai_spread_1793965253133.jpg'
                    });
                    setIsNewProduct(true);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#5A121F] hover:bg-[#460E18] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>
              )}
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E8DDCD] text-[#7B6A65]">
                    <th className="py-3 px-3">Item</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Serving / Weight</th>
                    <th className="py-3 px-3">Price (₹)</th>
                    <th className="py-3 px-3">Stock Status</th>
                    <th className="py-3 px-3">Badges</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2EBE0]">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-[#FAF7F2] transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          <ImageWithFallback
                            src={p.image}
                            alt={p.name}
                            fallbackTitle={p.name}
                            className="w-10 h-10 rounded-lg object-cover bg-[#FAF7F2] border border-[#E8DDCD]"
                          />
                          <div>
                            <div className="font-bold text-[#350A11]">{p.name}</div>
                            {p.hindiName && (
                              <div className="text-[10px] text-[#741727] font-serif">{p.hindiName}</div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3 capitalize text-[#7B6A65]">{p.category}</td>
                      <td className="py-3 px-3 text-[#55433E]">{p.weightOrServing}</td>
                      <td className="py-3 px-3 font-serif font-bold text-sm text-[#350A11] tabular-nums">
                        ₹{p.price}
                      </td>

                      <td className="py-3 px-3">
                        <button
                          onClick={() => {
                            if (!currentAdmin.permissions.canEditProducts) return;
                            onUpdateProduct({ ...p, inStock: !p.inStock });
                          }}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition-colors ${
                            p.inStock
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {p.inStock ? 'In Stock' : 'Out of Stock'}
                        </button>
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex gap-1">
                          {p.isBestseller && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#C5A059] text-white">
                              Bestseller
                            </span>
                          )}
                          {p.isSeasonal && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#5A121F] text-white">
                              Seasonal
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingProduct(p);
                              setIsNewProduct(false);
                            }}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                            title="Edit Product"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          {currentAdmin.role === 'owner' && (
                            <button
                              onClick={() => onDeleteProduct(p.id)}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: BULK CATERING & RESERVATIONS */}
        {activeTab === 'inquiries' && (
          <div className="space-y-8">
            {/* Catering Inquiries */}
            <div className="bg-white rounded-3xl border border-[#E8DDCD] p-6 sm:p-8 shadow-xs space-y-4">
              <h2 className="font-serif text-2xl font-bold text-[#350A11]">
                Wedding & Bulk Catering Inquiries ({inquiries.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {inquiries.map(inq => (
                  <div key={inq.id} className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E8DDCD] space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-[#350A11]">{inq.name}</h4>
                        <div className="text-xs text-[#7B6A65]">{inq.phone} · {inq.email}</div>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#5A121F] text-white">
                        {inq.eventType}
                      </span>
                    </div>

                    <div className="text-xs text-[#55433E] space-y-1">
                      <div>Date: <strong>{inq.eventDate}</strong> · Guests: <strong>{inq.guestCount} Pax</strong></div>
                      {inq.budgetRange && <div>Budget: <strong>{inq.budgetRange}</strong></div>}
                      <p className="mt-2 text-xs italic bg-white p-2.5 rounded-lg border border-[#E8DDCD]">
                        "{inq.requirements}"
                      </p>
                    </div>

                    <div className="pt-2 flex items-center gap-2">
                      <a
                        href={`tel:${inq.phone.replace(/[^0-9+]/g, '')}`}
                        className="px-3 py-1.5 bg-[#5A121F] text-white text-xs font-semibold rounded-lg"
                      >
                        Call Patron
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Table Reservations */}
            <div className="bg-white rounded-3xl border border-[#E8DDCD] p-6 sm:p-8 shadow-xs space-y-4">
              <h2 className="font-serif text-2xl font-bold text-[#350A11]">
                Restaurant Table Enquiries ({reservations.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reservations.map(res => (
                  <div key={res.id} className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E8DDCD] space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-[#350A11]">{res.name}</h4>
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        {res.status}
                      </span>
                    </div>
                    <div className="text-xs text-[#55433E]">
                      <div>Phone: {res.phone}</div>
                      <div>Date & Time: <strong>{res.date} at {res.time}</strong></div>
                      <div>Guests: <strong>{res.guestCount} Guests</strong></div>
                      {res.specialRequests && <div className="italic mt-1">Note: {res.specialRequests}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: BUSINESS SETTINGS */}
        {activeTab === 'settings' && currentAdmin.permissions.canEditSettings && (
          <div className="bg-white rounded-3xl border border-[#E8DDCD] p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#350A11]">
                Business Operations & Configurations
              </h2>
              <p className="text-xs text-[#7B6A65]">
                Configure phone, address, operating hours, delivery thresholds, taxes, and UPI accounts.
              </p>
            </div>

            {settingsSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Settings updated successfully! Changes immediately live on customer storefront.</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-[#350A11] block mb-1">Brand Name:</label>
                  <input
                    type="text"
                    value={formSettings.brandName}
                    onChange={e => setFormSettings({ ...formSettings, brandName: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8DDCD] rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#350A11] block mb-1">Store Phone:</label>
                  <input
                    type="text"
                    value={formSettings.phone}
                    onChange={e => setFormSettings({ ...formSettings, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8DDCD] rounded-xl"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-[#350A11] block mb-1">Physical Store Address:</label>
                  <input
                    type="text"
                    value={formSettings.address}
                    onChange={e => setFormSettings({ ...formSettings, address: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8DDCD] rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#350A11] block mb-1">Opening Hours:</label>
                  <input
                    type="text"
                    value={formSettings.openingHours}
                    onChange={e => setFormSettings({ ...formSettings, openingHours: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8DDCD] rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#350A11] block mb-1">UPI VPA for QR Code:</label>
                  <input
                    type="text"
                    value={formSettings.upiVpa}
                    onChange={e => setFormSettings({ ...formSettings, upiVpa: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8DDCD] rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#350A11] block mb-1">Free Delivery Minimum (₹):</label>
                  <input
                    type="number"
                    value={formSettings.freeDeliveryThreshold}
                    onChange={e => setFormSettings({ ...formSettings, freeDeliveryThreshold: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8DDCD] rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#350A11] block mb-1">Standard Delivery Fee (₹):</label>
                  <input
                    type="number"
                    value={formSettings.deliveryFee}
                    onChange={e => setFormSettings({ ...formSettings, deliveryFee: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8DDCD] rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#350A11] block mb-1">GST Tax Rate (%):</label>
                  <input
                    type="number"
                    value={formSettings.gstPercent}
                    onChange={e => setFormSettings({ ...formSettings, gstPercent: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8DDCD] rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#350A11] block mb-1">Minimum Order Value (₹):</label>
                  <input
                    type="number"
                    value={formSettings.minOrderValue}
                    onChange={e => setFormSettings({ ...formSettings, minOrderValue: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8DDCD] rounded-xl"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-[#5A121F] hover:bg-[#460E18] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Business Settings</span>
              </button>
            </form>
          </div>
        )}
      </main>

      {/* Edit / Add Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-[#E8DDCD] max-w-lg w-full overflow-hidden shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DDCD]">
              <h3 className="font-serif text-lg font-bold text-[#350A11]">
                {isNewProduct ? 'Add New Product to Menu' : `Edit ${editingProduct.name}`}
              </h3>
              <button onClick={() => setEditingProduct(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-[#350A11] block mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8DDCD] rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-[#350A11] block mb-1">Hindi Script Name</label>
                <input
                  type="text"
                  value={editingProduct.hindiName || ''}
                  onChange={e => setEditingProduct({ ...editingProduct, hindiName: e.target.value })}
                  placeholder="e.g. शाही मलाई घेवर"
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8DDCD] rounded-xl font-serif"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#350A11] block mb-1">Category *</label>
                  <select
                    value={editingProduct.category}
                    onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value as ProductCategory })}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8DDCD] rounded-xl capitalize"
                  >
                    <option value="sweets">Sweets & Mithai</option>
                    <option value="namkeen">Namkeen & Snacks</option>
                    <option value="breakfast">Breakfast & Dining</option>
                    <option value="chinese">Chinese & Fast Food</option>
                    <option value="beverages">Beverages</option>
                    <option value="gifting">Festive Hampers</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-[#350A11] block mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price}
                    onChange={e => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8DDCD] rounded-xl font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#350A11] block mb-1">Weight or Serving *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.weightOrServing}
                  onChange={e => setEditingProduct({ ...editingProduct, weightOrServing: e.target.value })}
                  placeholder="e.g. 500g Box, 2 Pieces with Chutneys"
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8DDCD] rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold text-[#350A11] block mb-1">Description *</label>
                <textarea
                  rows={2}
                  required
                  value={editingProduct.description}
                  onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8DDCD] rounded-xl"
                />
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.inStock}
                    onChange={e => setEditingProduct({ ...editingProduct, inStock: e.target.checked })}
                    className="rounded text-[#5A121F]"
                  />
                  <span>In Stock</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isBestseller || false}
                    onChange={e => setEditingProduct({ ...editingProduct, isBestseller: e.target.checked })}
                    className="rounded text-[#5A121F]"
                  />
                  <span>Bestseller Badge</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isSeasonal || false}
                    onChange={e => setEditingProduct({ ...editingProduct, isSeasonal: e.target.checked })}
                    className="rounded text-[#5A121F]"
                  />
                  <span>Seasonal Badge</span>
                </label>
              </div>

              <div className="pt-4 border-t border-[#E8DDCD] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 border border-[#E8DDCD] text-[#7B6A65] rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#5A121F] text-white font-semibold rounded-xl"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inspect & Print Order Invoice Modal */}
      {inspectOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-[#E8DDCD] max-w-xl w-full overflow-hidden shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8DDCD]">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#350A11]">
                  Tax Invoice: {inspectOrder.orderNumber}
                </h3>
                <div className="text-xs text-[#7B6A65]">
                  Beni Sweets Corner & Restaurant · GSTIN: 07AAAFB1970D1Z2
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (typeof window !== 'undefined') window.print();
                  }}
                  className="p-2 text-[#5A121F] hover:bg-[#F2EBE0] rounded-lg"
                  title="Print"
                >
                  <Printer className="w-5 h-5" />
                </button>
                <button onClick={() => setInspectOrder(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Bill Details */}
            <div className="space-y-3 text-xs text-[#55433E]">
              <div className="grid grid-cols-2 gap-4 p-3 bg-[#FAF7F2] rounded-xl">
                <div>
                  <div className="font-bold text-[#350A11]">{inspectOrder.customer.name}</div>
                  <div>Phone: {inspectOrder.customer.phone}</div>
                  <div>Address: {inspectOrder.customer.address || 'Store Pickup'}</div>
                </div>
                <div className="text-right">
                  <div>Date: {new Date(inspectOrder.createdAt).toLocaleDateString()}</div>
                  <div className="font-semibold text-[#741727]">Status: {inspectOrder.status}</div>
                  <div>Payment: {inspectOrder.paymentMethod.toUpperCase()}</div>
                </div>
              </div>

              <div className="divide-y divide-[#F2EBE0] border border-[#E8DDCD] rounded-xl overflow-hidden">
                {inspectOrder.items.map((item, i) => (
                  <div key={i} className="p-2.5 flex justify-between items-center">
                    <div>
                      <span className="font-semibold">{item.product.name}</span> x {item.quantity}
                    </div>
                    <span className="font-bold tabular-nums">₹{item.itemTotal}</span>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-[#FAF7F2] rounded-xl space-y-1 text-right">
                <div>Subtotal: ₹{inspectOrder.subtotal}</div>
                {inspectOrder.discountAmount > 0 && <div>Discount: -₹{inspectOrder.discountAmount}</div>}
                <div>GST (5%): ₹{inspectOrder.taxes.toFixed(2)}</div>
                <div>Delivery: ₹{inspectOrder.deliveryCharge}</div>
                <div className="font-bold text-sm text-[#5A121F] pt-1 border-t border-[#E8DDCD]">
                  Grand Total: ₹{inspectOrder.totalAmount.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
