import { 
  Product, 
  Order, 
  BusinessSettings, 
  Coupon, 
  CustomerUser, 
  AdminUser, 
  BulkCateringInquiry, 
  TableReservation 
} from '../types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_BUSINESS_SETTINGS, 
  INITIAL_COUPONS 
} from '../data/initialProducts';

const KEYS = {
  PRODUCTS: 'beni_products_v1',
  ORDERS: 'beni_orders_v1',
  SETTINGS: 'beni_settings_v1',
  COUPONS: 'beni_coupons_v1',
  CUSTOMER: 'beni_customer_v1',
  ADMIN_SESSION: 'beni_admin_session_v1',
  INQUIRIES: 'beni_inquiries_v1',
  RESERVATIONS: 'beni_reservations_v1'
};

const notifyChange = (key: string) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('beni_store_update', { detail: { key } }));
  }
};

const SAMPLE_ORDERS: Order[] = [
  {
    id: 'BENI-2026-1042',
    orderNumber: '#1042',
    items: [
      {
        product: INITIAL_PRODUCTS[0], // Malai Ghevar
        quantity: 1,
        selectedVariant: '1 Piece (~500g)',
        itemTotal: 480
      },
      {
        product: INITIAL_PRODUCTS[1], // Kaju Katli
        quantity: 2,
        selectedVariant: '500g Box',
        itemTotal: 1040
      }
    ],
    customer: {
      name: 'Rohan Sharma',
      phone: '+91 98712 34567',
      email: 'rohan.sharma@gmail.com',
      address: 'House 42, Block C, Nirman Vihar',
      pincode: '110092',
      landmark: 'Near V3S Mall',
      city: 'Delhi'
    },
    orderType: 'delivery',
    preferredTime: 'Today, 5:00 PM – 6:00 PM',
    specialInstructions: 'Please pack in festive carry bag with extra dry tissues.',
    subtotal: 1520,
    discountAmount: 150,
    couponCode: 'BENI10',
    taxes: 68.5,
    deliveryCharge: 0,
    totalAmount: 1438.5,
    paymentMethod: 'upi',
    paymentStatus: 'verified',
    status: 'Out for Delivery',
    statusHistory: [
      { status: 'Order Received', timestamp: '2026-11-06T10:15:00Z', note: 'Payment verified via UPI' },
      { status: 'Order Confirmed', timestamp: '2026-11-06T10:18:00Z', note: 'Store accepted order' },
      { status: 'Preparing Your Order', timestamp: '2026-11-06T10:30:00Z', note: 'Confectioner packaging fresh sweets' },
      { status: 'Out for Delivery', timestamp: '2026-11-06T11:05:00Z', note: 'Rider assigned with thermal box' }
    ],
    createdAt: '2026-11-06T10:15:00Z'
  },
  {
    id: 'BENI-2026-1041',
    orderNumber: '#1041',
    items: [
      {
        product: INITIAL_PRODUCTS[9], // Chole Bhature
        quantity: 2,
        itemTotal: 320
      },
      {
        product: INITIAL_PRODUCTS[20], // Sweet Lassi
        quantity: 2,
        itemTotal: 180
      }
    ],
    customer: {
      name: 'Pooja Verma',
      phone: '+91 98101 22334',
      email: 'pooja.verma@outlook.com',
      address: 'B-12, Main Vikas Marg, Shakarpur',
      pincode: '110092',
      landmark: 'Opposite Metro Pillar 38',
      city: 'Delhi'
    },
    orderType: 'takeaway',
    preferredTime: 'Ready for pickup in 20 mins',
    subtotal: 500,
    discountAmount: 0,
    taxes: 25,
    deliveryCharge: 0,
    totalAmount: 525,
    paymentMethod: 'pay_at_store',
    paymentStatus: 'pending',
    status: 'Ready for Pickup',
    statusHistory: [
      { status: 'Order Received', timestamp: '2026-11-06T11:00:00Z' },
      { status: 'Order Confirmed', timestamp: '2026-11-06T11:02:00Z' },
      { status: 'Preparing Your Order', timestamp: '2026-11-06T11:05:00Z' },
      { status: 'Ready for Pickup', timestamp: '2026-11-06T11:22:00Z', note: 'Hot fresh packing completed at front counter' }
    ],
    createdAt: '2026-11-06T11:00:00Z'
  },
  {
    id: 'BENI-2026-1040',
    orderNumber: '#1040',
    items: [
      {
        product: INITIAL_PRODUCTS[22], // Shubh Utsav Hamper
        quantity: 3,
        itemTotal: 3750
      }
    ],
    customer: {
      name: 'Aditya Gupta',
      phone: '+91 99990 88776',
      email: 'aditya.gupta@fintech.co',
      address: 'Tower B, Flat 802, Preet Vihar',
      pincode: '110092',
      landmark: 'Near Preet Vihar Club',
      city: 'Delhi'
    },
    orderType: 'delivery',
    preferredTime: 'Delivered',
    subtotal: 3750,
    discountAmount: 100,
    couponCode: 'FESTIVE100',
    taxes: 182.5,
    deliveryCharge: 0,
    totalAmount: 3832.5,
    paymentMethod: 'razorpay',
    paymentStatus: 'paid',
    status: 'Delivered',
    statusHistory: [
      { status: 'Order Received', timestamp: '2026-11-05T14:00:00Z' },
      { status: 'Order Confirmed', timestamp: '2026-11-05T14:05:00Z' },
      { status: 'Preparing Your Order', timestamp: '2026-11-05T14:20:00Z' },
      { status: 'Out for Delivery', timestamp: '2026-11-05T15:10:00Z' },
      { status: 'Delivered', timestamp: '2026-11-05T15:45:00Z', note: 'Handed to recipient with festive message card' }
    ],
    createdAt: '2026-11-05T14:00:00Z'
  }
];

export const StorageService = {
  // Products
  getProducts: (): Product[] => {
    try {
      const data = localStorage.getItem(KEYS.PRODUCTS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Storage read failed', e);
    }
    // Initialize
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  },

  saveProducts: (products: Product[]) => {
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
    notifyChange(KEYS.PRODUCTS);
  },

  updateProduct: (updatedProduct: Product) => {
    const products = StorageService.getProducts();
    const index = products.findIndex(p => p.id === updatedProduct.id);
    if (index !== -1) {
      products[index] = updatedProduct;
    } else {
      products.unshift(updatedProduct);
    }
    StorageService.saveProducts(products);
  },

  deleteProduct: (productId: string) => {
    const products = StorageService.getProducts().filter(p => p.id !== productId);
    StorageService.saveProducts(products);
  },

  // Orders
  getOrders: (): Order[] => {
    try {
      const data = localStorage.getItem(KEYS.ORDERS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Storage read failed', e);
    }
    localStorage.setItem(KEYS.ORDERS, JSON.stringify(SAMPLE_ORDERS));
    return SAMPLE_ORDERS;
  },

  saveOrder: (order: Order) => {
    const orders = StorageService.getOrders();
    // Prepend new order
    orders.unshift(order);
    localStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));
    notifyChange(KEYS.ORDERS);

    // Also link to customer if phone matches
    const customer = StorageService.getCustomer();
    if (customer && customer.phone === order.customer.phone) {
      if (!customer.savedOrderIds.includes(order.id)) {
        customer.savedOrderIds.unshift(order.id);
        StorageService.saveCustomer(customer);
      }
    }
    return order;
  },

  updateOrderStatus: (orderId: string, newStatus: Order['status'], note?: string) => {
    const orders = StorageService.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.status = newStatus;
      order.statusHistory.push({
        status: newStatus,
        timestamp: new Date().toISOString(),
        note: note || `Status updated to ${newStatus}`
      });
      localStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));
      notifyChange(KEYS.ORDERS);
    }
  },

  getOrderById: (orderId: string): Order | undefined => {
    const orders = StorageService.getOrders();
    return orders.find(o => o.id === orderId || o.orderNumber === orderId);
  },

  // Settings
  getSettings: (): BusinessSettings => {
    try {
      const data = localStorage.getItem(KEYS.SETTINGS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Storage read failed', e);
    }
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(INITIAL_BUSINESS_SETTINGS));
    return INITIAL_BUSINESS_SETTINGS;
  },

  saveSettings: (settings: BusinessSettings) => {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    notifyChange(KEYS.SETTINGS);
  },

  // Coupons
  getCoupons: (): Coupon[] => {
    try {
      const data = localStorage.getItem(KEYS.COUPONS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Storage read failed', e);
    }
    localStorage.setItem(KEYS.COUPONS, JSON.stringify(INITIAL_COUPONS));
    return INITIAL_COUPONS;
  },

  saveCoupons: (coupons: Coupon[]) => {
    localStorage.setItem(KEYS.COUPONS, JSON.stringify(coupons));
    notifyChange(KEYS.COUPONS);
  },

  // Customer Profile
  getCustomer: (): CustomerUser | null => {
    try {
      const data = localStorage.getItem(KEYS.CUSTOMER);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Customer read failed', e);
    }
    return null;
  },

  saveCustomer: (customer: CustomerUser) => {
    localStorage.setItem(KEYS.CUSTOMER, JSON.stringify(customer));
    notifyChange(KEYS.CUSTOMER);
  },

  logoutCustomer: () => {
    localStorage.removeItem(KEYS.CUSTOMER);
    notifyChange(KEYS.CUSTOMER);
  },

  // Admin Session
  getAdminSession: (): AdminUser | null => {
    try {
      const data = localStorage.getItem(KEYS.ADMIN_SESSION);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Admin read failed', e);
    }
    return null;
  },

  saveAdminSession: (admin: AdminUser | null) => {
    if (admin) {
      localStorage.setItem(KEYS.ADMIN_SESSION, JSON.stringify(admin));
    } else {
      localStorage.removeItem(KEYS.ADMIN_SESSION);
    }
    notifyChange(KEYS.ADMIN_SESSION);
  },

  // Catering Inquiries
  getInquiries: (): BulkCateringInquiry[] => {
    try {
      const data = localStorage.getItem(KEYS.INQUIRIES);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn(e);
    }
    return [
      {
        id: 'INQ-101',
        name: 'Vikas Aggarwal',
        phone: '+91 98112 44556',
        email: 'vikas.aggarwal@gmail.com',
        eventType: 'Wedding',
        eventDate: '2026-12-10',
        guestCount: 350,
        budgetRange: '₹75,000 - ₹1,50,000',
        requirements: 'Assorted custom royal mithai boxes with bride & groom names, plus live Jalebi Rabri counter for reception in Laxmi Nagar.',
        createdAt: '2026-11-04T12:00:00Z'
      }
    ];
  },

  saveInquiry: (inquiry: BulkCateringInquiry) => {
    const list = StorageService.getInquiries();
    list.unshift(inquiry);
    localStorage.setItem(KEYS.INQUIRIES, JSON.stringify(list));
    notifyChange(KEYS.INQUIRIES);
  },

  // Table Reservations
  getReservations: (): TableReservation[] => {
    try {
      const data = localStorage.getItem(KEYS.RESERVATIONS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn(e);
    }
    return [
      {
        id: 'RES-801',
        name: 'Suresh Singhania',
        phone: '+91 98100 55443',
        guestCount: 6,
        date: '2026-11-07',
        time: '19:30',
        specialRequests: 'Family gathering dinner, prefer quiet booth table.',
        status: 'Confirmed',
        createdAt: '2026-11-05T16:00:00Z'
      }
    ];
  },

  saveReservation: (reservation: TableReservation) => {
    const list = StorageService.getReservations();
    list.unshift(reservation);
    localStorage.setItem(KEYS.RESERVATIONS, JSON.stringify(list));
    notifyChange(KEYS.RESERVATIONS);
  }
};
