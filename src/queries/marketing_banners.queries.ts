import { supabase } from "@/supabase-client";
import { useQuery } from "@tanstack/react-query";

export const useGetMarketingBanners = (location: string) => {
    return useQuery({
        queryKey: ["get-marketing-banners", location],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("marketing_banners")
                .select("*")
                .eq("location", location)
                .eq("is_active", true)
                .order("sort_order", { ascending: true });

            if (error) throw error;

            return data;
        },
    });
};
