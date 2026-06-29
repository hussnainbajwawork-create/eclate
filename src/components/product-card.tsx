import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import type { Product } from "@/lib/db";
import { formatPKR } from "@/lib/format";
import { useWishlist } from "@/lib/wishlist";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { has, toggle } = useWishlist();
  const wished = has(product.id);
  const img = product.images[0]?.url ?? "https://images.unsplash.com/photo-1559563458-527698bf5295?auto=format&fit=crop&w=900&q=80";

  return (
    <article className="group animate-fade-up" style={{ animationDelay: `${index * 60}ms` }}>
      <div className="relative">
        <Link to="/collections/$productId" params={{ productId: product.slug }} className="block">
          <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
            <img
              src={img}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
            />
            {product.is_new && (
              <span className="absolute left-3 top-3 bg-background/90 px-2 py-1 text-[10px] uppercase tracking-luxe">
                New
              </span>
            )}
            {product.stock === "sold_out" && (
              <span className="absolute right-3 top-3 bg-foreground/90 px-2 py-1 text-[10px] uppercase tracking-luxe text-background">
                Sold Out
              </span>
            )}
            <div className="absolute inset-x-3 bottom-3 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
              <span className="block w-full bg-foreground py-3 text-center text-[11px] uppercase tracking-luxe text-background">
                View Piece
              </span>
            </div>
          </div>
        </Link>
        <button
          onClick={(e) => {
            e.preventDefault();
            toggle(product.id);
          }}
          aria-label="Toggle wishlist"
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur transition hover:bg-background"
        >
          <Heart className={`h-3.5 w-3.5 ${wished ? "fill-current text-accent" : ""}`} />
        </button>
      </div>
      <Link to="/collections/$productId" params={{ productId: product.slug }} className="block">
        <div className="mt-5 flex items-baseline justify-between">
          <h3 className="font-serif text-lg">{product.name}</h3>
          <span className="text-xs text-muted-foreground">{formatPKR(product.price)}</span>
        </div>
      </Link>
      <div className="mt-3 flex gap-1.5">
        {product.colors.map((c) => (
          <span
            key={c.id}
            title={c.name}
            className="h-3.5 w-3.5 rounded-full border border-border"
            style={{ backgroundColor: c.hex }}
          />
        ))}
      </div>
    </article>
  );
}
