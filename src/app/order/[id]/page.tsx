import Order from "@/components/Order";
import { createServerSupabaseClient } from "@/supabase-server";
import React, { Suspense } from "react";

export const metadata = {
  title: "Order",
};

export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  console.log(id);
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("orders_detail_view")
    .select()
    .eq("order_id", id)
    .single();

  if (error) {
    console.error(error);
    return <div>Error loading Order</div>;
  }
  return (
    <>
      <Suspense
        fallback={
          <div className="login-wrapper d-flex align-items-center justify-content-center text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        }
      >
        <Order order={data} />
      </Suspense>
    </>
  );
}
