
import { useAddToWishListQuery, useDeleteItemWhishList } from "@/queries/wishlist.queries";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export const useAddToWishList = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  // Data mutation
  const AddToWishListQuery = useAddToWishListQuery();
  const DeleteItemWishListQuery = useDeleteItemWhishList();

  // handle add to wishlist
  function addToWishList(vendor_product_id) {
    try {
      const promise = AddToWishListQuery.mutateAsync({
        user_id: user?.user_id,
        vendor_product_id,
      }).then(() => {
        queryClient.invalidateQueries({ queryKey: ["check-wishlist", user?.user_id, vendor_product_id] });
      });

      toast.promise(promise, {
        loading: "Adding to wishlist...",
        success: "Product added to wishlist",
        error: (err) => {
          if (err.code == "23505") {
            return "Product already in wishlist";
          }
          return err.message;
        },
      });
    } catch (error) {
      toast.error("Error adding to wishlist");
    }
  }

  // handle remove from wishlist
  function removeFromWishList(wishlist_id: string, vendor_product_id: string) {
    try {
      const promise = DeleteItemWishListQuery.mutateAsync(wishlist_id).then(() => {
        queryClient.invalidateQueries({ queryKey: ["check-wishlist", user?.user_id, vendor_product_id] });
      });

      toast.promise(promise, {
        loading: "Removing from wishlist...",
        success: "Product removed from wishlist",
        error: "Error removing from wishlist",
      });
    } catch (error) {
      toast.error("Error removing from wishlist");
    }
  }

  return { addToWishList, removeFromWishList };
};
