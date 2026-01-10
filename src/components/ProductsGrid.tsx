import Link from "next/link";
import ImageWithFallback from "./reuseable/ImageWithFallback";
import { formatCurrency } from "@/utils/formatCurrency";
import { useAddToCart } from "@/hooks/useAddToCart";
import { useAddToWishList } from "@/hooks/useAddToWishList";

export const ProductsGrid = ({ productItems, GetProductsQuery }) => {
  // handle add to cart
  const { handleAddToCart } = useAddToCart();

  // handle add to wishlist
  const { addToWishList } = useAddToWishList();

  return (
    <>
      <div className="row g-2 rtl-flex-d-row-r">
        {productItems &&
          productItems.map((product) => (
            <div key={product.vendor_product_id} className="col-6 col-md-4">
              <div className="card product-card h-100">
                <div className="card-body d-flex flex-column">
                  {/* Badge */}
                  {product.badge_text && (
                    <span
                      className={`badge rounded-pill badge-${product.badge_color || 'primary'}`}
                    >
                      {product.badge_text}
                    </span>
                  )}

                  {/* Wishlist */}
                  <div
                    onClick={() => addToWishList(product.vendor_product_id)}
                    className="wishlist-btn"
                  >
                    <i className="ti ti-heart"></i>
                  </div>

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
                    className="product-title"
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
                      className="btn btn-primary btn-sm"
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
        .product-card .sale-price {
          font-size: 0.95rem;
          font-weight: 600;
          line-height: 1.2;
        }
        .product-card .product-rating {
          color: #ffaf00;
        }
        .product-card .product-rating i {
          font-size: 0.625rem;
          margin: 0 0.063rem;
        }
      `}</style>
    </>
  );
};
