"use client";


import { useEffect } from "react";
// import { animationCreate } from "@/utils/utils";
import {animationCreate} from "../utils/utils"
import { ToastContainer } from "react-toastify";

if (typeof window !== "undefined") {
	require("bootstrap/dist/js/bootstrap");
}

const Wrapper = ({ children }: any) => {

	useEffect(() => {
		// animation
		const timer = setTimeout(() => {
			animationCreate();
		}, 100);

		return () => clearTimeout(timer);
	}, []);


	return (
    <>
    {children}
    <ToastContainer position="top-right"/>
    </>
  );
};

export default Wrapper;
