"use client";
import { ORDER_FLOW } from "@/constant/constant";
import { useClientReady } from "@/hooks/useClientReady";
import Footer from "@/layouts/Footer";
import HeaderTwo from "@/layouts/HeaderTwo";
import { useGetOrderStatus } from "@/queries/orders.queries";
import { formatYearTimeDate } from "@/utils/formatDate";
import { getOrderStatusTitle } from "@/utils/getOrderStatusTitle";
import React, { useEffect } from "react";

const Order = ({ order }: any) => {
  const ready = useClientReady();
  const currentIndex = ORDER_FLOW.indexOf(order && order.status);

  //   Data fetching (queries)
  const OrderStatusHistory = useGetOrderStatus(order.order_id, {
    enabled: !!order,
  });

  //   get the status updated date
  const statusDateMap = React.useMemo(() => {
    if (!OrderStatusHistory.data) return {};

    return OrderStatusHistory.data.reduce(
      (acc: Record<string, string>, item: any) => {
        acc[item.status] = item.created_at;
        return acc;
      },
      {}
    );
  }, [OrderStatusHistory.data]);

  if (!ready) return null;

  return (
    <>
      <HeaderTwo links="profile" title="Order Status" />

      <div
        className="my-order-wrapper"
        style={{ backgroundImage: `url(/assets/img/bg-img/21.jpg)` }}
      >
        <div className="container">
          <div className="card">
            <div className="card-body p-4">
              {/* <!-- Single Order Status--> */}
              {ORDER_FLOW.map((step, index) => (
                <div
                  key={step}
                  className={`single-order-status ${
                    index <= currentIndex && "active"
                  } `}
                >
                  <div className="order-icon">
                    <i className="ti ti-basket"></i>
                  </div>
                  <div className="order-text">
                    <h6>{getOrderStatusTitle(step)}</h6>
                    <span>
                      {statusDateMap[step]
                        ? formatYearTimeDate(statusDateMap[step])
                        : "—"}
                    </span>
                  </div>
                  <div className="order-status">
                    <i className="ti ti-circle-check"></i>
                  </div>
                </div>
              ))}

              {/* <!-- Single Order Status--> */}
              {/* <div className="single-order-status active">
                <div className="order-icon">
                  <i className="ti ti-box"></i>
                </div>
                <div className="order-text">
                  <h6>Product packaging</h6>
                  <span>3 Feb 2024</span>
                </div>
                <div className="order-status">
                  <i className="ti ti-circle-check"></i>
                </div>
              </div> */}
              {/* <!-- Single Order Status--> */}
              {/* <div className="single-order-status active">
                <div className="order-icon">
                  <i className="ti ti-trolley"></i>
                </div>
                <div className="order-text">
                  <h6>Ready for shipment</h6>
                  <span>3 Feb 2024</span>
                </div>
                <div className="order-status">
                  <i className="ti ti-circle-check"></i>
                </div>
              </div> */}
              {/* <!-- Single Order Status--> */}
              {/* <div className="single-order-status">
                <div className="order-icon">
                  <i className="ti ti-truck-delivery"></i>
                </div>
                <div className="order-text">
                  <h6>On the way</h6>
                  <span>Estimate: 4 Feb 2024</span>
                </div>
                <div className="order-status">
                  <i className="ti ti-circle-check"></i>
                </div>
              </div> */}
              {/* <!-- Single Order Status--> */}
              {/* <div className="single-order-status">
                <div className="order-icon">
                  <i className="ti ti-building-store"></i>
                </div>
                <div className="order-text">
                  <h6>Dropped in the delivery station</h6>
                  <span>Estimate: 6 Feb 2024</span>
                </div>
                <div className="order-status">
                  <i className="ti ti-circle-check"></i>
                </div>
              </div> */}
              {/* <!-- Single Order Status--> */}
              {/* <div className="single-order-status">
                <div className="order-icon">
                  <i className="ti ti-heart-check"></i>
                </div>
                <div className="order-text">
                  <h6>Delivered</h6>
                  <span>Estimate: 7 Feb 2024</span>
                </div>
                <div className="order-status">
                  <i className="ti ti-circle-check"></i>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
      <div className="internet-connection-status" id="internetStatus"></div>

      <Footer />
    </>
  );
};

export default Order;
