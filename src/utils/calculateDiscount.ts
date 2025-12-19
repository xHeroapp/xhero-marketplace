type DiscountType = "percentage" | "flat" | null;

interface CartItem {
  price: number;
  quantity?: number;
  discount_type?: DiscountType;
  discount_value?: number | null;
}

export function calculateItemDiscount(item: CartItem): number {
  const price = Number(item.price);
  const qty = item.quantity ?? 1;

  if (!item.discount_type || !item.discount_value) {
    return 0;
  }

  if (item.discount_type === "percentage") {
    return ((price * item.discount_value) / 100) * qty;
  }

  if (item.discount_type === "flat") {
    return item.discount_value * qty;
  }

  return 0;
}
