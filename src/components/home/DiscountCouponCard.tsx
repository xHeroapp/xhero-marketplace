"use client";

import React from "react";
import { useGetMarketingBanners } from "@/queries/marketing_banners.queries";

const DiscountCouponCard = () => {
	const { data: banners } = useGetMarketingBanners("home_bottom_coupon");
	const banner = banners?.[0];

	if (!banner) return null;

	return (
		<>
			<div className="container">
				<div
					className="discount-coupon-card p-0 dir-rtl"
					style={{
						backgroundImage: `url(${banner.image_url})`,
						backgroundPosition: 'center center',
						backgroundSize: 'cover',
						cursor: 'pointer',
						height: '150px' // fixed height for coupon banner
					}}
					onClick={() => {
						if (banner.target_link) {
							window.location.href = banner.target_link;
						}
					}}
				>
					{/* Empty div, just using background image for the full banner */}
				</div>
			</div>
		</>
	);
};

export default DiscountCouponCard;
