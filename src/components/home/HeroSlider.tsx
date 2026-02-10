"use client";

import React from "react";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useGetMarketingBanners } from "@/queries/marketing_banners.queries";

const HeroSlider = () => {
	const { data: banners, isLoading } = useGetMarketingBanners("home_hero");

	if (isLoading) {
		return (
			<div className="hero-wrapper">
				<div className="container">
					<div className="pt-3">
						<div
							className="skeleton-box rounded"
							style={{ height: "230px", width: "100%", backgroundColor: "#e0e0e0" }}
						></div>
					</div>
				</div>
			</div>
		);
	}

	if (!banners || banners.length === 0) return null;

	return (
		<>
			<div className="hero-wrapper">
				<div className="container">
					<div className="pt-3">
						<Swiper
							loop={true}
							pagination={true}
							modules={[Pagination]}
							className="hero-slides owl-carousel"
						>
							{banners.map((banner) => (
								<SwiperSlide
									key={banner.id}
									className="single-hero-slide"
									style={{
										backgroundImage: `url(${banner.image_url})`,
										backgroundColor: banner.meta_data?.bg_color,
									}}
								>
									<div className="slide-content h-100 d-flex align-items-center">
										<div className="slide-text">
											<h4
												className="text-white mb-0"
												data-animation="fadeInUp"
												data-delay="100ms"
												data-duration="1000ms"
											>
												{banner.title}
											</h4>
											{banner.subtitle && (
												<p
													className="text-white"
													data-animation="fadeInUp"
													data-delay="400ms"
													data-duration="1000ms"
												>
													{banner.subtitle}
												</p>
											)}
											{banner.button_text && (
												<a
													className="btn btn-primary"
													href={banner.target_link || "#"}
													data-animation="fadeInUp"
													data-delay="800ms"
													data-duration="1000ms"
												>
													{banner.button_text}
												</a>
											)}
										</div>
									</div>
								</SwiperSlide>
							))}
						</Swiper>
					</div>
				</div>
			</div>
		</>
	);
};

export default HeroSlider;
