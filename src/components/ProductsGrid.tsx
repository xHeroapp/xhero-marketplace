import Link from "next/link";
import ImageWithFallback from "./reuseable/ImageWithFallback";
import { formatCurrency } from "@/utils/formatCurrency";
import { useAddToCart } from "@/hooks/useAddToCart";
import WishlistButton from "./reuseable/WishlistButton";

export const ProductsGrid = ({ productItems, GetProductsQuery }) => {
  // handle add to cart
  const { handleAddToCart } = useAddToCart();

  return (
    <>
      <div className="row g-2 rtl-flex-d-row-r">
        {productItems &&
          productItems.map((product) => (
            <div key={product.vendor_product_id} className="col-6 col-md-4">
              <div className="card product-card h-100">
                <div className="card-body d-flex flex-column position-relative">
                  {/* Badge */}
                  {product.badge_text && (
                    <span
                      className={`badge rounded-pill badge-${product.badge_color || 'primary'}`}
                      style={{
                        position: "absolute",
                        top: "1rem",
                        left: "1rem",
                        zIndex: 10,
                      }}
                    >
                      {product.badge_text}
                    </span>
                  )}

                  {/* Wishlist */}
                  <WishlistButton vendorProductId={product.vendor_product_id} />

                  {/* Thumbnail */}
                  <Link
                    className="product-thumbnail d-block"
                    href={`/product/${product.vendor_product_id}`}
                  >
                    <ImageWithFallback
                      src={product.image_url}
                      alt={product.product_name}
                    />
                  </Link>

                  {/* Title */}
                  <Link
                    className="product-title d-block"
                    href={`/product/${product.vendor_product_id}`}
                  >
                    {product.product_name}
                  </Link>

                  {/* Price/Ratings/Button wrapper */}
                  <div className="mt-auto">
                    <p className="sale-price mb-1">
                      {formatCurrency(product.price)}
                    </p>

                    <div className="product-rating mb-2">
                      {[...Array(5)].map((_, starIndex) => (
                        <i
                          key={starIndex}
                          className="ti ti-star-filled"
                        ></i>
                      ))}
                    </div>

                    <a
                      className="btn btn-primary btn-add-cart"
                      onClick={() => handleAddToCart(product)}
                      style={{ cursor: "pointer" }}
                    >
                      <i className="ti ti-plus"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Load More or Fetching Indicator */}
      {GetProductsQuery.isFetching && !GetProductsQuery.isLoading && (
        <div className="text-center mt-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      <style jsx>{`
        .product-card .product-title {
          font-size: 1rem;
          margin-bottom: 0.5rem;
          line-height: 1.2;
        }
        .product-card .sale-price {
          font-size: 1.25rem;
          font-weight: 500;
          line-height: 1;
          margin-bottom: 0.125rem;
        }
        .product-card .product-rating {
          color: #ffaf00;
        }
        .product-card .product-rating i {
          font-size: 0.625rem;
          margin: 0 0.063rem;
        }
        /* Exact Dimensions from Suha Template */
        .product-card .wishlist-btn {
          position: absolute;
          top: 0.6rem;
          right: 0.6rem;
          width: 1.75rem;
          height: 1.75rem;
          font-size: 1.25rem;
          background-color: #ffffff;
          color: #ea4c62;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          transition: transform 0.3s;
        }
        .product-card .wishlist-btn:hover {
          transform: scale(1.1);
        }
        .product-card .btn-add-cart {
            position: absolute;
            right: 1rem;
            bottom: 1rem;
            width: 1.875rem;
            height: 1.875rem;
            border-radius: 50%;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1rem;
        }
        .product-card .product-thumbnail {
            position: relative;
            overflow: hidden;
        }
        .product-card .product-thumbnail img {
            transition: transform 0.3s;
        }
         .product-card:hover .product-thumbnail img {
            transform: scale(1.05);
        }
      `}</style>
    </>
  );
};
