"use client";

import Footer from "@/layouts/Footer";
import HeaderTwo from "@/layouts/HeaderTwo";
import { useAuthStore } from "@/store/authStore";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useGetUserGifts } from "@/queries/gifts.queries";
import RewardListItem from "./RewardListItems";
import { useRouter } from "next/navigation";
import RewardGridItem from "./RewardGridItem";

type ViewMode = "list" | "grid";

const Gifts = () => {
  const { user } = useAuthStore();
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

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
          {/* View Toggle Buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: 16,
              gap: 8,
            }}
          >
            {/* <button
              onClick={() => setViewMode("list")}
              style={{
                padding: "8px 12px",
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                background: viewMode === "list" ? "#2563eb" : "#fff",
                color: viewMode === "list" ? "#fff" : "#6b7280",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 14,
                fontWeight: 500,
                transition: "all 0.2s",
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
              List
            </button>

            <button
              onClick={() => setViewMode("grid")}
              style={{
                padding: "8px 12px",
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                background: viewMode === "grid" ? "#2563eb" : "#fff",
                color: viewMode === "grid" ? "#fff" : "#6b7280",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 14,
                fontWeight: 500,
                transition: "all 0.2s",
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
              Grid
            </button> */}
          </div>

          {isLoading && <p>Loading gifts...</p>}
          {isError && <p>Failed to load gifts</p>}

          {!isLoading && rewards.length === 0 && <p>No rewards received yet</p>}

          {/* List View */}
          {viewMode === "list" && (
            <div className="row g-2">
              {rewards.map((reward) => (
                <div key={reward.recognition_id} className="col-12">
                  <RewardListItem
                    reward={reward}
                    onClick={() =>
                      router.push(`/gifts/${reward.recognition_id}`)
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
          )}

          {/* Grid View */}
          {viewMode === "grid" && (
            <div className="row g-3">
              {rewards.map((reward) => (
                <div
                  key={reward.recognition_id}
                  className="col-6 col-md-4 col-lg-3"
                >
                  <RewardGridItem
                    reward={reward}
                    onClick={() =>
                      router.push(`/gifts/${reward.recognition_id}`)
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
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Gifts;
