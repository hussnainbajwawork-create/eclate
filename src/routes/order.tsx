import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { z } from "zod";
import { SiteLayout } from "@/components/site-layout";
import { products, formatPKR } from "@/lib/products";

const search = z.object({ product: z.string().optional() });

export const Route = createFileRoute("/order")({
  validateSearch: search,
  head: () => ({
    meta: [
      { title: "Order — ÉCLAT" },
      { name: "description", content: "Place your ÉCLAT order. Cash on Delivery, Bank Transfer, JazzCash and Easypaisa supported across Pakistan." },
      { property: "og:title", content: "Order — ÉCLAT" },
      { property: "og:description", content: "A discreet, considered checkout for the ÉCLAT maison." },
    ],
  }),
  component: OrderPage,
});

const payments = ["Cash on Delivery", "Bank Transfer", "JazzCash", "Easypaisa"] as const;

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-luxe text-muted-foreground">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

const inputCls =
  "w-full border-0 border-b border-border bg-transparent py-2.5 text-sm focus:border-accent focus:outline-none focus:ring-0";

function OrderPage() {
  const { product: prefilled } = Route.useSearch();
  const [productId, setProductId] = useState(prefilled ?? products[0].id);
  const [qty, setQty] = useState(1);
  const [payment, setPayment] = useState<typeof payments[number]>("Cash on Delivery");
  const [submitted, setSubmitted] = useState(false);
  const [color, setColor] = useState("");

  const product = useMemo(() => products.find((p) => p.id === productId) ?? products[0], [productId]);
  const total = product.price * qty;

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (submitted) {
    return (
      <SiteLayout>
        <section className="mx-auto flex max-w-2xl flex-col items-center px-6 py-32 text-center animate-fade-up">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-accent text-accent">
            <Check className="h-7 w-7" />
          </div>
          <h1 className="mt-8 font-serif text-4xl md:text-5xl">Merci.</h1>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
            Thank you for choosing ÉCLAT. Your order has been received and our team
            will contact you shortly to confirm the details.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-10 text-xs uppercase tracking-luxe link-underline"
          >
            Place another order
          </button>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="mx-auto max-w-3xl px-6 pt-16 pb-10 text-center">
        <span className="text-xs uppercase tracking-luxe text-muted-foreground">Checkout</span>
        <h1 className="mt-4 font-serif text-5xl md:text-6xl">Place Your Order</h1>
        <p className="mx-auto mt-5 max-w-lg text-sm text-muted-foreground">
          Complete the form below and a member of our atelier will be in touch
          within 24 hours.
        </p>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-32">
        <form
          onSubmit={onSubmit}
          className="border border-border/60 bg-card p-8 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.25)] md:p-14 animate-fade-up"
        >
          <h2 className="font-serif text-2xl">Your Details</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <Field label="Full Name"><input required className={inputCls} /></Field>
            <Field label="Phone Number"><input required type="tel" className={inputCls} /></Field>
            <Field label="Email Address"><input required type="email" className={inputCls} /></Field>
            <Field label="City"><input required className={inputCls} /></Field>
            <div className="md:col-span-2">
              <Field label="Address"><input required className={inputCls} /></Field>
            </div>
          </div>

          <h2 className="mt-14 font-serif text-2xl">Your Piece</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <Field label="Select Product">
              <select value={productId} onChange={(e) => setProductId(e.target.value)} className={inputCls}>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} — {formatPKR(p.price)}</option>
                ))}
              </select>
            </Field>
            <Field label="Color Preference">
              <select value={color} onChange={(e) => setColor(e.target.value)} className={inputCls}>
                <option value="">Select a colour</option>
                {product.colors.map((c) => <option key={c.name}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="Quantity">
              <input
                type="number"
                min={1}
                value={qty}
                onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
                className={inputCls}
              />
            </Field>
            <Field label="Delivery Notes">
              <input placeholder="Optional" className={inputCls} />
            </Field>
          </div>

          <h2 className="mt-14 font-serif text-2xl">Payment Method</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {payments.map((p) => (
              <label
                key={p}
                className={`flex cursor-pointer items-center gap-3 border p-4 text-sm transition ${
                  payment === p ? "border-accent bg-accent/5" : "border-border hover:border-foreground/40"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value={p}
                  checked={payment === p}
                  onChange={() => setPayment(p)}
                  className="accent-[color:var(--gold)]"
                />
                {p}
              </label>
            ))}
          </div>

          {/* Order Summary */}
          <div className="mt-14 border-t border-border/60 pt-8">
            <h2 className="font-serif text-2xl">Order Summary</h2>
            <div className="mt-6 flex items-center gap-5">
              <div className="h-20 w-20 shrink-0 overflow-hidden bg-secondary">
                <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="truncate font-serif text-lg">{product.name}</h3>
                  <span className="text-sm text-muted-foreground">{formatPKR(product.price)}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Quantity · {qty}{color && ` · ${color}`}</p>
              </div>
            </div>
            <div className="mt-6 flex items-baseline justify-between border-t border-border/60 pt-6">
              <span className="text-xs uppercase tracking-luxe text-muted-foreground">Total</span>
              <span className="font-serif text-2xl">{formatPKR(total)}</span>
            </div>
          </div>

          <button
            type="submit"
            className="btn-gold mt-10 w-full py-5 text-xs uppercase tracking-luxe"
          >
            Place Order
          </button>
          <p className="mt-4 text-center text-[11px] text-muted-foreground">
            Complimentary delivery on orders above PKR 10,000.
          </p>
        </form>
      </section>
    </SiteLayout>
  );
}
