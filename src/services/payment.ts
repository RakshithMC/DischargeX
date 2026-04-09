
export const RAZORPAY_KEY_ID = (import.meta as any).env.VITE_RAZORPAY_KEY_ID || "rzp_test_placeholder";

export interface PaymentOptions {
  amount: number;
  currency: string;
  name: string;
  description: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  onSuccess: (response: any) => void;
  onFailure: (error: any) => void;
}

export const startPayment = (options: PaymentOptions) => {
  const rzpOptions = {
    key: RAZORPAY_KEY_ID,
    amount: options.amount * 100, // Amount in paise
    currency: options.currency,
    name: options.name,
    description: options.description,
    image: "https://picsum.photos/seed/logo/200/200",
    handler: function (response: any) {
      console.log("Payment successful:", response);
      localStorage.setItem("isPaid", "true");
      if (options.onSuccess) options.onSuccess(response);
      // Reload page to unlock features as requested
      window.location.reload();
    },
    prefill: options.prefill || {
      name: "User",
      email: "user@example.com",
      contact: "9999999999"
    },
    theme: {
      color: "#2563eb", // blue-600
    },
    modal: {
      ondismiss: function () {
        console.log("Payment modal dismissed");
      },
    },
  };

  const rzp = new (window as any).Razorpay(rzpOptions);
  rzp.on("payment.failed", function (response: any) {
    console.error("Payment failed:", response.error);
    if (options.onFailure) options.onFailure(response.error);
  });
  rzp.open();
};

export const checkPaymentStatus = (): boolean => {
  return localStorage.getItem("isPaid") === "true";
};
