# Fix Magic Link Login 404 Error

The user is experiencing a 404 error when attempting to sign in with a magic link. This is because the frontend service `SignInWithMagicLink.service.ts` is trying to POST to `/sign-in-magic-link`, but no such API route exists in the application.

## User Review Required
> [!NOTE]
> I will be creating a new API route at `src/app/api/sign-in-magic-link/route.ts` (or `src/app/sign-in-magic-link/route.ts` depending on the axios config) to handle this request using Supabase's `signInWithOtp`.

## Proposed Changes

> [!IMPORTANT]
> This plan respects the constraint to **not modify existing configurations or database**. We are adding a single new file to handle the request locally. Production environments using Edge Functions will continue to operate as before (ignoring this route if they have a base URL configured).

### app
#### [NEW] [route.ts](file:///Users/mac/Desktop/xhero-marketplace/src/app/sign-in-magic-link/route.ts)
- Create a new API route handler at `src/app/sign-in-magic-link/route.ts`.
- This location matches the relative path `/sign-in-magic-link` requested by the frontend when no base URL is present (localhost).
- Logic:
    1.  Initialize Supabase client using `createServerClient`.
    2.  Extract `email` and `redirect_to` from the request JSON.
    3.  Call `supabase.auth.signInWithOtp` with the provided email and options.
    4.  Return the Supabase response as JSON.


### auth/callback
#### [NEW] [route.ts](file:///Users/mac/Desktop/xhero-marketplace/src/app/auth/callback/route.ts)
- Create a server-side route handler for `/auth/callback`.
- Logic:
    1.  Get `code` from query params.
    2.  Init `createServerClient` (with cookies).
    3.  `supabase.auth.exchangeCodeForSession(code)`.
    4.  Redirect to `/home`.

### components/auth
#### [NEW] [AuthSync.tsx](file:///Users/mac/Desktop/xhero-marketplace/src/components/auth/AuthSync.tsx)
- Create a client component `AuthSync`.
- Logic:
    1.  On mount, check `useAuthStore` for user.
    2.  If missing, check `supabase.auth.getSession()`.
    3.  If session exists, fetch user details from `employees` table (matching `AuthCallback` logic).
    4.  Update store usage `setUser`.

### Provider
#### [MODIFY] [Provider.tsx](file:///Users/mac/Desktop/xhero-marketplace/src/Provider/Provider.tsx)
- Import and render `AuthSync` inside the providers.
- This ensures global auth state synchronization.

## Verification Plan

### Manual Verification
1.  **Restart server**.
2.  Login via Magic Link.
3.  Click link -> Redirects to `/auth/callback`.
4.  Server Route handles exchange (No "code_verifier" error).
5.  Redirects to `/home`.
6.  `AuthSync` runs, fetches user data, updates UI (e.g. Avatar/Name).
