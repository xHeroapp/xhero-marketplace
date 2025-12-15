import { toast } from "sonner";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCartStore = create((set, get) => ({
  // The cart items stored as an object for fast updates
  productsInCart: {},

  // Load cart for a user
  loadCart: (userId) => {
    const storedCart = localStorage.getItem(`${userId}-cart-storage`);
    set({
      productsInCart: storedCart ? JSON.parse(storedCart) : {},
    });
  },

  // Persist cart manually
  persistCart: (userId) => {
    localStorage.setItem(
      `cart-${userId}`,
      JSON.stringify(get().productsInCart)
    );
  },

  // Add a product to the cart (or increment if exists)
  addProductToCart: (product, quantity = 1) => {
    const cart = { ...get().productsInCart };

    if (cart[product.product_id]) {
      cart[product.product_id].quantity += quantity;
    } else {
      cart[product.product_id] = { ...product, quantity };
    }

    set({ productsInCart: cart });
    get().persistCart(userId);
    toast.success("Product Added to cart");
  },

  // Remove a product completely
  removeProductFromCart: (productId) => {
    const cart = { ...get().productsInCart };
    delete cart[productId];
    set({ productsInCart: cart });
  },

  // Increment quantity
  incrementQuantity: (productId) => {
    const cart = { ...get().productsInCart };
    if (cart[productId]) {
      cart[productId].quantity += 1;
      set({ productsInCart: cart });
    }
  },

  // Decrement quantity
  decrementQuantity: (productId) => {
    const cart = { ...get().productsInCart };
    if (cart[productId]) {
      if (cart[productId].quantity > 1) {
        cart[productId].quantity -= 1;
      } else {
        delete cart[productId]; // remove if quantity reaches 0
      }
      set({ productsInCart: cart });
    }
  },

  // Clear entire cart
  clearCart: () => set({ productsInCart: {} }),

  // Get total items in cart
  getTotalItems: () =>
    Object.values(get().productsInCart).reduce(
      (acc, item) => acc + item.quantity,
      0
    ),

  // Get total price of cart
  getTotalPrice: () =>
    Object.values(get().productsInCart).reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    ),
}));

export default useCartStore;
