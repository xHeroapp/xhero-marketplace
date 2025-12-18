import { create } from "zustand";
import useCartStore from "./cartStore";

export type PaymentMethod = "wallet" | "bank-transfer";

const useCheckoutStore = create((set, get) => ({
  vendorId: null,
  deliveryFee: 0,
  discount: 0,
  paymentMethod: "wallet" as PaymentMethod,

  /* ---------------- START ---------------- */

  startCheckout: (vendorId) => {
    set({
      vendorId,
      deliveryFee: 0,
      discount: 0,
      paymentMethod: "wallet",
    });
  },

  /* ---------------- SETTERS ---------------- */

  setDeliveryFee: (fee) => {
    set({ deliveryFee: Math.max(0, fee) });
  },

  setDiscount: (amount) => {
    set({ discount: Math.max(0, amount) });
  },

  setPaymentMethod: (method: PaymentMethod) => {
    set({ paymentMethod: method });
  },

  /* ---------------- COMPUTED ---------------- */

  getSubTotal: () => {
    const vendorId = get().vendorId;
    if (!vendorId) return 0;

    return useCartStore.getState().getVendorTotal(vendorId);
  },

  getTotal: () => {
    const subTotal = get().getSubTotal();
    const { deliveryFee, discount } = get();

    return Math.max(subTotal + deliveryFee - discount, 0);
  },

  getVendorCart: () => {
    const vendorId = get().vendorId;
    if (!vendorId) return null;

    return useCartStore.getState().cart[vendorId] ?? null;
  },

  /* ---------------- CLEAR ---------------- */

  clearCheckout: () => {
    set({
      vendorId: null,
      deliveryFee: 0,
      discount: 0,
      paymentMethod: "wallet",
    });
  },
}));

export default useCheckoutStore;
