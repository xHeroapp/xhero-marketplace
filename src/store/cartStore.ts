import { toast } from "sonner";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCartStore = create(
  persist(
    (set, get) => ({
      // The cart items stored as an object for fast updates
      productsInCart: {},

      // Add a product to the cart (or increment if exists)
      addProductToCart: (product, quantity = 1) => {
        const cart = { ...get().productsInCart };

        if (cart[product.product_id]) {
          cart[product.product_id].quantity += quantity;
        } else {
          cart[product.product_id] = { ...product, quantity };
        }

        set({ productsInCart: cart });
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
    }),
    {
      name: "xhero-cart-storage", // Key for localStorage
    }
  )
);

export default useCartStore;
