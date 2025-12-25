import { PRODUCT_LIMIT } from "@/constant/constant";
import { supabase } from "@/supabase-client";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useGetFlashSale = () => {
  return useInfiniteQuery({
    queryKey: ["flash-sale"],
    queryFn: async ({ pageParam = 0 }) => {
      const from = pageParam * PRODUCT_LIMIT;
      const to = from + PRODUCT_LIMIT - 1;

      const { data, error, count } = await supabase
        .from("active_flash_sale_products")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw error;

      return {
        flashSaleProduct: data || [],
        nextPage:
          data && data.length === PRODUCT_LIMIT ? pageParam + 1 : undefined,
        totalCount: count || 0,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
  });
};
