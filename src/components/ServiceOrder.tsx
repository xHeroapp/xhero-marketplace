"use client";
import { SERVICE_ORDER_FLOW } from "@/constant/constant";
import { useClientReady } from "@/hooks/useClientReady";
import Footer from "@/layouts/Footer";
import HeaderTwo from "@/layouts/HeaderTwo";
import { useGetServiceOrderStatus } from "@/queries/orders.queries";
import { formatYearTimeDate } from "@/utils/formatDate";
import { getServiceOrderStatusTitle } from "@/utils/getOrderStatusTitle";
import React, { useEffect } from "react";

const ServiceOrder = ({ serviceOrder }: any) => {
  const ready = useClientReady();
  const currentIndex = SERVICE_ORDER_FLOW.indexOf(
    serviceOrder && serviceOrder.status
  );

  // Mock status history for service orders (you might need to create a real query for this)
  const serviceOrderStatusHistory = useGetServiceOrderStatus(
    serviceOrder?.service_order_id,
    {
      enabled: !!serviceOrder?.service_order_id,
    }
  );

  if (!ready) return null;

  return (
    <>
      <HeaderTwo links="profile" title="Service Order Status" />

      <div
        className="my-order-wrapper"
        style={{ backgroundImage: `url(/assets/img/bg-img/21.jpg)` }}
      >
        <div className="container">
          <div className="card">
            <div className="card-body p-4">
              {/* Service Order Details */}
              <div className="mb-4">
                <h5 className="mb-3">{serviceOrder?.service_name}</h5>
                <div className="row g-3">
                  <div className="col-sm-6">
                    <small className="text-muted">Order ID</small>
                    <p className="mb-0">{serviceOrder?.service_order_id}</p>
                  </div>
                  <div className="col-sm-6">
                    <small className="text-muted">Reference</small>
                    <p className="mb-0">{serviceOrder?.reference}</p>
                  </div>
                  <div className="col-sm-6">
                    <small className="text-muted">Vendor</small>
                    <p className="mb-0">{serviceOrder?.vendor_name}</p>
                  </div>
                  <div className="col-sm-6">
                    <small className="text-muted">Service Mode</small>
                    <p className="mb-0">{serviceOrder?.service_mode}</p>
                  </div>
                  {serviceOrder?.start_date && (
                    <div className="col-sm-6">
                      <small className="text-muted">Start Date</small>
                      <p className="mb-0">{serviceOrder.start_date}</p>
                    </div>
                  )}
                  {serviceOrder?.start_time && (
                    <div className="col-sm-6">
                      <small className="text-muted">Start Time</small>
                      <p className="mb-0">{serviceOrder.start_time}</p>
                    </div>
                  )}
                  {serviceOrder?.note && (
                    <div className="col-12">
                      <small className="text-muted">Note</small>
                      <p className="mb-0">{serviceOrder.note}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Service Order Status Flow */}
              <div className="order-status-flow">
                {SERVICE_ORDER_FLOW.map((step, index) => (
                  <div
                    key={step}
                    className={`single-order-status ${
                      index <= currentIndex && "active"
                    } `}
                  >
                    <div className="order-icon">
                      <i className="ti ti-tools"></i>
                    </div>
                    <div className="order-text">
                      <h6>{getServiceOrderStatusTitle(step)}</h6>
                      <span>
                        {(serviceOrderStatusHistory.data as any[])?.find(
                          (item: any) => item.status === step
                        )?.created_at
                          ? formatYearTimeDate(
                              (serviceOrderStatusHistory.data as any)?.find(
                                (item: any) => item.status === step
                              )?.created_at
                            )
                          : "—"}
                      </span>
                    </div>
                    <div className="order-status">
                      <i className="ti ti-circle-check"></i>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="internet-connection-status" id="internetStatus"></div>

      <Footer />
    </>
  );
};

export default ServiceOrder;
