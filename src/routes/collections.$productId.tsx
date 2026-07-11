import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ChevronLeft, Check, Truck, ShieldCheck, RotateCcw,
  ChevronLeft as ArrowLeft, ChevronRight as ArrowRight,
  X, ZoomIn, ZoomOut, Expand, Heart, MessageCircle, ShoppingBag,
  Share2, Copy, ChevronDown, Ruler, Clock,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site-layout";
import { ProductCard } from "@/components/product-card";
import { useProduct, useProducts } from "@/lib/db";
import { formatPKR } from "@/lib/format";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";

export const Route = createFileRoute("/collections/$productId")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.productId} — ÉCLAT` },
      { name: "description", content: `Discover ${params.productId} at ÉCLAT — handcrafted in Pakistan.` },
    ],
  }),
  component: ProductPage,
});

/* ─── Recently Viewed ─── */
const RECENTLY_VIEWED_KEY = "eclat-recently-viewed";
const MAX_RECENT = 8;

function addToRecentlyViewed(slug: string) {
  try {
    const raw = localStorage.getItem(RECENTLY_VIEWED_KEY);
    let items: string[] = raw ? JSON.parse(raw) : [];
    items = items.filter((s) => s !== slug);
    items.unshift(slug);
    if (items.length > MAX_RECENT) items = items.slice(0, MAX_RECENT);
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(items));
  } catch { }
}

function getRecentlyViewed(): string[] {
  try {
    const raw = localStorage.getItem(RECENTLY_VIEWED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/* ─── Accordion ─── */
function Accordion({
  title, children, defaultOpen = false,
}: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border/60">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-4 text-left text-[11px] uppercase tracking-luxe"
      >
        <span>{title}</span>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-[800px] pb-5" : "max-h-0"}`}>
        {children}
      </div>
    </div>
  );
}

/* ─── Size Guide Modal ─── */
function SizeGuide({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg border border-border bg-background p-8">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-2xl">Size Guide</h3>
          <button onClick={onClose} aria-label="Close"><X className="h-5 w-5" /></button>
        </div>

        <div className="mt-6">
          <h4 className="text-[10px] uppercase tracking-luxe text-muted-foreground">Shoes</h4>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border text-left text-[10px] uppercase tracking-luxe text-muted-foreground">
                <tr>
                  <th className="pb-2 pr-4">EU</th>
                  <th className="pb-2 pr-4">UK</th>
                  <th className="pb-2 pr-4">US</th>
                  <th className="pb-2">CM</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {[
                  [36, 3, 5.5, 22.5], [37, 4, 6.5, 23.5], [38, 5, 7.5, 24],
                  [39, 6, 8.5, 25], [40, 7, 9.5, 25.5], [41, 8, 10.5, 26.5],
                ].map(([eu, uk, us, cm]) => (
                  <tr key={eu}>
                    <td className="py-2 pr-4">{eu}</td>
                    <td className="py-2 pr-4">{uk}</td>
                    <td className="py-2 pr-4">{us}</td>
                    <td className="py-2">{cm}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8">
          <h4 className="text-[10px] uppercase tracking-luxe text-muted-foreground">Bags</h4>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border text-left text-[10px] uppercase tracking-luxe text-muted-foreground">
                <tr>
                  <th className="pb-2 pr-4">Size</th>
                  <th className="pb-2 pr-4">Width</th>
                  <th className="pb-2 pr-4">Height</th>
                  <th className="pb-2">Depth</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {[
                  ["Mini", "18 cm", "12 cm", "6 cm"],
                  ["Small", "22 cm", "16 cm", "8 cm"],
                  ["Standard", "30 cm", "22 cm", "12 cm"],
                  ["Large", "38 cm", "28 cm", "14 cm"],
                ].map(([size, w, h, d]) => (
                  <tr key={size}>
                    <td className="py-2 pr-4 font-serif">{size}</td>
                    <td className="py-2 pr-4">{w}</td>
                    <td className="py-2 pr-4">{h}</td>
                    <td className="py-2">{d}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          All measurements are approximate. For specific sizing questions, contact us on WhatsApp.
        </p>
      </div>
    </div>
  );
}

function ProductPage() {
  const { productId } = Route.useParams();
  const { data: product, isLoading } = useProduct(productId);
  const { data: allProducts = [] } = useProducts();
  const cart = useCart();
  const wishlist = useWishlist();
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const gallery = useMemo(
    () => product?.images.map((i) => i.url) ?? [],
    [product],
  );
  const [active, setActive] = useState(0);
  const [color, setColor] = useState<{ name: string; hex: string } | null>(null);
  const [size, setSize] = useState<string>("");
  const [qty, setQty] = useState(1);
  const [lightbox, setLightbox] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState<{ x: number; y: number } | null>(null);

  // Track recently viewed
  useEffect(() => {
    if (product) addToRecentlyViewed(product.slug);
  }, [product]);

  useEffect(() => {
    if (product) {
      setColor(product.colors[0] ?? null);
      setSize(product.sizes[0] ?? "");
      setActive(0);
    }
  }, [product]);

  const related = useMemo(
    () =>
      allProducts
        .filter((p) => product && p.id !== product.id && p.category_id === product.category_id)
        .slice(0, 4),
    [allProducts, product],
  );

  // Recently viewed products (excluding current)
  const recentSlugs = useMemo(() => {
    const slugs = getRecentlyViewed();
    return slugs.filter((s) => s !== productId);
  }, [productId]);
  const recentProducts = useMemo(
    () => recentSlugs.map((s) => allProducts.find((p) => p.slug === s)).filter(Boolean).slice(0, 4) as typeof allProducts,
    [recentSlugs, allProducts],
  );

  const next = useCallback(() => {
    if (!gallery.length) return;
    setActive((i) => (i + 1) % gallery.length);
    setZoom(1); setPan({ x: 0, y: 0 });
  }, [gallery.length]);

  const prev = useCallback(() => {
    if (!gallery.length) return;
    setActive((i) => (i - 1 + gallery.length) % gallery.length);
    setZoom(1); setPan({ x: 0, y: 0 });
  }, [gallery.length]);

  const closeLightbox = useCallback(() => {
    setLightbox(false);
    setZoom(1); setPan({ x: 0, y: 0 });
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

  if (isLoading) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-7xl px-6 py-32 text-center text-sm text-muted-foreground">Loading…</div>
      </SiteLayout>
    );
  }

  if (!product) {
    return (
      <SiteLayout>
        <section className="mx-auto max-w-xl px-6 py-32 text-center">
          <h1 className="font-serif text-4xl">Piece not found</h1>
          <p className="mt-4 text-sm text-muted-foreground">The piece you are looking for may have been retired.</p>
          <Link to="/shop" className="mt-8 inline-block text-xs uppercase tracking-luxe link-underline">
            Return to the Boutique
          </Link>
        </section>
      </SiteLayout>
    );
  }

  const wished = wishlist.has(product.id);
  const soldOut = product.stock === "sold_out";

  const handleAddToCart = () => {
    cart.add({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: gallery[0] ?? "",
      color: color?.name,
      size: size || undefined,
      qty,
    });
    toast.success(`${product.name} added to bag`);
  };

  const waMsg = `Hello ÉCLAT, I'd like to order: ${product.name}${color ? ` · ${color.name}` : ""}${size ? ` · ${size}` : ""
    } × ${qty}. Total ${formatPKR(product.price * qty)}.`;

  const toggleZoom = () => {
    if (zoom > 1) { setZoom(1); setPan({ x: 0, y: 0 }); } else { setZoom(2); }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard");
    setShareOpen(false);
  };

  const shareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(`Check out this piece from ÉCLAT: ${product.name} — ${window.location.href}`)}`, "_blank");
    setShareOpen(false);
  };

  return (
    <SiteLayout>
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-6 pt-10">
        <nav className="flex items-center gap-2 text-[11px] uppercase tracking-luxe text-muted-foreground">
          <Link to="/shop" className="flex items-center gap-1 transition hover:text-foreground">
            <ChevronLeft className="h-3 w-3" /> Shop
          </Link>
          {product.category && (
            <>
              <span>/</span>
              <Link to="/shop" search={{ cat: product.category.slug }} className="transition hover:text-foreground">
                {product.category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>
      </div>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 pt-8 pb-20 lg:grid-cols-2 lg:gap-16">
        {/* Gallery */}
        <div className="animate-fade-up">
          <button
            type="button"
            onClick={() => gallery.length > 0 && setLightbox(true)}
            className="group relative block aspect-[4/5] w-full overflow-hidden bg-secondary"
            aria-label="Open image lightbox"
          >
            {gallery[active] && (
              <img
                key={active}
                src={gallery[active]}
                alt={`${product.name} — view ${active + 1}`}
                className="h-full w-full object-cover animate-fade-in transition-transform duration-[1200ms] ease-out group-hover:scale-105"
              />
            )}
            {product.is_new && (
              <span className="absolute left-4 top-4 bg-background/90 px-3 py-1 text-[10px] uppercase tracking-luxe">New</span>
            )}
            {product.is_best_seller && (
              <span className="absolute left-4 top-4 bg-accent/90 px-3 py-1 text-[10px] uppercase tracking-luxe text-accent-foreground">
                {product.is_new ? "" : "Best Seller"}
              </span>
            )}
            <span className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center bg-background/80 text-foreground opacity-0 backdrop-blur transition group-hover:opacity-100">
              <Expand className="h-4 w-4" />
            </span>
          </button>
          {gallery.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-3">
              {gallery.map((src, i) => (
                <button
                  key={src + i}
                  onClick={() => setActive(i)}
                  className={`relative aspect-square overflow-hidden bg-secondary transition ${active === i ? "ring-1 ring-accent ring-offset-2 ring-offset-background" : "opacity-70 hover:opacity-100"
                    }`}
                  aria-label={`View ${i + 1}`}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="animate-fade-up lg:sticky lg:top-28 lg:self-start" style={{ animationDelay: "120ms" }}>
          {product.category && (
            <span className="text-xs uppercase tracking-luxe text-muted-foreground">{product.category.name}</span>
          )}
          <h1 className="mt-3 font-serif text-4xl md:text-5xl">{product.name}</h1>
          <p className="mt-4 font-serif text-2xl text-accent">{formatPKR(product.price)}</p>

          <div className="mt-3 text-xs uppercase tracking-luxe">
            {product.stock === "in_stock" && <span className="text-emerald-600">In Stock</span>}
            {product.stock === "low_stock" && <span className="text-amber-600">Only a few left</span>}
            {product.stock === "sold_out" && <span className="text-destructive">Sold Out</span>}
          </div>

          {product.description && (
            <p className="mt-8 text-sm leading-relaxed text-muted-foreground">{product.description}</p>
          )}

          {/* Color */}
          {product.colors.length > 0 && (
            <div className="mt-10">
              <div className="flex items-baseline justify-between">
                <span className="text-[10px] uppercase tracking-luxe text-muted-foreground">Colour</span>
                <span className="text-xs">{color?.name}</span>
              </div>
              <div className="mt-3 flex gap-3">
                {product.colors.map((c) => {
                  const selected = c.name === color?.name;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setColor({ name: c.name, hex: c.hex })}
                      aria-label={c.name}
                      className={`relative h-9 w-9 rounded-full border transition ${selected ? "border-accent" : "border-border hover:border-foreground/40"
                        }`}
                    >
                      <span className="absolute inset-1 rounded-full" style={{ backgroundColor: c.hex }} />
                      {selected && (
                        <Check
                          className="absolute inset-0 m-auto h-3.5 w-3.5"
                          style={{ color: c.hex === "#111111" || c.hex === "#000000" ? "#fff" : "#111" }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.sizes.length > 1 && (
            <div className="mt-8">
              <div className="flex items-baseline justify-between">
                <span className="text-[10px] uppercase tracking-luxe text-muted-foreground">Size</span>
                <button
                  onClick={() => setSizeGuideOpen(true)}
                  className="flex items-center gap-1 text-[10px] uppercase tracking-luxe text-muted-foreground link-underline"
                >
                  <Ruler className="h-3 w-3" /> Size Guide
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`min-w-[3rem] border px-3 py-2 text-xs uppercase tracking-luxe transition ${size === s ? "border-accent bg-accent/5" : "border-border hover:border-foreground/40"
                      }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Qty */}
          <div className="mt-8 flex items-center gap-6">
            <span className="text-[10px] uppercase tracking-luxe text-muted-foreground">Quantity</span>
            <div className="flex items-center border border-border">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-2 transition hover:bg-secondary">−</button>
              <span className="min-w-[2.5rem] text-center text-sm">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="px-3 py-2 transition hover:bg-secondary">+</button>
            </div>
          </div>

          {/* CTAs */}
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={handleAddToCart}
              disabled={soldOut}
              className="btn-gold flex flex-1 items-center justify-center gap-2 py-5 text-xs uppercase tracking-luxe disabled:opacity-50"
            >
              <ShoppingBag className="h-4 w-4" /> {soldOut ? "Sold Out" : "Add to Bag"}
            </button>
            <a
              href={`https://wa.me/923227505007?text=${encodeURIComponent(waMsg)}`}
              target="_blank"
              rel="noreferrer"
              className="flex flex-1 items-center justify-center gap-2 border border-border py-5 text-center text-xs uppercase tracking-luxe transition hover:border-foreground"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
            <button
              onClick={() => wishlist.toggle(product.id)}
              aria-label="Save to wishlist"
              className={`flex h-auto items-center justify-center border px-5 transition ${wished ? "border-accent text-accent" : "border-border hover:border-foreground"
                }`}
            >
              <Heart className={`h-4 w-4 ${wished ? "fill-current" : ""}`} />
            </button>
            <div className="relative">
              <button
                onClick={() => setShareOpen(!shareOpen)}
                aria-label="Share"
                className="flex h-full items-center justify-center border border-border px-5 transition hover:border-foreground"
              >
                <Share2 className="h-4 w-4" />
              </button>
              {shareOpen && (
                <div className="absolute right-0 top-full z-20 mt-2 w-48 border border-border bg-background p-2 shadow-lg animate-fade-in">
                  <button onClick={copyLink} className="flex w-full items-center gap-2 px-3 py-2 text-xs uppercase tracking-luxe transition hover:bg-secondary">
                    <Copy className="h-3 w-3" /> Copy Link
                  </button>
                  <button onClick={shareWhatsApp} className="flex w-full items-center gap-2 px-3 py-2 text-xs uppercase tracking-luxe transition hover:bg-secondary">
                    <MessageCircle className="h-3 w-3" /> WhatsApp
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Reassurance */}
          <ul className="mt-10 grid grid-cols-1 gap-4 border-t border-border/60 pt-8 text-xs text-muted-foreground sm:grid-cols-3">
            <li className="flex items-center gap-2"><Truck className="h-4 w-4 text-accent" /> Standard delivery PKR 250</li>
            <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-accent" /> Lifetime craftsmanship</li>
            <li className="flex items-center gap-2"><RotateCcw className="h-4 w-4 text-accent" /> 14-day exchange</li>
          </ul>

          {/* Accordion Details */}
          <div className="mt-8">
            {product.details.length > 0 && (
              <Accordion title="The Details" defaultOpen>
                <ul className="space-y-2 text-sm">
                  {product.details.map((d) => (
                    <li key={d} className="flex gap-3">
                      <span className="mt-2 h-px w-4 bg-accent" /> {d}
                    </li>
                  ))}
                </ul>
              </Accordion>
            )}

            {product.delivery_info && (
              <Accordion title="Delivery & Returns">
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>{product.delivery_info}</p>
                  <p>Standard delivery charges are PKR 250. Delivery takes 3-5 business days across Pakistan.</p>
                  <p>We accept exchanges within 14 days of delivery. Items must be unworn and in original packaging.</p>
                </div>
              </Accordion>
            )}

            <Accordion title="Care Instructions">
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Store in the provided dust bag when not in use.</p>
                <p>Avoid direct sunlight and moisture.</p>
                <p>Clean gently with a soft, dry cloth.</p>
                <p>For leather products, condition periodically with a suitable leather cream.</p>
              </div>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pb-16">
          <div className="flex items-baseline justify-between border-t border-border/60 pt-10">
            <h2 className="font-serif text-2xl md:text-3xl">You may also love</h2>
            <Link to="/shop" className="text-xs uppercase tracking-luxe link-underline">View all</Link>
          </div>
          <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Recently Viewed */}
      {recentProducts.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pb-24">
          <div className="flex items-baseline justify-between border-t border-border/60 pt-10">
            <h2 className="font-serif text-2xl md:text-3xl">
              <Clock className="mb-1 mr-2 inline h-5 w-5 text-muted-foreground" />
              Recently Viewed
            </h2>
          </div>
          <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {recentProducts.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Size Guide Modal */}
      {sizeGuideOpen && <SizeGuide onClose={() => setSizeGuideOpen(false)} />}

      {/* Lightbox */}
      {lightbox && gallery.length > 0 && (
        <div
          className="fixed inset-0 z-[100] flex flex-col bg-black/95 animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-label={`${product.name} gallery`}
        >
          <div className="flex items-center justify-between px-6 py-5 text-white">
            <span className="font-serif text-sm tracking-[0.3em]">
              {String(active + 1).padStart(2, "0")} / {String(gallery.length).padStart(2, "0")}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoom((z) => Math.max(z - 0.5, 1))}
                disabled={zoom <= 1}
                aria-label="Zoom out"
                className="flex h-10 w-10 items-center justify-center border border-white/20 text-white transition hover:bg-white/10 disabled:opacity-30"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <span className="w-12 text-center text-xs tracking-luxe text-white/70">{Math.round(zoom * 100)}%</span>
              <button
                onClick={() => setZoom((z) => Math.min(z + 0.5, 4))}
                disabled={zoom >= 4}
                aria-label="Zoom in"
                className="flex h-10 w-10 items-center justify-center border border-white/20 text-white transition hover:bg-white/10 disabled:opacity-30"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              <button
                onClick={closeLightbox}
                aria-label="Close"
                className="ml-2 flex h-10 w-10 items-center justify-center border border-white/20 text-white transition hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="relative flex flex-1 items-center justify-center overflow-hidden">
            <button onClick={prev} aria-label="Previous image" className="absolute left-4 z-10 flex h-12 w-12 items-center justify-center border border-white/20 text-white transition hover:bg-white/10 md:left-8">
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div
              className="flex h-full w-full items-center justify-center overflow-hidden"
              onMouseDown={(e) => { if (zoom <= 1) return; setDragging({ x: e.clientX - pan.x, y: e.clientY - pan.y }); }}
              onMouseMove={(e) => { if (!dragging) return; setPan({ x: e.clientX - dragging.x, y: e.clientY - dragging.y }); }}
              onMouseUp={() => setDragging(null)}
              onMouseLeave={() => setDragging(null)}
              style={{ cursor: zoom > 1 ? (dragging ? "grabbing" : "grab") : "zoom-in" }}
            >
              <img
                key={active}
                src={gallery[active]}
                alt={`${product.name} — view ${active + 1}`}
                onClick={(e) => { if (zoom > 1) return; e.stopPropagation(); toggleZoom(); }}
                draggable={false}
                className="max-h-[80vh] max-w-[85vw] select-none object-contain transition-transform duration-300 ease-out animate-fade-in"
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                  transitionDuration: dragging ? "0ms" : "300ms",
                }}
              />
            </div>

            <button onClick={next} aria-label="Next image" className="absolute right-4 z-10 flex h-12 w-12 items-center justify-center border border-white/20 text-white transition hover:bg-white/10 md:right-8">
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>

          <div className="flex justify-center gap-2 px-6 pb-6 pt-4">
            {gallery.map((src, i) => (
              <button
                key={src + i}
                onClick={() => { setActive(i); setZoom(1); setPan({ x: 0, y: 0 }); }}
                aria-label={`View ${i + 1}`}
                className={`h-16 w-16 overflow-hidden border transition ${active === i ? "border-accent" : "border-white/20 opacity-50 hover:opacity-100"
                  }`}
              >
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </SiteLayout>
  );
}
