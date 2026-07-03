import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site-layout";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign In — ÉCLAT" }] }),
  component: Auth,
});

function Auth() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate({ to: "/account" });
  }, [loading, user, navigate]);

  const google = async () => {
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      toast.error(err.message ?? "Google sign-in failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <SiteLayout>
      <section className="mx-auto max-w-md px-6 py-32 flex flex-col items-center">
        <span className="text-xs uppercase tracking-luxe text-muted-foreground">Maison ÉCLAT</span>
        <h1 className="mt-4 text-center font-serif text-5xl">Welcome</h1>
        <p className="mt-3 text-center text-sm text-muted-foreground max-w-xs">
          Sign in or create an account to manage your orders, wishlist, and profile details.
        </p>

        <div className="mt-10 w-full border border-border/60 bg-card p-8 text-center">
          <button
            type="button"
            onClick={google}
            disabled={busy}
            className="w-full btn-gold py-4 text-xs uppercase tracking-luxe disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {busy ? "Connecting…" : "Continue with Google"}
          </button>
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          <Link to="/" className="link-underline">Back to home</Link>
        </p>
      </section>
    </SiteLayout>
  );
}
