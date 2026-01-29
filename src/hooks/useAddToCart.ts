import { useAuthStore } from "@/store/authStore";
import useCartStore from "@/store/cartStore";
import { useRouter } from "next/navigation";

export const useAddToCart = (quantity?: number, order_type?: string) => {
  const { user } = useAuthStore();
  const { addProductToCart } = useCartStore();
  const router = useRouter();

  const handleAddToCart = (item: any) => {
    // Check if item is a service (not goods)
    if (item.product_type !== "goods") {
      router.push(`/product/${item.vendor_product_id}`);
      return;
    }

    addProductToCart(
      item,
      // vendor data
      {
        vendor_name: item.vendor_name,
        vendor_id: item.vendor_id,
        vendor_img: item.vendor_avatar_url || item.avatar_url || "/assets/img/vendor/vendor-avatar.png",
        delivery_fee: item.delivery_fee,
        delivery_fee_type: item.delivery_fee_type,
        delivery_areas: item.delivery_areas,
      },
      user && user.id,
      quantity && quantity,
      order_type && order_type
    );
  };

  return { handleAddToCart };
};
