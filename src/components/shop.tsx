import { Search, SlidersHorizontal, X, Grid3X3, List, ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { z } from "zod";
import { SiteLayout } from "@/components/site-layout";
import { ProductCard } from "@/components/product-card";
import { useCategories, useProducts, type Product } from "@/lib/db";

export const shopSearchSchema = z.object({
  q: z.string().optional(),
  cat: z.string().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  color: z.string().optional(),
  size: z.string().optional(),
  tag: z.enum(["new", "best"]).optional(),
  page: z.number().optional(),
});

export type ShopSearchParams = z.infer<typeof shopSearchSchema>;

export interface ShopProps {
  restrictCategorySlug?: string;
  params: ShopSearchParams;
  setSearch: (next: Partial<ShopSearchParams>) => void;
  onResetFilters: () => void;
}

const sortOptions = ["Featured", "New Arrivals", "Price: Low to High", "Price: High to Low"] as const;
const ITEMS_PER_PAGE = 12;

export function Shop({ restrictCategorySlug, params, setSearch, onResetFilters }: ShopProps) {
  const { data: products = [], isLoading } = useProducts();
  const { data: categories = [] } = useCategories();
  const [sort, setSort] = useState<(typeof sortOptions)[number]>("Featured");
  const [mobileFilters, setMobileFilters] = useState(false);
  const [gridView, setGridView] = useState(true);

  const q = params.q ?? "";
  const activeCat = restrictCategorySlug ?? params.cat ?? "all";
  const min = params.min;
  const max = params.max;
  const color = params.color;
  const size = params.size;
  const tag = params.tag;
  const page = params.page ?? 1;

  const rootCategory = restrictCategorySlug ? categories.find((c) => c.slug === restrictCategorySlug) : null;
  const subcats = rootCategory
    ? categories.filter((c) => c.parent_id === rootCategory.id)
    : categories.filter((c) => c.parent_id === null);

  const allColors = useMemo(() => {
    const m = new Map<string, string>();
    products.forEach((p) => p.colors.forEach((c) => m.set(c.name, c.hex)));
    return Array.from(m.entries()).map(([name, hex]) => ({ name, hex }));
  }, [products]);

  const allSizes = useMemo(() => {
    const s = new Set<string>();
    products.forEach((p) => p.sizes.forEach((sz) => s.add(sz)));
    return Array.from(s).sort();
  }, [products]);

  const filtered = useMemo(() => {
    let l: Product[] = products;

    if (restrictCategorySlug && rootCategory) {
      const subIds = new Set([rootCategory.id, ...categories.filter((c) => c.parent_id === rootCategory.id).map((c) => c.id)]);
      l = l.filter((p) => p.category_id && subIds.has(p.category_id));
    }

    if (activeCat && activeCat !== "all" && !restrictCategorySlug) {
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
    if (size) l = l.filter((p) => p.sizes.some((s) => s === size));
    if (tag === "new") l = l.filter((p) => p.is_new);
    if (tag === "best") l = l.filter((p) => p.is_best_seller);

    if (sort === "Price: Low to High") l = [...l].sort((a, b) => a.price - b.price);
    else if (sort === "Price: High to Low") l = [...l].sort((a, b) => b.price - a.price);
    else if (sort === "New Arrivals") l = [...l].sort((a, b) => Number(b.is_new) - Number(a.is_new));
    return l;
  }, [products, q, activeCat, min, max, color, size, tag, sort, categories, restrictCategorySlug, rootCategory]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const activeFilterCount = [q, min, max, color, size, tag, params.cat].filter(Boolean).length;

  const heading = restrictCategorySlug
    ? rootCategory?.name ?? "Shop"
    : "The Collection";

  const filterSidebar = (
    <div className="space-y-8 text-xs uppercase tracking-luxe">
      {/* Tags */}
      <div>
        <h3 className="text-muted-foreground">Collection</h3>
        <div className="mt-3 flex flex-col gap-2">
          {[
            { value: undefined, label: "All" },
            { value: "new" as const, label: "New Arrivals" },
            { value: "best" as const, label: "Best Sellers" },
          ].map((t) => (
            <button
              key={t.label}
              onClick={() => setSearch({ tag: t.value, page: 1 })}
              className={`text-left transition ${tag === t.value ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              {tag === t.value && "• "}{t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h3 className="text-muted-foreground">Price</h3>
        <div className="mt-3 flex flex-col gap-2">
          <input
            type="number"
            placeholder="Min PKR"
            value={min ?? ""}
            onChange={(e) => setSearch({ min: e.target.value ? Number(e.target.value) : undefined, page: 1 })}
            className="border border-border bg-transparent px-3 py-2 text-xs transition focus:border-accent focus:outline-none"
          />
          <input
            type="number"
            placeholder="Max PKR"
            value={max ?? ""}
            onChange={(e) => setSearch({ max: e.target.value ? Number(e.target.value) : undefined, page: 1 })}
            className="border border-border bg-transparent px-3 py-2 text-xs transition focus:border-accent focus:outline-none"
          />
        </div>
      </div>

      {/* Colour */}
      {allColors.length > 0 && (
        <div>
          <h3 className="text-muted-foreground">Colour</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={() => setSearch({ color: undefined, page: 1 })}
              className={`px-2 py-1 text-[10px] transition ${!color ? "bg-foreground text-background" : "border border-border hover:border-foreground"}`}
            >
              All
            </button>
            {allColors.map((c) => (
              <button
                key={c.name}
                onClick={() => setSearch({ color: c.name, page: 1 })}
                title={c.name}
                className={`flex h-7 w-7 items-center justify-center rounded-full border transition ${
                  color === c.name ? "border-accent ring-2 ring-accent/30" : "border-border hover:border-foreground/40"
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Size */}
      {allSizes.length > 0 && (
        <div>
          <h3 className="text-muted-foreground">Size</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={() => setSearch({ size: undefined, page: 1 })}
              className={`px-2 py-1 text-[10px] transition ${!size ? "bg-foreground text-background" : "border border-border hover:border-foreground"}`}
            >
              All
            </button>
            {allSizes.map((s) => (
              <button
                key={s}
                onClick={() => setSearch({ size: s, page: 1 })}
                className={`min-w-[2.5rem] border px-2 py-1 text-[10px] transition ${
                  size === s ? "border-accent bg-accent/5 text-foreground" : "border-border hover:border-foreground/40"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Reset */}
      {activeFilterCount > 0 && (
        <button
          onClick={() => {
            onResetFilters();
            setMobileFilters(false);
          }}
          className="text-[10px] uppercase tracking-luxe text-muted-foreground link-underline"
        >
          Reset all filters
        </button>
      )}
    </div>
  );

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pt-16 pb-10 text-center">
        <span className="text-xs uppercase tracking-luxe text-muted-foreground">Autumn / Winter</span>
        <h1 className="mt-4 font-serif text-5xl md:text-6xl">{heading}</h1>
        <p className="mx-auto mt-5 max-w-xl text-sm text-muted-foreground">
          Hand-finished in our Lahore atelier. Full-grain leather, solid brass hardware.
        </p>
      </section>

      {/* Toolbar */}
      <section className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-4 border-y border-border/60 py-4 md:flex-row md:items-center md:justify-between">
          {/* Category tabs (desktop) */}
          {!restrictCategorySlug && (
            <div className="hidden flex-wrap gap-x-6 gap-y-2 text-xs uppercase tracking-luxe md:flex">
              <button
                onClick={() => setSearch({ cat: undefined, page: 1 })}
                className={`link-underline transition ${!params.cat ? "text-foreground" : "text-muted-foreground"}`}
              >
                All
              </button>
              {subcats.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSearch({ cat: c.slug, page: 1 })}
                  className={`link-underline transition ${params.cat === c.slug ? "text-foreground" : "text-muted-foreground"}`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            {/* Mobile filter button */}
            <button
              onClick={() => setMobileFilters(true)}
              className="flex items-center gap-2 border border-border px-3 py-2 text-xs uppercase tracking-luxe transition hover:border-foreground lg:hidden"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Filters
              {activeFilterCount > 0 && (
                <span className="flex h-4 min-w-4 items-center justify-center bg-accent px-1 text-[9px] text-accent-foreground">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Search */}
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setSearch({ q: e.target.value || undefined, page: 1 })}
                placeholder="Search"
                className="w-full border border-border bg-transparent py-2 pl-9 pr-4 text-xs uppercase tracking-luxe placeholder:text-muted-foreground transition focus:border-accent focus:outline-none sm:w-56"
              />
            </div>

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="border border-border bg-transparent px-3 py-2 text-xs uppercase tracking-luxe transition focus:border-accent focus:outline-none"
            >
              {sortOptions.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>

            {/* View toggle */}
            <div className="hidden items-center border border-border md:flex">
              <button
                onClick={() => setGridView(true)}
                className={`p-2 transition ${gridView ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
                aria-label="Grid view"
              >
                <Grid3X3 className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setGridView(false)}
                className={`p-2 transition ${!gridView ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
                aria-label="List view"
              >
                <List className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[220px_1fr]">
        {/* Sidebar (desktop) */}
        <aside className="hidden lg:block">
          {filterSidebar}
        </aside>

        {/* Product grid */}
        <div>
          {/* Count */}
          <p className="mb-6 text-xs text-muted-foreground">
            Showing {paginated.length} of {filtered.length} piece{filtered.length !== 1 ? "s" : ""}
            {activeFilterCount > 0 && (
              <button onClick={onResetFilters} className="ml-2 text-accent link-underline">Clear filters</button>
            )}
          </p>

          {isLoading ? (
            <div className={gridView ? "grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3" : "space-y-6"}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[4/5] animate-pulse bg-secondary" />
              ))}
            </div>
          ) : paginated.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Search className="h-10 w-10 text-muted-foreground/30" />
              <p className="mt-4 text-sm text-muted-foreground">No pieces match your search.</p>
              <button onClick={onResetFilters} className="mt-3 text-xs uppercase tracking-luxe text-accent link-underline">
                Clear all filters
              </button>
            </div>
          ) : gridView ? (
            <div className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
              {paginated.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {paginated.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} variant="list" />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-16 flex items-center justify-center gap-2">
              <button
                onClick={() => setSearch({ page: Math.max(1, page - 1) })}
                disabled={page <= 1}
                className="flex h-10 w-10 items-center justify-center border border-border transition hover:border-foreground disabled:opacity-30"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setSearch({ page: p })}
                  className={`flex h-10 min-w-10 items-center justify-center border text-xs uppercase tracking-luxe transition ${
                    p === page ? "border-accent bg-accent/5 text-foreground" : "border-border text-muted-foreground hover:border-foreground"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setSearch({ page: Math.min(totalPages, page + 1) })}
                disabled={page >= totalPages}
                className="flex h-10 w-10 items-center justify-center border border-border transition hover:border-foreground disabled:opacity-30"
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Mobile Filter Drawer */}
      {mobileFilters && (
        <div className="fixed inset-0 z-[70] flex lg:hidden animate-fade-in">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileFilters(false)} />
          <div className="relative ml-auto flex h-full w-full max-w-sm flex-col overflow-y-auto bg-background p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-2xl">Filters</h3>
              <button onClick={() => setMobileFilters(false)} aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Category tabs (mobile) */}
            {!restrictCategorySlug && (
              <div className="mt-6">
                <h3 className="text-[10px] uppercase tracking-luxe text-muted-foreground">Category</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    onClick={() => { setSearch({ cat: undefined, page: 1 }); setMobileFilters(false); }}
                    className={`px-3 py-1.5 text-[10px] uppercase tracking-luxe transition ${!params.cat ? "bg-foreground text-background" : "border border-border"}`}
                  >
                    All
                  </button>
                  {subcats.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => { setSearch({ cat: c.slug, page: 1 }); setMobileFilters(false); }}
                      className={`px-3 py-1.5 text-[10px] uppercase tracking-luxe transition ${params.cat === c.slug ? "bg-foreground text-background" : "border border-border"}`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6">{filterSidebar}</div>

            <button
              onClick={() => setMobileFilters(false)}
              className="btn-gold mt-8 w-full py-4 text-xs uppercase tracking-luxe"
            >
              Show {filtered.length} piece{filtered.length !== 1 ? "s" : ""}
            </button>
          </div>
        </div>
      )}
    </SiteLayout>
  );
}
