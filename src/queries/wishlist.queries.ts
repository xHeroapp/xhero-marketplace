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

// Bulk fetch wishlist items for efficient local lookup
export const useWishlistMap = (user_id: string | undefined) => {
  return useQuery({
    queryKey: ["user-wishlist-map", user_id],
    queryFn: async () => {
      if (!user_id) return new Map<string, string>();

      const { data, error } = await supabase
        .from("wishlists")
        .select("id, vendor_product_id")
        .eq("user_id", user_id);

      if (error) throw error;

      // Create a map of vendor_product_id -> wishlist_id for O(1) lookup
      const map = new Map<string, string>();
      data?.forEach((item) => {
        if (item.vendor_product_id) {
          map.set(item.vendor_product_id, item.id);
        }
      });
      return map;
    },
    enabled: !!user_id,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
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
