import { FLASH_SALE_ORDER_TYPE } from "@/constant/constant";
import { useGetUser } from "@/queries/auth.queries";
import { processOrder } from "@/services/processOrder.service";
import { useAuthStore } from "@/store/authStore";
import { generateTxRef } from "@/utils/generateTxRef";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export const useHandlePayment = ({
  orderAmount,
  vendorCart,
  setIsLoading,
  setIsSuccess,
  payment_method,
  redirect_link,
  TX_REF,
}: {
  TX_REF?: string;
}) => {
  const [txRef, setTxRef] = useState(generateTxRef());
  const router = useRouter();

  const { user } = useAuthStore();

  const useGetUserQuery = useGetUser();

  // Payment / Order handler
  const handlePayment = (e: React.FormEvent) => {
    e?.preventDefault();
    setIsLoading(true);

    // ✅ Only check balance if payment method is wallet
    if (
      payment_method === "wallet" &&
      user?.points_balance < orderAmount.total
    ) {
      setIsLoading(false);
      toast.error("Insufficient wallet balance");
      return;
    }

    try {
      const promise = processOrder({
        p_vendor_id: vendorCart.vendor.vendor_id,
        p_items: Object.values(vendorCart.items),
        p_payment_method: payment_method,
        p_reference: txRef ?? TX_REF,
      });

      toast.promise(promise, {
        loading:
          payment_method === "wallet"
            ? "Processing Payment..."
            : "Processing Order...",

        success: () => {
          useGetUserQuery.refetch();
          setIsLoading(false);
          setIsSuccess(true);
          router.push(redirect_link);

          return payment_method === "wallet"
            ? "Payment Successful"
            : "Order Successful";
        },

        error: () => {
          setIsLoading(false);
          setIsSuccess(false);
          return `There was an error while trying to process your ${
            payment_method === "wallet" ? "payment" : "order"
          }. Please try again later`;
        },
      });
    } catch (err) {
      setIsLoading(false);
      console.error(err);
    }
  };

  return { handlePayment };
};
