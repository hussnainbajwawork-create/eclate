import { createFileRoute, Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { SiteLayout } from "@/components/site-layout";
import { products, formatPKR, type Category } from "@/lib/products";

export const Route = createFileRoute("/collections")({
  head: () => ({
    meta: [
      { title: "Collections — ÉCLAT" },
      { name: "description", content: "Browse the ÉCLAT collection — totes, shoulder bags, crossbodies and mini bags handcrafted in Pakistan." },
      { property: "og:title", content: "Collections — ÉCLAT" },
      { property: "og:description", content: "Totes, shoulder bags, crossbodies and mini bags." },
    ],
  }),
  component: CollectionsPage,
});

const filters: ("All" | Category)[] = ["All", "Tote", "Shoulder", "Crossbody", "Mini"];
const sortOptions = ["New Arrivals", "Price: Low to High", "Price: High to Low"] as const;

function CollectionsPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [sort, setSort] = useState<(typeof sortOptions)[number]>("New Arrivals");
  const [query, setQuery] = useState("");

  const list = useMemo(() => {
    let l = products.filter((p) => filter === "All" || p.category === filter);
    if (query.trim()) {
      const q = query.toLowerCase();
      l = l.filter((p) => p.name.toLowerCase().includes(q));
    }
    if (sort === "Price: Low to High") l = [...l].sort((a, b) => a.price - b.price);
    else if (sort === "Price: High to Low") l = [...l].sort((a, b) => b.price - a.price);
    else l = [...l].sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew));
    return l;
  }, [filter, sort, query]);

  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-6 pt-16 pb-10 text-center">
        <span className="text-xs uppercase tracking-luxe text-muted-foreground">Autumn / Winter</span>
        <h1 className="mt-4 font-serif text-5xl md:text-6xl">The Collection</h1>
        <p className="mx-auto mt-5 max-w-xl text-sm text-muted-foreground">
          Eight pieces, hand-finished in our Lahore atelier. Full-grain leather, brass hardware.
        </p>
      </section>

      {/* Toolbar */}
      <section className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-6 border-y border-border/60 py-5 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs uppercase tracking-luxe">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`transition link-underline ${
                  filter === f ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {f === "All" ? "All" : `${f} Bags`}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                className="w-full border border-border bg-transparent py-2 pl-9 pr-4 text-xs uppercase tracking-luxe placeholder:text-muted-foreground focus:border-accent focus:outline-none sm:w-56"
              />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="border border-border bg-transparent py-2 px-3 text-xs uppercase tracking-luxe focus:border-accent focus:outline-none"
            >
              {sortOptions.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((p, i) => (
            <article
              key={p.id}
              className="group animate-fade-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <Link
                to="/collections/$productId"
                params={{ productId: p.id }}
                className="block"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                  />
                  {p.isNew && (
                    <span className="absolute left-3 top-3 bg-background/90 px-2 py-1 text-[10px] uppercase tracking-luxe text-foreground">
                      New
                    </span>
                  )}
                  <div className="absolute inset-x-3 bottom-3 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <span className="block w-full bg-foreground py-3 text-center text-[11px] uppercase tracking-luxe text-background">
                      View Piece
                    </span>
                  </div>
                </div>
                <div className="mt-5 flex items-baseline justify-between">
                  <h3 className="font-serif text-lg">{p.name}</h3>
                  <span className="text-xs text-muted-foreground">{formatPKR(p.price)}</span>
                </div>
              </Link>
              <div className="mt-3 flex gap-1.5">
                {p.colors.map((c) => (
                  <span
                    key={c.name}
                    title={c.name}
                    className="h-3.5 w-3.5 rounded-full border border-border"
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </article>
          ))}
        </div>

        {list.length === 0 && (
          <p className="py-24 text-center text-sm text-muted-foreground">No pieces match your search.</p>
        )}
      </section>
    </SiteLayout>
  );
}
