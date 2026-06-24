import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronLeft, Check, Truck, ShieldCheck, RotateCcw, ChevronLeft as ArrowLeft, ChevronRight as ArrowRight, X, ZoomIn, ZoomOut, Expand } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { SiteLayout } from "@/components/site-layout";
import { products, getProduct, formatPKR } from "@/lib/products";

export const Route = createFileRoute("/collections/$productId")({
  loader: ({ params }) => {
    const product = getProduct(params.productId);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.product;
    if (!p) return { meta: [{ title: "Product — ÉCLAT" }] };
    return {
      meta: [
        { title: `${p.name} — ÉCLAT` },
        { name: "description", content: `${p.name}. ${formatPKR(p.price)}. Handcrafted in Lahore from full-grain leather.` },
        { property: "og:title", content: `${p.name} — ÉCLAT` },
        { property: "og:description", content: `Handcrafted ${p.category.toLowerCase()} bag — ${formatPKR(p.price)}.` },
        { property: "og:image", content: p.image },
        { name: "twitter:image", content: p.image },
      ],
    };
  },
  notFoundComponent: () => (
    <SiteLayout>
      <section className="mx-auto max-w-xl px-6 py-32 text-center">
        <h1 className="font-serif text-4xl">Piece not found</h1>
        <p className="mt-4 text-sm text-muted-foreground">The bag you are looking for may have been retired.</p>
        <Link to="/collections" className="mt-8 inline-block text-xs uppercase tracking-luxe link-underline">
          Return to the Collection
        </Link>
      </section>
    </SiteLayout>
  ),
  errorComponent: ({ error }) => (
    <SiteLayout>
      <section className="mx-auto max-w-xl px-6 py-32 text-center">
        <h1 className="font-serif text-3xl">Something went wrong</h1>
        <p className="mt-4 text-sm text-muted-foreground">{error.message}</p>
      </section>
    </SiteLayout>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const gallery = product.gallery ?? [product.image];
  const [active, setActive] = useState(0);
  const [color, setColor] = useState(product.colors[0]);
  const [lightbox, setLightbox] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState<{ x: number; y: number } | null>(null);

  const related = products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4);

  const next = useCallback(() => {
    setActive((i) => (i + 1) % gallery.length);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [gallery.length]);

  const prev = useCallback(() => {
    setActive((i) => (i - 1 + gallery.length) % gallery.length);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [gallery.length]);

  const closeLightbox = useCallback(() => {
    setLightbox(false);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "+" || e.key === "=") setZoom((z) => Math.min(z + 0.5, 4));
      if (e.key === "-") setZoom((z) => Math.max(z - 0.5, 1));
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [lightbox, next, prev, closeLightbox]);

  const toggleZoom = () => {
    if (zoom > 1) {
      setZoom(1);
      setPan({ x: 0, y: 0 });
    } else {
      setZoom(2);
    }
  };

  return (
    <SiteLayout>
      <div className="mx-auto max-w-7xl px-6 pt-10">
        <nav className="flex items-center gap-2 text-[11px] uppercase tracking-luxe text-muted-foreground">
          <Link to="/collections" className="flex items-center gap-1 hover:text-foreground">
            <ChevronLeft className="h-3 w-3" /> Collection
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>
      </div>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 pt-8 pb-20 lg:grid-cols-2 lg:gap-16">
        {/* Gallery */}
        <div className="animate-fade-up">
          <button
            type="button"
            onClick={() => setLightbox(true)}
            className="group relative block aspect-[4/5] w-full overflow-hidden bg-secondary"
            aria-label="Open image lightbox"
          >
            <img
              key={active}
              src={gallery[active]}
              alt={`${product.name} — view ${active + 1}`}
              className="h-full w-full object-cover animate-fade-in transition-transform duration-[1200ms] ease-out group-hover:scale-105"
            />
            {product.isNew && (
              <span className="absolute left-4 top-4 bg-background/90 px-3 py-1 text-[10px] uppercase tracking-luxe">
                New
              </span>
            )}
            <span className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center bg-background/80 text-foreground opacity-0 backdrop-blur transition group-hover:opacity-100">
              <Expand className="h-4 w-4" />
            </span>
          </button>
          <div className="mt-4 grid grid-cols-4 gap-3">
            {gallery.map((src: string, i: number) => (
              <button
                key={src + i}
                onClick={() => setActive(i)}
                className={`relative aspect-square overflow-hidden bg-secondary transition ${
                  active === i ? "ring-1 ring-accent ring-offset-2 ring-offset-background" : "opacity-70 hover:opacity-100"
                }`}
                aria-label={`View ${i + 1}`}
              >
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="animate-fade-up lg:sticky lg:top-28 lg:self-start" style={{ animationDelay: "120ms" }}>
          <span className="text-xs uppercase tracking-luxe text-muted-foreground">{product.category}</span>
          <h1 className="mt-3 font-serif text-4xl md:text-5xl">{product.name}</h1>
          <p className="mt-4 font-serif text-2xl text-accent">{formatPKR(product.price)}</p>

          <p className="mt-8 text-sm leading-relaxed text-muted-foreground">{product.description}</p>

          {/* Color */}
          <div className="mt-10">
            <div className="flex items-baseline justify-between">
              <span className="text-[10px] uppercase tracking-luxe text-muted-foreground">Colour</span>
              <span className="text-xs">{color.name}</span>
            </div>
            <div className="mt-3 flex gap-3">
              {product.colors.map((c: { name: string; hex: string }) => {
                const selected = c.name === color.name;
                return (
                  <button
                    key={c.name}
                    onClick={() => setColor(c)}
                    aria-label={c.name}
                    className={`relative h-9 w-9 rounded-full border transition ${
                      selected ? "border-accent" : "border-border hover:border-foreground/40"
                    }`}
                  >
                    <span
                      className="absolute inset-1 rounded-full"
                      style={{ backgroundColor: c.hex }}
                    />
                    {selected && (
                      <Check
                        className="absolute inset-0 m-auto h-3.5 w-3.5"
                        style={{ color: c.hex === "#111111" ? "#fff" : "#111" }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/order"
              search={{ product: product.id }}
              className="btn-gold flex-1 py-5 text-center text-xs uppercase tracking-luxe"
            >
              Order Now
            </Link>
            <Link
              to="/collections"
              className="flex-1 border border-border py-5 text-center text-xs uppercase tracking-luxe transition hover:border-foreground"
            >
              Continue Browsing
            </Link>
          </div>

          {/* Reassurance */}
          <ul className="mt-10 grid grid-cols-1 gap-4 border-t border-border/60 pt-8 text-xs text-muted-foreground sm:grid-cols-3">
            <li className="flex items-center gap-2"><Truck className="h-4 w-4 text-accent" /> Free delivery PKR 10k+</li>
            <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-accent" /> Lifetime craftsmanship</li>
            <li className="flex items-center gap-2"><RotateCcw className="h-4 w-4 text-accent" /> 14-day exchange</li>
          </ul>

          {/* Details */}
          <div className="mt-10 border-t border-border/60 pt-8">
            <h2 className="text-[10px] uppercase tracking-luxe text-muted-foreground">The Details</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {product.details?.map((d: string) => (
                <li key={d} className="flex gap-3">
                  <span className="mt-2 h-px w-4 bg-accent" />
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pb-24">
          <div className="flex items-baseline justify-between border-t border-border/60 pt-10">
            <h2 className="font-serif text-2xl md:text-3xl">You may also love</h2>
            <Link to="/collections" className="text-xs uppercase tracking-luxe link-underline">View all</Link>
          </div>
          <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <Link
                key={p.id}
                to="/collections/$productId"
                params={{ productId: p.id }}
                className="group block"
              >
                <div className="aspect-[4/5] overflow-hidden bg-secondary">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                  />
                </div>
                <div className="mt-4 flex items-baseline justify-between">
                  <h3 className="font-serif text-base">{p.name}</h3>
                  <span className="text-xs text-muted-foreground">{formatPKR(p.price)}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </SiteLayout>
  );
}
