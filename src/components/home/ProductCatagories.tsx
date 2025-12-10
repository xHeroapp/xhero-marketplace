import React from "react";
import Link from "next/link";
import product_catagories from "@/data/product_catagories";

const ProductCatagories = () => {
	return (
		<>
			<div className="product-catagories-wrapper py-3">
				<div className="container">
					<div className="row g-2 rtl-flex-d-row-r">
						{product_catagories.map((item, i) => (
							<div key={i} className="col-3">
								<div
									className={`card catagory-card ${i === 7 ? "active" : ""}`}
								>
									<div className="card-body px-2">
										<Link href="/catagory">
											<img src={item.img} alt="" />
											<span>{item.title}</span>
										</Link>
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

export default ProductCatagories;
