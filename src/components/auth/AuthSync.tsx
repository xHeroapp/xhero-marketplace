"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { supabase } from "@/supabase-client";

export default function AuthSync() {
    const { user, setUser } = useAuthStore();

    useEffect(() => {
        const syncUser = async () => {
            // If we don't have a user in store, check Supabase session
            if (!user) {
                const { data: { session } } = await supabase.auth.getSession();

                if (session?.user) {
                    // Fetch additional user details from employees table
                    // Matching the logic from AuthCallback.tsx
                    const { data: UserData, error } = await supabase
                        .from("employees")
                        .select()
                        .eq("email", session.user.email)
                        .single();

                    if (UserData && !error) {
                        setUser(UserData);
                    }
                }
            }
        };

        // Run sync immediately on mount
        syncUser();

        // Listen for auth state changes (e.g. sign in, sign out)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === "SIGNED_IN" && session?.user) {
                const { data: UserData, error } = await supabase
                    .from("employees")
                    .select()
                    .eq("email", session.user.email)
                    .single();

                if (UserData && !error) {
                    setUser(UserData);
                }
            } else if (event === "SIGNED_OUT") {
                // We might need to handle sign out, but for now we follow existing patterns
                // Assuming store might need clearing or it's handled elsewhere
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [user, setUser]);

    return null;
}
