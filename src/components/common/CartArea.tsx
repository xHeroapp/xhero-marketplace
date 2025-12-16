"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import useCartStore from "@/store/cartStore";
import ImageWithFallback from "../reuseable/ImageWithFallback";
import { formatCurrency } from "@/utils/formatCurrency";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

const CartArea = () => {
  // router
  const router = useRouter();
  const {
    cart,
    getVendorTotal,
    decrementQuantity,
    incrementQuantity,
    removeProductFromCart,
    clearVendorCart,
  } = useCartStore();

  // Get userId from your auth system
  const { user } = useAuthStore();
  const userId = user.id;

  useEffect(() => {
    console.log("Cart state:", cart);
  }, [cart]);

  // Convert cart object to array of vendors
  const vendorCarts = Object.entries(cart).map(([vendorId, vendorData]) => ({
    vendorId,
    vendor: vendorData.vendor,
    items: Object.values(vendorData.items),
    total: getVendorTotal(vendorId),
  }));

  const hasItems = vendorCarts.length > 0;

  return (
    <>
      <div className="page-content-wrapper">
        <div className="container">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center py-3">
            <h5 className="mb-0">Orders</h5>
            {hasItems && (
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => {
                  if (confirm("Clear entire cart?")) {
                    vendorCarts.forEach(({ vendorId }) =>
                      clearVendorCart(vendorId, userId)
                    );
                  }
                }}
              >
                Clear Cart
              </button>
            )}
          </div>

          {/* Tabs */}
          <div className="card mb-3">
            <div className="card-body p-2">
              <div className="d-flex">
                <button className="btn btn-dark flex-fill rounded-pill me-2">
                  My Cart
                </button>
                <button className="btn btn-light flex-fill rounded-pill me-2">
                  Ongoing
                </button>
                <button className="btn btn-light flex-fill rounded-pill">
                  Completed
                </button>
              </div>
            </div>
          </div>

          {/* Empty state */}
          {!hasItems && (
            <div className="card text-center py-5">
              <div className="card-body">
                <i className="ti ti-shopping-cart display-4 text-muted mb-3"></i>
                <h5 className="mb-2">Your cart is empty</h5>
                <p className="text-muted mb-4">
                  Add items to get started with your order
                </p>
                <Link href="/shop" className="btn btn-primary">
                  Start Shopping
                </Link>
              </div>
            </div>
          )}

          {/* Vendor carts */}
          <div className="cart-wrapper-area pb-3">
            {vendorCarts.map(({ vendorId, vendor, items, total }) => (
              <div key={vendorId} className="vendor-cart-card card mb-3">
                <div className="card-body">
                  {/* Vendor header */}
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="d-flex align-items-center">
                      <div className="vendor-icon me-2">
                        {vendor.vendor_img ? (
                          <img
                            src={vendor.vendor_img}
                            alt={vendor.vendor_name}
                            width="40"
                            height="40"
                            className="rounded"
                          />
                        ) : (
                          <div
                            className="bg-light rounded d-flex align-items-center justify-content-center"
                            style={{ width: 40, height: 40 }}
                          >
                            <i className="ti ti-building-store"></i>
                          </div>
                        )}
                      </div>
                      <div>
                        <h6 className="mb-0">{vendor.vendor_name}</h6>
                        <small className="text-muted">
                          {items.length} Item{items.length !== 1 ? "s" : ""} •{" "}
                          {formatCurrency(total)}
                        </small>
                      </div>
                    </div>
                    <button
                      className="btn btn-sm"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#vendor-${vendorId}`}
                    >
                      <span className="view-selection-text">
                        View Selection
                      </span>
                      <i className="ti ti-chevron-down ms-1"></i>
                    </button>
                  </div>

                  {/* Delivery address */}
                  <div className="delivery-info d-flex align-items-start mb-3 p-2 bg-light rounded">
                    <i className="ti ti-map-pin me-2 mt-1"></i>
                    <small>
                      Delivering to{" "}
                      {vendor.deliveryAddress || "Default Address"}
                    </small>
                  </div>

                  {/* Collapsible items */}
                  <div className="collapse" id={`vendor-${vendorId}`}>
                    <div className="items-list mb-3">
                      {items.map((product) => (
                        <div
                          key={product.product_id}
                          className="cart-item d-flex align-items-center justify-content-between mb-2 pb-2 border-bottom"
                        >
                          <div className="d-flex align-items-center flex-grow-1">
                            <ImageWithFallback
                              src={product.image_url}
                              alt={product.product_name}
                              width={50}
                              height={50}
                              className="rounded me-3s"
                            />
                            <div className="flex-grow-1">
                              <p className="mb-0 fw-medium">
                                {product.product_name}
                              </p>
                              <small className="text-muted">
                                {formatCurrency(product.price)}
                              </small>
                            </div>
                          </div>

                          <div className="d-flex align-items-center">
                            {/* Quantity controls */}
                            <div className="quantity-controls d-flex align-items-center me-2">
                              <button
                                className="btn btn-sm btn-outline-secondary"
                                style={{
                                  width: 30,
                                  height: 30,
                                  padding: 0,
                                  borderRadius: "50%",
                                }}
                                onClick={() =>
                                  decrementQuantity(
                                    vendorId,
                                    product.product_id,
                                    userId
                                  )
                                }
                              >
                                -
                              </button>
                              <span className="mx-2 fw-medium">
                                {product.quantity}
                              </span>
                              <button
                                className="btn btn-sm btn-outline-secondary"
                                style={{
                                  width: 30,
                                  height: 30,
                                  padding: 0,
                                  borderRadius: "50%",
                                }}
                                onClick={() =>
                                  incrementQuantity(
                                    vendorId,
                                    product.product_id,
                                    userId
                                  )
                                }
                              >
                                +
                              </button>
                            </div>

                            {/* Remove button */}
                            <button
                              className="btn btn-sm btn-link text-danger p-0"
                              onClick={() =>
                                removeProductFromCart(
                                  vendorId,
                                  product.product_id,
                                  userId
                                )
                              }
                              style={{ fontSize: "1.2rem" }}
                            >
                              <i className="ti ti-x"></i>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Checkout button for this vendor */}
                  <button
                    className="btn btn-primary w-100 mb-2"
                    onClick={() => {
                      // Navigate to checkout with this vendor
                      router.push(`/checkout?vendor=${vendorId}`);
                    }}
                  >
                    Checkout
                  </button>

                  {/* Clear selection */}
                  <button
                    className="btn btn-link w-100 text-success p-0"
                    onClick={() => {
                      clearVendorCart(vendorId, userId);
                    }}
                  >
                    Clear Selection
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="internet-connection-status" id="internetStatus"></div>

      <style jsx>{`
        .vendor-cart-card {
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .view-selection-text {
          font-size: 0.875rem;
        }

        .cart-item:last-child {
          border-bottom: none !important;
        }

        .quantity-controls button {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .delivery-info {
          font-size: 0.875rem;
        }

        @media (max-width: 576px) {
          .cart-item {
            flex-direction: column;
            align-items: flex-start;
          }

          .quantity-controls {
            margin-top: 10px;
          }
        }
      `}</style>
    </>
  );
};

export default CartArea;
