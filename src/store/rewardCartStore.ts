import { toast } from "sonner";
import { create } from "zustand";

const useRewardCartStore = create((set, get) => ({
  rewardCart: null, // single object only

  redeemReward: (reward) => {
    set({
      rewardCart: {
        vendor: reward.vendor,
        recognition_id: reward.recognition_id,
        price: reward.price || 0, // Store the actual product price
        items: {
          [reward.product_id]: {
            ...reward,
            quantity: 1,
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
    const { rewardCart } = get();
    const rewardValue = rewardCart?.price || 0;
    return {
      subtotal: rewardValue,
      discount: rewardValue, // Full discount since it's a gift
      deliveryFee: 0,
      total: 0, // Always 0 for rewards
    };
  },

  /* ---------------- CLEAR ---------------- */
  clearRewardCart: () => set({ rewardCart: null }),
}));

export default useRewardCartStore;

