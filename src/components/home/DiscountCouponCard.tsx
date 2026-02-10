"use client";

import React from "react";
import { useGetMarketingBanners } from "@/queries/marketing_banners.queries";

const DiscountCouponCard = () => {
	const { data: banners } = useGetMarketingBanners("home_bottom_coupon");
	const banner = banners?.[0];

	if (!banner) return null;

	const { coupon_code, bg_color, icon_url } = banner.meta_data || {};

	// Create gradient if bg_color is present
	// We'll approximate the gradient logic from the original CSS but using the provided color as base
	// or just set the background color if provided
	const style = bg_color ? {
		background: `linear-gradient(to left, ${bg_color}, #0d5cd1)` // Keeping the original end color for now, or could use the same color
	} : {};

	// If exact color code from original CSS (#625afa) is passed, we can rely on CSS class, 
	// but here we allow dynamic override via style

	return (
		<>
			<div className="container">
				<div className="discount-coupon-card p-4 p-lg-5 dir-rtl" style={{ backgroundColor: bg_color }}>
					<div className="d-flex align-items-center">
						<div className="discountIcon">
							<img
								className="w-100"
								src={icon_url || banner.image_url}
								alt=""
							/>
						</div>
						<div className="text-content">
							<h5 className="text-white mb-2">{banner.title}</h5>
							<p className="text-white mb-0">
								{banner.subtitle?.split(coupon_code)[0]}
								<span className="px-1 fw-bold">{coupon_code}</span>
								{banner.subtitle?.split(coupon_code)[1] || ' code on the checkout page.'}
							</p>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default DiscountCouponCard;
