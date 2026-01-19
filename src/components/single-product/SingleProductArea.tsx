"use client";
import Link from "next/link";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, decrease_quantity } from "@/redux/features/cartSlice";
import { formatCurrency } from "@/utils/formatCurrency";
import { useAddToCart } from "@/hooks/useAddToCart";
import { useAddToWishList } from "@/hooks/useAddToWishList";
import { useForm } from "react-hook-form";
import useServiceStore from "@/store/serviceStore";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { SERVICE_ORDER_TYPE } from "@/constant/constant";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import reviews_data from "@/data/reviews_data";
import { useGetTopProducts } from "@/queries/products.queries";
import ImageWithFallback from "@/components/reuseable/ImageWithFallback";

// Related Products Section Component
const RelatedProductsSection = ({ product }: { product: any }) => {
  const { data: relatedProducts, isLoading } = useGetTopProducts();
  const { addToWishList } = useAddToWishList();
  const { handleAddToCart } = useAddToCart();

  if (isLoading || !relatedProducts || relatedProducts.length === 0) {
    return null;
  }

  // Filter out current product and limit to 6
  const filteredProducts = relatedProducts
    .filter((item: any) => item.vendor_products_view?.vendor_product_id !== product?.vendor_product_id)
    .slice(0, 6);

  if (filteredProducts.length === 0) {
    return null;
  }

  return (
    <div className="related-product-wrapper bg-white py-3 mb-3">
      <div className="container">
        <div className="section-heading d-flex align-items-center justify-content-between">
          <h6>Related Products</h6>
          <Link className="btn btn-sm btn-secondary" href="/shop-grid">
            View all
          </Link>
        </div>
        <Swiper
          loop={filteredProducts.length > 2}
          slidesPerView={2}
          spaceBetween={10}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          modules={[Autoplay]}
          className="related-product-slide"
        >
          {filteredProducts.map((item: any, i: number) => (
            <SwiperSlide key={item.vendor_products_view?.vendor_product_id || i}>
              <div className="card product-card">
                <div className="card-body">
                  <div
                    onClick={() => addToWishList(item.vendor_products_view?.vendor_product_id)}
                    className="wishlist-btn"
                  >
                    <i className="ti ti-heart"></i>
                  </div>
                  <Link
                    className="product-thumbnail d-block"
                    href={`/product/${item.vendor_products_view?.vendor_product_id}`}
                  >
                    <ImageWithFallback
                      src={item.vendor_products_view?.image_url}
                      alt={item.vendor_products_view?.product_name}
                    />
                  </Link>
                  <Link
                    className="product-title"
                    href={`/product/${item.vendor_products_view?.vendor_product_id}`}
                  >
                    {item.vendor_products_view?.product_name}
                  </Link>
                  <p className="sale-price">
                    {formatCurrency(item.vendor_products_view?.price)}
                  </p>
                  <div className="product-rating">
                    {[...Array(5)].map((_, starIndex) => (
                      <i key={starIndex} className="ti ti-star-filled"></i>
                    ))}
                  </div>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleAddToCart(item.vendor_products_view)}
                  >
                    <i className="ti ti-plus"></i>
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

const SingleProductArea = ({ product }: any) => {
  const [quantity, setQuantity] = useState<number>(1);
  const { addBooking } = useServiceStore();
  const userId = useAuthStore((state) => state.user?.id);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmitBooking = (data: any) => {
    if (!userId) {
      alert("Please login to book a service");
      return;
    }

    // Map form data to booking details structure
    // we are currently using only one date/time for one_time service
    const bookingDetails = {
      start_date: data.date || "",
      end_date: data.date || "", // Using same date for start and end for one_time service
      start_time: data.time || "",
      end_time: data.time || "", // Using same time for start and end for one_time service
      service_mode: data.service_mode || "one_time",
      note: data.special_requirements || "",
    };

    // Add booking to store (this will replace any previous booking)
    addBooking(bookingDetails, product, userId);

    // Redirect to checkout payment page
    router.push(`/checkout-payment?order_type=${SERVICE_ORDER_TYPE}`);
  };

  const increment = () => {
    setQuantity(quantity + 1);
  };

  const decrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // handleAdd to cart
  const { handleAddToCart } = useAddToCart(quantity);

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
                {/* <span> $ {product?.old_price ? product.old_price : "67"}</span> */}
              </p>
              <p className="">{product.product_description}</p>
            </div>
            <div
              onClick={() => addToWishList(product.vendor_product_id)}
              className="p-wishlist-share"
            >
              <div>
                <i className="ti ti-heart"></i>
              </div>
            </div>
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

        {product.product_type === "service" ? (
          <div className="bg-white mb-3 py-3 booking-form-wrapper">
            <div className="container">
              <form
                className="cart-form d-flex flex-column"
                onSubmit={handleSubmit(onSubmitBooking)}
              >
                <div className="mb-3 d-flex flex-column w-100">
                  <label htmlFor="booking-date" className="form-label mb-1">
                    Select Date
                  </label>
                  <input
                    type="date"
                    id="booking-date"
                    className="form-control w-100"
                    {...register("date", { required: true })}
                  />
                  {errors.date && (
                    <span className="text-danger">Date is required</span>
                  )}
                </div>
                <div className="mb-3 d-flex flex-column w-100">
                  <label htmlFor="booking-time" className="form-label mb-1">
                    Select Time
                  </label>
                  <select
                    id="booking-time"
                    className="form-control w-100"
                    {...register("time", { required: true })}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select a time slot
                    </option>
                    <option value="09:00">9:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="12:00">12:00 PM</option>
                    <option value="13:00">1:00 PM</option>
                    <option value="14:00">2:00 PM</option>
                    <option value="15:00">3:00 PM</option>
                    <option value="16:00">4:00 PM</option>
                    <option value="17:00">5:00 PM</option>
                    <option value="18:00">6:00 PM</option>
                  </select>
                  {errors.time && (
                    <span className="text-danger">Time is required</span>
                  )}
                </div>
                <div className="mb-3 d-flex flex-column w-100">
                  <label htmlFor="service-mode" className="form-label mb-1">
                    Service Mode
                  </label>
                  <select
                    id="service-mode"
                    className="form-control w-100"
                    disabled
                    {...register("service_mode")}
                    defaultValue="one_time"
                  >
                    <option value="one_time">One Time</option>
                  </select>
                </div>
                <div className="mb-3 d-flex flex-column w-100">
                  <label
                    htmlFor="special-requirements"
                    className="form-label mb-1"
                  >
                    Special Requirements
                  </label>
                  <textarea
                    id="special-requirements"
                    className="form-control w-100"
                    placeholder="Any special requirements..."
                    rows={3}
                    {...register("special_requirements")}
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  style={{ cursor: "pointer" }}
                >
                  Submit Booking
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="cart-form-wrapper bg-white mb-3 py-3">
            <div className="container">
              <form className="cart-form" onSubmit={(e) => e.preventDefault()}>
                <div className="order-plus-minus d-flex align-items-center">
                  <div className="quantity-button-handler" onClick={decrement}>
                    -
                  </div>
                  <input
                    className="form-control cart-quantity-input"
                    type="text"
                    step="1"
                    name="quantity"
                    value={quantity}
                    readOnly
                  />
                  <div className="quantity-button-handler" onClick={increment}>
                    +
                  </div>
                </div>
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
        )}

        {/* removed product specfication for now */}
        <div className="p-specification bg-white mb-3 py-3">
          <div className="container">
            <h6>Description</h6>
            <div className="product-description-content">
              <p>{product.product_description}</p>
            </div>
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

        {/* Related Products Section */}
        <RelatedProductsSection product={product} />

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
        {/* Ratings & Reviews Section */}
        <div className="rating-and-review-wrapper bg-white py-3 mb-3">
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
                      <p className="comment mb-0">{item.title}</p>
                      <span className="name-date">{item.date}</span>
                      {item.images.map((image, index) => (
                        <a
                          key={index}
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
        </div>

        {/* Submit a Review Section */}
        <div className="ratings-submit-form bg-white py-3">
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
                rows={5}
                placeholder="Write your review..."
              ></textarea>
              <button className="btn btn-primary" type="submit">
                Save Review
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleProductArea;
