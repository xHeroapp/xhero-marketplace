import { PRODUCT_LIMIT } from "@/constant/constant";
import { supabase } from "@/supabase-client";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";

export const useAddToWishListQuery = () => {
  return useMutation({
    mutationFn: async (wishList) => {
      const { data, error } = await supabase.from("wishlists").insert(wishList);
      if (error) throw error;
      return data;
    },
  });
};

export const useCheckItemInWishlist = (user_id: string, vendor_product_id: string) => {
  return useQuery({
    queryKey: ["check-wishlist", user_id, vendor_product_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("wishlists")
        .select("id")
        .eq("user_id", user_id)
        .eq("vendor_product_id", vendor_product_id)
        .single();

      if (error && error.code !== "PGRST116") throw error; // PGRST116 is "no rows found"
      return data?.id || null;
    },
    enabled: !!user_id && !!vendor_product_id,
  });
};

export const useGetUserWishlist = (user_id: string, limit = PRODUCT_LIMIT) => {
  return useInfiniteQuery({
    queryKey: ["user-wishlist", user_id],
    queryFn: async ({ pageParam = 0 }) => {
      const from = pageParam * limit;
      const to = from + limit - 1;

      const { data, error } = await supabase
        .from("user_wishlist_view")
        .select("*", { count: "exact" })
        .order("wishlist_created_at", { ascending: false })
        .range(from, to);

      if (error) throw error;

      return {
        items: data ?? [],
        page: pageParam,
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) =>
      lastPage.items.length === limit ? pages.length : undefined,
    enabled: !!user_id,
  });
};

// Remove item from wish list
export const useDeleteItemWhishList = () => {
  return useMutation({
    mutationFn: async (item_id) => {
      const { data, error } = await supabase
        .from("wishlists")
        .delete()
        .eq("id", item_id);

      if (error) throw error;
      return data;
    },
  });
};
