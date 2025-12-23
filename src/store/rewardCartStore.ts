import { toast } from "sonner";
import { create } from "zustand";

const useRewardCartStore = create((set, get) => ({
  rewardCart: null, // single object only

  redeemReward: (reward) => {
    set({
      rewardCart: {
        vendor: reward.vendor,
        recognition_id: reward.recognition_id,
        items: {
          [reward.product_id]: {
            ...reward,
            quantity: 1,
            price: 0,
          },
        },
      },
    });

    toast.success("Reward ready for redemption");
  },

  /* ---------------- GETTERS ---------------- */
  getItems: () => {
    const { rewardCart } = get();
    return rewardCart ? Object.values(rewardCart.items) : [];
  },

  getTotal: () => {
    // you can expand later if needed
    return {
      subtotal: 0,
      discount: 0,
      deliveryFee: 0,
      total: 0,
    };
  },

  /* ---------------- CLEAR ---------------- */
  clearRewardCart: () => set({ rewardCart: null }),
}));

export default useRewardCartStore;
