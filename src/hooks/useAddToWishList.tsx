import { useAddToWishListQuery } from "@/queries/wishlist.queries";
import { toast } from "sonner";

export const useAddToWishList = () => {
  // Data mutation
  const AddToWishListQuery = useAddToWishListQuery();

  // handle add to wishlist
  function addToWishList(user_id, vendor_product_id) {
    try {
      const promise = AddToWishListQuery.mutateAsync({
        user_id,
        vendor_product_id,
      });

      toast.promise(promise, {
        loading: "Adding wishlist",
        success: "Product added to wish list",
        error: (err) => {
            if(err.code == "23505")// this is the duplicate key value error code 
            {
                return "Product already added to wishlist"
            } 
          return err.message;
        },
      });
    } catch (error) {
      toast.error(
        "There was an error while trying to add yout item to wish list"
      );
    }
  }

  return { addToWishList };
};
