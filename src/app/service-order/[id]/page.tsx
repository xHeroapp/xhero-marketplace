import ServiceOrder from "@/components/ServiceOrder";
import { createServerSupabaseClient } from "@/supabase-server";
import React, { Suspense } from "react";

export const metadata = {
  title: "Service Order",
};

export default async function ServiceOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  console.log(id);
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("service_orders_view")
    .select()
    .eq("service_order_id", id)
    .single();

  if (error) {
    console.error(error);
    return <div>Error loading Service Order</div>;
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
        <ServiceOrder serviceOrder={data} />
      </Suspense>
    </>
  );
}
