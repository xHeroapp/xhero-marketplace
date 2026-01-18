"use client";

import Footer from "@/layouts/Footer";
import HeaderTwo from "@/layouts/HeaderTwo";
import { useAuthStore } from "@/store/authStore";
import { useMemo, useState } from "react";
import { useGetUserGifts } from "@/queries/gifts.queries";
import RewardGridItem from "./RewardGridItem";
import { useRouter } from "next/navigation";

type FilterStatus = "all" | "pending" | "redeemed" | "expired";

const Gifts = () => {
  const { user } = useAuthStore();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterStatus>("all");

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useGetUserGifts(user?.id);

  const allRewards = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data]
  );

  // Filter rewards based on active filter
  const rewards = useMemo(() => {
    if (activeFilter === "all") return allRewards;
    return allRewards.filter(
      (reward) => reward.status?.toLowerCase() === activeFilter
    );
  }, [allRewards, activeFilter]);

  // Count by status
  const statusCounts = useMemo(() => {
    return {
      all: allRewards.length,
      pending: allRewards.filter((r) => r.status?.toLowerCase() === "pending")
        .length,
      redeemed: allRewards.filter((r) => r.status?.toLowerCase() === "redeemed")
        .length,
      expired: allRewards.filter((r) => r.status?.toLowerCase() === "expired")
        .length,
    };
  }, [allRewards]);

  const filterTabs: { key: FilterStatus; label: string }[] = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "redeemed", label: "Redeemed" },
    { key: "expired", label: "Expired" },
  ];

  return (
    <>
      <HeaderTwo links="home" title="My Gifts" />

      <div className="page-content-wrapper gifts-page">
        <div className="container">
          {/* Header Stats */}
          <div className="gifts-header-stats">
            <h4>
              Your Gifts{" "}
              <span className="gifts-count">({allRewards.length})</span>
            </h4>
          </div>

          {/* Filter Tabs */}
          <div className="gifts-filter-tabs">
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                className={`gifts-filter-tab ${activeFilter === tab.key ? "active" : ""
                  }`}
                onClick={() => setActiveFilter(tab.key)}
              >
                {tab.label}
                {statusCounts[tab.key] > 0 && (
                  <span className="filter-count">{statusCounts[tab.key]}</span>
                )}
              </button>
            ))}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="gifts-grid">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="gift-card" style={{ opacity: 0.7 }}>
                  <div
                    className="gift-card-image gift-skeleton"
                    style={{ paddingTop: "75%" }}
                  />
                  <div className="gift-card-content">
                    <div
                      className="gift-skeleton"
                      style={{ height: 16, width: "80%", marginBottom: 12 }}
                    />
                    <div
                      className="gift-skeleton"
                      style={{ height: 12, width: "60%", marginBottom: 8 }}
                    />
                    <div
                      className="gift-skeleton"
                      style={{ height: 12, width: "40%" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {isError && (
            <div className="gift-section-card" style={{ textAlign: "center" }}>
              <i
                className="ti ti-alert-circle"
                style={{ fontSize: 48, color: "#ff3b30", marginBottom: 16 }}
              />
              <h5
                style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}
              >
                Unable to Load Gifts
              </h5>
              <p
                style={{
                  fontSize: 14,
                  color: "#86868b",
                  marginBottom: 16,
                }}
              >
                Something went wrong. Please try again.
              </p>
              <button
                onClick={() => refetch()}
                className="gift-cta-button"
                style={{ position: "static" }}
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !isError && rewards.length === 0 && (
            <div className="gifts-empty-state">
              <i className="ti ti-gift" />
              <h5>No Gifts Yet</h5>
              <p>
                {activeFilter === "all"
                  ? "You haven't received any gifts yet. When someone sends you a reward, it will appear here."
                  : `You don't have any ${activeFilter} gifts at the moment.`}
              </p>
            </div>
          )}

          {/* Gift Grid */}
          {!isLoading && !isError && rewards.length > 0 && (
            <>
              <div className="row g-2 rtl-flex-d-row-r">
                {rewards.map((reward) => (
                  <div key={reward.recognition_id} className="col-6 col-md-4">
                    <RewardGridItem
                      reward={reward}
                      onClick={() =>
                        router.push(`/gifts/${reward.recognition_id}`)
                      }
                    />
                  </div>
                ))}
              </div>

              {/* Load More */}
              {hasNextPage && (
                <button
                  className="gifts-load-more"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                >
                  {isFetchingNextPage ? "Loading..." : "Load More Gifts"}
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Gifts;
