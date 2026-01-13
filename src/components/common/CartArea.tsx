"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import useCartStore from "@/store/cartStore";
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

  // Calculate grand total
  const grandTotal = vendorCarts.reduce(
    (acc, { total }) => acc + total.total,
    0
  );
  const totalItems = vendorCarts.reduce(
    (acc, { items }) => acc + items.reduce((sum, item) => sum + item.quantity, 0),
    0
  );

  if (!ready) return null;

  return (
    <>
      <div className="cart-page">
        {/* Empty State */}
        {!hasItems && (
          <div className="empty-state">
            <div className="empty-icon">
              <i className="ti ti-shopping-bag"></i>
            </div>
            <h2>Your bag is empty</h2>
            <p>Items you add to your bag will appear here.</p>
            <Link href="/shop" className="shop-btn">
              Continue Shopping
            </Link>
          </div>
        )}

        {/* Cart Items */}
        {hasItems && (
          <div className="cart-content">
            {vendorCarts.map(({ vendorId, vendor, items, total }) => (
              <div key={vendorId} className="vendor-section">
                {/* Vendor Header */}
                <div className="vendor-header">
                  <div className="vendor-info">
                    <div className="vendor-avatar">
                      {vendor.vendor_img ? (
                        <img src={vendor.vendor_img} alt={vendor.vendor_name} />
                      ) : (
                        <i className="ti ti-building-store"></i>
                      )}
                    </div>
                    <div className="vendor-details">
                      <h3>{vendor.vendor_name}</h3>
                      <span className="delivery-badge">
                        <i className="ti ti-truck"></i>
                        Free Delivery
                      </span>
                    </div>
                  </div>
                </div>

                {/* Products - Always Visible */}
                <div className="products-list">
                  {items.map((product) => (
                    <div key={product.product_id} className="product-card">
                      <div className="product-image">
                        <img
                          src={
                            product.image_url ||
                            "/assets/img/product/product_fallback.png"
                          }
                          alt={product.product_name}
                        />
                      </div>
                      <div className="product-details">
                        <div className="product-header">
                          <h4>{product.product_name}</h4>
                          <button
                            className="remove-btn"
                            onClick={() =>
                              removeProductFromCart(
                                vendorId,
                                product.product_id,
                                user?.id
                              )
                            }
                          >
                            <i className="ti ti-x"></i>
                          </button>
                        </div>
                        <div className="product-footer">
                          <div className="quantity-stepper">
                            <button
                              onClick={() =>
                                decrementQuantity(
                                  vendorId,
                                  product.product_id,
                                  user?.id
                                )
                              }
                            >
                              <i className="ti ti-minus"></i>
                            </button>
                            <span>{product.quantity}</span>
                            <button
                              onClick={() =>
                                incrementQuantity(
                                  vendorId,
                                  product.product_id,
                                  user?.id
                                )
                              }
                            >
                              <i className="ti ti-plus"></i>
                            </button>
                          </div>
                          <span className="product-price">
                            {formatCurrency(product.price * product.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Vendor Subtotal */}
                <div className="vendor-subtotal">
                  <div className="subtotal-row">
                    <span>Subtotal</span>
                    <span>{formatCurrency(total.total)}</span>
                  </div>
                  <button
                    className="checkout-btn"
                    onClick={() => router.push(`/checkout?vendor=${vendorId}`)}
                  >
                    Checkout
                    <i className="ti ti-arrow-right"></i>
                  </button>
                </div>
              </div>
            ))}

            {/* Order Summary */}
            {vendorCarts.length > 1 && (
              <div className="order-summary">
                <div className="summary-header">
                  <h3>Order Summary</h3>
                </div>
                <div className="summary-row">
                  <span>Items ({totalItems})</span>
                  <span>{formatCurrency(grandTotal)}</span>
                </div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span>{formatCurrency(grandTotal)}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .cart-page {
          min-height: calc(100vh - 120px);
          background: #f5f5f7;
          padding: 60px 16px 32px;
        }

        /* Empty State */
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          text-align: center;
          padding: 40px 20px;
        }

        .empty-icon {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: linear-gradient(135deg, #e8e8ed 0%, #d2d2d7 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
        }

        .empty-icon i {
          font-size: 42px;
          color: #86868b;
        }

        .empty-state h2 {
          font-size: 24px;
          font-weight: 600;
          color: #1d1d1f;
          margin: 0 0 8px;
          letter-spacing: -0.02em;
        }

        .empty-state p {
          font-size: 15px;
          color: #86868b;
          margin: 0 0 28px;
        }

        .shop-btn {
          display: inline-flex;
          align-items: center;
          padding: 14px 28px;
          background: #0071e3;
          color: #fff;
          font-size: 15px;
          font-weight: 500;
          border-radius: 980px;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .shop-btn:hover {
          background: #0077ed;
          transform: scale(1.02);
        }

        /* Cart Content */
        .cart-content {
          max-width: 680px;
          margin: 0 auto;
          padding-top: 8px;
        }

        /* Vendor Section */
        .vendor-section {
          background: #ffffff;
          border-radius: 18px;
          margin-bottom: 16px;
          overflow: hidden;
        }

        .vendor-header {
          padding: 20px 20px 16px;
          border-bottom: 1px solid #f5f5f7;
        }

        .vendor-info {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .vendor-avatar {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .vendor-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .vendor-avatar i {
          font-size: 22px;
          color: #fff;
        }

        .vendor-details h3 {
          font-size: 17px;
          font-weight: 600;
          color: #1d1d1f;
          margin: 0 0 4px;
          letter-spacing: -0.01em;
        }

        .delivery-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: #34c759;
          font-weight: 500;
        }

        .delivery-badge i {
          font-size: 14px;
        }

        /* Products List */
        .products-list {
          padding: 0;
        }

        .product-card {
          display: flex;
          gap: 16px;
          padding: 16px 20px;
          border-bottom: 1px solid #f5f5f7;
          transition: background 0.2s ease;
        }

        .product-card:last-child {
          border-bottom: none;
        }

        .product-image {
          width: 88px;
          height: 88px;
          border-radius: 14px;
          background: #f5f5f7;
          overflow: hidden;
          flex-shrink: 0;
        }

        .product-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .product-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-width: 0;
        }

        .product-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 8px;
        }

        .product-header h4 {
          font-size: 15px;
          font-weight: 500;
          color: #1d1d1f;
          margin: 0;
          line-height: 1.4;
          letter-spacing: -0.01em;
        }

        .remove-btn {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: none;
          background: transparent;
          color: #86868b;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .remove-btn:hover {
          background: #f5f5f7;
          color: #ff3b30;
        }

        .product-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
          padding-top: 12px;
        }

        .quantity-stepper {
          display: flex;
          align-items: center;
          background: #f5f5f7;
          border-radius: 10px;
          overflow: hidden;
        }

        .quantity-stepper button {
          width: 36px;
          height: 36px;
          border: none;
          background: transparent;
          color: #0071e3;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s ease;
        }

        .quantity-stepper button:hover {
          background: rgba(0, 113, 227, 0.08);
        }

        .quantity-stepper button:active {
          transform: scale(0.9);
        }

        .quantity-stepper span {
          min-width: 32px;
          text-align: center;
          font-size: 15px;
          font-weight: 600;
          color: #1d1d1f;
        }

        .product-price {
          font-size: 17px;
          font-weight: 600;
          color: #1d1d1f;
          letter-spacing: -0.02em;
        }

        /* Vendor Subtotal */
        .vendor-subtotal {
          padding: 16px 20px 20px;
          background: #fafafa;
        }

        .subtotal-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 16px;
          font-size: 15px;
        }

        .subtotal-row span:first-child {
          color: #86868b;
        }

        .subtotal-row span:last-child {
          font-weight: 600;
          color: #1d1d1f;
        }

        .checkout-btn {
          width: 100%;
          padding: 16px;
          background: #0071e3;
          color: #fff;
          font-size: 17px;
          font-weight: 500;
          border: none;
          border-radius: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s ease;
        }

        .checkout-btn:hover {
          background: #0077ed;
          transform: translateY(-1px);
        }

        .checkout-btn:active {
          transform: scale(0.98);
        }

        /* Order Summary */
        .order-summary {
          background: #ffffff;
          border-radius: 18px;
          padding: 20px;
          margin-top: 8px;
        }

        .summary-header h3 {
          font-size: 17px;
          font-weight: 600;
          color: #1d1d1f;
          margin: 0 0 16px;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          font-size: 15px;
          color: #1d1d1f;
        }

        .summary-row.total {
          border-top: 1px solid #e8e8ed;
          margin-top: 8px;
          padding-top: 16px;
          font-size: 17px;
          font-weight: 600;
        }

        /* Mobile Responsive */
        @media (max-width: 390px) {
          .product-image {
            width: 72px;
            height: 72px;
          }

          .product-header h4 {
            font-size: 14px;
          }

          .quantity-stepper button {
            width: 32px;
            height: 32px;
          }
        }
      `}</style>
    </>
  );
};

export default CartArea;
