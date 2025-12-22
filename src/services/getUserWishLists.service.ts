import { supabase } from "@/supabase-client";

export const getUserWishLists = async (user_id: string) => {
  const { data, error } = await supabase.rpc("get_user_wishlist", user_id);
  if (error) throw error;
  return data;
};
