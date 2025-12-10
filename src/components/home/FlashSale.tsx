"use client";
import React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Swiper, SwiperSlide } from "swiper/react";




import flash_sale from "@/data/flash_sale";
const MyTimer = dynamic(() => import("../common/Timer"), { ssr: false });

const FlashSale = () => {
	return (
		<>
			<div className="flash-sale-wrapper">
				<div className="container">
					<div className="section-heading d-flex align-items-center justify-content-between rtl-flex-d-row-r">
						<h6 className="d-flex align-items-center rtl-flex-d-row-r">
							<i className="ti ti-bolt-lightning me-1 text-danger lni-flashing-effect"></i>
							Cyclone Offer
						</h6>

						<ul className="sales-end-timer ps-0 d-flex align-items-center rtl-flex-d-row-r">
							<MyTimer />
						</ul>
					</div>

					<Swiper
						loop={true}
						slidesPerView={3}
						spaceBetween={5}
						className="flash-sale-slide owl-carousel"
					>
						{flash_sale.map((item, i) => (
							<SwiperSlide key={i} className="card flash-sale-card">
								<div className="card-body">
									<Link href="/single-product">
										<img src={item.img} alt={item.title} />
										<span className="product-title">{item.title}</span>
										<p className="sale-price">
											${item.new_price}
											<span className="real-price">${item.old_price}</span>
										</p>
										<span className="progress-title">
											{item.discount}% {item.test}
										</span>

										<div className="progress">
											<div
												className={`progress-bar ${item.color}`}
												role="progressbar"
												style={{ width: `${item.discount}%` }}
												aria-valuenow={item.discount}
												aria-valuemin={0}
												aria-valuemax={100}
											></div>
										</div>
									</Link>
								</div>
							</SwiperSlide>
						))}
					</Swiper>
				</div>
			</div>
		</>
	);
};

export default FlashSale;
