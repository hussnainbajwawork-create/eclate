import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, Trash2 } from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { ProductCard } from "@/components/product-card";
import { useProducts } from "@/lib/db";
import { useWishlist } from "@/lib/wishlist";

export const Route = createFileRoute("/wishlist")({
  head: () => ({ meta: [{ title: "Wishlist — ÉCLAT" }] }),
  component: Wishlist,
});

function Wishlist() {
  const { ids, clear } = useWishlist();
  const { data: products = [] } = useProducts();
  const items = products.filter((p) => ids.includes(p.id));

  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-6 pt-16 pb-24">
        <Link to="/shop" className="inline-flex items-center gap-1 text-[11px] uppercase tracking-luxe text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-3 w-3" /> Continue Shopping
        </Link>
        <div className="mt-6 flex items-end justify-between">
          <h1 className="font-serif text-5xl md:text-6xl">Wishlist</h1>
          {items.length > 0 && (
            <button onClick={clear} className="flex items-center gap-2 text-xs uppercase tracking-luxe text-muted-foreground link-underline">
              <Trash2 className="h-3.5 w-3.5" /> Clear
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <p className="mt-16 border border-border/60 bg-card p-16 text-center text-sm text-muted-foreground">
            Your wishlist is empty. Mark pieces you love with the heart.
          </p>
        ) : (
          <div className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
