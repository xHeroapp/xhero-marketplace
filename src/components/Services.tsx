"use client";
import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useClientReady } from "@/hooks/useClientReady";
import {
  formatOrderAmount,
  formatOrderDate,
  getServiceOrderStatusColor,
  getServiceOrderStatusLabel,
} from "@/utils/ordersUtils";
import {
  ServiceOrder,
  useGetUserServiceOrders,
} from "@/queries/orders.queries";
import { useAuthStore } from "@/store/authStore";
import ImageWithFallback from "./reuseable/ImageWithFallback";

interface ServiceCardProps {
  service: ServiceOrder;
  onClick: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onClick }) => {
  const statusColor = getServiceOrderStatusColor(service.status);
  const statusLabel = getServiceOrderStatusLabel(service.status);
  const formattedDate = formatOrderDate(service.created_at);
  const formattedAmount = formatOrderAmount(service.total_amount);

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
            {/* Service Image */}
            <div className="order-image me-3 flex-shrink-0">
              {service.image_url ? (
                <ImageWithFallback
                  src={service.image_url}
                  alt={service.service_name}
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
                  <i className="ti ti-tools fs-3 text-muted"></i>
                </div>
              )}
            </div>

            {/* Service Details */}
            <div className="order-details flex-grow-1">
              <h6 className="mb-1 text-truncate">{service.service_name}</h6>
              <p className="mb-1 text-muted small">
                Order{" "}
                {service.reference || service.service_order_id.slice(0, 12)}
              </p>
              <p className="mb-1 text-muted small">{service.vendor_name}</p>

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

const Services: React.FC = () => {
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
  } = useGetUserServiceOrders(user?.user_id ?? "");

  // Debug log
  useEffect(() => {
    if (data) {
      console.log("Service orders data:", data);
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

  const handleServiceClick = (serviceId: string) => {
    router.push(`/service-order/${serviceId}`);
  };

  if (!ready) return null;

  // Flatten all service orders from pages
  const allServices = data?.pages.flatMap((page) => page.items) ?? [];
  const totalCount = data?.pages[0]?.totalCount ?? 0;

  return (
    <div className="services-content">
      {isLoading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading your service orders...</p>
        </div>
      ) : isError ? (
        <div className="card">
          <div className="card-body text-center py-5">
            <i className="ti ti-alert-circle fs-1 text-danger mb-3"></i>
            <h5>Error Loading Service Orders</h5>
            <p className="text-muted">
              {error instanceof Error ? error.message : "Something went wrong"}
            </p>
          </div>
        </div>
      ) : allServices.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py-5">
            <i className="ti ti-tools fs-1 text-muted mb-3"></i>
            <h5>No Service Orders Yet</h5>
            <p className="text-muted">
              You haven't booked any services yet. Start exploring services!
            </p>
            <button
              className="btn btn-primary mt-3"
              onClick={() => router.push("/services")}
            >
              Explore Services
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Filter services for ongoing/confirmed */}
          {allServices
            .filter((service) =>
              ["pending", "confirmed", "completed"].includes(
                service.status.toLowerCase()
              )
            )
            .map((service) => (
              <ServiceCard
                key={service.service_order_id}
                service={service}
                onClick={() => handleServiceClick(service.service_order_id)}
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
  );
};

export default Services;
