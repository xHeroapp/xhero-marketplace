"use client";

import React from "react";
import { useTimer } from "react-timer-hook";

const MyTimer = () => {
    // Set expiry to a future date for demonstration
    const expiryTimestamp = new Date();
    expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + 86400 * 3); // 3 days from now

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

export default MyTimer;
