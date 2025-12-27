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
              <div className="card product-card">
                <div className="card-body">
                  {/* removed badge and wishlist buttons for now */}
                  <span
                    className={`badge rounded-pill badge-${product.badge_color}`}
                  >
                    {product.badge_text}
                  </span>
                  <div
                    onClick={() => addToWishList(product.vendor_product_id)}
                    className="wishlist-btn"
                  >
                    <i className="ti ti-heart"></i>
                  </div>
                  <Link
                    className="product-thumbnail d-block"
                    href={`/product/${product.vendor_product_id}`}
                  >
                    <ImageWithFallback
                      src={product.image_url}
                      alt={product.product_name}
                    />
                    {/* Removed sale count down timer */}
                    {/* {i === 0 || i === 3 ? (
                                  <ul className="offer-countdown-timer d-flex align-items-center shadow-sm">
                                    <MyTimer />
                                  </ul>
                                ) : null} */}
                  </Link>
                  <Link
                    className="product-title"
                    href={`/product/${product.vendor_product_id}`}
                  >
                    {product.product_name}
                  </Link>
                  <p className="sale-price">
                    {formatCurrency(product.price)}
                    {/* <span>$ {product.old_price}</span> */}
                  </p>
                  {/* Removed ratings for now */}
                  {/* <div className="product-rating">
                                <i className="ti ti-star-filled"></i>
                                <i className="ti ti-star-filled"></i>
                                <i className="ti ti-star-filled"></i>
                                <i className="ti ti-star-filled"></i>
                                <i className="ti ti-star-filled"></i>
                              </div> */}
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
    </>
  );
};
