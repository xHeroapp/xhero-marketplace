import { supabase } from "@/supabase-client";

export const processOrder = async (payload) => {
  const { data, error } = await supabase.rpc("process_vendor_order", payload);
  if (error) throw error;
  return data;
};
