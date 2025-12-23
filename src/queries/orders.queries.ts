import { PRODUCT_LIMIT } from "@/constant/constant";
import { supabase } from "@/supabase-client";
import { useQuery } from "@tanstack/react-query";
import { useInfiniteQuery } from "@tanstack/react-query";

// Raw data from order_items_view (flattened structure)
export interface OrderItemView {
  idx: number;
  order_id: string;
  user_id: string;
  order_total: string;
  order_status: string;
  order_reference: string;
  order_created_at: string;
  order_updated_at: string;
  vendor_order_id: string;
  vendor_id: string;
  vendor_total: string;
  vendor_status: string;
  order_item_id: string;
  quantity: number;
  price_at_order: string;
  item_total: string;
  vendor_product_id: string;
  product_id: string;
  product_name: string;
  product_description: string;
  product_img_url: string;
}

// Grouped structure for display
export interface OrderItem {
  product_id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
  description: string;
}

export interface VendorOrder {
  vendor_order_id: string;
  vendor_id: string;
  vendor_total: number;
  status: string;
  items: OrderItem[];
}

export interface ParsedOrder {
  order_id: string;
  user_id: string;
  total_amount: string;
  status: string;
  reference: string;
  created_at: string;
  updated_at: string;
  vendors: VendorOrder[];
}

// Group flattened items by order_id and vendor_order_id
const groupOrderItems = (items: OrderItemView[]): ParsedOrder[] => {
  const ordersMap = new Map<string, ParsedOrder>();

  items.forEach((item) => {
    const orderId = item.order_id;

    if (!ordersMap.has(orderId)) {
      ordersMap.set(orderId, {
        order_id: item.order_id,
        user_id: item.user_id,
        total_amount: item.order_total,
        status: item.order_status,
        reference: item.order_reference,
        created_at: item.order_created_at,
        updated_at: item.order_updated_at,
        vendors: [],
      });
    }

    const order = ordersMap.get(orderId)!;
    let vendor = order.vendors.find(
      (v) => v.vendor_order_id === item.vendor_order_id
    );

    if (!vendor) {
      vendor = {
        vendor_order_id: item.vendor_order_id,
        vendor_id: item.vendor_id,
        vendor_total: parseFloat(item.vendor_total),
        status: item.vendor_status,
        items: [],
      };
      order.vendors.push(vendor);
    }

    vendor.items.push({
      product_id: item.product_id,
      name: item.product_name,
      quantity: item.quantity,
      price: parseFloat(item.price_at_order),
      image: item.product_img_url,
      description: item.product_description,
    });
  });

  return Array.from(ordersMap.values());
};

export const useGetUserOrders = (user_id: string, limit = PRODUCT_LIMIT) => {
  return useInfiniteQuery({
    queryKey: ["user-orders", user_id],
    queryFn: async ({ pageParam = 0 }) => {
      const from = pageParam * limit;
      const to = from + limit - 1;

      const { data, error, count } = await supabase
        .from("order_items_view")
        .select("*", { count: "exact" })
        .eq("user_id", user_id)
        .order("order_created_at", { ascending: false })
        .range(from, to);

      if (error) throw error;

      // Group the flattened items into orders
      const groupedOrders = groupOrderItems(data ?? []);

      return {
        items: groupedOrders,
        page: pageParam,
        totalCount: count ?? 0,
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) =>
      lastPage.items.length === limit ? pages.length : undefined,
    enabled: !!user_id,
  });
};

export const useGetOrderStatus = (order_id, options) => {
  return useQuery({
    queryKey: ["get-order-status", order_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("order_status_history")
        .select("status, created_at")
        .eq("order_id", order_id);

      if (error) throw error;
      return data;
    },
    ...options,
  });
};
