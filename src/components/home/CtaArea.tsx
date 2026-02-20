"use client";

import React from "react";
import { useGetMarketingBanners } from "@/queries/marketing_banners.queries";

const CtaArea = () => {
	const { data: banners } = useGetMarketingBanners("home_mid_cta");
	const banner = banners?.[0];

	if (!banner) return null;

	return (
		<>
			<div className="container">
				<div
					className="cta-text dir-rtl p-0"
					style={{
						backgroundImage: `url(${banner.image_url})`,
						backgroundPosition: 'center center',
						backgroundSize: 'cover',
						cursor: 'pointer',
						height: '200px' // giving it a fixed height similar to hero slider
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

export default CtaArea;
