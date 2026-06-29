import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LogOut, Package } from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { formatPKR } from "@/lib/format";

export const Route = createFileRoute("/account")({
  head: () => ({ meta: [{ title: "Account — ÉCLAT" }] }),
  component: Account,
});

type Order = {
  id: string;
  total: number;
  status: string;
  created_at: string;
  customer_name: string;
  city: string;
  order_items: { name_snapshot: string; qty: number; price_snapshot: number }[];
};

function Account() {
  const { user, loading, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("orders")
      .select("id,total,status,created_at,customer_name,city,order_items(name_snapshot,qty,price_snapshot)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setOrders((data ?? []) as any);
        setLoadingOrders(false);
      });
  }, [user]);

  if (loading || !user) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-5xl px-6 py-32 text-center text-sm text-muted-foreground">Loading…</div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="mx-auto max-w-5xl px-6 pt-16 pb-24">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <span className="text-xs uppercase tracking-luxe text-muted-foreground">Maison Account</span>
            <h1 className="mt-3 font-serif text-5xl">Bonjour</h1>
            <p className="mt-2 text-sm text-muted-foreground">{user.email}</p>
          </div>
          <div className="flex gap-3">
            {isAdmin && (
              <Link to="/admin" className="border border-border px-4 py-2 text-xs uppercase tracking-luxe link-underline">
                Admin Dashboard
              </Link>
            )}
            <button onClick={signOut} className="flex items-center gap-2 border border-border px-4 py-2 text-xs uppercase tracking-luxe">
              <LogOut className="h-3.5 w-3.5" /> Sign Out
            </button>
          </div>
        </div>

        <h2 className="mt-16 font-serif text-3xl">Order History</h2>
        {loadingOrders ? (
          <p className="mt-8 text-sm text-muted-foreground">Loading orders…</p>
        ) : orders.length === 0 ? (
          <p className="mt-8 border border-border/60 bg-card p-12 text-center text-sm text-muted-foreground">
            You haven't placed an order yet.
          </p>
        ) : (
          <ul className="mt-8 space-y-4">
            {orders.map((o) => (
              <li key={o.id} className="border border-border/60 bg-card p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Package className="h-4 w-4 text-accent" />
                    <span className="font-mono text-sm">#{o.id.slice(0, 8)}</span>
                    <span className="text-xs uppercase tracking-luxe text-muted-foreground">{o.status}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{new Date(o.created_at).toLocaleDateString()}</span>
                    <span className="font-serif text-lg text-foreground">{formatPKR(o.total)}</span>
                  </div>
                </div>
                <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                  {o.order_items.map((i, idx) => (
                    <li key={idx}>
                      {i.name_snapshot} × {i.qty}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </section>
    </SiteLayout>
  );
}
