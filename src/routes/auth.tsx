import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { lovable } from "@/integrations/lovable";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign In — ÉCLAT" }] }),
  component: Auth,
});

type Mode = "signin" | "signup" | "forgot";

function Auth() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("signin");
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [resetSent, setResetSent] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate({ to: "/account" });
  }, [loading, user, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/account`,
        });
        if (error) throw error;
        setResetSent(true);
        toast.success("Password reset link sent to your email");
      } else if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back");
      } else {
        if (password.length < 6) {
          toast.error("Password must be at least 6 characters");
          setBusy(false);
          return;
        }
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

  const titles: Record<Mode, string> = {
    signin: "Welcome Back",
    signup: "Create Account",
    forgot: "Reset Password",
  };

  const descriptions: Record<Mode, string> = {
    signin: "Sign in to track your orders and manage your wishlist.",
    signup: "Join the ÉCLAT clientele for a personalized shopping experience.",
    forgot: "Enter your email and we'll send you a link to reset your password.",
  };

  return (
    <SiteLayout>
      <section className="mx-auto max-w-md px-6 py-20">
        <h1 className="text-center font-serif text-5xl">{titles[mode]}</h1>
        <p className="mt-3 text-center text-sm text-muted-foreground">{descriptions[mode]}</p>

        {mode === "forgot" && resetSent ? (
          <div className="mt-10 border border-border/60 bg-card p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center border border-accent text-accent">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              We've sent a password reset link to <strong className="text-foreground">{email}</strong>. Check your inbox and spam folder.
            </p>
            <button
              onClick={() => { setMode("signin"); setResetSent(false); }}
              className="mt-6 flex items-center gap-2 mx-auto text-xs uppercase tracking-luxe link-underline"
            >
              <ArrowLeft className="h-3 w-3" /> Back to Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-10 space-y-5 border border-border/60 bg-card p-8">
            {mode === "signup" && (
              <div>
                <label className="text-[10px] uppercase tracking-luxe text-muted-foreground">Full Name</label>
                <input
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1 w-full border-0 border-b border-border bg-transparent py-3 text-sm transition focus:border-accent focus:outline-none"
                  placeholder="Your full name"
                />
              </div>
            )}
            <div>
              <label className="text-[10px] uppercase tracking-luxe text-muted-foreground">Email</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full border-0 border-b border-border bg-transparent py-3 text-sm transition focus:border-accent focus:outline-none"
                placeholder="your@email.com"
              />
            </div>
            {mode !== "forgot" && (
              <div>
                <label className="text-[10px] uppercase tracking-luxe text-muted-foreground">Password</label>
                <input
                  required
                  type="password"
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full border-0 border-b border-border bg-transparent py-3 text-sm transition focus:border-accent focus:outline-none"
                  placeholder={mode === "signup" ? "Min 6 characters" : "Your password"}
                />
              </div>
            )}

            {mode === "signin" && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setMode("forgot")}
                  className="text-xs text-muted-foreground link-underline"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button type="submit" disabled={busy} className="btn-gold w-full py-4 text-xs uppercase tracking-luxe disabled:opacity-50">
              {busy ? "Please wait…" : mode === "signin" ? "Sign In" : mode === "signup" ? "Create Account" : "Send Reset Link"}
            </button>

            {mode !== "forgot" && (
              <>
                <div className="relative my-2 text-center text-[10px] uppercase tracking-luxe text-muted-foreground">
                  <span className="bg-card px-3 relative z-10">or</span>
                  <span className="absolute inset-x-0 top-1/2 h-px bg-border" />
                </div>

                <button
                  type="button"
                  onClick={google}
                  disabled={busy}
                  className="w-full border border-border py-3 text-xs uppercase tracking-luxe transition hover:border-foreground disabled:opacity-50"
                >
                  Continue with Google
                </button>
              </>
            )}
          </form>
        )}

        <div className="mt-6 text-center text-xs text-muted-foreground">
          {mode === "signin" && (
            <>
              New to ÉCLAT?{" "}
              <button onClick={() => setMode("signup")} className="link-underline text-foreground">Create an account</button>
            </>
          )}
          {mode === "signup" && (
            <>
              Already have an account?{" "}
              <button onClick={() => setMode("signin")} className="link-underline text-foreground">Sign in</button>
            </>
          )}
          {mode === "forgot" && !resetSent && (
            <>
              Remember your password?{" "}
              <button onClick={() => setMode("signin")} className="link-underline text-foreground">Sign in</button>
            </>
          )}
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          <Link to="/" className="link-underline">Back to home</Link>
        </p>
      </section>
    </SiteLayout>
  );
}
