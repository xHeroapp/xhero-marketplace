// product limit per page
export const PRODUCT_LIMIT = 100;

// dashboard table limit
export const DASHBOARD_TABLE_LIMIT = 5;

// points rates
// removed the exchange rate for now
export const EXCHANGE_RATE = 1; // 100 Naira = 1000 Points (1 Naira = 10 Points)
export const MIN_PURCHASE = 100; // Minimum 100 Naira

export const NOTIFICATIONS_PER_PAGE = 100;

// used for the order tracking
export const ORDER_FLOW = [
  "pending",
  "packaging",
  "shipment_ready",
  "in_transit",
  "delivered",
] as const;

// Flash sale order type
export const FLASH_SALE_ORDER_TYPE = "flash_sale";
