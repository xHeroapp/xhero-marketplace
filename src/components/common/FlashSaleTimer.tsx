"use client";

import React from "react";
import { useTimer } from "react-timer-hook";

interface FlashSaleTimerProps {
    endTime: string | Date;
    compact?: boolean;
}

/**
 * FlashSaleTimer - A countdown timer for individual flash sale products
 * @param endTime - The expiry date/time for this specific flash sale item
 * @param compact - If true, renders a more compact version for product cards
 */
const FlashSaleTimer = ({ endTime, compact = true }: FlashSaleTimerProps) => {
    // Parse the endTime to a Date object
    const expiryTimestamp = new Date(endTime);

    const { seconds, minutes, hours, days, isRunning } = useTimer({
        expiryTimestamp,
        onExpire: () => console.log("Flash sale expired"),
    });

    // If the timer has expired, show "Expired" indicator
    if (!isRunning && days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
        return (
            <span className="badge bg-danger" style={{ fontSize: "0.65rem" }}>
                Expired
            </span>
        );
    }

    // Compact version for product cards
    if (compact) {
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
    }

    // Full version (for flash sale single product page)
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

export default FlashSaleTimer;
