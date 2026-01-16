export function getOrderStatusTitle(status: string): string {
  switch (status) {
    case "pending":
      return "Order Placed";

    case "packaging":
      return "Product Packaging";

    case "shipment_ready":
      return "Ready for Shipment";

    case "in_transit":
      return "On the way";

    case "delivered":
      return "Delivered";

    default:
      return "Unknown Status";
  }
}

export function getServiceOrderStatusTitle(status: string): string {
  switch (status) {
    case "pending":
      return "Order Placed";

    case "confirmed":
      return "Service Confirmed";

    case "completed":
      return "Service Completed";

    default:
      return "Unknown Status";
  }
}
