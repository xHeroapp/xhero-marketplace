import { calculateItemDiscount } from "./calculateDiscount";

export function calculateCartDiscount(items: any[]): number {
  return items.reduce((total, item) => {
    return total + calculateItemDiscount(item);
  }, 0);
}
