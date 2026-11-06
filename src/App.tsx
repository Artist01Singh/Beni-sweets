import React, { useState, useEffect, useCallback } from 'react';
import { 
  Header 
} from './components/common/Header';
import { 
  Footer 
} from './components/common/Footer';
import { 
  HeroSection 
} from './components/home/HeroSection';
import { 
  FeaturedCategories 
} from './components/home/FeaturedCategories';
import { 
  SpecialGhevarHighlight 
} from './components/home/SpecialGhevarHighlight';
import { 
  HeritageStory 
} from './components/home/HeritageStory';
import { 
  WhyChooseBeni 
} from './components/home/WhyChooseBeni';
import { 
  Testimonials 
} from './components/home/Testimonials';
import { 
  InstagramGallery 
} from './components/home/InstagramGallery';
import { 
  LocationContact 
} from './components/home/LocationContact';
import { 
  MenuCatalogue 
} from './components/menu/MenuCatalogue';
import { 
  GiftingStudio 
} from './components/gifting/GiftingStudio';
import { 
  CartDrawer 
} from './components/cart/CartDrawer';
import { 
  CheckoutModal 
} from './components/checkout/CheckoutModal';
import { 
  OrderTrackingModal 
} from './components/orders/OrderTrackingModal';
import { 
  AdminDashboard 
} from './components/admin/AdminDashboard';
import { 
  CateringEnquiryModal 
} from './components/enquiry/CateringEnquiryModal';
import { 
  TableReservationModal 
} from './components/enquiry/TableReservationModal';
import { 
  CustomerAuthModal 
} from './components/customer/CustomerAuthModal';
import { 
  QRCodeMenuModal 
} from './components/menu/QRCodeMenuModal';

import { 
  Product, 
  CartItem, 
  Order, 
  OrderStatus, 
  BusinessSettings, 
  Coupon, 
  CustomerUser, 
  ProductCategory,
  BulkCateringInquiry,
  TableReservation
} from './types';
import { StorageService } from './services/storage';

export default function App() {
  // App State Loaded from Persistent Local Storage
  const [products, setProducts] = useState<Product[]>(() => StorageService.getProducts());
  const [orders, setOrders] = useState<Order[]>(() => StorageService.getOrders());
  const [settings, setSettings] = useState<BusinessSettings>(() => StorageService.getSettings());
  const [coupons, setCoupons] = useState<Coupon[]>(() => StorageService.getCoupons());
  const [inquiries, setInquiries] = useState<BulkCateringInquiry[]>(() => StorageService.getInquiries());
  const [reservations, setReservations] = useState<TableReservation[]>(() => StorageService.getReservations());
  const [customer, setCustomer] = useState<CustomerUser | null>(() => StorageService.getCustomer());

  // Active View / Page
  const [currentView, setCurrentView] = useState<'home' | 'menu' | 'gifting' | 'story' | 'contact' | 'admin' | 'tracking'>('home');
  const [menuSelectedCategory, setMenuSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);

  // Cart & Checkout State
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('beni_cart_session');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Modals visibility
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isCateringOpen, setIsCateringOpen] = useState(false);
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [isCustomerAuthOpen, setIsCustomerAuthOpen] = useState(false);
  const [isQrMenuOpen, setIsQrMenuOpen] = useState(false);

  // Persist Cart
  useEffect(() => {
    localStorage.setItem('beni_cart_session', JSON.stringify(cart));
  }, [cart]);

  // Synchronize with storage updates (e.g. from Admin changes or other tabs)
  useEffect(() => {
    const handleStorageUpdate = () => {
      setProducts(StorageService.getProducts());
      setOrders(StorageService.getOrders());
      setSettings(StorageService.getSettings());
      setCoupons(StorageService.getCoupons());
      setInquiries(StorageService.getInquiries());
      setReservations(StorageService.getReservations());
      setCustomer(StorageService.getCustomer());
    };

    window.addEventListener('beni_store_update', handleStorageUpdate);
    window.addEventListener('storage', handleStorageUpdate);
    return () => {
      window.removeEventListener('beni_store_update', handleStorageUpdate);
      window.removeEventListener('storage', handleStorageUpdate);
    };
  }, []);

  // Cart Management Handlers
  const handleAddToCart = useCallback((
    product: Product,
    quantity = 1,
    selectedVariant?: string,
    customNote?: string
  ) => {
    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(
        item => item.product.id === product.id && item.selectedVariant === selectedVariant
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          itemTotal: newQty * product.price,
          customNote: customNote || updated[existingIndex].customNote
        };
        return updated;
      } else {
        return [
          ...prevCart,
          {
            product,
            quantity,
            selectedVariant: selectedVariant || product.weightOrServing,
            customNote,
            itemTotal: quantity * product.price
          }
        ];
      }
    });

    setIsCartOpen(true);
  }, []);

  const handleUpdateQuantity = useCallback((productId: string, quantity: number) => {
    setCart(prevCart => {
      if (quantity <= 0) {
        return prevCart.filter(item => item.product.id !== productId);
      }
      return prevCart.map(item => {
        if (item.product.id === productId) {
          return {
            ...item,
            quantity,
            itemTotal: quantity * item.product.price
          };
        }
        return item;
      });
    });
  }, []);

  const handleRemoveItem = useCallback((productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  }, []);

  // Checkout & Order Placement
  const handleOrderPlaced = (order: Order) => {
    setCart([]);
    setAppliedCoupon(null);
    setSpecialInstructions('');
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    setTrackedOrder(order);
    setCurrentView('tracking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reorder previous order
  const handleReorder = (order: Order) => {
    const reorderedItems: CartItem[] = order.items.map(item => ({
      ...item,
      itemTotal: item.quantity * item.product.price
    }));
    setCart(reorderedItems);
    setIsCartOpen(true);
  };

  // Admin mutation callbacks
  const handleUpdateProduct = (updated: Product) => {
    StorageService.updateProduct(updated);
    setProducts(StorageService.getProducts());
  };

  const handleDeleteProduct = (productId: string) => {
    StorageService.deleteProduct(productId);
    setProducts(StorageService.getProducts());
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus, note?: string) => {
    StorageService.updateOrderStatus(orderId, status, note);
    setOrders(StorageService.getOrders());
  };

  const handleUpdateSettings = (newSettings: BusinessSettings) => {
    StorageService.saveSettings(newSettings);
    setSettings(newSettings);
  };

  // Ghevar Product Reference
  const royalGhevar = products.find(p => p.id === 'sweet-ghevar') || products[0];
  const allSweets = products.filter(p => p.category === 'sweets');
  const cartTotalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#221A18] font-sans antialiased selection:bg-[#741727] selection:text-white">
      {/* Global Navigation Header */}
      <Header
        settings={settings}
        cartCount={cartTotalItems}
        onOpenCart={() => setIsCartOpen(true)}
        onNavigate={view => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        currentView={currentView}
        onOpenSearch={() => {
          setCurrentView('menu');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenCustomerAuth={() => setIsCustomerAuthOpen(true)}
        customerName={customer?.name}
      />

      {/* Main Routed Content */}
      <main className="flex-1">
        {/* VIEW 1: HOME PAGE */}
        {currentView === 'home' && (
          <>
            <HeroSection
              onExploreMenu={() => {
                setMenuSelectedCategory('all');
                setCurrentView('menu');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onExploreGifting={() => {
                setCurrentView('gifting');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            <FeaturedCategories
              onSelectCategory={cat => {
                if (cat === 'gifting') {
                  setCurrentView('gifting');
                } else {
                  setMenuSelectedCategory(cat);
                  setCurrentView('menu');
                }
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            <SpecialGhevarHighlight
              ghevarProduct={royalGhevar}
              onAddToCart={product => handleAddToCart(product, 1)}
            />

            <HeritageStory />

            <WhyChooseBeni />

            <Testimonials />

            <InstagramGallery />

            <LocationContact
              settings={settings}
              onOpenReservation={() => setIsReservationOpen(true)}
              onOpenCatering={() => setIsCateringOpen(true)}
            />
          </>
        )}

        {/* VIEW 2: FULL DIGITAL MENU */}
        {currentView === 'menu' && (
          <MenuCatalogue
            products={products}
            onAddToCart={(product, qty) => handleAddToCart(product, qty || 1)}
            selectedCategory={menuSelectedCategory}
            searchQuery={searchQuery}
          />
        )}

        {/* VIEW 3: FESTIVE GIFTING STUDIO */}
        {currentView === 'gifting' && (
          <GiftingStudio
            sweetsList={allSweets}
            onAddToCart={handleAddToCart}
            onOpenCatering={() => setIsCateringOpen(true)}
          />
        )}

        {/* VIEW 4: OUR HERITAGE STORY */}
        {currentView === 'story' && (
          <div className="py-12">
            <HeritageStory />
            <WhyChooseBeni />
            <Testimonials />
          </div>
        )}

        {/* VIEW 5: VISIT & CONTACT */}
        {currentView === 'contact' && (
          <LocationContact
            settings={settings}
            onOpenReservation={() => setIsReservationOpen(true)}
            onOpenCatering={() => setIsCateringOpen(true)}
          />
        )}

        {/* VIEW 6: LIVE ORDER TRACKING */}
        {currentView === 'tracking' && (
          <OrderTrackingModal
            initialOrder={trackedOrder}
            allOrders={orders}
            onSelectOrder={order => setTrackedOrder(order)}
          />
        )}

        {/* VIEW 7: ADMIN DASHBOARD */}
        {currentView === 'admin' && (
          <AdminDashboard
            products={products}
            orders={orders}
            settings={settings}
            inquiries={inquiries}
            reservations={reservations}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onUpdateSettings={handleUpdateSettings}
            onExitAdmin={() => setCurrentView('home')}
          />
        )}
      </main>

      {/* Global Footer (shown on all customer-facing views) */}
      {currentView !== 'admin' && (
        <Footer
          settings={settings}
          onNavigate={view => {
            setCurrentView(view);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenReservation={() => setIsReservationOpen(true)}
          onOpenCatering={() => setIsCateringOpen(true)}
          onOpenQrMenu={() => setIsQrMenuOpen(true)}
        />
      )}

      {/* Cart Slide-out Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        settings={settings}
        coupons={coupons}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={setAppliedCoupon}
        specialInstructions={specialInstructions}
        onUpdateInstructions={setSpecialInstructions}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        appliedCoupon={appliedCoupon}
        specialInstructions={specialInstructions}
        settings={settings}
        onOrderPlaced={handleOrderPlaced}
        initialCustomer={
          customer
            ? {
                name: customer.name,
                phone: customer.phone,
                email: customer.email,
                address: customer.addresses[0]?.address,
                pincode: customer.addresses[0]?.pincode,
                landmark: customer.addresses[0]?.landmark,
                city: 'Delhi'
              }
            : undefined
        }
      />

      {/* Bulk Wedding & Corporate Catering Modal */}
      <CateringEnquiryModal
        isOpen={isCateringOpen}
        onClose={() => setIsCateringOpen(false)}
      />

      {/* Table Reservation Modal */}
      <TableReservationModal
        isOpen={isReservationOpen}
        onClose={() => setIsReservationOpen(false)}
      />

      {/* Customer Account & Order History Modal */}
      <CustomerAuthModal
        isOpen={isCustomerAuthOpen}
        onClose={() => setIsCustomerAuthOpen(false)}
        customer={customer}
        onCustomerUpdate={setCustomer}
        orders={orders}
        onReorder={handleReorder}
        onTrackOrder={order => {
          setTrackedOrder(order);
          setCurrentView('tracking');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Contactless QR Code Dine-In Menu Modal */}
      <QRCodeMenuModal
        isOpen={isQrMenuOpen}
        onClose={() => setIsQrMenuOpen(false)}
        settings={settings}
      />
    </div>
  );
}
