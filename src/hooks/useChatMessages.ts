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
    const [conversationId, setConversationId] = useState<string | null>(null);
    const subscriptionRef = useRef<RealtimeChannel | null>(null);
    const supabase = createClient();

    // Initialize conversation and fetch messages
    useEffect(() => {
        if (!userId) return;

        const initChat = async () => {
            setIsLoading(true);
            try {
                // 1. Check if conversation exists
                let { data: conversation, error } = await supabase
                    .from("chat_conversations")
                    .select("id")
                    .eq("user_id", userId)
                    .single();

                if (error && error.code !== "PGRST116") {
                    console.error("Error fetching conversation:", error);
                    return;
                }

                // 2. Create if not exists
                if (!conversation) {
                    const { data: newConv, error: createError } = await supabase
                        .from("chat_conversations")
                        .insert({ user_id: userId })
                        .select("id")
                        .single();

                    if (createError) {
                        console.error("Error creating conversation:", createError);
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
                        .order("created_at", { ascending: true }); // Oldest first

                    if (msgsError) {
                        console.error("Error fetching messages:", msgsError);
                    } else {
                        setMessages(msgs as Message[]);
                    }
                }
            } catch (err) {
                console.error("Unexpected error initializing chat:", err);
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
        if (!conversationId || !userId || !content.trim()) return;

        try {
            const { error } = await supabase.from("chat_messages").insert({
                conversation_id: conversationId,
                sender_type: "user",
                sender_id: userId,
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
        sendMessage,
        conversationId,
    };
}
