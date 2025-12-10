import featured_products from "@/data/featured_products";
import Link from "next/link";
import React from "react";

const FeaturedProducts = () => {
	return (
		<>
			<div className="featured-products-wrapper py-3">
				<div className="container">
					<div className="section-heading d-flex align-items-center justify-content-between dir-rtl">
						<h6>Featured Products</h6>
						<Link className="btn btn-sm btn-light" href="/featured-products">
							View all
							<i className="ms-1 ti ti-arrow-right"></i>
						</Link>
					</div>
					<div className="row g-2">
						{featured_products.map((item, i) => (
							<div key={i} className="col-4">
								<div className="card featured-product-card">
									<div className="card-body">
										<span className="badge badge-warning custom-badge">
											<i className="ti ti-star-filled"></i>
										</span>
										<div className="product-thumbnail-side">
											<Link
												className="product-thumbnail d-block"
												href="/single-product"
											>
												<img src={item.img} alt={item.title} />
											</Link>
										</div>
										<div className="product-description">
											<Link
												className="product-title d-block"
												href="/single-product"
											>
												{item.title}
											</Link>
											<p className="sale-price">
												${item.new_price}
												<span>${item.old_price}</span>
											</p>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</>
	);
};

export default FeaturedProducts;
