import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Check, CreditCard, ShieldCheck } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site-layout";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth-context";
import { formatPKR, STORE_PAYMENT_INFO } from "@/lib/format";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — ÉCLAT" }] }),
  component: Checkout,
});

const inputCls = "w-full border-0 border-b border-border bg-transparent py-2.5 text-sm focus:border-accent focus:outline-none focus:ring-0";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-luxe text-muted-foreground">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

function Checkout() {
  const { items, subtotal, clear } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<{ orderId: string; total: number; halfAmount: number } | null>(null);

  const delivery = subtotal >= 10000 || subtotal === 0 ? 0 : 300;
  const total = subtotal + delivery;
  const halfAmount = Math.ceil(total / 2);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Your bag is empty");
      return;
    }
    if (!user) {
      toast.error("Please sign in to place an order");
      navigate({ to: "/auth" });
      return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData(e.currentTarget);
      const customer_name = String(fd.get("name") ?? "");
      const phone = String(fd.get("phone") ?? "");
      const email = String(fd.get("email") ?? "") || null;
      const address = String(fd.get("address") ?? "");
      const city = String(fd.get("city") ?? "");
      const notes = String(fd.get("notes") ?? "") || null;

      const { data: order, error } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          customer_name,
          phone,
          email,
          address,
          city,
          notes,
          total,
          status: "pending",
        })
        .select()
        .single();
      if (error) throw error;

      const itemRows = items.map((i) => ({
        order_id: order.id,
        product_id: i.productId,
        name_snapshot: i.name,
        price_snapshot: i.price,
        qty: i.qty,
        color: i.color ?? null,
        size: i.size ?? null,
      }));
      const { error: itemsError } = await supabase.from("order_items").insert(itemRows);
      if (itemsError) throw itemsError;

      clear();
      setDone({ orderId: order.id, total, halfAmount });
    } catch (err: any) {
      console.error(err);
      toast.error(err.message ?? "Could not place order");
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Success screen: Order placed, pay 50% ── */
  if (done) {
    return (
      <SiteLayout>
        <section className="mx-auto flex max-w-2xl flex-col items-center px-6 py-32 text-center animate-fade-up">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-accent text-accent">
            <Check className="h-7 w-7" />
          </div>
          <h1 className="mt-8 font-serif text-4xl md:text-5xl">Order Placed</h1>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
            Your order has been received. Order ID:{" "}
            <span className="font-mono text-foreground">#{done.orderId.slice(0, 8)}</span>.
            To confirm your order, please pay <strong className="text-foreground">{formatPKR(done.halfAmount)}</strong> (50% advance).
          </p>

          {/* Bank details card */}
          <div className="mt-10 w-full max-w-md border border-border/60 bg-card p-6 text-left">
            <h3 className="flex items-center gap-2 text-xs uppercase tracking-luxe text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5" /> Payment Details
            </h3>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">Bank</dt><dd className="font-medium">{STORE_PAYMENT_INFO.bankName}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Account Title</dt><dd className="font-medium">{STORE_PAYMENT_INFO.accountTitle}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Account No.</dt><dd className="font-mono text-xs">{STORE_PAYMENT_INFO.accountNumber}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">IBAN</dt><dd className="font-mono text-xs">{STORE_PAYMENT_INFO.iban}</dd></div>
              <div className="mt-3 border-t border-border/60 pt-3">
                <div className="flex justify-between"><dt className="text-muted-foreground">JazzCash</dt><dd className="font-mono text-xs">{STORE_PAYMENT_INFO.jazzcash}</dd></div>
              </div>
              <div className="flex justify-between"><dt className="text-muted-foreground">EasyPaisa</dt><dd className="font-mono text-xs">{STORE_PAYMENT_INFO.easypaisa}</dd></div>
            </dl>
            <div className="mt-4 flex items-baseline justify-between border-t border-border/60 pt-4">
              <span className="text-xs uppercase tracking-luxe text-muted-foreground">Amount Due (50%)</span>
              <span className="font-serif text-2xl text-accent">{formatPKR(done.halfAmount)}</span>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => navigate({ to: "/pay/$orderId", params: { orderId: done.orderId } })}
              className="btn-gold inline-flex items-center gap-2 px-8 py-4 text-xs uppercase tracking-luxe"
            >
              <CreditCard className="h-4 w-4" /> Submit Payment Proof
            </button>
            <button
              onClick={() => navigate({ to: "/account" })}
              className="border border-border px-6 py-4 text-xs uppercase tracking-luxe link-underline"
            >
              Go to My Account
            </button>
          </div>
        </section>
      </SiteLayout>
    );
  }

  /* ── Checkout form ── */
  return (
    <SiteLayout>
      <section className="mx-auto max-w-3xl px-6 pt-16 pb-10 text-center">
        <span className="text-xs uppercase tracking-luxe text-muted-foreground">Checkout</span>
        <h1 className="mt-4 font-serif text-5xl md:text-6xl">Place Your Order</h1>
        <p className="mx-auto mt-5 max-w-lg text-sm text-muted-foreground">
          Confirm your details and place your order. You'll pay 50% advance after placing the order.
        </p>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-32">
        {items.length === 0 && (
          <div className="mb-8 border border-border/60 bg-card p-6 text-center text-sm">
            Your bag is empty. <Link to="/shop" className="link-underline">Shop the collection.</Link>
          </div>
        )}

        {!user && (
          <div className="mb-8 border border-amber-300/50 bg-amber-50 p-5 text-center text-sm dark:border-amber-700/50 dark:bg-amber-900/20">
            <p>Please <Link to="/auth" className="link-underline font-medium">sign in</Link> to place an order. We need your account to track your orders.</p>
          </div>
        )}

        <form onSubmit={onSubmit} className="border border-border/60 bg-card p-8 md:p-14 animate-fade-up">
          <h2 className="font-serif text-2xl">Your Details</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <Field label="Full Name"><input name="name" required className={inputCls} /></Field>
            <Field label="Phone Number"><input name="phone" required type="tel" className={inputCls} /></Field>
            <Field label="Email"><input name="email" type="email" defaultValue={user?.email ?? ""} className={inputCls} /></Field>
            <Field label="City"><input name="city" required className={inputCls} /></Field>
            <div className="md:col-span-2"><Field label="Address"><input name="address" required className={inputCls} /></Field></div>
            <div className="md:col-span-2"><Field label="Delivery Notes"><input name="notes" placeholder="Optional" className={inputCls} /></Field></div>
          </div>

          <h2 className="mt-12 font-serif text-2xl">Order Summary</h2>
          <ul className="mt-6 divide-y divide-border/60 border-y border-border/60">
            {items.map((i) => (
              <li key={i.productId + i.color + i.size} className="flex items-center justify-between py-4 text-sm">
                <span>
                  {i.name}
                  <span className="ml-2 text-xs text-muted-foreground">× {i.qty}</span>
                </span>
                <span>{formatPKR(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{formatPKR(subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Delivery</dt><dd>{delivery === 0 ? "Complimentary" : formatPKR(delivery)}</dd></div>
            <div className="mt-3 flex items-baseline justify-between border-t border-border/60 pt-3">
              <dt className="text-xs uppercase tracking-luxe text-muted-foreground">Total</dt>
              <dd className="font-serif text-2xl">{formatPKR(total)}</dd>
            </div>
            <div className="flex items-baseline justify-between">
              <dt className="text-xs uppercase tracking-luxe text-accent">50% Advance Payment</dt>
              <dd className="font-serif text-xl text-accent">{formatPKR(halfAmount)}</dd>
            </div>
          </dl>

          <button
            type="submit"
            disabled={submitting || items.length === 0 || !user}
            className="btn-gold mt-10 flex w-full items-center justify-center gap-2 py-5 text-xs uppercase tracking-luxe disabled:opacity-50"
          >
            <CreditCard className="h-4 w-4" /> {submitting ? "Placing…" : "Place Order"}
          </button>
          <p className="mt-4 text-center text-[11px] text-muted-foreground">
            After placing the order, you'll be asked to pay 50% advance ({formatPKR(halfAmount)}).
            Complimentary delivery on orders above PKR 10,000.
          </p>
        </form>
      </section>
    </SiteLayout>
  );
}
