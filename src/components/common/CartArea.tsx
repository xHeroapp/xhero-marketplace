"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import useCartStore from "@/store/cartStore";
import ImageWithFallback from "../reuseable/ImageWithFallback";
import { formatCurrency } from "@/utils/formatCurrency";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useClientReady } from "@/hooks/useClientReady";

const CartArea = () => {
  const ready = useClientReady();
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

  if (!ready) return null;

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
                      clearVendorCart(vendorId, user?.id)
                    );
                  }
                }}
              >
                Clear Cart
              </button>
            )}
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
                      <span className="view-selection-text">View</span>
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
                          className="cart-item-modern"
                        >
                          <div className="cart-item-content">
                            <div className="product-image-wrapper">
                              <img
                                src={
                                  product.image_url
                                    ? product.image_url
                                    : "/assets/img/product/product_fallback.png"
                                }
                                alt={product.product_name}
                                width={60}
                                height={60}
                                className="product-image"
                              />
                            </div>

                            <div className="product-info">
                              <h4 className="product-name">
                                {product.product_name}
                              </h4>
                              <p className="product-price">
                                {formatCurrency(product.price)}
                              </p>
                            </div>

                            <div className="item-actions">
                              <div className="quantity-control">
                                <button
                                  className="qty-btn"
                                  onClick={() =>
                                    decrementQuantity(
                                      vendorId,
                                      product.product_id,
                                      user?.id
                                    )
                                  }
                                  aria-label="Decrease quantity"
                                >
                                  −
                                </button>
                                <span className="qty-display">
                                  {product.quantity}
                                </span>
                                <button
                                  className="qty-btn"
                                  onClick={() =>
                                    incrementQuantity(
                                      vendorId,
                                      product.product_id,
                                      user?.id
                                    )
                                  }
                                  aria-label="Increase quantity"
                                >
                                  +
                                </button>
                              </div>

                              <button
                                className="remove-btn"
                                onClick={() =>
                                  removeProductFromCart(
                                    vendorId,
                                    product.product_id,
                                    user?.id
                                  )
                                }
                                aria-label="Remove item"
                              >
                                ×
                              </button>
                            </div>
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
                      clearVendorCart(vendorId, user?.id);
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

        .delivery-info {
          font-size: 0.875rem;
        }

        /* Cart Item Styles */
        .cart-item-modern {
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 12px;
          margin-bottom: 12px;
          transition: all 0.2s ease;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
        }

        .cart-item-modern:hover {
          border-color: #d1d5db;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .cart-item-modern:last-child {
          margin-bottom: 0;
        }

        .cart-item-content {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .product-image-wrapper {
          width: 60px;
          height: 60px;
          border-radius: 10px;
          overflow: hidden;
          background: #f3f4f6;
          flex-shrink: 0;
        }

        .product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .product-info {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .product-name {
          font-size: 14px;
          font-weight: 600;
          color: #111827;
          margin: 0 0 4px 0;
          line-height: 1.3;
        }

        .product-price {
          font-size: 13px;
          font-weight: 600;
          color: #10b981;
          margin: 0;
        }

        .item-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
          margin-left: auto;
        }

        .quantity-control {
          display: flex;
          align-items: center;
          background: #f9fafb;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          overflow: hidden;
        }

        .qty-btn {
          width: 28px;
          height: 28px;
          border: none;
          background: transparent;
          color: #6b7280;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s ease;
        }

        .qty-btn:hover {
          background: #e5e7eb;
          color: #111827;
        }

        .qty-btn:active {
          transform: scale(0.9);
        }

        .qty-display {
          min-width: 24px;
          text-align: center;
          font-weight: 600;
          color: #111827;
          font-size: 13px;
          padding: 0 4px;
        }

        .remove-btn {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          border: none;
          background: #fee2e2;
          color: #dc2626;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s ease;
          font-size: 18px;
          flex-shrink: 0;
        }

        .remove-btn:hover {
          background: #fecaca;
        }

        .remove-btn:active {
          transform: scale(0.9);
        }

        /* Mobile optimizations */
        @media (max-width: 360px) {
          .product-image-wrapper {
            width: 50px;
            height: 50px;
          }

          .product-name {
            font-size: 13px;
          }

          .product-price {
            font-size: 12px;
          }
        }
      `}</style>
    </>
  );
};

export default CartArea;
