"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@/supabase-client";
import { RealtimeChannel } from "@supabase/supabase-js";

interface TypingEvent {
    user_id: string;
    is_typing: boolean;
}

export function useTypingIndicator(conversationId: string | null, userId: string | undefined) {
    const [isOtherTyping, setIsOtherTyping] = useState(false);
    const supabase = createClient();
    const channelRef = useRef<RealtimeChannel | null>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!conversationId || !userId) return;

        // Create a unique channel for typing events
        const channel = supabase.channel(`typing:${conversationId}`);

        channel
            .on("broadcast", { event: "typing" }, (payload) => {
                // Ignore own typing events
                if (payload.payload.user_id === userId) return;

                setIsOtherTyping(true);

                // Clear existing timeout
                if (typingTimeoutRef.current) {
                    clearTimeout(typingTimeoutRef.current);
                }

                // Auto-clear typing status after 3 seconds of no events
                typingTimeoutRef.current = setTimeout(() => {
                    setIsOtherTyping(false);
                }, 3000);
            })
            .subscribe();

        channelRef.current = channel;

        return () => {
            supabase.removeChannel(channel);
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, [conversationId, userId]);

    // Function to broadcast typing status
    const broadcastTyping = useCallback(() => {
        if (!channelRef.current || !userId) return;

        channelRef.current.send({
            type: "broadcast",
            event: "typing",
            payload: { user_id: userId, is_typing: true },
        });
    }, [userId]);

    return {
        isOtherTyping,
        broadcastTyping,
    };
}
