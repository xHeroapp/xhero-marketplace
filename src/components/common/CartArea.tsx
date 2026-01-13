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
                            style={{ borderRadius: "12px" }}
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
                          {formatCurrency(total.total)}
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
                                  <i className="ti ti-minus"></i>
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
                                  <i className="ti ti-plus"></i>
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
                                <i className="ti ti-x"></i>
                                {/* × */}
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
        /* Header Styling */
        .page-content-wrapper h5 {
          font-weight: 600;
          color: #1a1a1a;
          letter-spacing: -0.02em;
        }

        /* Vendor Cart Card */
        .vendor-cart-card {
          border: none;
          border-radius: 16px;
          background: #ffffff;
          overflow: hidden;
        }

        .vendor-cart-card .card-body {
          padding: 20px;
        }

        .view-selection-text {
          font-size: 13px;
          font-weight: 500;
          color: #6b7280;
        }

        .delivery-info {
          font-size: 13px;
          background: #f8fafc !important;
          border-radius: 10px !important;
          color: #64748b;
        }

        /* Cart Item Styles - Premium */
        .cart-item-modern {
          background: #ffffff;
          border: 1px solid #f1f5f9;
          border-radius: 16px;
          padding: 16px;
          margin-bottom: 12px;
          transition: all 0.25s cubic-bezier(0.25, 0.1, 0.25, 1);
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
        }

        .cart-item-modern:hover {
          border-color: #e2e8f0;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
          transform: translateY(-1px);
        }

        .cart-item-modern:last-child {
          margin-bottom: 0;
        }

        .cart-item-content {
          display: flex;
          gap: 16px;
          align-items: center;
        }

        /* Larger Product Image */
        .product-image-wrapper {
          width: 80px;
          height: 80px;
          border-radius: 14px;
          overflow: hidden;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        }

        .product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .cart-item-modern:hover .product-image {
          transform: scale(1.05);
        }

        /* Product Info */
        .product-info {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 4px;
        }

        .product-name {
          font-size: 15px;
          font-weight: 600;
          color: #0f172a;
          margin: 0;
          line-height: 1.35;
          letter-spacing: -0.01em;
        }

        .product-price {
          font-size: 16px;
          font-weight: 700;
          color: #10b981;
          margin: 0;
          letter-spacing: -0.02em;
        }

        /* Item Actions */
        .item-actions {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 10px;
          flex-shrink: 0;
        }

        /* Pill-shaped Quantity Control */
        .quantity-control {
          display: flex;
          align-items: center;
          background: #f8fafc;
          border-radius: 24px;
          border: 1px solid #e2e8f0;
          overflow: hidden;
          padding: 2px;
        }

        .qty-btn {
          width: 32px;
          height: 32px;
          border: none;
          background: transparent;
          color: #64748b;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          border-radius: 50%;
        }

        .qty-btn:hover {
          background: #ffffff;
          color: #0f172a;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
        }

        .qty-btn:active {
          transform: scale(0.92);
        }

        .qty-display {
          min-width: 28px;
          text-align: center;
          font-weight: 600;
          color: #0f172a;
          font-size: 14px;
          padding: 0 4px;
        }

        /* Remove Button */
        .remove-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: none;
          background: #fef2f2;
          color: #ef4444;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          font-size: 14px;
          flex-shrink: 0;
        }

        .remove-btn:hover {
          background: #fee2e2;
          transform: scale(1.05);
        }

        .remove-btn:active {
          transform: scale(0.92);
        }

        /* Checkout Button */
        .btn-primary {
          border-radius: 12px;
          font-weight: 600;
          padding: 14px 24px;
          font-size: 15px;
          letter-spacing: -0.01em;
          transition: all 0.2s ease;
        }

        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        /* Clear Selection Link */
        .btn-link.text-success {
          font-size: 13px;
          font-weight: 500;
          text-decoration: none;
        }

        .btn-link.text-success:hover {
          text-decoration: underline;
        }

        /* Mobile optimizations */
        @media (max-width: 360px) {
          .product-image-wrapper {
            width: 64px;
            height: 64px;
          }

          .product-name {
            font-size: 13px;
          }

          .product-price {
            font-size: 14px;
          }

          .cart-item-content {
            gap: 12px;
          }

          .vendor-cart-card .card-body {
            padding: 16px;
          }
        }
      `}</style>
    </>
  );
};

export default CartArea;
