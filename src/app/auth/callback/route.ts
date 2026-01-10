import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    const next = searchParams.get("next") ?? "/home";

    console.log("Auth Callback Hit:", { code, next, origin });

    if (code) {
        const cookieStore = await cookies();
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
                            console.log("Setting cookies:", cookiesToSet.length);
                            cookiesToSet.forEach(({ name, value, options }) =>
                                cookieStore.set(name, value, options)
                            );
                        } catch (err) {
                            console.error("Failed to set cookies:", err);
                        }
                    },
                },
            }
        );
        const { error, data } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            console.log("Exchange Success. User:", data.user?.email);
            // Determine invalid next paths
            const validNext = next.startsWith("http") ? "/home" : next;
            return NextResponse.redirect(`${origin}${validNext}?msg=login_success`);
        } else {
            console.error("Exchange Error:", error);
            return NextResponse.redirect(`${origin}/login?error=exchange_failed&details=${error.code}`);
        }
    } else {
        console.warn("No code found in params");
        return NextResponse.redirect(`${origin}/login?error=no_code`);
    }
}
