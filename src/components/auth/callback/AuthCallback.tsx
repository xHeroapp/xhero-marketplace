"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/supabase-client";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  const { setUser } = useAuthStore();

  async function storeUserData(email: string) {
    const { error, data: UserData } = await supabase
      .from("employees")
      .select()
      .eq("email", email)
      .single();

    if (error) throw error;

    setUser(UserData);

    return UserData;
  }

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Method 1: Check for PKCE code in URL params (modern approach)
        const code = searchParams.get("code");

        if (code) {
          // Exchange the code for a session
          const { data, error } = await supabase.auth.exchangeCodeForSession(
            code
          );

          if (error) {
            console.error("Error exchanging code:", error);
            setError(error.message);
            setTimeout(() => {
              router.replace("/login?error=auth_failed");
            }, 2000);
            return;
          }

          if (data.session) {
            console.log("Session established:", data.session);

            // Update employee's last_seen for engagement tracking
            // NOTE: We update the 'employees' table, NOT the 'users' table,
            // because employee accounts are stored in 'employees', not 'users'
            if (data.user?.email) {
              await supabase
                .from("employees")
                .update({ last_seen: new Date().toISOString() })
                .eq("email", data.user.email);
            }

            router.replace("/home");
            return;
          }
        }

        // Method 2: Check for tokens in hash (legacy magic link approach)
        const hashParams = new URLSearchParams(
          window.location.hash.substring(1)
        );

        const access_token = hashParams.get("access_token");
        const refresh_token = hashParams.get("refresh_token");
        const error_code = hashParams.get("error_code");
        const error_description = hashParams.get("error_description");

        // Handle errors from URL
        if (error_code || error_description) {
          console.error("Auth error:", error_description);
          setError(error_description || "Authentication failed");
          setTimeout(() => {
            router.replace("/login?error=expired_link");
          }, 2000);
          return;
        }

        // If we have tokens in hash, set the session
        if (access_token && refresh_token) {
          const { data, error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });

          if (error) {
            console.error("Error setting session:", error);
            setError("Failed to sign in");
            setTimeout(() => {
              router.replace("/login?error=session_failed");
            }, 2000);
            return;
          }

          if (data.session) {
            console.log(data);
            await storeUserData(data.user?.email);

            // Update employee's last_seen for engagement tracking
            // NOTE: We update the 'employees' table, NOT the 'users' table,
            // because employee accounts are stored in 'employees', not 'users'
            if (data.user?.email) {
              await supabase
                .from("employees")
                .update({ last_seen: new Date().toISOString() })
                .eq("email", data.user.email);
            }

            router.replace("/home");
            return;
          }
        }

        // Fallback: check if session already exists
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData.session) {
          console.log(sessionData);
          router.replace("/home");
          return;
        }

        // If we get here, no valid authentication found
        setError("No valid authentication found");
        setTimeout(() => {
          router.replace("/login");
        }, 2000);
      } catch (err) {
        console.error("Callback error:", err);
        setError("An unexpected error occurred");
        setTimeout(() => {
          router.replace("/login");
        }, 2000);
      }
    };

    handleCallback();
  }, [router, searchParams]);

  return (
    <div className="login-wrapper d-flex align-items-center justify-content-center text-center">
      <div className="container">
        {error ? (
          <>
            <div className="alert alert-danger mb-3 ">{error}</div>
            <p className="text-white">Redirecting...</p>
          </>
        ) : (
          <>
            <div className="spinner-border text-white" role="status">
              <span className="visually-hidden">Signing you in...</span>
            </div>
            <p className="mt-3 text-white">Signing you in...</p>
          </>
        )}
      </div>
    </div>
  );
}

// ## How `exchangeCodeForSession` Works

// ### **The PKCE Flow (Proof Key for Code Exchange)**

// `exchangeCodeForSession` is used with **PKCE authentication flow**, which is more secure than the older token-in-hash approach. Here's how it works:

// 1. **User requests magic link** → Your Edge Function generates the link
// 2. **User clicks the link** → Supabase validates it
// 3. **Redirect with code** → Instead of tokens in the hash (`#access_token=...`), Supabase redirects with a **code** in the query params:

//    http://localhost:3000/auth/callback?code=abc123xyz
