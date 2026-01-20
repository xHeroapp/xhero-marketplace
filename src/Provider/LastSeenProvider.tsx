// src/Provider/LastSeenProvider.tsx
"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/authStore";
import { UseUpdateLastSeen } from "@/queries/auth.queries";

export default function LastSeenProvider() {
  const { user } = useAuthStore();
  const updateLastSeen = UseUpdateLastSeen();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdateRef = useRef<number>(0);

  useEffect(() => {
    if (!user?.id) {
      // Clear interval if user logs out
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Update immediately when user becomes available
    const updateNow = () => {
      const now = Date.now();
      // Only update if it's been more than 5 minutes since last update
      if (now - lastUpdateRef.current > 5 * 60 * 1000) {
        updateLastSeen.mutate();
        lastUpdateRef.current = now;
      }
    };

    updateNow();

    // Set up periodic updates every 10 minutes
    intervalRef.current = setInterval(updateNow, 10 * 60 * 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [user?.id, updateLastSeen]);

  return null;
}