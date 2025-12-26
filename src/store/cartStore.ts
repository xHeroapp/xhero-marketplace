import { FLASH_SALE_ORDER_TYPE } from "@/constant/constant";
import { calculateCartDiscount } from "@/utils/calculateCartDiscount";
import { toast } from "sonner";
import { create } from "zustand";

const useCartStore = create((set, get) => ({
  cart: {},

  /* ---------------- LOAD & SAVE ---------------- */

  loadCart: (userId) => {
    const storedCart = localStorage.getItem(`${userId}-cart`);
    set({ cart: storedCart ? JSON.parse(storedCart) : {} });
  },

  persistCart: (userId) => {
    localStorage.setItem(`${userId}-cart`, JSON.stringify(get().cart));
  },

  /* ---------------- ADD PRODUCT ---------------- */

  addProductToCart: (product, vendor, userId, quantity = 1) => {
    const cart = { ...get().cart };
    const vendorId = vendor.vendor_id;
    const productId = product.product_id;

    if (!cart[vendorId]) {
      cart[vendorId] = {
        vendor,
        items: {},
      };
    }

    if (cart[vendorId].items[productId]) {
      cart[vendorId].items[productId].quantity += quantity;
    } else {
      cart[vendorId].items[productId] = {
        ...product,
        quantity,
      };
    }

    set({ cart });
    get().persistCart(userId);
    toast.success("Product added to cart");
  },

  /* ---------------- REMOVE PRODUCT ---------------- */

  removeProductFromCart: (vendorId, productId, userId) => {
    const cart = { ...get().cart };

    if (!cart[vendorId]) return;

    delete cart[vendorId].items[productId];

    // If vendor has no items left, remove vendor
    if (Object.keys(cart[vendorId].items).length === 0) {
      delete cart[vendorId];
    }

    set({ cart });
    get().persistCart(userId);
  },

  /* ---------------- QUANTITY ---------------- */

  incrementQuantity: (vendorId, productId, userId) => {
    const cart = { ...get().cart };

    cart[vendorId].items[productId].quantity += 1;

    set({ cart });
    get().persistCart(userId);
  },

  decrementQuantity: (vendorId, productId, userId) => {
    const cart = { ...get().cart };
    const item = cart[vendorId].items[productId];

    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      delete cart[vendorId].items[productId];
    }

    if (Object.keys(cart[vendorId].items).length === 0) {
      delete cart[vendorId];
    }

    set({ cart });
    get().persistCart(userId);
  },

  /* ---------------- CLEAR ---------------- */

  clearVendorCart: (vendorId, userId) => {
    const cart = { ...get().cart };
    delete cart[vendorId];
    set({ cart });
    get().persistCart(userId);
  },

  clearCart: (userId) => {
    set({ cart: {} });
    localStorage.removeItem(`${userId}-cart`);
  },

  /* ---------------- TOTALS ---------------- */

  getVendorTotal: (vendorId) => {
    const vendorCart = get().cart[vendorId];
    if (!vendorCart) {
      return { subtotal: 0, discount: 0, deliveryFee: 0, total: 0 };
    }

    const items = Object.values(vendorCart.items);

    const subtotal = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    const discount = calculateCartDiscount(items);
    const deliveryFee = vendorCart.vendor.delivery_fee ?? 0;

    const total = Math.max(0, subtotal - discount + deliveryFee);

    return { subtotal, discount, deliveryFee, total };
  },
}));

export default useCartStore;
