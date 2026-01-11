"use client";

import React from "react";
import { useTimer } from "react-timer-hook";

interface TimerProps {
  endTime: string; // ISO timestamp format like "2026-01-31T18:06:05+00:00"
}

const Timer: React.FC<TimerProps> = ({ endTime }) => {
  const expiryTimestamp = new Date(endTime);
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
