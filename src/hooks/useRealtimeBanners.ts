"use client";

import { useEffect, useRef } from "react";
import { supabase } from "@/supabase-client";
import { useQueryClient } from "@tanstack/react-query";
import type { RealtimeChannel } from "@supabase/supabase-js";

/**
 * Subscribes to Supabase Realtime changes on the `marketing_banners` table.
 * Invalidates the React Query cache for all banner queries whenever a banner
 * is inserted, updated, or deleted — preventing stale "ghost banner" flashes.
 *
 * Mount once in a global provider.
 */
export function RealtimeBannerSync() {
    const queryClient = useQueryClient();
    const channelRef = useRef<RealtimeChannel | null>(null);

    useEffect(() => {
        const channel = supabase
            .channel("marketing-banners-sync")
            .on(
                "postgres_changes",
                {
                    event: "*", // INSERT, UPDATE, DELETE
                    schema: "public",
                    table: "marketing_banners",
                },
                () => {
                    queryClient.invalidateQueries({
                        queryKey: ["get-marketing-banners"],
                    });
                }
            )
            .subscribe();

        channelRef.current = channel;

        return () => {
            supabase.removeChannel(channel);
            channelRef.current = null;
        };
    }, [queryClient]);

    return null;
}
