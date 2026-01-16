import { supabase } from "@/supabase-client";

export const processServiceOrder = async (payload: {
  p_vendor_product_id: string;
  p_service_mode: string;
  p_start_date: string;
  p_payment_method: string;
  // p_end_date?: string | null; we are only using one time service for now, so no end date is needed
  p_start_time?: string | null;
  // p_duration_minutes?: number | null; we are only using one time service for now, so no duration is needed
  p_note?: string | null;
  p_reference?: string | null;
}) => {
  const { data, error } = await supabase.rpc("process_service_order", payload);
  if (error) throw error;
  return data;
};
