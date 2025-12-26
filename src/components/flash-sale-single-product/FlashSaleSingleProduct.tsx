"use client";
import Link from "next/link";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, decrease_quantity } from "@/redux/features/cartSlice";
import { formatCurrency } from "@/utils/formatCurrency";
import { useAddToCart } from "@/hooks/useAddToCart";
import { useAddToWishList } from "@/hooks/useAddToWishList";
import { FLASH_SALE_ORDER_TYPE } from "@/constant/constant";

const FlashSaleSingleProductArea = ({ product }: any) => {
  const [quantity, setQuantity] = useState<number>(1);

  const increment = () => {
    setQuantity(quantity + 1);
  };

  const decrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // handleAdd to cart
  const { handleAddToCart } = useAddToCart(quantity, FLASH_SALE_ORDER_TYPE);

  // handle add to wishlist
  const { addToWishList } = useAddToWishList();

  //   console.log(totalItems?.quantity);

  return (
    <>
      <div className="product-description pb-3">
        <div className="product-title-meta-data bg-white mb-3 py-3">
          <div className="container d-flex justify-content-between rtl-flex-d-row-r">
            <div className="p-title-price">
              <h5 className="mb-1"> {product.product_name}</h5>
              <p className="sale-price mb-0 lh-1">
                {formatCurrency(product?.price)}
                <span> {formatCurrency(product?.normal_price)}</span>
              </p>
              <p className="">{product.product_description}</p>
            </div>
            {/* <div
              onClick={() => addToWishList(product.vendor_product_id)}
              className="p-wishlist-share"
            >
              <div>
                <i className="ti ti-heart"></i>
              </div>
            </div> */}
          </div>
          <div className="container">
            <h6>
              Vendor
              <span>
                <p>
                  <Link href={`/vendor-shop`}>{product.vendor_name}</Link>
                </p>
              </span>
            </h6>
          </div>
          {/* Removed product rating for now */}
          {/* <div className="product-ratings">
            <div className="container d-flex align-items-center justify-content-between rtl-flex-d-row-r">
              <div className="ratings">
                <i className="ti ti-star-filled"></i>
                <i className="ti ti-star-filled"></i>
                <i className="ti ti-star-filled"></i>
                <i className="ti ti-star-filled"></i>
                <i className="ti ti-star-filled"></i>
                <span className="ps-1">3 ratings</span>
              </div>
              <div className="total-result-of-ratings">
                <span>5.0</span>
                <span>Very Good </span>
              </div>
            </div>
          </div> */}
        </div>
        {/* Removed flash sales for now */}
        {/* <div className="flash-sale-panel bg-white mb-3 py-3">
          <div className="container">
            <div className="sales-offer-content d-flex align-items-end justify-content-between">
              <div className="sales-end">
                <p className="mb-1 font-weight-bold">
                  <i className="ti ti-bolt-lightning lni-flashing-effect text-danger"></i>
                  Flash sale end in
                </p>

                <ul className="sales-end-timer ps-0 d-flex align-items-center">
                  <MyTimer />
                </ul>
              </div>

              <div className="sales-volume text-end">
                <p className="mb-1 font-weight-bold">82% Sold Out</p>
                <div className="progress" style={{ height: "0.375rem" }}>
                  <div
                    className="progress-bar bg-warning"
                    role="progressbar"
                    style={{ width: "82%" }}
                    aria-valuenow={82}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div> */}

        <div className="cart-form-wrapper bg-white mb-3 py-3">
          <div className="container">
            <form className="cart-form" onSubmit={(e) => e.preventDefault()}>
              {/* <div className="order-plus-minus d-flex align-items-center">
                <div className="quantity-button-handler" onClick={decrement}>
                  -
                </div>
                <input
                  className="form-control cart-quantity-input"
                  type="text"
                  step="1"
                  name="quantity"
                  value={quantity}
                  defaultValue={0}
                  readOnly
                />
                <div className="quantity-button-handler" onClick={increment}>
                  +
                </div>
              </div> */}
              <button
                onClick={() => product && handleAddToCart(product)}
                style={{ cursor: "pointer" }}
                className="btn btn-primary ms-3"
                type="submit"
              >
                Add To Cart
              </button>
            </form>
          </div>
        </div>
        {/* removed product specfication for now */}
        <div className="p-specification bg-white mb-3 py-3">
          <div className="container">
            <h6>Description</h6>
            {/* return the product long descriptions here */}
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi,
              eum? Id, culpa? At officia quisquam laudantium nisi mollitia
              nesciunt, qui porro asperiores cum voluptates placeat similique
              recusandae in facere quos vitae?
            </p>
            <ul className="mb-3 ps-3">
              <li>
                <i className="ti ti-check me-1"></i> 100% Good Reviews
              </li>
              <li>
                <i className="ti ti-check me-1"></i> 7 Days Returns
              </li>
              <li>
                {" "}
                <i className="ti ti-check me-1"></i> Warranty not Aplicable
              </li>
              <li>
                {" "}
                <i className="ti ti-check me-1"></i> 100% Brand New Product
              </li>
            </ul>
            <p className="mb-0">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi,
              eum? Id, culpa? At officia quisquam laudantium nisi mollitia
              nesciunt, qui porro asperiores cum voluptates placeat similique
              recusandae in facere quos vitae?
            </p>
          </div>
        </div>

        {/* removed the video pop up, our products do not have videos  */}
        {/* <div
          className="bg-img"
          style={{ backgroundImage: `url(/assets/img/product/18.jpg)` }}
        >
          <div className="container">
            <div className="video-cta-content d-flex align-items-center justify-content-center">
              <div className="video-text text-center">
                <h4 className="mb-4">Summer Clothing</h4>
                <VideoPopup>
                  <a
                    className="btn btn-primary rounded-circle"
                    id="videoButton"
                    href="https://www.youtube.com/watch?v=zE_WFiHnSlY"
                    style={{ cursor: "pointer" }}
                  >
                    <i className="ti ti-player-play"></i>
                  </a>
                </VideoPopup>
              </div>
            </div>
          </div>
        </div> */}
        <div className="pb-3"></div>

        {/* removed related products for now */}
        {/* <div className="related-product-wrapper bg-white py-3 mb-3">
                            <div className="container">
                                <div className="section-heading d-flex align-items-center justify-content-between rtl-flex-d-row-r">
                                    <h6>Related Products</h6>
                                    <Link className="btn btn-sm btn-secondary" href="/shop-grid">
                                        View all
                                    </Link>
                                </div>
                                <Swiper
                                    loop={true}
                                    slidesPerView={2}
                                    spaceBetween={10}
                                    autoplay={true}
                                    modules={[Autoplay]}
                                    className="related-product-slide owl-carousel"
                                >
                                    {top_product.map((item, i) => (
                                        <SwiperSlide key={i} className="col-6 col-md-4">
                                            <div className="card product-card">
                                                <div className="card-body">
                                                    <span
                                                        className={`badge rounded-pill badge-${item.badge_color}`}
                                                    >
                                                        {item.badge_text}
                                                    </span>
                                                    <a className="wishlist-btn" href="#">
                                                        <i className="ti ti-heart"></i>
                                                    </a>
                                                    <Link
                                                        className="product-thumbnail d-block"
                                                        href="/single-product"
                                                    >
                                                        <img className="mb-2" src={item.img} alt="" />
                                                        {i === 0 || i === 3 ? (
                                                            <ul className="offer-countdown-timer d-flex align-items-center shadow-sm">
                                                                <MyTimer />
                                                            </ul>
                                                        ) : null}
                                                    </Link>

                                                    <Link className="product-title" href="/single-product">
                                                        {item.title}
                                                    </Link>

                                                    <p className="sale-price">
                                                        $ {item.new_price}
                                                        <span>$ {item.old_price}</span>
                                                    </p>

                                                    <div className="product-rating">
                                                        <i className="ti ti-star-filled"></i>
                                                        <i className="ti ti-star-filled"></i>
                                                        <i className="ti ti-star-filled"></i>
                                                        <i className="ti ti-star-filled"></i>
                                                        <i className="ti ti-star-filled"></i>
                                                    </div>
                                                    <a className="btn btn-primary btn-sm" href="#">
                                                        <i className="ti ti-plus"></i>
                                                    </a>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                        </div> */}

        {/* removed product reviews for now */}
        {/* <div className="rating-and-review-wrapper bg-white py-3 mb-3 dir-rtl">
                            <div className="container">
                                <h6>Ratings & Reviews</h6>
                                <div className="rating-review-content">
                                    <ul className="ps-0">

                                        {reviews_data.map((item, i) => (
                                            <li key={i} className="single-user-review d-flex">
                                                <div className="user-thumbnail">
                                                    <img src={item.img} alt="" />
                                                </div>
                                                <div className="rating-comment">
                                                    <div className="rating">
                                                        <i className="ti ti-star-filled"></i>
                                                        <i className="ti ti-star-filled"></i>
                                                        <i className="ti ti-star-filled"></i>
                                                        <i className="ti ti-star-filled"></i>
                                                        <i className="ti ti-star-filled"></i>
                                                    </div>
                                                    <p className="comment mb-0">
                                                        {item.title}
                                                    </p>
                                                    <span className="name-date">
                                                        {item.date}
                                                    </span>


                                                    {item.images.map((image, index) => (
                                                        <a key={index}
                                                            className="review-image mt-2 border rounded"
                                                            style={{ cursor: "pointer" }} 
                                                        >
                                                            <img
                                                                className="rounded-3"
                                                                src={image.img}
                                                                alt=""
                                                            />
                                                        </a>
                                                    ))}



                                                </div>
                                            </li>
                                        ))}

                                    </ul>
                                </div>
                            </div>
                        </div> */}

        {/* Removed the send Reviews */}
        {/* <div className="ratings-submit-form bg-white py-3 dir-rtl">
          <div className="container">
            <h6>Submit A Review</h6>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="stars mb-3">
                <input className="star-1" type="radio" name="star" id="star1" />
                <label className="star-1" htmlFor="star1"></label>
                <input className="star-2" type="radio" name="star" id="star2" />
                <label className="star-2" htmlFor="star2"></label>
                <input className="star-3" type="radio" name="star" id="star3" />
                <label className="star-3" htmlFor="star3"></label>
                <input className="star-4" type="radio" name="star" id="star4" />
                <label className="star-4" htmlFor="star4"></label>
                <input className="star-5" type="radio" name="star" id="star5" />
                <label className="star-5" htmlFor="star5"></label>
                <span></span>
              </div>
              <textarea
                className="form-control mb-3"
                id="comments"
                name="comment"
                cols={30}
                rows={10}
                data-max-length="200"
                placeholder="Write your review..."
              ></textarea>
              <button className="btn btn-primary" type="submit">
                Save Review
              </button>
            </form>
          </div>
        </div> */}
      </div>
    </>
  );
};

export default FlashSaleSingleProductArea;
