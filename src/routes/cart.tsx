import { createFileRoute, Link } from "@tanstack/react-router";
import { Trash2, ChevronLeft } from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { useCart, cartKey } from "@/lib/cart";
import { formatPKR } from "@/lib/format";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Cart — ÉCLAT" }] }),
  component: Cart,
});

function Cart() {
  const { items, remove, setQty, subtotal } = useCart();

  return (
    <SiteLayout>
      <section className="mx-auto max-w-5xl px-6 pt-16 pb-24">
        <Link to="/shop" className="inline-flex items-center gap-1 text-[11px] uppercase tracking-luxe text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-3 w-3" /> Continue Shopping
        </Link>
        <h1 className="mt-6 font-serif text-5xl md:text-6xl">Your Bag</h1>

        {items.length === 0 ? (
          <div className="mt-16 border border-border/60 bg-card p-16 text-center">
            <p className="text-sm text-muted-foreground">Your bag is empty.</p>
            <Link to="/shop" className="mt-6 inline-block btn-gold px-8 py-4 text-xs uppercase tracking-luxe">
              Discover the Maison
            </Link>
          </div>
        ) : (
          <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_360px]">
            <ul className="divide-y divide-border/60 border-y border-border/60">
              {items.map((it) => {
                const k = cartKey(it);
                return (
                  <li key={k} className="flex gap-5 py-6">
                    <Link to="/collections/$productId" params={{ productId: it.slug }} className="block h-28 w-24 shrink-0 overflow-hidden bg-secondary">
                      <img src={it.image} alt={it.name} className="h-full w-full object-cover" />
                    </Link>
                    <div className="flex-1">
                      <div className="flex items-baseline justify-between gap-3">
                        <Link to="/collections/$productId" params={{ productId: it.slug }} className="font-serif text-lg link-underline">
                          {it.name}
                        </Link>
                        <span className="text-sm text-muted-foreground">{formatPKR(it.price)}</span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {[it.color, it.size].filter(Boolean).join(" · ")}
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center border border-border">
                          <button onClick={() => setQty(k, it.qty - 1)} className="px-3 py-1.5">−</button>
                          <span className="min-w-[2rem] text-center text-sm">{it.qty}</span>
                          <button onClick={() => setQty(k, it.qty + 1)} className="px-3 py-1.5">+</button>
                        </div>
                        <button onClick={() => remove(k)} aria-label="Remove" className="text-muted-foreground hover:text-foreground">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <aside className="h-fit border border-border/60 bg-card p-8">
              <h2 className="font-serif text-2xl">Order Summary</h2>
              <dl className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd>{formatPKR(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Delivery</dt>
                  <dd>{subtotal === 0 ? "—" : formatPKR(250)}</dd>
                </div>
              </dl>
              <div className="mt-6 flex items-baseline justify-between border-t border-border/60 pt-4">
                <span className="text-xs uppercase tracking-luxe text-muted-foreground">Total</span>
                <span className="font-serif text-2xl">{formatPKR(subtotal + (subtotal === 0 ? 0 : 250))}</span>
              </div>
              <Link to="/checkout" className="btn-gold mt-8 block w-full py-4 text-center text-xs uppercase tracking-luxe">
                Checkout
              </Link>
            </aside>
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
