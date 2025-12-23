import { supabase } from "@/supabase-client";

export const processRewardOrder = async (payload) => {
  console.log(payload);
  const { data, error } = await supabase.rpc("redeem_reward_order", payload);
  if (error) throw error;
  return data;
};
