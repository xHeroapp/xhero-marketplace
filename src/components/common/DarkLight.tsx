"use client";
import useTheme from "@/hooks/useTheme";
import React from "react";

const DarkLight = () => {
	const { theme, toggleTheme } = useTheme();

	return (
		<>
			<div className="container">
				<div className="dark-mode-wrapper mt-3 bg-img p-4 p-lg-5">
					<p className="text-white">
						You can change your display to a dark background using a dark mode.
					</p>
					<div className="form-check form-switch mb-0">
						<label
							className="form-check-label text-white h6 mb-0"
							htmlFor="darkSwitch"
						>
							Switch to Dark Mode
						</label>

						<input
							className="form-check-input"
							id="darkSwitch"
							type="checkbox"
							checked={theme === "dark"}
							onChange={toggleTheme}
						/>
					</div>
				</div>
			</div>
		</>
	);
};

export default DarkLight;


