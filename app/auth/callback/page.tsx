"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useStore } from "@/lib/store";
import { User } from "@/lib/types";
import { Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
  const router = useRouter();
  const { setCurrentUser } = useStore();
  const [error, setError] = useState("");

  useEffect(() => {
    const handleAuth = async () => {
      try {
        // The Supabase client automatically processes the URL hash fragment on load.
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (session?.user) {
          const userObj: User = {
            id: session.user.id,
            email: session.user.email || undefined,
            name: session.user.user_metadata?.full_name || undefined,
            phone: session.user.phone || "",
            createdAt: session.user.created_at,
            updatedAt: session.user.updated_at || session.user.created_at,
          };

          // Sync the session cookie so API routes know the user is authenticated
          await fetch("/api/auth/session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: userObj.id }),
          });

          setCurrentUser(userObj);
          router.replace("/");
        } else {
          // Edge case: listen for the auth state change if the session isn't immediately ready
          const { data: authListener } = supabase.auth.onAuthStateChange(
            async (event, newSession) => {
              if (event === "SIGNED_IN" && newSession?.user) {
                const userObj: User = {
                  id: newSession.user.id,
                  email: newSession.user.email || undefined,
                  name: newSession.user.user_metadata?.full_name || undefined,
                  phone: newSession.user.phone || "",
                  createdAt: newSession.user.created_at,
                  updatedAt:
                    newSession.user.updated_at || newSession.user.created_at,
                };

                await fetch("/api/auth/session", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ userId: userObj.id }),
                });

                setCurrentUser(userObj);
                router.replace("/");
              }
            },
          );
        }
      } catch (err: any) {
        console.error("Auth callback error:", err);
        setError(err.message || "Failed to authenticate.");
      }
    };

    handleAuth();
  }, [router, setCurrentUser]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--home-bg-alt)] dark:bg-[#1a1612] px-4">
      {error ? (
        <div className="text-center space-y-4 max-w-md">
          <p className="text-red-500 font-medium">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-2.5 bg-coral-600 hover:bg-coral-700 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            Go back home
          </button>
        </div>
      ) : (
        <div className="text-center space-y-4">
          <Loader2 size={40} className="animate-spin text-coral-600 mx-auto" />
          <p className="text-brown-600 dark:text-amber-100/70 font-medium text-lg font-serif">
            Logging you in...
          </p>
        </div>
      )}
    </div>
  );
}
