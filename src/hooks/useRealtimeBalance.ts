"use client";

import { useEffect, useRef } from "react";
import { supabase } from "@/supabase-client";
import { useAuthStore } from "@/store/authStore";
import type { RealtimeChannel } from "@supabase/supabase-js";

/**
 * Subscribes to Supabase Realtime changes on the current user's
 * `employees` row. Patches the Zustand auth store immediately when
 * `points_balance` (or any other column) changes on the backend.
 *
 * Mount once in a global provider — it self-manages the subscription lifecycle.
 */
export function RealtimeBalanceSync() {
  const { user, setUser } = useAuthStore();
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel(`employee-balance:${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "employees",
          filter: `id=eq.${user.id}`,
        },
        (payload) => {
          const updated = payload.new;

          // Merge changed fields into the existing user object
          setUser({ ...user, ...updated });
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [user?.id]);

  return null; // Render-less component
}
