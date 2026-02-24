import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();


        // Create Supabase client
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_API_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll();
                    },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) => {
                                cookieStore.set(name, value, options);
                            });
                        } catch (err) {
                            console.error("Magic Link Route: Failed to set cookies:", err);
                        }
                    },
                },
            }
        );

        const body = await request.json();
        const { email, redirect_to } = body;

        const allowedRedirects = (process.env.ALLOWED_MAGIC_LINK_REDIRECTS ?? "")
            .split(",")
            .map((url) => url.trim())
            .filter(Boolean);

        if (!redirect_to || !allowedRedirects.includes(redirect_to)) {
            return NextResponse.json(
                { message: "Invalid redirect URL" },
                { status: 400 }
            );
        }

        const { data, error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: redirect_to,
            },
        });

        if (error) {
            return NextResponse.json(
                { message: error.message },
                { status: error.status || 400 }
            );
        }

        return NextResponse.json(
            { message: "Magic link sent successfully", data },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
