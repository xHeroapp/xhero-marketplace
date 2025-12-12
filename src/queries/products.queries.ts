import { supabase } from "@/supabase-client";
import { useQuery } from "@tanstack/react-query";

export const useGetProductCategories = () => {
  return useQuery({
    queryKey: ["get-product-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .neq("name", "Cash");

      if (error) throw error;
      return data;
    },
  });
};

// get featured products
export const useGetFeatureProducts = () => {
  return useQuery({
    queryKey: ["get-featured-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("featured_products")
        .select("*, vendor_products_view(*)");

      if (error) throw error;
      return data;
    },
  });
};

// get Top products
export const useGetTopProducts = () => {
  return useQuery({
    queryKey: ["get-top-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("top_products")
        .select("*, vendor_products_view(*)");

      if (error) throw error;
      return data;
    },
  });
};

// Get Weekly best seller products
export const useGetWeeklyProducts = () => {
  return useQuery({
    queryKey: ["get-weekly-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("weekly_products")
        .select("*, vendor_products_view(*)");

      if (error) throw error;
      return data;
    },
  });
};
