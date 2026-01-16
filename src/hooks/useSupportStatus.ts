"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/supabase-client";

interface SupportSchedule {
    day_of_week: number;
    start_time: string;
    end_time: string;
    is_enabled: boolean;
}

interface SupportStatus {
    isOnline: boolean;
    isLoading: boolean;
    nextStatusChange: Date | null;
    schedule: SupportSchedule[];
}

/**
 * Hook to determine if support is currently online based on configurable schedule.
 * Fetches schedule from `support_schedule` table and calculates status in real-time.
 * Updates every minute to catch status changes.
 */
export function useSupportStatus(): SupportStatus {
    const [schedule, setSchedule] = useState<SupportSchedule[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isOnline, setIsOnline] = useState(false);
    const [nextStatusChange, setNextStatusChange] = useState<Date | null>(null);

    // Fetch schedule from database
    const fetchSchedule = useCallback(async () => {
        try {
            const supabase = createClient();
            const { data, error } = await supabase
                .from("support_schedule")
                .select("day_of_week, start_time, end_time, is_enabled")
                .order("day_of_week");

            if (error) {
                console.error("Error fetching support schedule:", error);
                // Fallback to default: 9am-5pm Sun-Fri
                setSchedule(getDefaultSchedule());
            } else if (data) {
                setSchedule(data);
            }
        } catch (err) {
            console.error("Failed to fetch support schedule:", err);
            setSchedule(getDefaultSchedule());
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Calculate if currently online based on schedule
    const calculateStatus = useCallback(() => {
        if (schedule.length === 0) return;

        const now = new Date();
        const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
        const currentTime = now.toTimeString().slice(0, 8); // "HH:MM:SS"

        const todaySchedule = schedule.find((s) => s.day_of_week === currentDay);

        if (!todaySchedule || !todaySchedule.is_enabled) {
            setIsOnline(false);
            // Calculate next status change: start of next enabled day
            const nextChange = findNextStatusChange(schedule, now, false);
            setNextStatusChange(nextChange);
            return;
        }

        const { start_time, end_time } = todaySchedule;
        const withinHours = currentTime >= start_time && currentTime < end_time;

        setIsOnline(withinHours);

        // Calculate next status change
        if (withinHours) {
            // Currently online, next change is end_time today
            const [hours, minutes, seconds] = end_time.split(":").map(Number);
            const endDate = new Date(now);
            endDate.setHours(hours, minutes, seconds || 0, 0);
            setNextStatusChange(endDate);
        } else if (currentTime < start_time) {
            // Before start time, next change is start_time today
            const [hours, minutes, seconds] = start_time.split(":").map(Number);
            const startDate = new Date(now);
            startDate.setHours(hours, minutes, seconds || 0, 0);
            setNextStatusChange(startDate);
        } else {
            // After end time, next change is start of next enabled day
            const nextChange = findNextStatusChange(schedule, now, false);
            setNextStatusChange(nextChange);
        }
    }, [schedule]);

    // Find next status change date
    function findNextStatusChange(
        schedule: SupportSchedule[],
        from: Date,
        lookingForEnd: boolean
    ): Date | null {
        const currentDay = from.getDay();

        // Look ahead up to 7 days
        for (let offset = 1; offset <= 7; offset++) {
            const targetDay = (currentDay + offset) % 7;
            const daySchedule = schedule.find((s) => s.day_of_week === targetDay);

            if (daySchedule?.is_enabled) {
                const targetDate = new Date(from);
                targetDate.setDate(from.getDate() + offset);
                const timeStr = lookingForEnd
                    ? daySchedule.end_time
                    : daySchedule.start_time;
                const [hours, minutes, seconds] = timeStr.split(":").map(Number);
                targetDate.setHours(hours, minutes, seconds || 0, 0);
                return targetDate;
            }
        }

        return null;
    }

    // Default schedule fallback
    function getDefaultSchedule(): SupportSchedule[] {
        return [
            { day_of_week: 0, start_time: "09:00:00", end_time: "17:00:00", is_enabled: true },
            { day_of_week: 1, start_time: "09:00:00", end_time: "17:00:00", is_enabled: true },
            { day_of_week: 2, start_time: "09:00:00", end_time: "17:00:00", is_enabled: true },
            { day_of_week: 3, start_time: "09:00:00", end_time: "17:00:00", is_enabled: true },
            { day_of_week: 4, start_time: "09:00:00", end_time: "17:00:00", is_enabled: true },
            { day_of_week: 5, start_time: "09:00:00", end_time: "17:00:00", is_enabled: true },
            { day_of_week: 6, start_time: "09:00:00", end_time: "17:00:00", is_enabled: false },
        ];
    }

    // Fetch schedule on mount
    useEffect(() => {
        fetchSchedule();
    }, [fetchSchedule]);

    // Calculate status whenever schedule changes
    useEffect(() => {
        calculateStatus();
    }, [schedule, calculateStatus]);

    // Update status every minute to catch transitions
    useEffect(() => {
        const interval = setInterval(() => {
            calculateStatus();
        }, 60000); // Check every minute

        return () => clearInterval(interval);
    }, [calculateStatus]);

    return { isOnline, isLoading, nextStatusChange, schedule };
}
