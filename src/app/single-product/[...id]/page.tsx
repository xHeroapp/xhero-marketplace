
"use client";
import SingleProduct from "@/components/single-product";
import top_product from "@/data/top_product";
import { useParams } from "next/navigation";
import React from "react";

// export const metadata = {
// 	title: "Suha Single Product - Multipurpose Ecommerce Mobile Next js Template",
// };

const index = ({params}: any) => {
	// const params = useParams();
  const single_product = top_product.find((item) => Number(item.id) === Number(params.id));


	return (
		<>
			<SingleProduct product={single_product} key={single_product?.id} />
		</>
	);
};

export default index;
