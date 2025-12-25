import { NOTIFICATIONS_PER_PAGE } from "@/constant/constant";
import { supabase } from "@/supabase-client";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

// get notifications

export const useGetNotifications = () => {
  return useInfiniteQuery({
    queryKey: ["notifications"],
    queryFn: async ({ pageParam = 0 }) => {
      const from = pageParam * NOTIFICATIONS_PER_PAGE;
      const to = from + NOTIFICATIONS_PER_PAGE - 1;

      const { data, error, count } = await supabase
        .from("notifications")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw error;

      return {
        notifications: data || [],
        nextPage:
          data && data.length === NOTIFICATIONS_PER_PAGE
            ? pageParam + 1
            : undefined,
        totalCount: count || 0,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
  });
};

export const useGetNotificationsCount = (userId: string) => {
  return useQuery({
    queryKey: ["notifications-count", userId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc(
        "get_user_notifications_count",
        { p_user_id: userId }
      );

      if (error) throw error;
      return data; // bigint (number of notifications)
    },
    enabled: !!userId,
  });
};
