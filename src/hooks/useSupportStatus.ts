"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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

// BUG-06: convert "HH:MM:SS" or "HH:MM" to total minutes for safe numeric comparison.
// String lexicographic comparison ("23:00" >= "02:00") breaks overnight schedules.
function timeToMinutes(t: string): number {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
}

// Default schedule fallback: 9am–5pm Sun–Fri, Saturday disabled
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

// Find the next date when the online/offline status changes.
// Looks up to 7 days ahead for the next enabled schedule day.
function findNextStatusChange(
    schedule: SupportSchedule[],
    from: Date,
    lookingForEnd: boolean
): Date | null {
    const currentDay = from.getDay();

    for (let offset = 1; offset <= 7; offset++) {
        const targetDay = (currentDay + offset) % 7;
        const daySchedule = schedule.find((s) => s.day_of_week === targetDay);

        if (daySchedule?.is_enabled) {
            const targetDate = new Date(from);
            targetDate.setDate(from.getDate() + offset);
            const timeStr = lookingForEnd ? daySchedule.end_time : daySchedule.start_time;
            const [hours, minutes, seconds] = timeStr.split(":").map(Number);
            targetDate.setHours(hours, minutes, seconds || 0, 0);
            return targetDate;
        }
    }

    return null;
}

/**
 * Hook to determine if support is currently online based on configurable schedule.
 * Fetches schedule from `support_schedule` table and calculates status in real-time.
 * Updates every minute to catch transitions.
 * Subscribes to Realtime so admin edits propagate without a page reload.
 */
export function useSupportStatus(): SupportStatus {
    const [schedule, setSchedule] = useState<SupportSchedule[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isOnline, setIsOnline] = useState(false);
    const [nextStatusChange, setNextStatusChange] = useState<Date | null>(null);

    // Stable Supabase client shared between fetchSchedule and the Realtime subscription
    const supabaseRef = useRef(createClient());
    const supabase = supabaseRef.current;

    // Fetch schedule from database
    const fetchSchedule = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from("support_schedule")
                .select("day_of_week, start_time, end_time, is_enabled")
                .order("day_of_week");

            if (error) {
                console.error("Error fetching support schedule:", error);
                setSchedule(getDefaultSchedule());
            } else if (data && data.length > 0) {
                // BUG-07: only use DB data when it actually has rows
                setSchedule(data);
            } else {
                // BUG-07: table exists but is empty — fall back to default rather than
                // leaving schedule as [] which makes calculateStatus return early and
                // leaves support permanently showing as offline
                console.warn("support_schedule table is empty. Using default schedule.");
                setSchedule(getDefaultSchedule());
            }
        } catch (err) {
            console.error("Failed to fetch support schedule:", err);
            setSchedule(getDefaultSchedule());
        } finally {
            setIsLoading(false);
        }
    }, [supabase]);

    // Calculate if currently online based on schedule
    const calculateStatus = useCallback(() => {
        if (schedule.length === 0) return;

        const now = new Date();
        const currentDay = now.getDay();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();

        const todaySchedule = schedule.find((s) => s.day_of_week === currentDay);

        if (!todaySchedule || !todaySchedule.is_enabled) {
            setIsOnline(false);
            setNextStatusChange(findNextStatusChange(schedule, now, false));
            return;
        }

        const { start_time, end_time } = todaySchedule;
        const startMinutes = timeToMinutes(start_time);
        const endMinutes = timeToMinutes(end_time);

        // BUG-06: numeric minute-of-day comparison correctly handles overnight schedules
        // where end_time < start_time (e.g. 22:00–02:00).
        // Normal  (end > start): online when start <= current < end
        // Overnight (end < start): online when current >= start OR current < end
        const withinHours =
            endMinutes > startMinutes
                ? currentMinutes >= startMinutes && currentMinutes < endMinutes
                : currentMinutes >= startMinutes || currentMinutes < endMinutes;

        setIsOnline(withinHours);

        if (withinHours) {
            // Currently online — next change is end_time today
            const [h, m, s] = end_time.split(":").map(Number);
            const endDate = new Date(now);
            endDate.setHours(h, m, s || 0, 0);
            setNextStatusChange(endDate);
        } else if (startMinutes > currentMinutes) {
            // Before today's shift — next change is start_time today
            const [h, m, s] = start_time.split(":").map(Number);
            const startDate = new Date(now);
            startDate.setHours(h, m, s || 0, 0);
            setNextStatusChange(startDate);
        } else {
            // After today's shift — next change is the next enabled day's start
            setNextStatusChange(findNextStatusChange(schedule, now, false));
        }
    }, [schedule]);

    // Fetch schedule on mount
    useEffect(() => {
        fetchSchedule();
    }, [fetchSchedule]);

    // BUG-10: Subscribe to Realtime changes on support_schedule so admin edits
    // (INSERT / UPDATE / DELETE) propagate to active user sessions immediately
    // without requiring a page reload.
    useEffect(() => {
        const channel = supabase
            .channel("support_schedule_changes")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "support_schedule",
                },
                () => {
                    fetchSchedule();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase, fetchSchedule]);

    // Recalculate status whenever the schedule array changes
    useEffect(() => {
        calculateStatus();
    }, [schedule, calculateStatus]);

    // Poll every minute to catch start/end time transitions
    useEffect(() => {
        const interval = setInterval(() => {
            calculateStatus();
        }, 60000);

        return () => clearInterval(interval);
    }, [calculateStatus]);

    return { isOnline, isLoading, nextStatusChange, schedule };
}
