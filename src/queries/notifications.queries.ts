import { supabase } from "@/supabase-client";
import { useMutation, useQuery } from "@tanstack/react-query";

// get notifications
export const useGetNotifications = (user) => {
  return useQuery({
    queryKey: ["notifications", user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

export const useGetNotificationsCount = (user) => {
  return useQuery({
    queryKey: ["notifications-count", user.id],
    queryFn: async () => {
      const { data, error } = await supabase.rpc(
        "get_user_notifications_count",
        { p_user_id: user.id }
      );

      if (error) throw error;
      return data; // bigint (number of notifications)
    },
    // ...options,
  });
};
