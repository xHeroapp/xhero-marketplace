import Settings from "@/components/Settings";
import Footer from "@/layouts/Footer";
import Header from "@/layouts/Header";
import React from "react";

export const metadata = {
	title: "Suha Settings - Multipurpose Ecommerce Mobile Next js Template",
};

const index = () => {
	return (
		<>
			<Header />
			<Settings />
			<Footer />
		</>
	);
};

export default index;
