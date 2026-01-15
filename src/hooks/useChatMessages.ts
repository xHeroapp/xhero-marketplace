"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@/supabase-client";
import { RealtimeChannel } from "@supabase/supabase-js";
import { toast } from "sonner";

export interface Message {
    id: string;
    conversation_id: string;
    sender_type: "user" | "admin";
    sender_id: string;
    content: string;
    is_read: boolean;
    created_at: string;
}

export function useChatMessages(userId: string | undefined) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [activeUserId, setActiveUserId] = useState<string | null>(null);
    const subscriptionRef = useRef<RealtimeChannel | null>(null);
    const supabase = createClient();

    // Initialize conversation and fetch messages
    useEffect(() => {
        // If userId is missing, we still try to fetch current user to be safe, 
        // but typically we wait for the prop.
        // However, to fix "Stale ID" issue, we always fetch fresh auth user.

        const initChat = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Get fresh user data from Supabase to ensure we have the correct ID
                // (This handles cases where useAuthStore might be stale)
                const { data: { user: currentUser } } = await supabase.auth.getUser();
                const effectiveUserId = currentUser?.id || userId;

                if (!effectiveUserId) {
                    // Valid case: user not logged in yet
                    return;
                }

                setActiveUserId(effectiveUserId);

                // 0. Verify user exists in employees table
                let { data: employee, error: empError } = await supabase
                    .from("employees")
                    .select("id")
                    .eq("user_id", effectiveUserId)
                    .maybeSingle();

                // If not linked yet, try to link via RPC (Auto-Onboarding)
                if (!employee) {
                    console.log("User not linked to employee record. Attempting auto-link...");
                    const { data: linked, error: linkError } = await supabase
                        .rpc("link_employee_identity");

                    if (linkError) {
                        console.error("Auto-link failed:", linkError);
                    } else if (linked) {
                        console.log("Auto-link successful! Retrying verification...");
                        // Retry verification with effectiveUserId
                        const retry = await supabase
                            .from("employees")
                            .select("id")
                            .eq("user_id", effectiveUserId)
                            .maybeSingle();

                        if (retry.data) {
                            employee = retry.data;
                            empError = null;
                        }
                    } else {
                        console.warn("Auto-link returned false (no matching email found).");
                    }
                }

                if (empError) {
                    console.error("Error verifying employee:", empError);
                    setError("Failed to verify employee status");
                    return;
                }

                // 1. Check if conversation exists
                let { data: conversation, error } = await supabase
                    .from("chat_conversations")
                    .select("id")
                    .eq("user_id", effectiveUserId)
                    .maybeSingle();

                if (error) {
                    console.error("Error fetching conversation:", error);
                    setError("Failed to load conversation");
                    return;
                }

                // 2. Create if not exists
                if (!conversation) {
                    // If user is not an employee, we cannot create a conversation due to FK constraint
                    if (!employee) {
                        console.warn("User not found in employees table. Cannot create conversation.");
                        setError("You must be a verified employee to use support chat.");
                        return;
                    }

                    console.log("Creating new conversation for user:", effectiveUserId);
                    const { data: newConv, error: createError } = await supabase
                        .from("chat_conversations")
                        .insert({ user_id: effectiveUserId })
                        .select("id")
                        .single();

                    if (createError) {
                        console.error("Error creating conversation validation:", JSON.stringify(createError, null, 2));
                        setError("Failed to start conversation");
                        return;
                    }
                    conversation = newConv;
                }

                if (conversation) {
                    setConversationId(conversation.id);

                    // 3. Fetch existing messages
                    const { data: msgs, error: msgsError } = await supabase
                        .from("chat_messages")
                        .select("*")
                        .eq("conversation_id", conversation.id)
                        .order("created_at", { ascending: true });

                    if (msgsError) {
                        console.error("Error fetching messages:", msgsError);
                    } else {
                        setMessages(msgs as Message[]);
                    }
                }
            } catch (err) {
                console.error("Unexpected error initializing chat:", err);
                setError("An unexpected error occurred");
            } finally {
                setIsLoading(false);
            }
        };

        initChat();
    }, [userId]);

    // Subscribe to real-time updates
    useEffect(() => {
        if (!conversationId) return;

        // Clean up existing subscription
        if (subscriptionRef.current) {
            supabase.removeChannel(subscriptionRef.current);
        }

        // Subscribe to new messages for this conversation
        const channel = supabase
            .channel(`chat:${conversationId}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "chat_messages",
                    filter: `conversation_id=eq.${conversationId}`,
                },
                (payload) => {
                    const newMessage = payload.new as Message;
                    setMessages((prev) => [...prev, newMessage]);
                }
            )
            .subscribe();

        subscriptionRef.current = channel;

        return () => {
            if (subscriptionRef.current) {
                supabase.removeChannel(subscriptionRef.current);
            }
        };
    }, [conversationId]);

    // Send message function
    const sendMessage = async (content: string) => {
        // Use activeUserId instead of userId prop to ensure we match the DB session
        if (!conversationId || !activeUserId || !content.trim()) return;

        try {
            const { error } = await supabase.from("chat_messages").insert({
                conversation_id: conversationId,
                sender_type: "user",
                sender_id: activeUserId,
                content: content.trim(),
            });

            if (error) {
                throw error;
            }

            // Update last_message_at on conversation
            await supabase
                .from("chat_conversations")
                .update({ last_message_at: new Date().toISOString() })
                .eq("id", conversationId);

        } catch (error) {
            console.error("Error sending message:", error);
            toast.error("Failed to send message");
            throw error;
        }
    };

    return {
        messages,
        isLoading,
        error,
        sendMessage,
        conversationId,
    };
}
