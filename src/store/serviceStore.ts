import { toast } from "sonner";
import { create } from "zustand";

interface Service {
  vendor_product_id: string;
  product_id: string;
  vendor_id: string;
  category_id: string;
  product_name: string;
  product_description: string;
  price: number;
  stock: number;
  sku: string;
  discount_type: string | null;
  discount_value: number | null;
  discount_expires_at: string | null;
  vendor_name: string;
  delivery_fee: number;
  category_name: string;
  image_url: string;
  created_at: string;
  product_type: string;
}

interface BookingDetails {
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  service_mode: string;
  note: string;
}

interface ServiceBooking {
  booking_details: BookingDetails;
  service: Service;
}

type PaymentMethod = "wallet" | "bank_transfer";

interface ServiceStore {
  booking: ServiceBooking | null;
  paymentMethod: PaymentMethod | null;
  loadBooking: (userId: string) => void;
  persistBooking: (userId: string) => void;
  addBooking: (
    bookingDetails: BookingDetails,
    service: Service,
    userId: string
  ) => void;
  updateBookingDetails: (
    bookingDetails: Partial<BookingDetails>,
    userId: string
  ) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  clearBooking: (userId: string) => void;
  getBooking: () => ServiceBooking | null;
  getTotal: () => number;
}

const useServiceStore = create<ServiceStore>((set, get) => ({
  booking: null,
  paymentMethod: null,

  loadBooking: (userId: string) => {
    const storedBooking = localStorage.getItem(`${userId}-service-booking`);
    set({ booking: storedBooking ? JSON.parse(storedBooking) : null });
  },

  persistBooking: (userId: string) => {
    const booking = get().booking;
    if (booking) {
      localStorage.setItem(
        `${userId}-service-booking`,
        JSON.stringify(booking)
      );
    } else {
      localStorage.removeItem(`${userId}-service-booking`);
    }
  },

  addBooking: (
    bookingDetails: BookingDetails,
    service: Service,
    userId: string
  ) => {
    const newBooking: ServiceBooking = {
      booking_details: bookingDetails,
      service: service,
    };

    // Replace previous booking with new one
    set({ booking: newBooking });
    get().persistBooking(userId);
    toast.success("Service booking added");
  },

  updateBookingDetails: (
    bookingDetails: Partial<BookingDetails>,
    userId: string
  ) => {
    const currentBooking = get().booking;
    if (!currentBooking) {
      toast.error("No booking found to update");
      return;
    }

    const updatedBooking: ServiceBooking = {
      ...currentBooking,
      booking_details: {
        ...currentBooking.booking_details,
        ...bookingDetails,
      },
    };

    set({ booking: updatedBooking });
    get().persistBooking(userId);
    toast.success("Booking details updated");
  },

  setPaymentMethod: (method: PaymentMethod) => {
    set({ paymentMethod: method });
  },

  clearBooking: (userId: string) => {
    set({ booking: null, paymentMethod: null });
    localStorage.removeItem(`${userId}-service-booking`);
    toast.success("Booking cleared");
  },

  getBooking: () => {
    return get().booking;
  },

  getTotal: () => {
    const booking = get().booking;
    if (!booking) return 0;
    return booking.service.price;
  },
}));

export default useServiceStore;
export type { ServiceBooking, BookingDetails, Service };
