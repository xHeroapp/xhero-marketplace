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

// Number of messages loaded per page (initial load + each "load more")
const PAGE_SIZE = 50;

export function useChatMessages(userId: string | undefined) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [activeUserId, setActiveUserId] = useState<string | null>(null);

  // BUG-09: stable client — created once, not on every render
  const supabaseRef = useRef(createClient());
  const supabase = supabaseRef.current;

  const optimisticIdsRef = useRef<Set<string>>(new Set());
  // Ref-stable copy of activeUserId so the real-time closure never goes stale
  const activeUserIdRef = useRef<string | null>(null);
  // Cursor for pagination: created_at of the oldest message currently loaded
  const oldestCreatedAtRef = useRef<string | null>(null);
  // Ref-based in-flight guard so loadMore useCallback doesn't need isFetchingMore as a dep
  const isFetchingMoreRef = useRef(false);

  // Keep oldestCreatedAtRef in sync whenever the messages array changes
  useEffect(() => {
    if (messages.length > 0) {
      oldestCreatedAtRef.current = messages[0].created_at;
    }
  }, [messages]);

  useEffect(() => {
    // BUG-02: cancelled flag prevents state updates after unmount / userId change
    let cancelled = false;
    let channel: RealtimeChannel | null = null;

    const initChat = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // 1. Always get a fresh auth user (avoids stale Zustand state)
        const {
          data: { user: currentUser },
        } = await supabase.auth.getUser();
        const effectiveUserId = currentUser?.id || userId;

        if (!effectiveUserId) {
          setMessages([]);
          setConversationId(null);
          setActiveUserId(null);
          setIsLoading(false);
          return;
        }

        setActiveUserId(effectiveUserId);
        activeUserIdRef.current = effectiveUserId;

        // 2. Verify the user exists in the employees table
        let { data: employee, error: empError } = await supabase
          .from("employees")
          .select("id")
          .eq("user_id", effectiveUserId)
          .maybeSingle();

        if (!employee) {
          console.log(
            "User not linked to employee record. Attempting auto-link...",
          );
          const { data: linked, error: linkError } = await supabase.rpc(
            "link_employee_identity",
          );

          if (linkError) {
            console.error("Auto-link failed:", linkError);
          } else if (linked) {
            console.log("Auto-link successful! Retrying verification...");
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

        // 3. Find or create the conversation
        let { data: conversation, error: convError } = await supabase
          .from("chat_conversations")
          .select("id")
          .eq("user_id", effectiveUserId)
          .maybeSingle();

        if (convError) {
          console.error("Error fetching conversation:", convError);
          setError("Failed to load conversation");
          return;
        }

        if (!conversation) {
          if (!employee) {
            console.warn(
              "User not found in employees table. Cannot create conversation.",
            );
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
            console.error(
              "Error creating conversation:",
              JSON.stringify(createError, null, 2),
            );
            setError("Failed to start conversation");
            return;
          }
          conversation = newConv;
        }

        if (!conversation || cancelled) return;

        // 4. BUG-02: Subscribe BEFORE fetching messages to close the race window.
        channel = supabase.channel(`chat:${conversation.id}`).on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "chat_messages",
            filter: `conversation_id=eq.${conversation.id}`,
          },
          (payload) => {
            if (cancelled) return;

            const newMessage = payload.new as Message;
            setMessages((prev) => {
              // Dedup: already have this exact id (covers the normal
              // path where sendMessage swaps the optimistic first)
              if (prev.some((m) => m.id === newMessage.id)) return prev;

              // Fallback: real-time event arrived before insert HTTP response
              if (
                newMessage.sender_id === activeUserIdRef.current &&
                optimisticIdsRef.current.size > 0
              ) {
                const optimisticIndex = prev.findIndex(
                  (m) =>
                    optimisticIdsRef.current.has(m.id) &&
                    m.content === newMessage.content,
                );
                if (optimisticIndex !== -1) {
                  optimisticIdsRef.current.delete(prev[optimisticIndex].id);
                  const updated = [...prev];
                  updated[optimisticIndex] = newMessage;
                  return updated;
                }
              }

              return [...prev, newMessage];
            });
          },
        );

        await new Promise<void>((resolve) => {
          const timeout = setTimeout(resolve, 5000);
          channel!.subscribe((status) => {
            if (status === "SUBSCRIBED") {
              clearTimeout(timeout);
              resolve();
            }
          });
        });

        if (cancelled) return;

        // 5. Fetch the most recent PAGE_SIZE messages.
        //    Ordered DESC so we get the newest first, then reversed for display.
        //    If exactly PAGE_SIZE rows come back there may be older pages.
        const { data: msgs, error: msgsError } = await supabase
          .from("chat_messages")
          .select("*")
          .eq("conversation_id", conversation.id)
          .order("created_at", { ascending: false })
          .limit(PAGE_SIZE);

        if (cancelled) return;

        if (msgsError) {
          console.error("Error fetching messages:", msgsError);
        } else if (msgs) {
          setMessages([...msgs].reverse() as Message[]);
          setHasMore(msgs.length === PAGE_SIZE);
        }

        setConversationId(conversation.id);
      } catch (err) {
        console.error("Unexpected error initializing chat:", err);
        if (!cancelled) setError("An unexpected error occurred");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    initChat();

    return () => {
      cancelled = true;
      if (channel) supabase.removeChannel(channel);
    };
  }, [userId]);

  // Load the previous page of messages (cursor-based, prepends to the top of the list).
  // Uses a ref-based in-flight guard so the function reference stays stable when
  // isFetchingMore changes — prevents the IntersectionObserver from triggering a
  // duplicate load immediately after the first page finishes.
  const loadMore = useCallback(async () => {
    if (isFetchingMoreRef.current || !hasMore || !conversationId) return;

    const cursor = oldestCreatedAtRef.current;
    if (!cursor) return;

    isFetchingMoreRef.current = true;
    setIsFetchingMore(true);

    try {
      const { data: olderMsgs, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .lt("created_at", cursor)
        .order("created_at", { ascending: false })
        .limit(PAGE_SIZE);

      if (error) throw error;

      if (olderMsgs && olderMsgs.length > 0) {
        // Reverse to chronological order then prepend
        setMessages((prev) => [
          ...([...olderMsgs].reverse() as Message[]),
          ...prev,
        ]);
        setHasMore(olderMsgs.length === PAGE_SIZE);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Error loading more messages:", err);
    } finally {
      isFetchingMoreRef.current = false;
      setIsFetchingMore(false);
    }
  }, [supabase, conversationId, hasMore]);

  // Send message function
  const sendMessage = async (content: string) => {
    if (!conversationId || !activeUserId || !content.trim()) return;

    // BUG-01: Optimistic update — show message immediately before DB confirms
    const tempId = crypto.randomUUID();
    const optimisticMessage: Message = {
      id: tempId,
      conversation_id: conversationId,
      sender_type: "user",
      sender_id: activeUserId,
      content: content.trim(),
      is_read: false,
      created_at: new Date().toISOString(),
    };
    optimisticIdsRef.current.add(tempId);
    setMessages((prev) => [...prev, optimisticMessage]);

    try {
      // Select the inserted row back so we get the real server-assigned id.
      // We swap the optimistic placeholder immediately (by tempId) — before the
      // real-time event arrives — so the id-based dedup in the subscription
      // handler no-ops the event instead of appending a duplicate.
      const { data: inserted, error } = await supabase
        .from("chat_messages")
        .insert({
          conversation_id: conversationId,
          sender_type: "user",
          sender_id: activeUserId,
          content: content.trim(),
        })
        .select("*")
        .single();

      if (error) throw error;

      if (inserted) {
        optimisticIdsRef.current.delete(tempId);
        setMessages((prev) =>
          prev.map((m) => (m.id === tempId ? (inserted as Message) : m)),
        );
      }

      // Update last_message_at on the conversation
      await supabase
        .from("chat_conversations")
        .update({ last_message_at: new Date().toISOString() })
        .eq("id", conversationId);
    } catch (error) {
      // Roll back the optimistic message on failure
      optimisticIdsRef.current.delete(tempId);
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
      throw error;
    }
  };

  return {
    messages,
    isLoading,
    isFetchingMore,
    hasMore,
    loadMore,
    error,
    sendMessage,
    conversationId,
  };
}
