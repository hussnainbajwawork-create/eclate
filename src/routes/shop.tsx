import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { z } from "zod";
import { SiteLayout } from "@/components/site-layout";
import { ProductCard } from "@/components/product-card";
import { useCategories, useProducts, type Product } from "@/lib/db";

const search = z.object({
  q: z.string().optional(),
  cat: z.string().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  color: z.string().optional(),
});

export const Route = createFileRoute("/shop")({
  validateSearch: search,
  head: () => ({
    meta: [
      { title: "Shop — ÉCLAT" },
      { name: "description", content: "Shop the ÉCLAT collection — handbags & shoes, handcrafted in Pakistan." },
    ],
  }),
  component: Shop,
});

const sortOptions = ["Featured", "New Arrivals", "Price: Low to High", "Price: High to Low"] as const;

export function Shop({ restrictCategorySlug }: { restrictCategorySlug?: string } = {}) {
  const params = Route.useSearch();
  const navigate = Route.useNavigate();
  const { data: products = [], isLoading } = useProducts();
  const { data: categories = [] } = useCategories();
  const [sort, setSort] = useState<(typeof sortOptions)[number]>("Featured");

  const q = params.q ?? "";
  const activeCat = restrictCategorySlug ?? params.cat ?? "all";
  const min = params.min;
  const max = params.max;
  const color = params.color;

  const setSearch = (next: Partial<typeof params>) =>
    navigate({ search: { ...params, ...next } });

  const rootCategory = restrictCategorySlug ? categories.find((c) => c.slug === restrictCategorySlug) : null;
  const subcats = rootCategory
    ? categories.filter((c) => c.parent_id === rootCategory.id)
    : categories.filter((c) => c.parent_id === null);

  const allColors = useMemo(() => {
    const m = new Map<string, string>();
    products.forEach((p) => p.colors.forEach((c) => m.set(c.name, c.hex)));
    return Array.from(m.entries()).map(([name, hex]) => ({ name, hex }));
  }, [products]);

  const list = useMemo(() => {
    let l: Product[] = products;
    if (restrictCategorySlug && rootCategory) {
      const subIds = new Set([rootCategory.id, ...categories.filter((c) => c.parent_id === rootCategory.id).map((c) => c.id)]);
      l = l.filter((p) => p.category_id && subIds.has(p.category_id));
    }
    if (activeCat && activeCat !== "all") {
      const cat = categories.find((c) => c.slug === activeCat);
      if (cat) {
        const subIds = new Set([cat.id, ...categories.filter((c) => c.parent_id === cat.id).map((c) => c.id)]);
        l = l.filter((p) => p.category_id && subIds.has(p.category_id));
      }
    }
    if (q.trim()) {
      const ql = q.toLowerCase();
      l = l.filter((p) => p.name.toLowerCase().includes(ql) || p.description?.toLowerCase().includes(ql));
    }
    if (min !== undefined) l = l.filter((p) => p.price >= min);
    if (max !== undefined) l = l.filter((p) => p.price <= max);
    if (color) l = l.filter((p) => p.colors.some((c) => c.name === color));
    if (sort === "Price: Low to High") l = [...l].sort((a, b) => a.price - b.price);
    else if (sort === "Price: High to Low") l = [...l].sort((a, b) => b.price - a.price);
    else if (sort === "New Arrivals") l = [...l].sort((a, b) => Number(b.is_new) - Number(a.is_new));
    return l;
  }, [products, q, activeCat, min, max, color, sort, categories, restrictCategorySlug, rootCategory]);

  const heading = restrictCategorySlug
    ? rootCategory?.name ?? "Shop"
    : "The Collection";

  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-6 pt-16 pb-10 text-center">
        <span className="text-xs uppercase tracking-luxe text-muted-foreground">Autumn / Winter</span>
        <h1 className="mt-4 font-serif text-5xl md:text-6xl">{heading}</h1>
        <p className="mx-auto mt-5 max-w-xl text-sm text-muted-foreground">
          Hand-finished in our Lahore atelier. Full-grain leather, solid brass hardware.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-6 border-y border-border/60 py-5 md:flex-row md:items-center md:justify-between">
          {!restrictCategorySlug && (
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs uppercase tracking-luxe">
              <button
                onClick={() => setSearch({ cat: undefined })}
                className={`link-underline ${!params.cat ? "text-foreground" : "text-muted-foreground"}`}
              >
                All
              </button>
              {subcats.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSearch({ cat: c.slug })}
                  className={`link-underline ${params.cat === c.slug ? "text-foreground" : "text-muted-foreground"}`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setSearch({ q: e.target.value || undefined })}
                placeholder="Search"
                className="w-full border border-border bg-transparent py-2 pl-9 pr-4 text-xs uppercase tracking-luxe placeholder:text-muted-foreground focus:border-accent focus:outline-none sm:w-56"
              />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="border border-border bg-transparent py-2 px-3 text-xs uppercase tracking-luxe focus:border-accent focus:outline-none"
            >
              {sortOptions.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[220px_1fr]">
        <aside className="hidden text-xs uppercase tracking-luxe lg:block">
          <h3 className="text-muted-foreground">Price</h3>
          <div className="mt-3 flex flex-col gap-2">
            <input
              type="number"
              placeholder="Min PKR"
              value={min ?? ""}
              onChange={(e) => setSearch({ min: e.target.value ? Number(e.target.value) : undefined })}
              className="border border-border bg-transparent px-3 py-2 text-xs focus:border-accent focus:outline-none"
            />
            <input
              type="number"
              placeholder="Max PKR"
              value={max ?? ""}
              onChange={(e) => setSearch({ max: e.target.value ? Number(e.target.value) : undefined })}
              className="border border-border bg-transparent px-3 py-2 text-xs focus:border-accent focus:outline-none"
            />
          </div>

          <h3 className="mt-8 text-muted-foreground">Colour</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={() => setSearch({ color: undefined })}
              className={`px-2 py-1 text-[10px] ${!color ? "bg-foreground text-background" : "border border-border"}`}
            >
              All
            </button>
            {allColors.map((c) => (
              <button
                key={c.name}
                onClick={() => setSearch({ color: c.name })}
                title={c.name}
                className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                  color === c.name ? "border-accent ring-2 ring-accent/30" : "border-border"
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>

          {(q || min !== undefined || max !== undefined || color || params.cat) && (
            <button
              onClick={() =>
                navigate({ search: {} })
              }
              className="mt-8 text-[10px] uppercase tracking-luxe text-muted-foreground link-underline"
            >
              Reset filters
            </button>
          )}
        </aside>

        <div>
          <div className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="aspect-[4/5] animate-pulse bg-secondary" />
                ))
              : list.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
          {!isLoading && list.length === 0 && (
            <p className="py-24 text-center text-sm text-muted-foreground">No pieces match your search.</p>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
