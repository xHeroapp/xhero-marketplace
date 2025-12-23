"use client";

import Footer from "@/layouts/Footer";
import HeaderTwo from "@/layouts/HeaderTwo";
import { useAuthStore } from "@/store/authStore";
import { useMemo } from "react";
import Link from "next/link";
import { useGetUserGifts } from "@/queries/gifts.queries";
import RewardListItem from "./RewardListItems";
import { useRouter } from "next/navigation";

const Gifts = () => {
  const { user } = useAuthStore();
  const router = useRouter();

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetUserGifts(user?.id);

  const rewards = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data]
  );

  return (
    <>
      <HeaderTwo links="home" title="My Gifts" />

      <div className="page-content-wrapper">
        <div className="container py-3">
          {isLoading && <p>Loading gifts...</p>}
          {isError && <p>Failed to load gifts</p>}

          {!isLoading && rewards.length === 0 && <p>No rewards received yet</p>}

          <div className="row g-2">
            {rewards.map((reward) => (
              <div key={reward.recognition_id} className="col-12">
                <RewardListItem
                  reward={reward}
                  onClick={
                    () => router.push(`/gifts/${reward.recognition_id}`)
                    // (window.location.href = `/gifts/${reward.recognition_id}`)
                  }
                />
              </div>
            ))}

            {hasNextPage && (
              <div className="col-12">
                <button
                  className="btn btn-primary w-100"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                >
                  {isFetchingNextPage ? "Loading..." : "Load more"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Gifts;
