import { supabase } from "@/supabase-client";

export const processFlashSaleOrder = async (payload) => {
  const { data, error } = await supabase.rpc(
    "process_flash_sale_order",
    payload
  );
  if (error) throw error;
  return data;
};
