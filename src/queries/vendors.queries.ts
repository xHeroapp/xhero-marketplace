import { supabase } from "@/supabase-client";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

// Get vendors
export const useGetVendors = (filters = {}) => {
  const { search, limit } = filters;

  return useInfiniteQuery({
    queryKey: ["get-vendors", search],
    queryFn: async ({ pageParam = 0 }) => {
      const currentPage = typeof pageParam === "number" ? pageParam : 0;
      const from = currentPage * limit;
      const to = from + limit - 1;

      let query = supabase
        .from("vendors_view")
        .select("*", { count: "exact" })
        .neq("vendor_id", "10988314-40e7-4b56-8010-49218fcd0933") // not returning the xhero vendor (we only return cash)
        .range(from, to);

      // Search filter
      if (search && search.trim() !== "") {
        query = query.or(`vendor_name.ilike.%${search}%`);
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

// get Vendor
export const useGetVendor = (id) => {
  return useQuery({
    queryKey: ["get-vendor"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vendors_view")
        .select()
        .eq("vendor_id", id)
        .single();

      if (error) throw error;

      return data;
    },
  });
};

// Get Vendor Product items
export const useGetProductItems = (filters = {}, vendor_id: string) => {
  const { search, limti, category, price } = filters;

  return useInfiniteQuery({
    queryKey: ["get-vendor-products", search, category ?? null, price ?? null],
    queryFn: async ({ pageParam = 0 }) => {
      const currentPage = typeof pageParam === "number" ? pageParam : 0;
      const from = currentPage * limit;
      const to = from + limit - 1;

      let query = supabase
        .from("vendor_products_view")
        .select("*", { count: "exact" })
        .eq("vendor_product-id", vendor_id)
        .range(from, to);

      // Search filter
      if (search && search.trim() !== "") {
        query = query.or(`product_name.ilike.%${search}%`);
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
