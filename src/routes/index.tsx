import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Star, MessageCircle } from "lucide-react";
import { SiteLayout } from "@/components/site-layout";
import { ProductCard } from "@/components/product-card";
import { useProducts } from "@/lib/db";
import { whatsappLink } from "@/lib/format";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ÉCLAT — Timeless Elegance, Crafted for Pakistan" },
      {
        name: "description",
        content:
          "ÉCLAT — a Pakistani maison of luxury handbags & shoes. Refined craftsmanship, contemporary design, everyday elegance.",
      },
      { property: "og:title", content: "ÉCLAT — Luxury Handbags" },
      { property: "og:description", content: "Timeless Elegance, Crafted for Pakistan." },
      {
        property: "og:image",
        content:
          "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1600&q=80",
      },
    ],
  }),
  component: Home,
});

const testimonials = [
  { name: "Hira A.", city: "Lahore", text: "The craftsmanship is unmatched. My Aurora Tote feels heirloom-quality.", rating: 5 },
  { name: "Sana M.", city: "Karachi", text: "Elegant, understated and beautifully made. ÉCLAT has become my signature.", rating: 5 },
  { name: "Mahnoor R.", city: "Islamabad", text: "The Noire Crossbody is the most luxurious bag I own. Simply exquisite.", rating: 5 },
];

function Home() {
  const { data: products = [], isLoading } = useProducts();
  const featured = products.slice(0, 3);
  const newArrivals = products.filter((p) => p.is_new).slice(0, 4);

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative h-[88vh] min-h-[640px] w-full overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1591348122449-02525d70379b?auto=format&fit=crop&w=2000&q=80"
          alt="ÉCLAT luxury handbag"
          className="absolute inset-0 h-full w-full object-cover animate-ken-burns"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/50" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white animate-fade-up">
          <span className="text-xs uppercase tracking-luxe text-white/80">Maison ÉCLAT · Pakistan</span>
          <h1 className="mt-6 font-serif text-5xl leading-[1.05] md:text-7xl lg:text-8xl">
            Timeless Elegance,<br />Crafted for Pakistan.
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/80 md:text-base">
            A new house of leather, born of quiet luxury and contemporary form.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/shop"
              className="group inline-flex items-center justify-center gap-2 border border-white/80 px-8 py-4 text-xs uppercase tracking-luxe transition hover:bg-white hover:text-foreground"
            >
              Shop the Maison
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href={whatsappLink("Hello ÉCLAT, I'd like to place an order.")}
              target="_blank"
              rel="noreferrer"
              className="btn-gold inline-flex items-center justify-center gap-2 px-8 py-4 text-xs uppercase tracking-luxe"
            >
              <MessageCircle className="h-4 w-4" /> Order on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Category split */}
      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-24 md:grid-cols-2">
        {[
          {
            to: "/handbags",
            label: "Handbags",
            img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1400&q=80",
          },
          {
            to: "/shoes",
            label: "Shoes",
            img: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1400&q=80",
          },
        ].map((c) => (
          <Link
            key={c.to}
            to={c.to}
            className="group relative block aspect-[4/5] overflow-hidden bg-secondary md:aspect-[5/6]"
          >
            <img
              src={c.img}
              alt={c.label}
              className="h-full w-full object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/0" />
            <div className="absolute inset-x-0 bottom-0 p-8 text-white">
              <h3 className="font-serif text-3xl md:text-4xl">{c.label}</h3>
              <span className="mt-3 inline-flex items-center gap-2 text-xs uppercase tracking-luxe">
                Discover <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </Link>
        ))}
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="flex flex-col items-center text-center">
          <span className="text-xs uppercase tracking-luxe text-muted-foreground">The Edit</span>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl">Featured Pieces</h2>
          <div className="mt-6 h-px w-12 bg-accent" />
        </div>
        <div className="mt-16 grid gap-10 md:grid-cols-3">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="aspect-[4/5] animate-pulse bg-secondary" />
              ))
            : featured.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </section>

      {/* Brand Story */}
      <section className="relative overflow-hidden bg-secondary/60">
        <div className="mx-auto grid max-w-7xl gap-16 px-6 py-24 md:grid-cols-2 md:py-32">
          <div className="relative aspect-[4/5] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1559563458-527698bf5295?auto=format&fit=crop&w=1200&q=80"
              alt="Atelier"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-xs uppercase tracking-luxe text-muted-foreground">Our Story</span>
            <h2 className="mt-4 font-serif text-4xl leading-tight md:text-5xl">
              A maison rooted in <em className="text-accent">quiet</em> luxury.
            </h2>
            <p className="mt-8 max-w-md text-base leading-relaxed text-muted-foreground">
              ÉCLAT brings together refined craftsmanship and contemporary design, creating handbags and shoes that embody
              sophistication and everyday luxury for women across Pakistan.
            </p>
            <Link
              to="/about"
              className="mt-10 inline-flex w-fit items-center gap-2 text-xs uppercase tracking-luxe link-underline"
            >
              Discover the Maison <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* New arrivals */}
      {newArrivals.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-24">
          <div className="flex flex-col items-center text-center">
            <span className="text-xs uppercase tracking-luxe text-muted-foreground">Just In</span>
            <h2 className="mt-4 font-serif text-4xl md:text-5xl">New Arrivals</h2>
            <div className="mt-6 h-px w-12 bg-accent" />
          </div>
          <div className="mt-16 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {newArrivals.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-6 py-24 md:py-32">
        <div className="flex flex-col items-center text-center">
          <span className="text-xs uppercase tracking-luxe text-muted-foreground">Voices</span>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl">From Our Clientele</h2>
          <div className="mt-6 h-px w-12 bg-accent" />
        </div>
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <figure
              key={t.name}
              className="border border-border/60 bg-card p-8 text-center animate-fade-up"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <div className="flex justify-center gap-1 text-accent">
                {Array.from({ length: t.rating }).map((_, idx) => (
                  <Star key={idx} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
              <blockquote className="mt-6 font-serif text-lg italic leading-relaxed">"{t.text}"</blockquote>
              <figcaption className="mt-6 text-xs uppercase tracking-luxe text-muted-foreground">
                {t.name} · {t.city}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
