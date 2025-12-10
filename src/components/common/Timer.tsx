"use client";

import React from "react";
import { useTimer } from "react-timer-hook";

const Timer = () => {
	const expiryTimestamp = new Date("2025-12-30");
	const { seconds, minutes, hours, days } = useTimer({ expiryTimestamp });

	return (
		<>
			<li>
				<span className="days">{days}</span>d
			</li>
			<li>
				<span className="hours">{hours}</span>h
			</li>
			<li>
				<span className="minutes">{minutes}</span>m
			</li>
			<li>
				<span className="seconds">{seconds}</span>s
			</li>
		</>
	);
};

export default Timer;
