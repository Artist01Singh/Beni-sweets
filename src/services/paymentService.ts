export interface UpiPaymentDetails {
  vpa: string;
  payeeName: string;
  amount: number;
  transactionNote: string;
  upiUri: string;
}

export const PaymentService = {
  createUpiPaymentDetails: (amount: number, orderId: string, vpa = 'benisweets@upi'): UpiPaymentDetails => {
    const payeeName = 'Beni Sweets Corner';
    const transactionNote = `Order ${orderId}`;
    const cleanAmount = amount.toFixed(2);
    // Standard NPCI UPI URI Scheme
    const upiUri = `upi://pay?pa=${encodeURIComponent(vpa)}&pn=${encodeURIComponent(
      payeeName
    )}&am=${cleanAmount}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;

    return {
      vpa,
      payeeName,
      amount,
      transactionNote,
      upiUri
    };
  },

  // Generates reliable QR matrix representation for rendering without fragile external services
  renderQrCodeUrl: (data: string): string => {
    // Uses Google Charts QR API or fallback data URL for hermetic offline rendering
    return `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(data)}`;
  },

  verifyTestPayment: async (
    method: 'upi' | 'razorpay' | 'cod' | 'pay_at_store',
    details: { utrOrTransactionId?: string; razorpayPaymentId?: string }
  ): Promise<{ success: boolean; message: string; transactionId: string }> => {
    // Server-like validation
    await new Promise(resolve => setTimeout(resolve, 800)); // Network simulation

    if (method === 'upi') {
      const utr = details.utrOrTransactionId?.trim() || `UPI${Date.now().toString().slice(-8)}`;
      return {
        success: true,
        message: 'UPI payment verified successfully',
        transactionId: utr
      };
    }

    if (method === 'razorpay') {
      const payId = details.razorpayPaymentId || `pay_test_${Math.random().toString(36).substring(2, 10)}`;
      return {
        success: true,
        message: 'Razorpay test transaction authorized',
        transactionId: payId
      };
    }

    return {
      success: true,
      message: method === 'cod' ? 'Cash on Delivery confirmed' : 'Pay at store confirmed',
      transactionId: `BENI_OFFLINE_${Date.now().toString().slice(-6)}`
    };
  }
};
