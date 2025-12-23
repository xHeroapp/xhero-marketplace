/**
 * Get the display status label for an order
 */
export const getOrderStatusLabel = (status: string): string => {
  const statusMap: Record<string, string> = {
    pending: "Pending",
    processing: "Processing",
    shipment_ready: "Processing",
    packaging: "Packaging",
    in_transit: "In Transit",
    paid: "Paid",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
    refunded: "Refunded",
    failed: "Failed",
  };

  return statusMap[status.toLowerCase()] || status;
};

/**
 * Get the status color class for styling
 */
export const getOrderStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    pending: "warning",
    processing: "info",
    packaging: "info",
    shipment_ready: "info",
    in_transit: "info",
    paid: "success",
    shipped: "primary",
    delivered: "success",
    cancelled: "danger",
    refunded: "secondary",
    failed: "danger",
  };

  return colorMap[status.toLowerCase()] || "secondary";
};

/**
 * Format the order total amount
 */
export const formatOrderAmount = (amount: string | number): string => {
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(numAmount);
};

/**
 * Get the first product name from vendors array
 */
export const getFirstProductName = (vendors: any[]): string => {
  if (!vendors || vendors.length === 0) return "No items";

  const firstVendor = vendors[0];
  if (!firstVendor.items || firstVendor.items.length === 0) return "No items";

  return firstVendor.items[0].name;
};

/**
 * Get total number of items in the order
 */
export const getTotalItemsCount = (vendors: any[]): number => {
  if (!vendors || vendors.length === 0) return 0;

  return vendors.reduce((total, vendor) => {
    return total + (vendor.items?.length || 0);
  }, 0);
};

/**
 * Format date in a user-friendly way
 */
export const formatOrderDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};
