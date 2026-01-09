"use client";
import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useClientReady } from "@/hooks/useClientReady";
import HeaderTwo from "@/layouts/HeaderTwo";
import Footer from "@/layouts/Footer";
import {
  formatOrderAmount,
  formatOrderDate,
  getFirstProductName,
  getOrderStatusColor,
  getOrderStatusLabel,
  getTotalItemsCount,
} from "@/utils/ordersUtils";
import { ParsedOrder, useGetUserOrders } from "@/queries/orders.queries";
import { useAuthStore } from "@/store/authStore";
import ImageWithFallback from "./reuseable/ImageWithFallback";
import Services from "./Services";

interface OrderCardProps {
  order: ParsedOrder;
  onClick: () => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onClick }) => {
  const firstProductName = getFirstProductName(order.vendors);
  const totalItems = getTotalItemsCount(order.vendors);
  const statusColor = getOrderStatusColor(order.status);
  const statusLabel = getOrderStatusLabel(order.status);
  const formattedDate = formatOrderDate(order.created_at);
  const formattedAmount = formatOrderAmount(order.total_amount);

  // Get the first product image if available
  const firstProductImage = order.vendors[0]?.items[0]?.image || null;

  return (
    <div
      className="order-card mb-3"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick();
        }
      }}
    >
      <div className="card">
        <div className="card-body p-3">
          <div className="d-flex align-items-start">
            {/* Product Image */}
            <div className="order-image me-3 flex-shrink-0">
              {firstProductImage ? (
                <ImageWithFallback
                  src={firstProductImage}
                  alt={firstProductName}
                  className="rounded"
                  width="70px"
                  height="70px"
                  style={{
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div
                  className="bg-light rounded d-flex align-items-center justify-content-center"
                  style={{ width: "70px", height: "70px" }}
                >
                  <i className="ti ti-package fs-3 text-muted"></i>
                </div>
              )}
            </div>

            {/* Order Details */}
            <div className="order-details flex-grow-1">
              <h6 className="mb-1 text-truncate">{firstProductName}</h6>
              {totalItems > 1 && (
                <small className="text-muted">
                  +{totalItems - 1} more item{totalItems - 1 > 1 ? "s" : ""}
                </small>
              )}
              <p className="mb-1 text-muted small">
                Order {order.reference || order.order_id.slice(0, 12)}
              </p>

              {/* Status Badge */}
              <div className="d-flex align-items-center justify-content-between mt-2">
                <span className={`badge bg-${statusColor} text-uppercase`}>
                  {statusLabel}
                </span>
                <small className="text-muted">On {formattedDate}</small>
              </div>

              {/* Amount */}
              <div className="mt-2">
                <span className="fw-bold text-dark">{formattedAmount}</span>
              </div>
            </div>

            {/* Arrow Icon */}
            <div className="ms-2 flex-shrink-0 align-self-center">
              <i className="ti ti-chevron-right text-muted"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Orders: React.FC = () => {
  const ready = useClientReady();
  const router = useRouter();
  const observerRef = useRef<HTMLDivElement>(null);

  const { user } = useAuthStore();

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetUserOrders(user?.id ?? "");

  // Debug log
  useEffect(() => {
    if (data) {
      console.log("Orders data:", data);
    }
  }, [data]);

  // Infinite scroll observer
  useEffect(() => {
    if (!observerRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, data]);

  const handleOrderClick = (orderId: string) => {
    router.push(`/order/${orderId}`);
  };

  if (!ready) return null;

  // Flatten all orders from pages
  const allOrders = data?.pages.flatMap((page) => page.items) ?? [];
  const totalCount = data?.pages[0]?.totalCount ?? 0;

  return (
    <>
      <HeaderTwo links="profile" title="Orders" />

      <div className="page-content-wrapper py-3">
        <div className="container">
          {/* Main Tabs for Products and Services */}
          <div className="order-tabs mb-3">
            <ul className="nav nav-tabs border-0" role="tablist">
              <li className="nav-item flex-fill" role="presentation">
                <button
                  className="nav-link active w-100 text-center"
                  data-bs-toggle="tab"
                  data-bs-target="#products"
                  type="button"
                  role="tab"
                  aria-controls="products"
                  aria-selected="true"
                >
                  Products
                </button>
              </li>
              <li className="nav-item flex-fill" role="presentation">
                <button
                  className="nav-link w-100 text-center"
                  data-bs-toggle="tab"
                  data-bs-target="#services"
                  type="button"
                  role="tab"
                  aria-controls="services"
                  aria-selected="false"
                >
                  Services
                </button>
              </li>
            </ul>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {/* Products Tab */}
            <div
              className="tab-pane fade show active"
              id="products"
              role="tabpanel"
            >
              {isLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2 text-muted">Loading your orders...</p>
                </div>
              ) : isError ? (
                <div className="card">
                  <div className="card-body text-center py-5">
                    <i className="ti ti-alert-circle fs-1 text-danger mb-3"></i>
                    <h5>Error Loading Orders</h5>
                    <p className="text-muted">
                      {error instanceof Error
                        ? error.message
                        : "Something went wrong"}
                    </p>
                  </div>
                </div>
              ) : allOrders.length === 0 ? (
                <div className="card">
                  <div className="card-body text-center py-5">
                    <i className="ti ti-shopping-bag fs-1 text-muted mb-3"></i>
                    <h5>No Orders Yet</h5>
                    <p className="text-muted">
                      You haven't placed any orders yet. Start shopping to see
                      your orders here!
                    </p>
                    <button
                      className="btn btn-primary mt-3"
                      onClick={() => router.push("/shop")}
                    >
                      Start Shopping
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Filter orders for ongoing/delivered */}
                  {allOrders
                    // .filter((order) =>
                    //   [
                    //     "pending",
                    //     "shipment_ready",
                    //     "in",
                    //     "paid",
                    //     "shipped",
                    //     "delivered",
                    //   ].includes(order.status.toLowerCase())
                    // )  removed the filter for now because we want to show all the orders (the status wil do the filtering)
                    .map((order) => (
                      <OrderCard
                        key={order.order_id}
                        order={order}
                        onClick={() => handleOrderClick(order.order_id)}
                      />
                    ))}

                  {/* Loading indicator for next page */}
                  {isFetchingNextPage && (
                    <div className="text-center py-3">
                      <div
                        className="spinner-border spinner-border-sm text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Loading more...</span>
                      </div>
                    </div>
                  )}

                  {/* Intersection observer target */}
                  <div ref={observerRef} style={{ height: "20px" }} />
                </>
              )}
            </div>

            {/* Services Tab */}
            <div className="tab-pane fade" id="services" role="tabpanel">
              <Services />
            </div>
          </div>
        </div>
      </div>

      <div className="internet-connection-status" id="internetStatus"></div>
      <Footer />
    </>
  );
};

export default Orders;
