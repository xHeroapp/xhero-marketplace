import { useAuthStore } from "@/store/authStore";
import { supabase } from "@/supabase-client";
import { useQuery } from "@tanstack/react-query";

async function getUser(userId: string) {
  const { data, error } = await supabase
    .from("employees")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) throw error;
  return data;
}

export function useUser() {
  const userId = useAuthStore((state) => state.user?.id);
  const { setUser } = useAuthStore();

  const query = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUser(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });

  // sync store manually after data loads
  if (query.data) {
    setUser(query.data);
  }

  return query;
}
