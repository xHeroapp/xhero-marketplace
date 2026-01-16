// "use client";
import GiftDetailsPage from "@/components/Gifts/Gift";
import { createServerSupabaseClient } from "@/supabase-server";
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
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("users_reward_recognitions_view")
    .select("*")
    .eq("recognition_id", id)
    .single();

  if (error) {
    console.error(error);
    return <div>Error loading Gift</div>;
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
      <GiftDetailsPage gift={data} />
    </Suspense>
  );
}
