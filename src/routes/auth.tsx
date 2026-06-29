import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site-layout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { lovable } from "@/integrations/lovable";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign In — ÉCLAT" }] }),
  component: Auth,
});

function Auth() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    if (!loading && user) navigate({ to: "/account" });
  }, [loading, user, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back");
      } else {
        const redirect = `${window.location.origin}/account`;
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: redirect, data: { full_name: fullName } },
        });
        if (error) throw error;
        toast.success("Account created. Check your email to confirm.");
      }
    } catch (err: any) {
      toast.error(err.message ?? "Authentication failed");
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    setBusy(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) throw new Error(String(result.error));
    } catch (err: any) {
      toast.error(err.message ?? "Google sign-in failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <SiteLayout>
      <section className="mx-auto max-w-md px-6 py-20">
        <h1 className="text-center font-serif text-5xl">
          {mode === "signin" ? "Welcome Back" : "Create Account"}
        </h1>
        <p className="mt-3 text-center text-sm text-muted-foreground">
          {mode === "signin" ? "Sign in to track your orders." : "Join the ÉCLAT clientele."}
        </p>

        <form onSubmit={submit} className="mt-10 space-y-5 border border-border/60 bg-card p-8">
          {mode === "signup" && (
            <input
              required
              placeholder="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border-0 border-b border-border bg-transparent py-3 text-sm focus:border-accent focus:outline-none"
            />
          )}
          <input
            required
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-0 border-b border-border bg-transparent py-3 text-sm focus:border-accent focus:outline-none"
          />
          <input
            required
            type="password"
            placeholder="Password (min 6 chars)"
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-0 border-b border-border bg-transparent py-3 text-sm focus:border-accent focus:outline-none"
          />
          <button type="submit" disabled={busy} className="btn-gold w-full py-4 text-xs uppercase tracking-luxe disabled:opacity-50">
            {busy ? "Please wait…" : mode === "signin" ? "Sign In" : "Create Account"}
          </button>

          <div className="relative my-2 text-center text-[10px] uppercase tracking-luxe text-muted-foreground">
            <span className="bg-card px-3">or</span>
            <span className="absolute inset-x-0 top-1/2 -z-10 h-px bg-border" />
          </div>

          <button
            type="button"
            onClick={google}
            disabled={busy}
            className="w-full border border-border py-3 text-xs uppercase tracking-luxe transition hover:border-foreground disabled:opacity-50"
          >
            Continue with Google
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          {mode === "signin" ? "New to ÉCLAT?" : "Already have an account?"}{" "}
          <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="link-underline text-foreground">
            {mode === "signin" ? "Create one" : "Sign in"}
          </button>
        </p>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          <Link to="/" className="link-underline">Back to home</Link>
        </p>
      </section>
    </SiteLayout>
  );
}
