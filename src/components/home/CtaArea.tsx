"use client";

import React from "react";
import { useGetMarketingBanners } from "@/queries/marketing_banners.queries";

const CtaArea = () => {
	const { data: banners } = useGetMarketingBanners("home_mid_cta");
	const banner = banners?.[0];

	if (!banner) return null;

	const { bg_color_start, bg_color_end } = banner.meta_data || {};

	const style = (bg_color_start && bg_color_end) ? {
		background: `linear-gradient(to right, ${bg_color_start}, ${bg_color_end})`
	} : {};

	return (
		<>
			<div className="container">
				<div
					className="cta-text dir-rtl p-4 p-lg-5"
					style={style}
				>
					<div className="row">
						<div className="col-9">
							<h5 className="text-white">{banner.title}</h5>
							<a className="btn btn-primary" href={banner.target_link || "#"}>
								{banner.button_text || "Grab this offer"}
							</a>
						</div>
					</div>
					<img src={banner.image_url} alt={banner.title} />
				</div>
			</div>
		</>
	);
};

export default CtaArea;
