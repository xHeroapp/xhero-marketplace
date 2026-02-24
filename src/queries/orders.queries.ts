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
        .select(
          "idx,order_id,user_id,order_total,order_status,order_reference,order_created_at,order_updated_at,vendor_order_id,vendor_id,vendor_total,vendor_status,order_item_id,quantity,price_at_order,item_total,vendor_product_id,product_id,product_name,product_description,product_img_url",
          { count: "exact" }
        )
        // .eq("user_id", user_id)
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

// Service order types
export interface ServiceOrder {
  idx: number;
  service_order_id: string;
  user_id: string;
  vendor_id: string;
  vendor_name: string;
  vendor_product_id: string;
  service_name: string;
  image_url: string;
  total_amount: string;
  status: string;
  reference: string;
  created_at: string;
  service_mode: string;
  start_date: string | null;
  end_date: string | null;
  start_time: string;
  duration_minutes: number;
  note: string;
}

export const useGetUserServiceOrders = (
  user_id: string,
  limit = PRODUCT_LIMIT
) => {
  return useInfiniteQuery({
    queryKey: ["user-service-orders", user_id],
    queryFn: async ({ pageParam = 0 }) => {
      const from = pageParam * limit;
      const to = from + limit - 1;

      const { data, error, count } = await supabase
        .from("service_orders_view")
        .select(
          "idx,service_order_id,user_id,vendor_id,vendor_name,vendor_product_id,service_name,image_url,total_amount,status,reference,created_at,service_mode,start_date,end_date,start_time,duration_minutes,note",
          { count: "exact" }
        )
        // .eq("user_id", user_id)
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw error;

      return {
        items: data ?? [],
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

export const useGetOrderStatus = (order_id: string, options?: any) => {
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

export const useGetServiceOrderStatus = (
  service_order_id: string,
  options?: any
) => {
  return useQuery({
    queryKey: ["get-service-order-status", service_order_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("service_order_status_history")
        .select("status, created_at")
        .eq("order_id", service_order_id);

      if (error) throw error;
      return data;
    },
    ...options,
  });
};

// --- UNIFIED ORDERS ---

export interface UnifiedOrderView {
  unique_track_id: string;
  order_id: string;
  type: "goods" | "service" | "voucher";
  reference: string;
  total_amount: number;
  status: string;
  created_at: string;
  user_id: string;
  employee_name: string | null;
  employee_email: string | null;
  employee_avatar: string | null;
  employee_phone: string | null;
  delivery_address: string | null;
  vendor_name: string | null;
  vendor_logo: string | null;
  vendor_address: string | null;
  item_name: string;
  item_image: string | null;
  quantity: number | null;
  price: number | null;
  payment_status: string | null;
  service_start_date: string | null;
  voucher_recipient: string | null;
  service_mode: string | null;
  order_note: string | null;
  delivery_fee: number;
  vendor_order_id: string | null;
  readable_id: number;
}

export interface UnifiedOrder {
  order_id: string;
  type: "goods" | "service" | "voucher";
  reference: string;
  total_amount: number;
  status: string;
  created_at: string;
  user_id: string;
  readable_id: number;
  items: {
    item_name: string;
    item_image: string | null;
    quantity: number | null;
    price: number | null;
  }[];
}

const groupUnifiedOrders = (items: UnifiedOrderView[]): UnifiedOrder[] => {
  const ordersMap = new Map<string, UnifiedOrder>();

  items.forEach((item) => {
    const orderId = item.order_id;

    if (!ordersMap.has(orderId)) {
      ordersMap.set(orderId, {
        order_id: item.order_id,
        type: item.type,
        reference: item.reference,
        total_amount: item.total_amount,
        status: item.status,
        created_at: item.created_at,
        user_id: item.user_id,
        readable_id: item.readable_id,
        items: [],
      });
    }

    const order = ordersMap.get(orderId)!;

    // Only add item if it exists (handles cases where there are no line items returning yet)
    if (item.item_name) {
      order.items.push({
        item_name: item.item_name,
        item_image: item.item_image,
        quantity: item.quantity,
        price: item.price,
      });
    }
  });

  return Array.from(ordersMap.values());
};

export const useGetUnifiedUserOrders = (user_id: string, limit = PRODUCT_LIMIT) => {
  return useInfiniteQuery({
    queryKey: ["unified-user-orders", user_id],
    queryFn: async ({ pageParam = 0 }) => {
      const from = pageParam * limit;
      const to = from + limit - 1;

      // Ensure we sort by latest orders correctly
      const { data, error, count } = await supabase
        .from("all_orders_unified_view")
        .select(
          "unique_track_id,order_id,type,reference,total_amount,status,created_at,user_id,employee_name,employee_email,employee_avatar,employee_phone,delivery_address,vendor_name,vendor_logo,vendor_address,item_name,item_image,quantity,price,payment_status,service_start_date,voucher_recipient,service_mode,order_note,delivery_fee,vendor_order_id,readable_id",
          { count: "exact" }
        )
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw error;

      // Group the flattened items into orders
      const rawRows = (data as unknown as UnifiedOrderView[]) ?? [];
      const groupedOrders = groupUnifiedOrders(rawRows);

      return {
        items: groupedOrders,
        rawCount: rawRows.length,
        page: pageParam,
        totalCount: count ?? 0,
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) =>
      lastPage.rawCount === limit ? pages.length : undefined,
    enabled: !!user_id,
  });
};
