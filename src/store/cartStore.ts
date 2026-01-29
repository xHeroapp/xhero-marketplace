import { FLASH_SALE_ORDER_TYPE } from "@/constant/constant";
import { calculateCartDiscount } from "@/utils/calculateCartDiscount";
import { toast } from "sonner";
import { create } from "zustand";

// Type for delivery area
interface DeliveryArea {
  id: string;
  location: string;
  fee: number | string;
}

interface CartItem {
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
  [key: string]: any; // Allow other properties
}

interface VendorData {
  vendor_id: string;
  vendor_name: string;
  vendor_img?: string;
  delivery_fee?: number;
  delivery_fee_type?: string;
  delivery_areas?: DeliveryArea[];
  [key: string]: any;
}

interface VendorCart {
  vendor: VendorData;
  items: Record<string, CartItem>;
}

interface VendorTotal {
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
}

interface CartState {
  cart: Record<string, VendorCart>;
  selectedDeliveryLocation: Record<string, DeliveryArea | null>;

  // Load & Save
  loadCart: (userId: string) => void;
  persistCart: (userId?: string) => void;

  // Actions
  setDeliveryLocation: (vendorId: string, location: DeliveryArea | null, userId?: string) => void;
  updateVendorInCart: (vendorId: string, freshVendorData: any, userId?: string) => void;
  addProductToCart: (product: any, vendor: any, userId?: string, quantity?: number) => void;
  removeProductFromCart: (vendorId: string, productId: string, userId?: string) => void;
  incrementQuantity: (vendorId: string, productId: string, userId?: string) => void;
  decrementQuantity: (vendorId: string, productId: string, userId?: string) => void;
  clearVendorCart: (vendorId: string, userId?: string) => void;
  clearCart: (userId: string) => void;
  getVendorTotal: (vendorId: string) => VendorTotal;
}

const useCartStore = create<CartState>((set, get) => ({
  cart: {},
  // Stores the selected delivery location per vendor (keyed by vendorId)
  selectedDeliveryLocation: {} as Record<string, DeliveryArea | null>,

  /* ---------------- LOAD & SAVE ---------------- */

  loadCart: (userId) => {
    const storedCart = localStorage.getItem(`${userId}-cart`);
    const storedLocations = localStorage.getItem(`${userId}-delivery-locations`);
    set({
      cart: storedCart ? JSON.parse(storedCart) : {},
      selectedDeliveryLocation: storedLocations ? JSON.parse(storedLocations) : {}
    });
  },

  persistCart: (userId) => {
    if (!userId) return;
    localStorage.setItem(`${userId}-cart`, JSON.stringify(get().cart));
    localStorage.setItem(`${userId}-delivery-locations`, JSON.stringify(get().selectedDeliveryLocation));
  },

  /* ---------------- DELIVERY LOCATION ---------------- */

  setDeliveryLocation: (vendorId: string, location: DeliveryArea | null, userId?: string) => {
    const current = { ...get().selectedDeliveryLocation };
    current[vendorId] = location;
    set({ selectedDeliveryLocation: current });
    if (userId) {
      get().persistCart(userId);
    }
  },

  // Used during revalidation to update vendor data in cart without losing items
  updateVendorInCart: (vendorId: string, freshVendorData: any, userId?: string) => {
    const cart = { ...get().cart };
    if (cart[vendorId]) {
      cart[vendorId] = {
        ...cart[vendorId],
        vendor: { ...cart[vendorId].vendor, ...freshVendorData }
      };
      set({ cart });
      if (userId) {
        get().persistCart(userId);
      }
    }
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
      // Also clear selected location for this vendor
      const locations = { ...get().selectedDeliveryLocation };
      delete locations[vendorId];
      set({ selectedDeliveryLocation: locations });
      // We must persist the location removal as well
      if (userId) {
        localStorage.setItem(`${userId}-delivery-locations`, JSON.stringify(locations));
      }
    }

    set({ cart });
    get().persistCart(userId);
  },

  /* ---------------- QUANTITY ---------------- */

  incrementQuantity: (vendorId, productId, userId) => {
    const cart = { ...get().cart };

    // Safety check
    if (!cart[vendorId] || !cart[vendorId].items[productId]) return;

    cart[vendorId].items[productId].quantity += 1;

    set({ cart });
    get().persistCart(userId);
  },

  decrementQuantity: (vendorId, productId, userId) => {
    const cart = { ...get().cart };

    // Safety check
    if (!cart[vendorId] || !cart[vendorId].items[productId]) return;

    const item = cart[vendorId].items[productId];

    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      delete cart[vendorId].items[productId];
    }

    if (Object.keys(cart[vendorId].items).length === 0) {
      delete cart[vendorId];
      // Also clear selected location for this vendor
      const locations = { ...get().selectedDeliveryLocation };
      delete locations[vendorId];
      set({ selectedDeliveryLocation: locations });
      if (userId) {
        localStorage.setItem(`${userId}-delivery-locations`, JSON.stringify(locations));
      }
    }

    set({ cart });
    get().persistCart(userId);
  },

  /* ---------------- CLEAR ---------------- */

  clearVendorCart: (vendorId, userId) => {
    const cart = { ...get().cart };
    delete cart[vendorId];
    // Also clear selected location
    const locations = { ...get().selectedDeliveryLocation };
    delete locations[vendorId];
    set({ cart, selectedDeliveryLocation: locations });
    get().persistCart(userId);
  },

  clearCart: (userId) => {
    set({ cart: {}, selectedDeliveryLocation: {} });
    localStorage.removeItem(`${userId}-cart`);
    localStorage.removeItem(`${userId}-delivery-locations`);
  },

  /* ---------------- TOTALS ---------------- */

  getVendorTotal: (vendorId) => {
    const vendorCart = get().cart[vendorId];
    if (!vendorCart) {
      return { subtotal: 0, discount: 0, deliveryFee: 0, total: 0 };
    }

    const items = Object.values(vendorCart.items);
    const vendor = vendorCart.vendor;

    const subtotal = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    const discount = calculateCartDiscount(items);

    // Determine delivery fee based on fee type
    let deliveryFee = 0;
    if (vendor.delivery_fee_type === "location") {
      // Use selected location's fee if available
      const selectedLocation = get().selectedDeliveryLocation[vendorId];
      if (selectedLocation) {
        deliveryFee = Number(selectedLocation.fee) || 0;
      }
      // If no location selected, fee stays 0 (checkout should be blocked)
    } else {
      // Fixed fee or null/undefined (legacy behavior)
      deliveryFee = vendor.delivery_fee ?? 0;
    }

    const total = Math.max(0, subtotal - discount + deliveryFee);

    return { subtotal, discount, deliveryFee, total };
  },
}));

export default useCartStore;

