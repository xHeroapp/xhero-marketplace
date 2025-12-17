// "use client";
import SingleProduct from "@/components/single-product";
import VendorShop from "@/components/VendorShop";
import top_product from "@/data/top_product";
import { createServerSupabaseClient } from "@/supabase-server";
import { useParams } from "next/navigation";
import React, { Suspense } from "react";

// export const metadata = {
//   title: "Suha Single Product - Multipurpose Ecommerce Mobile Next js Template",
// };

export default async function Product({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  console.log(id);
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("vendors_view")
    .select()
    .eq("vendor_id", id)
    .single();

  if (error) {
    console.error(error);
    return <div>Error loading Product</div>;
  }

  return (
    <Suspense
      fallback={
        <div className="login-wrapper d-flex align-items-center justify-content-center text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      }
    >
      <VendorShop initialData={data} />
    </Suspense>
  );
}
