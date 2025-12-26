import { create } from "zustand";

type FlashSaleItem = {
  flashSaleItemId: string;
  vendorId: string;
  flashPrice: number;
  productName?: string;
  imageUrl?: string;
};

type PaymentMethod = "wallet" | "bank-transfer";

const useFlashSaleStore = create((set, get) => ({
  item: null as FlashSaleItem | null,
  paymentMethod: "wallet" as PaymentMethod,

  /* ---------------- ADD ---------------- */
  setFlashSaleItem: (item: FlashSaleItem) => {
    set({ item });
  },

  /* ---------------- PAYMENT ---------------- */
  setPaymentMethod: (method: PaymentMethod) => {
    set({ paymentMethod: method });
  },

  /* ---------------- GETTERS ---------------- */
  getTotal: () => {
    const item = get().item;
    return item ? item.flash_price + item.delivery_fee : 0;
  },

  /* ---------------- CLEAR ---------------- */
  clear: () => {
    set({
      item: null,
      paymentMethod: "wallet",
    });
  },
}));

export default useFlashSaleStore;
