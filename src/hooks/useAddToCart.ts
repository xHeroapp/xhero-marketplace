import { useAuthStore } from "@/store/authStore";
import useCartStore from "@/store/cartStore";

export const useAddToCart = (quantity?: number, order_type?: string) => {
  const { user } = useAuthStore();
  const { addProductToCart } = useCartStore();

  const handleAddToCart = (item: any) => {
    addProductToCart(
      item,
      // vendor data
      {
        vendor_name: item.vendor_name,
        vendor_id: item.vendor_id,
        vendor_img: "/assets/img/vendor/vendor-avatar.png", //update this to the actual vendor avatar
        delivery_fee: item.delivery_fee,
      },
      user && user.id,
      quantity && quantity,
      order_type && order_type
    );
  };

  return { handleAddToCart };
};
