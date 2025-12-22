import { supabase } from "@/supabase-client";
import { useMutation } from "@tanstack/react-query";

export const useAddToWishListQuery = () => {
  return useMutation({
    mutationFn: async (wishList) => {
      const { data, error } = await supabase.from("wishlists").insert(wishList);
      if (error) throw error;
      return data;
    },
  });
};
