import { supabase } from "@/supabase-client";
import { useMutation, useQuery } from "@tanstack/react-query";

// get notifications
export const useGetNotifications = (userId) => {
  return useQuery({
    queryKey: ["notifications", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
};

export const useGetNotificationsCount = (userId) => {
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
