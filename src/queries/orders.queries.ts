import { supabase } from "@/supabase-client";
import { useQuery } from "@tanstack/react-query";

export const useGetOrderStatus = (order_id, options) => {
  return useQuery({
    queryKey: ["get-order-status", order_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("order_status_history")
        .select("status, created_at")
        .eq("order_id", order_id);

      if (error) throw error;
      return data;
    },
    ...options,
  });
};
