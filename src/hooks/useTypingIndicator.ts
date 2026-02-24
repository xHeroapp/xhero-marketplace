"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@/supabase-client";
import { RealtimeChannel } from "@supabase/supabase-js";

interface TypingEvent {
    user_id: string;
    is_typing: boolean;
}

// BUG-08: minimum ms between outgoing typing broadcasts
const TYPING_THROTTLE_MS = 300;

// UUID v4 pattern — rejects empty strings, spoofed non-UUID ids, etc.
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isValidTypingEvent(payload: unknown): payload is TypingEvent {
    if (!payload || typeof payload !== "object") return false;
    const p = payload as Record<string, unknown>;
    return (
        typeof p.user_id === "string" &&
        UUID_PATTERN.test(p.user_id) &&
        typeof p.is_typing === "boolean"
    );
}

export function useTypingIndicator(conversationId: string | null, userId: string | undefined) {
    const [isOtherTyping, setIsOtherTyping] = useState(false);
    // BUG-09: stable client — created once, not recreated on every render
    const supabaseRef = useRef(createClient());
    const supabase = supabaseRef.current;
    const channelRef = useRef<RealtimeChannel | null>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    // BUG-08: tracks when we last sent a typing broadcast for the throttle check
    const lastBroadcastRef = useRef<number>(0);

    useEffect(() => {
        if (!conversationId || !userId) return;

        // Create a unique channel for typing events
        const channel = supabase.channel(`typing:${conversationId}`);

        channel
            .on("broadcast", { event: "typing" }, (payload) => {
                const event = payload.payload;

                // Reject malformed or structurally invalid payloads
                if (!isValidTypingEvent(event)) return;

                // Ignore own typing events
                if (event.user_id === userId) return;

                if (event.is_typing) {
                    setIsOtherTyping(true);

                    // Reset auto-clear window on each received event
                    if (typingTimeoutRef.current) {
                        clearTimeout(typingTimeoutRef.current);
                    }

                    // Auto-clear typing status after 3 seconds of no events
                    typingTimeoutRef.current = setTimeout(() => {
                        setIsOtherTyping(false);
                    }, 3000);
                } else {
                    // Sender explicitly stopped typing — clear immediately
                    if (typingTimeoutRef.current) {
                        clearTimeout(typingTimeoutRef.current);
                    }
                    setIsOtherTyping(false);
                }
            })
            .subscribe();

        channelRef.current = channel;

        return () => {
            supabase.removeChannel(channel);
            // BUG-12: clear the ref so broadcastTyping/broadcastStopTyping
            // don't attempt to send on a removed channel during re-render cycles
            channelRef.current = null;
            // BUG-08: reset throttle so the next conversation starts fresh
            lastBroadcastRef.current = 0;
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, [conversationId, userId]);

    // Broadcast that the user is typing.
    // BUG-08: leading-edge throttle — fires immediately on the first keystroke,
    // then drops any calls that arrive within TYPING_THROTTLE_MS of the last send.
    // The receiver's 3-second auto-clear handles the tail end after typing stops.
    const broadcastTyping = useCallback(() => {
        if (!channelRef.current || !userId) return;

        const now = Date.now();
        if (now - lastBroadcastRef.current < TYPING_THROTTLE_MS) return;

        lastBroadcastRef.current = now;
        channelRef.current.send({
            type: "broadcast",
            event: "typing",
            payload: { user_id: userId, is_typing: true },
        });
    }, [userId]);

    // Broadcast that the user stopped typing (on send or input cleared)
    const broadcastStopTyping = useCallback(() => {
        if (!channelRef.current || !userId) return;

        channelRef.current.send({
            type: "broadcast",
            event: "typing",
            payload: { user_id: userId, is_typing: false },
        });
    }, [userId]);

    return {
        isOtherTyping,
        broadcastTyping,
        broadcastStopTyping,
    };
}
