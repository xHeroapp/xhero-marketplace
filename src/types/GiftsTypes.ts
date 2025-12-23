export type GiftDetails = {
  recognition_id: string;
  status: "pending" | "redeemed" | "expired";

  message: string | null;
  price: string;

  redemption_code: number | null;
  redemption_date: string | null;

  sent_at: string | null;
  created_at: string;
  expires_at: string | null;

  sender_name: string;
  sender_avatar: string | null;

  recipient_name: string;
  recipient_email: string;
  recipient_avatar: string | null;

  program_name: string;
  program_description: string;

  department_name: string;

  product_name: string;
  product_description: string;
  image_url: string;
  vendor_name: string;
  category_name: string;
  product_price: string;
};
