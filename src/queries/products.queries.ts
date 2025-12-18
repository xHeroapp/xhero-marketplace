import { supabase } from "@/supabase-client";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

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

// get all products
export const useGetProductItems = (filters = {}, limit: number) => {
  const { search, category, price } = filters;

  return useInfiniteQuery({
    queryKey: [
      "get-reward-product-items",
      search,
      category ?? null,
      price ?? null,
    ],
    queryFn: async ({ pageParam = 0 }) => {
      const currentPage = typeof pageParam === "number" ? pageParam : 0;
      const from = currentPage * limit;
      const to = from + limit - 1;

      let query = supabase
        .from("vendor_products_view")
        .select("*", { count: "exact" })
        .neq("product_id", "7177584c-8ea8-4cb8-9758-ae1b7edf51d2") // avoid returning cash product
        .range(from, to);

      // Search filter
      if (search && search.trim() !== "") {
        query = query.or(
          `product_name.ilike.%${search}%,vendor_name.ilike.%${search}%`
        );
      }
      // Category filter
      if (category && category.trim() !== "") {
        query = query.eq("category_name", category);
      }
      // Price filter
      if (price) {
        const { from: priceFrom, to: priceTo } = price;
        if (priceFrom != null) query = query.gte("price", priceFrom);
        if (priceTo != null) query = query.lte("price", priceTo);
      }

      const { data, count, error } = await query;
      if (error) throw error;

      return { items: data ?? [], total: count ?? 0, currentPage }; // or whatever shape you prefer
    },
    initialPageParam: 0, // <--- important
    getNextPageParam: (lastPage, allPages) => {
      return (lastPage.items?.length ?? 0) === limit
        ? allPages.length
        : undefined;
    },
  });
};
