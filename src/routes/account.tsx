import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LogOut, Package, User, MapPin, Phone, Mail, Pencil, Check, Clock, Truck, CheckCircle, CreditCard, ShieldCheck, XCircle } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site-layout";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { formatPKR } from "@/lib/format";

export const Route = createFileRoute("/account")({
  head: () => ({ meta: [{ title: "Account — ÉCLAT" }] }),
  component: Account,
});

type Profile = {
  full_name: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
};

type Order = {
  id: string;
  total: number;
  status: string;
  created_at: string;
  customer_name: string;
  city: string;
  order_items: { name_snapshot: string; qty: number; price_snapshot: number; color: string | null; size: string | null }[];
};

const STATUS_STEPS = ["pending", "payment_submitted", "confirmed", "shipped", "delivered"];

const STATUS_LABELS: Record<string, string> = {
  pending: "pending",
  payment_submitted: "payment",
  confirmed: "confirmed",
  shipped: "shipped",
  delivered: "delivered",
};

const STATUS_ICONS: Record<string, any> = {
  pending: Clock,
  payment_submitted: CreditCard,
  confirmed: ShieldCheck,
  shipped: Truck,
  delivered: CheckCircle,
};

function OrderTimeline({ status }: { status: string }) {
  const currentIdx = STATUS_STEPS.indexOf(status);
  const isCancelled = status === "cancelled";

  return (
    <div className="flex items-center gap-1">
      {STATUS_STEPS.map((s, i) => {
        const done = !isCancelled && i <= currentIdx;
        const isCurrent = !isCancelled && i === currentIdx;
        const StepIcon = STATUS_ICONS[s] ?? Clock;
        return (
          <div key={s} className="flex items-center gap-1">
            <div
              className={`flex items-center gap-1 px-2 py-1 text-[9px] uppercase tracking-luxe transition ${
                done
                  ? "bg-accent/10 text-accent"
                  : isCancelled
                    ? "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                    : "bg-secondary text-muted-foreground"
              }`}
            >
              {done ? <CheckCircle className="h-2.5 w-2.5" /> : <StepIcon className="h-2.5 w-2.5" />}
              {STATUS_LABELS[s] ?? s}
            </div>
            {i < STATUS_STEPS.length - 1 && (
              <div className={`h-px w-4 ${done && i < currentIdx ? "bg-accent" : "bg-border"}`} />
            )}
          </div>
        );
      })}
      {isCancelled && (
        <div className="ml-1 bg-red-100 px-2 py-1 text-[9px] uppercase tracking-luxe text-red-600 dark:bg-red-900/20 dark:text-red-400">
          <XCircle className="inline h-2.5 w-2.5 mr-1" />Cancelled
        </div>
      )}
    </div>
  );
}

function Account() {
  const { user, loading, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [profile, setProfile] = useState<Profile>({ full_name: null, phone: null, address: null, city: null });
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState<Profile>({ full_name: "", phone: "", address: "", city: "" });
  const [savingProfile, setSavingProfile] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  // Load profile
  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("full_name, phone, address, city")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }: { data: any }) => {
        if (data) {
          setProfile(data);
          setProfileForm(data);
        }
      });
  }, [user]);

  // Load orders
  useEffect(() => {
    if (!user) return;
    supabase
      .from("orders")
      .select("id,total,status,created_at,customer_name,city,order_items(name_snapshot,qty,price_snapshot,color,size)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }: { data: any }) => {
        setOrders((data ?? []) as any);
        setLoadingOrders(false);
      });
  }, [user]);

  const saveProfile = async () => {
    if (!user) return;
    setSavingProfile(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profileForm.full_name || null,
          phone: profileForm.phone || null,
          address: profileForm.address || null,
          city: profileForm.city || null,
        })
        .eq("id", user.id);
      if (error) throw error;
      setProfile(profileForm);
      setEditingProfile(false);
      toast.success("Profile updated");
    } catch (err: any) {
      toast.error(err.message ?? "Failed to save profile");
    } finally {
      setSavingProfile(false);
    }
  };

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
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <span className="text-xs uppercase tracking-luxe text-muted-foreground">Maison Account</span>
            <h1 className="mt-3 font-serif text-5xl">Bonjour{profile.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{user.email}</p>
          </div>
          <div className="flex gap-3">
            {isAdmin && (
              <Link to="/admin" className="border border-border px-4 py-2 text-xs uppercase tracking-luxe transition hover:border-foreground">
                Admin Dashboard
              </Link>
            )}
            <button onClick={signOut} className="flex items-center gap-2 border border-border px-4 py-2 text-xs uppercase tracking-luxe transition hover:border-foreground">
              <LogOut className="h-3.5 w-3.5" /> Sign Out
            </button>
          </div>
        </div>

        {/* Profile Card */}
        <div className="mt-12 border border-border/60 bg-card p-8">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl">Your Profile</h2>
            {!editingProfile && (
              <button
                onClick={() => { setEditingProfile(true); setProfileForm(profile); }}
                className="flex items-center gap-2 text-xs uppercase tracking-luxe text-muted-foreground transition hover:text-foreground"
              >
                <Pencil className="h-3 w-3" /> Edit
              </button>
            )}
          </div>

          {editingProfile ? (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="text-[10px] uppercase tracking-luxe text-muted-foreground">Full Name</span>
                <input
                  value={profileForm.full_name ?? ""}
                  onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                  className="mt-1 w-full border border-border bg-transparent px-3 py-2.5 text-sm transition focus:border-accent focus:outline-none"
                />
              </label>
              <label className="block">
                <span className="text-[10px] uppercase tracking-luxe text-muted-foreground">Phone</span>
                <input
                  value={profileForm.phone ?? ""}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  type="tel"
                  className="mt-1 w-full border border-border bg-transparent px-3 py-2.5 text-sm transition focus:border-accent focus:outline-none"
                />
              </label>
              <label className="block">
                <span className="text-[10px] uppercase tracking-luxe text-muted-foreground">City</span>
                <input
                  value={profileForm.city ?? ""}
                  onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                  className="mt-1 w-full border border-border bg-transparent px-3 py-2.5 text-sm transition focus:border-accent focus:outline-none"
                />
              </label>
              <label className="block">
                <span className="text-[10px] uppercase tracking-luxe text-muted-foreground">Address</span>
                <input
                  value={profileForm.address ?? ""}
                  onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                  className="mt-1 w-full border border-border bg-transparent px-3 py-2.5 text-sm transition focus:border-accent focus:outline-none"
                />
              </label>
              <div className="flex gap-3 md:col-span-2">
                <button
                  onClick={saveProfile}
                  disabled={savingProfile}
                  className="btn-gold flex items-center gap-2 px-6 py-2.5 text-xs uppercase tracking-luxe disabled:opacity-50"
                >
                  <Check className="h-3.5 w-3.5" /> {savingProfile ? "Saving…" : "Save Profile"}
                </button>
                <button
                  onClick={() => setEditingProfile(false)}
                  className="border border-border px-5 py-2.5 text-xs uppercase tracking-luxe transition hover:border-foreground"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-3 text-sm">
                <User className="h-4 w-4 text-accent" />
                <div>
                  <span className="text-[10px] uppercase tracking-luxe text-muted-foreground">Name</span>
                  <p>{profile.full_name || "Not set"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-accent" />
                <div>
                  <span className="text-[10px] uppercase tracking-luxe text-muted-foreground">Phone</span>
                  <p>{profile.phone || "Not set"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-accent" />
                <div>
                  <span className="text-[10px] uppercase tracking-luxe text-muted-foreground">City</span>
                  <p>{profile.city || "Not set"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-accent" />
                <div>
                  <span className="text-[10px] uppercase tracking-luxe text-muted-foreground">Email</span>
                  <p>{user.email}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Order History */}
        <h2 className="mt-16 font-serif text-3xl">Order History</h2>
        {loadingOrders ? (
          <p className="mt-8 text-sm text-muted-foreground">Loading orders…</p>
        ) : orders.length === 0 ? (
          <div className="mt-8 border border-border/60 bg-card p-16 text-center">
            <Package className="mx-auto h-10 w-10 text-muted-foreground/30" />
            <p className="mt-4 text-sm text-muted-foreground">You haven't placed an order yet.</p>
            <Link to="/shop" className="mt-6 inline-block btn-gold px-8 py-3 text-xs uppercase tracking-luxe">
              Start Shopping
            </Link>
          </div>
        ) : (
          <ul className="mt-8 space-y-4">
            {orders.map((o) => {
              const expanded = expandedOrder === o.id;
              return (
                <li key={o.id} className="border border-border/60 bg-card transition hover:shadow-sm">
                  <button
                    type="button"
                    onClick={() => setExpandedOrder(expanded ? null : o.id)}
                    className="flex w-full flex-wrap items-center justify-between gap-3 px-6 py-5 text-left"
                  >
                    <div className="flex items-center gap-4">
                      <Package className="h-5 w-5 text-accent" />
                      <div>
                        <span className="font-mono text-xs text-muted-foreground">#{o.id.slice(0, 8)}</span>
                        <span className="ml-3 font-serif text-base">{formatPKR(o.total)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <OrderTimeline status={o.status} />
                      <span className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</span>
                    </div>
                  </button>

                  {expanded && (
                    <div className="border-t border-border/60 px-6 py-5 animate-fade-in">
                      <h4 className="text-[10px] uppercase tracking-luxe text-muted-foreground">Items</h4>
                      <ul className="mt-3 space-y-2 text-sm">
                        {o.order_items.map((item, idx) => (
                          <li key={idx} className="flex items-center justify-between">
                            <span>
                              {item.name_snapshot}
                              {item.color && <span className="text-muted-foreground"> · {item.color}</span>}
                              {item.size && <span className="text-muted-foreground"> · {item.size}</span>}
                              <span className="text-muted-foreground"> × {item.qty}</span>
                            </span>
                            <span>{formatPKR(Number(item.price_snapshot) * item.qty)}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-4 flex items-baseline justify-between border-t border-border/60 pt-3">
                        <span className="text-xs uppercase tracking-luxe text-muted-foreground">Total</span>
                        <span className="font-serif text-xl">{formatPKR(o.total)}</span>
                      </div>

                      {/* Payment Actions */}
                      <div className="mt-4 flex flex-wrap gap-3 border-t border-border/60 pt-4">
                        {o.status === "pending" && (
                          <Link
                            to="/pay/$orderId"
                            params={{ orderId: o.id }}
                            className="btn-gold inline-flex items-center gap-2 px-5 py-2.5 text-xs uppercase tracking-luxe"
                          >
                            <CreditCard className="h-3.5 w-3.5" /> Pay 20% Advance
                          </Link>
                        )}
                        <Link
                          to="/track-order/$orderId"
                          params={{ orderId: o.id }}
                          className="inline-flex items-center gap-2 border border-border px-5 py-2.5 text-xs uppercase tracking-luxe transition hover:border-foreground"
                        >
                          <Package className="h-3.5 w-3.5" /> Track Order
                        </Link>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </SiteLayout>
  );
}
