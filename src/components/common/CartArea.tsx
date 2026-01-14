"use client";
import Link from "next/link";
import React, { useState } from "react";
import useCartStore from "@/store/cartStore";
import ImageWithFallback from "@/components/reuseable/ImageWithFallback";
import { formatCurrency } from "@/utils/formatCurrency";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useClientReady } from "@/hooks/useClientReady";

const CartArea = () => {
  const ready = useClientReady();
  const router = useRouter();

  const {
    cart,
    getVendorTotal,
    decrementQuantity,
    incrementQuantity,
    removeProductFromCart,
    clearVendorCart,
  } = useCartStore();

  const { user } = useAuthStore();

  // Track expanded state for each vendor
  const [expandedVendors, setExpandedVendors] = useState<Record<string, boolean>>({});

  const toggleVendorExpand = (vendorId: string) => {
    setExpandedVendors(prev => ({
      ...prev,
      [vendorId]: !prev[vendorId]
    }));
  };

  // Convert cart object to array of vendors
  const vendorCarts = Object.entries(cart).map(([vendorId, vendorData]) => ({
    vendorId,
    vendor: vendorData.vendor,
    items: Object.values(vendorData.items),
    total: getVendorTotal(vendorId),
  }));

  if (!ready) return null;

  return (
    <>
      <div className="cart-area">
        {vendorCarts.map(({ vendorId, vendor, items, total }) => {
          const isExpanded = expandedVendors[vendorId] ?? false;
          const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

          return (
            <div key={vendorId} className="vendor-card">
              {/* Vendor Header Row */}
              <div className="vendor-header">
                <div className="vendor-info">
                  <div className="vendor-logo">
                    {vendor.vendor_img ? (
                      <img src={vendor.vendor_img} alt={vendor.vendor_name} />
                    ) : (
                      <i className="ti ti-building-store"></i>
                    )}
                  </div>
                  <div className="vendor-details">
                    <h3>{vendor.vendor_name}</h3>
                    <span className="vendor-meta">
                      {itemCount} Item{itemCount !== 1 ? 's' : ''} • {formatCurrency(total.total)}
                    </span>
                  </div>
                </div>
                <button
                  className="view-selection-btn"
                  onClick={() => toggleVendorExpand(vendorId)}
                >
                  {isExpanded ? 'Hide' : 'View'} Selection
                  <i className={`ti ti-chevron-${isExpanded ? 'up' : 'down'}`}></i>
                </button>
              </div>

              {/* Expanded Items */}
              {isExpanded && (
                <div className="items-section">
                  {items.map((product) => (
                    <div key={product.product_id} className="item-row">
                      <div className="item-image">
                        <ImageWithFallback
                          src={product.image_url}
                          alt={product.product_name}
                        />
                      </div>
                      <div className="item-info">
                        <h4>{product.product_name}</h4>
                        <span className="item-price">{formatCurrency(product.price)}</span>
                      </div>
                      <div className="item-controls">
                        <div className="qty-stepper">
                          <button
                            onClick={() => decrementQuantity(vendorId, product.product_id, user?.id)}
                          >
                            <i className="ti ti-minus"></i>
                          </button>
                          <span>{product.quantity}</span>
                          <button
                            onClick={() => incrementQuantity(vendorId, product.product_id, user?.id)}
                          >
                            <i className="ti ti-plus"></i>
                          </button>
                        </div>
                        <button
                          className="remove-btn"
                          onClick={() => removeProductFromCart(vendorId, product.product_id, user?.id)}
                        >
                          <i className="ti ti-x"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Separator Line */}
              <div className="card-divider"></div>

              {/* Delivery Address */}
              <div className="delivery-section">
                <div className="delivery-icon">
                  <i className="ti ti-bike"></i>
                </div>
                <p className="delivery-text">
                  Delivering to {user?.delivery_address || 'Default Address'}
                </p>
              </div>

              {/* Checkout Button */}
              <button
                className="checkout-btn"
                onClick={() => router.push(`/checkout?vendor=${vendorId}`)}
              >
                Checkout
              </button>

              {/* Clear Selection Link */}
              <button
                className="clear-selection-btn"
                onClick={() => clearVendorCart(vendorId, user?.id)}
              >
                Clear Selection
              </button>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .cart-area {
          padding: 16px;
          max-width: 680px;
          margin: 0 auto;
        }

        /* Vendor Card */
        .vendor-card {
          background: #ffffff;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 16px;
        }

        .card-divider {
          height: 1px;
          background: #e5e7eb;
          margin: 16px 0 20px 0;
        }

        /* Vendor Header */
        .vendor-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }

        .vendor-info {
          display: flex;
          gap: 12px;
        }

        .vendor-logo {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          background: #f5f5f7;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          flex-shrink: 0;
        }

        .vendor-logo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .vendor-logo i {
          font-size: 20px;
          color: #86868b;
        }

        .vendor-details h3 {
          font-size: 16px;
          font-weight: 600;
          color: #1d1d1f;
          margin: 0 0 4px;
        }

        .vendor-meta {
          font-size: 13px;
          color: #86868b;
        }

        .view-selection-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          background: none;
          border: none;
          color: #1d1d1f;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          padding: 4px 0;
        }

        .view-selection-btn i {
          font-size: 14px;
        }

        /* Items Section */
        .items-section {
          border-top: 1px solid #f0f0f0;
          padding-top: 16px;
          margin-bottom: 16px;
        }

        .item-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 0;
          border-bottom: 1px solid #f5f5f7;
        }

        .item-row:last-child {
          border-bottom: none;
        }

        .item-image {
          width: 56px;
          height: 56px;
          border-radius: 10px;
          background: #f5f5f7;
          overflow: hidden;
          flex-shrink: 0;
        }

        .item-image :global(img) {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .item-info {
          flex: 1;
          min-width: 0;
        }

        .item-info h4 {
          font-size: 14px;
          font-weight: 500;
          color: #1d1d1f;
          margin: 0 0 4px;
        }

        .item-price {
          font-size: 13px;
          color: #86868b;
        }

        .item-controls {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .qty-stepper {
          display: flex;
          align-items: center;
          background: #f5f5f7;
          border-radius: 8px;
        }

        .qty-stepper button {
          width: 32px;
          height: 32px;
          border: none;
          background: transparent;
          color: #1d1d1f;
          font-size: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .qty-stepper span {
          min-width: 24px;
          text-align: center;
          font-size: 14px;
          font-weight: 500;
          color: #1d1d1f;
        }

        .remove-btn {
          width: 28px;
          height: 28px;
          border: none;
          background: transparent;
          color: #86868b;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
        }

        .remove-btn:hover {
          color: #ff3b30;
        }

        /* Delivery Section */
        .delivery-section {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
        }

        .delivery-icon {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .delivery-icon i {
          font-size: 20px;
          color: #86868b;
        }

        .delivery-text {
          font-size: 14px;
          color: #1d1d1f;
          line-height: 1;
          margin: 0;
        }

        /* Checkout Button */
        .checkout-btn {
          width: 100%;
          padding: 12px;
          background: #0071e3;
          color: #ffffff;
          font-size: 15px;
          font-weight: 500;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          margin-bottom: 12px;
          transition: background 0.2s ease;
        }

        .checkout-btn:hover {
          background: #0077ed;
        }

        /* Clear Selection */
        .clear-selection-btn {
          display: block;
          width: 100%;
          background: none;
          border: none;
          color: #0071e3;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          padding: 8px 0;
          text-align: center;
        }

        .clear-selection-btn:hover {
          color: #0077ed;
        }
      `}</style>
    </>
  );
};

export default CartArea;
