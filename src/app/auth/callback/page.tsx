import AuthCallback from "@/components/auth/callback/AuthCallback";
import { Suspense } from "react";

export default function CallbackPage() {
  return (
    <>
      <Suspense
        fallback={
          <div className="login-wrapper d-flex align-items-center justify-content-center text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        }
      >
        <AuthCallback />
      </Suspense>
    </>
  );
}
