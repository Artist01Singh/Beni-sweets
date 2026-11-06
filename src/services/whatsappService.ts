import { Order, BulkCateringInquiry, TableReservation } from '../types';

const BENI_PHONE_INT = '919811100486';

export const WhatsAppService = {
  getDirectChatUrl: (customMessage?: string): string => {
    const text = encodeURIComponent(
      customMessage || 
      'Namaste Beni Sweets Corner! I would like to enquire about your fresh sweets and menu.'
    );
    return `https://wa.me/${BENI_PHONE_INT}?text=${text}`;
  },

  getOrderWhatsAppUrl: (order: Order): string => {
    const itemsList = order.items
      .map(
        (item, index) =>
          `${index + 1}. *${item.product.name}* x ${item.quantity} (${item.selectedVariant || item.product.weightOrServing}) = ₹${item.itemTotal}`
      )
      .join('\n');

    const message = `*NEW ORDER - BENI SWEETS CORNER* 🪔
Order ID: *${order.id}*
Date: ${new Date(order.createdAt).toLocaleString('en-IN')}

*CUSTOMER DETAILS:*
• Name: ${order.customer.name}
• Phone: ${order.customer.phone}
• Order Type: *${order.orderType.toUpperCase()}*
${order.orderType === 'delivery' ? `• Address: ${order.customer.address}, ${order.customer.city || 'Delhi'} - ${order.customer.pincode}
• Landmark: ${order.customer.landmark || 'N/A'}` : '• Pickup from Store: L-35, Vijay Chowk, Laxmi Nagar'}
• Preferred Time: ${order.preferredTime}

*ITEMS ORDERED:*
${itemsList}

*BILLING SUMMARY:*
• Subtotal: ₹${order.subtotal}
${order.discountAmount > 0 ? `• Coupon Discount (${order.couponCode}): -₹${order.discountAmount}\n` : ''}• GST (5%): ₹${order.taxes.toFixed(2)}
• Delivery Fee: ${order.deliveryCharge === 0 ? 'FREE' : `₹${order.deliveryCharge}`}
• *TOTAL AMOUNT: ₹${order.totalAmount.toFixed(2)}*
• Payment Mode: *${order.paymentMethod.toUpperCase()}* (${order.paymentStatus})

${order.specialInstructions ? `*Instructions:* ${order.specialInstructions}\n` : ''}
${order.giftMessage ? `*Gift Note:* To: ${order.giftMessage.to} | From: ${order.giftMessage.from} | "${order.giftMessage.message}"\n` : ''}
Please confirm my order. Thank you!`;

    return `https://wa.me/${BENI_PHONE_INT}?text=${encodeURIComponent(message)}`;
  },

  getCateringInquiryWhatsAppUrl: (inquiry: BulkCateringInquiry): string => {
    const message = `*CATERING / BULK ORDER ENQUIRY - BENI SWEETS*
Name: *${inquiry.name}*
Contact: ${inquiry.phone}
Email: ${inquiry.email}
Occasion: *${inquiry.eventType}*
Event Date: ${inquiry.eventDate}
Expected Guests: *${inquiry.guestCount} Pax*
Budget: ${inquiry.budgetRange || 'Not specified'}

*Requirements:*
${inquiry.requirements}

Kindly share your quotation and menu options.`;

    return `https://wa.me/${BENI_PHONE_INT}?text=${encodeURIComponent(message)}`;
  },

  getTableReservationWhatsAppUrl: (res: TableReservation): string => {
    const message = `*TABLE RESERVATION ENQUIRY - BENI RESTAURANT*
Name: *${res.name}*
Phone: ${res.phone}
Guests: *${res.guestCount} Guests*
Date: ${res.date}
Time: ${res.time}
${res.specialRequests ? `Special Request: ${res.specialRequests}` : ''}

Please confirm availability for table seating.`;

    return `https://wa.me/${BENI_PHONE_INT}?text=${encodeURIComponent(message)}`;
  }
};
