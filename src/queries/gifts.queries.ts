// queries/rewards.queries.ts
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { PRODUCT_LIMIT } from "@/constant/constant";
import { supabase } from "@/supabase-client";

export const useGetUserGifts = (
  recipient_id: string,
  limit = PRODUCT_LIMIT
) => {
  return useInfiniteQuery({
    queryKey: ["user-gifts", recipient_id],
    queryFn: async ({ pageParam = 0 }) => {
      const from = pageParam * limit;
      const to = from + limit - 1;

      const { data, error } = await supabase
        .from("users_reward_recognitions_view")
        .select("*", { count: "exact" })
        // .eq("recipient_id", recipient_id)
        .order("created_at", { ascending: false })
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
    enabled: !!recipient_id,
  });
};

export const useGetGiftById = (id: string) => {
  return useQuery({
    queryKey: ["gift", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("users_reward_recognitions_view")
        .select("*")
        .eq("recognition_id", id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};
