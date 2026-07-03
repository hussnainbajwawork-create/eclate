import { Link } from "@tanstack/react-router";
import { Heart, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/db";
import { formatPKR } from "@/lib/format";
import { useWishlist } from "@/lib/wishlist";

export function ProductCard({
  product,
  index = 0,
  variant = "grid",
}: {
  product: Product;
  index?: number;
  variant?: "grid" | "list";
}) {
  const { has, toggle } = useWishlist();
  const wished = has(product.id);
  const img =
    product.images[0]?.url ??
    "https://images.unsplash.com/photo-1559563458-527698bf5295?auto=format&fit=crop&w=900&q=80";

  if (variant === "list") {
    return (
      <article
        className="group flex gap-5 border border-border/60 bg-card p-4 transition hover:shadow-md animate-fade-up"
        style={{ animationDelay: `${index * 40}ms` }}
      >
        <Link
          to="/collections/$productId"
          params={{ productId: product.slug }}
          className="relative block h-40 w-32 shrink-0 overflow-hidden bg-secondary"
        >
          <img
            src={img}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          {product.is_new && (
            <span className="absolute left-2 top-2 bg-background/90 px-2 py-0.5 text-[9px] uppercase tracking-luxe">
              New
            </span>
          )}
          {product.stock === "sold_out" && (
            <span className="absolute right-2 top-2 bg-foreground/90 px-2 py-0.5 text-[9px] uppercase tracking-luxe text-background">
              Sold Out
            </span>
          )}
        </Link>
        <div className="flex flex-1 flex-col justify-between py-1">
          <div>
            <Link
              to="/collections/$productId"
              params={{ productId: product.slug }}
              className="block"
            >
              <h3 className="font-serif text-xl transition group-hover:text-accent">
                {product.name}
              </h3>
            </Link>
            {product.category && (
              <span className="mt-1 block text-[10px] uppercase tracking-luxe text-muted-foreground">
                {product.category.name}
              </span>
            )}
            {product.description && (
              <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                {product.description}
              </p>
            )}
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-serif text-lg">{formatPKR(product.price)}</span>
              <div className="flex gap-1">
                {product.colors.slice(0, 5).map((c) => (
                  <span
                    key={c.id}
                    title={c.name}
                    className="h-3 w-3 rounded-full border border-border"
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                toggle(product.id);
              }}
              aria-label="Toggle wishlist"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-accent hover:text-accent"
            >
              <Heart
                className={`h-3.5 w-3.5 ${wished ? "fill-current text-accent" : ""}`}
              />
            </button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      className="group animate-fade-up"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="relative">
        <Link
          to="/collections/$productId"
          params={{ productId: product.slug }}
          className="block"
        >
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
            {product.is_best_seller && !product.is_new && (
              <span className="absolute left-3 top-3 bg-accent/90 px-2 py-1 text-[10px] uppercase tracking-luxe text-accent-foreground">
                Best Seller
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
          <Heart
            className={`h-3.5 w-3.5 ${wished ? "fill-current text-accent" : ""}`}
          />
        </button>
      </div>
      <Link
        to="/collections/$productId"
        params={{ productId: product.slug }}
        className="block"
      >
        <div className="mt-5 flex items-baseline justify-between">
          <h3 className="font-serif text-lg">{product.name}</h3>
          <span className="text-xs text-muted-foreground">
            {formatPKR(product.price)}
          </span>
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
