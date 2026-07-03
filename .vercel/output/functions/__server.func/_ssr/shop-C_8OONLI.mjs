import { i as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { G as ChevronLeft, M as List, W as ChevronRight, X as Grid3x3, p as SlidersHorizontal, r as X, y as Search } from "../_libs/lucide-react.mjs";
import { a as SiteLayout } from "./site-layout-Cg2V6MLS.mjs";
import { r as useProducts, t as useCategories } from "./db-Dt9Bwu6d.mjs";
import { t as ProductCard } from "./product-card-Ck9qO05U.mjs";
import { i as stringType, n as numberType, r as objectType, t as enumType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shop-C_8OONLI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var shopSearchSchema = objectType({
	q: stringType().optional(),
	cat: stringType().optional(),
	min: numberType().optional(),
	max: numberType().optional(),
	color: stringType().optional(),
	size: stringType().optional(),
	tag: enumType(["new", "best"]).optional(),
	page: numberType().optional()
});
var sortOptions = [
	"Featured",
	"New Arrivals",
	"Price: Low to High",
	"Price: High to Low"
];
var ITEMS_PER_PAGE = 12;
function Shop({ restrictCategorySlug, params, setSearch, onResetFilters }) {
	const { data: products = [], isLoading } = useProducts();
	const { data: categories = [] } = useCategories();
	const [sort, setSort] = (0, import_react.useState)("Featured");
	const [mobileFilters, setMobileFilters] = (0, import_react.useState)(false);
	const [gridView, setGridView] = (0, import_react.useState)(true);
	const q = params.q ?? "";
	const activeCat = restrictCategorySlug ?? params.cat ?? "all";
	const min = params.min;
	const max = params.max;
	const color = params.color;
	const size = params.size;
	const tag = params.tag;
	const page = params.page ?? 1;
	const rootCategory = restrictCategorySlug ? categories.find((c) => c.slug === restrictCategorySlug) : null;
	const subcats = rootCategory ? categories.filter((c) => c.parent_id === rootCategory.id) : categories.filter((c) => c.parent_id === null);
	const allColors = (0, import_react.useMemo)(() => {
		const m = /* @__PURE__ */ new Map();
		products.forEach((p) => p.colors.forEach((c) => m.set(c.name, c.hex)));
		return Array.from(m.entries()).map(([name, hex]) => ({
			name,
			hex
		}));
	}, [products]);
	const allSizes = (0, import_react.useMemo)(() => {
		const s = /* @__PURE__ */ new Set();
		products.forEach((p) => p.sizes.forEach((sz) => s.add(sz)));
		return Array.from(s).sort();
	}, [products]);
	const filtered = (0, import_react.useMemo)(() => {
		let l = products;
		if (restrictCategorySlug && rootCategory) {
			const subIds = /* @__PURE__ */ new Set([rootCategory.id, ...categories.filter((c) => c.parent_id === rootCategory.id).map((c) => c.id)]);
			l = l.filter((p) => p.category_id && subIds.has(p.category_id));
		}
		if (activeCat && activeCat !== "all" && !restrictCategorySlug) {
			const cat = categories.find((c) => c.slug === activeCat);
			if (cat) {
				const subIds = /* @__PURE__ */ new Set([cat.id, ...categories.filter((c) => c.parent_id === cat.id).map((c) => c.id)]);
				l = l.filter((p) => p.category_id && subIds.has(p.category_id));
			}
		}
		if (q.trim()) {
			const ql = q.toLowerCase();
			l = l.filter((p) => p.name.toLowerCase().includes(ql) || p.description?.toLowerCase().includes(ql));
		}
		if (min !== void 0) l = l.filter((p) => p.price >= min);
		if (max !== void 0) l = l.filter((p) => p.price <= max);
		if (color) l = l.filter((p) => p.colors.some((c) => c.name === color));
		if (size) l = l.filter((p) => p.sizes.some((s) => s === size));
		if (tag === "new") l = l.filter((p) => p.is_new);
		if (tag === "best") l = l.filter((p) => p.is_best_seller);
		if (sort === "Price: Low to High") l = [...l].sort((a, b) => a.price - b.price);
		else if (sort === "Price: High to Low") l = [...l].sort((a, b) => b.price - a.price);
		else if (sort === "New Arrivals") l = [...l].sort((a, b) => Number(b.is_new) - Number(a.is_new));
		return l;
	}, [
		products,
		q,
		activeCat,
		min,
		max,
		color,
		size,
		tag,
		sort,
		categories,
		restrictCategorySlug,
		rootCategory
	]);
	const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
	const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
	const activeFilterCount = [
		q,
		min,
		max,
		color,
		size,
		tag,
		params.cat
	].filter(Boolean).length;
	const heading = restrictCategorySlug ? rootCategory?.name ?? "Shop" : "The Collection";
	const filterSidebar = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8 text-xs uppercase tracking-luxe",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-muted-foreground",
				children: "Collection"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 flex flex-col gap-2",
				children: [
					{
						value: void 0,
						label: "All"
					},
					{
						value: "new",
						label: "New Arrivals"
					},
					{
						value: "best",
						label: "Best Sellers"
					}
				].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setSearch({
						tag: t.value,
						page: 1
					}),
					className: `text-left transition ${tag === t.value ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`,
					children: [tag === t.value && "• ", t.label]
				}, t.label))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-muted-foreground",
				children: "Price"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-col gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "number",
					placeholder: "Min PKR",
					value: min ?? "",
					onChange: (e) => setSearch({
						min: e.target.value ? Number(e.target.value) : void 0,
						page: 1
					}),
					className: "border border-border bg-transparent px-3 py-2 text-xs transition focus:border-accent focus:outline-none"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "number",
					placeholder: "Max PKR",
					value: max ?? "",
					onChange: (e) => setSearch({
						max: e.target.value ? Number(e.target.value) : void 0,
						page: 1
					}),
					className: "border border-border bg-transparent px-3 py-2 text-xs transition focus:border-accent focus:outline-none"
				})]
			})] }),
			allColors.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-muted-foreground",
				children: "Colour"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setSearch({
						color: void 0,
						page: 1
					}),
					className: `px-2 py-1 text-[10px] transition ${!color ? "bg-foreground text-background" : "border border-border hover:border-foreground"}`,
					children: "All"
				}), allColors.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setSearch({
						color: c.name,
						page: 1
					}),
					title: c.name,
					className: `flex h-7 w-7 items-center justify-center rounded-full border transition ${color === c.name ? "border-accent ring-2 ring-accent/30" : "border-border hover:border-foreground/40"}`,
					style: { backgroundColor: c.hex }
				}, c.name))]
			})] }),
			allSizes.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-muted-foreground",
				children: "Size"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setSearch({
						size: void 0,
						page: 1
					}),
					className: `px-2 py-1 text-[10px] transition ${!size ? "bg-foreground text-background" : "border border-border hover:border-foreground"}`,
					children: "All"
				}), allSizes.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setSearch({
						size: s,
						page: 1
					}),
					className: `min-w-[2.5rem] border px-2 py-1 text-[10px] transition ${size === s ? "border-accent bg-accent/5 text-foreground" : "border-border hover:border-foreground/40"}`,
					children: s
				}, s))]
			})] }),
			activeFilterCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => {
					onResetFilters();
					setMobileFilters(false);
				},
				className: "text-[10px] uppercase tracking-luxe text-muted-foreground link-underline",
				children: "Reset all filters"
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteLayout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-7xl px-6 pt-16 pb-10 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs uppercase tracking-luxe text-muted-foreground",
					children: "Autumn / Winter"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-4 font-serif text-5xl md:text-6xl",
					children: heading
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mx-auto mt-5 max-w-xl text-sm text-muted-foreground",
					children: "Hand-finished in our Lahore atelier. Full-grain leather, solid brass hardware."
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "mx-auto max-w-7xl px-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4 border-y border-border/60 py-4 md:flex-row md:items-center md:justify-between",
				children: [!restrictCategorySlug && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hidden flex-wrap gap-x-6 gap-y-2 text-xs uppercase tracking-luxe md:flex",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setSearch({
							cat: void 0,
							page: 1
						}),
						className: `link-underline transition ${!params.cat ? "text-foreground" : "text-muted-foreground"}`,
						children: "All"
					}), subcats.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setSearch({
							cat: c.slug,
							page: 1
						}),
						className: `link-underline transition ${params.cat === c.slug ? "text-foreground" : "text-muted-foreground"}`,
						children: c.name
					}, c.id))]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setMobileFilters(true),
							className: "flex items-center gap-2 border border-border px-3 py-2 text-xs uppercase tracking-luxe transition hover:border-foreground lg:hidden",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "h-3.5 w-3.5" }),
								"Filters",
								activeFilterCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex h-4 min-w-4 items-center justify-center bg-accent px-1 text-[9px] text-accent-foreground",
									children: activeFilterCount
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative flex-1 sm:flex-initial",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: q,
								onChange: (e) => setSearch({
									q: e.target.value || void 0,
									page: 1
								}),
								placeholder: "Search",
								className: "w-full border border-border bg-transparent py-2 pl-9 pr-4 text-xs uppercase tracking-luxe placeholder:text-muted-foreground transition focus:border-accent focus:outline-none sm:w-56"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: sort,
							onChange: (e) => setSort(e.target.value),
							className: "border border-border bg-transparent px-3 py-2 text-xs uppercase tracking-luxe transition focus:border-accent focus:outline-none",
							children: sortOptions.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: s }, s))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hidden items-center border border-border md:flex",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setGridView(true),
								className: `p-2 transition ${gridView ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`,
								"aria-label": "Grid view",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Grid3x3, { className: "h-3.5 w-3.5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setGridView(false),
								className: `p-2 transition ${!gridView ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`,
								"aria-label": "List view",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, { className: "h-3.5 w-3.5" })
							})]
						})
					]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[220px_1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
				className: "hidden lg:block",
				children: filterSidebar
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mb-6 text-xs text-muted-foreground",
					children: [
						"Showing ",
						paginated.length,
						" of ",
						filtered.length,
						" piece",
						filtered.length !== 1 ? "s" : "",
						activeFilterCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: onResetFilters,
							className: "ml-2 text-accent link-underline",
							children: "Clear filters"
						})
					]
				}),
				isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: gridView ? "grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3" : "space-y-6",
					children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "aspect-[4/5] animate-pulse bg-secondary" }, i))
				}) : paginated.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center justify-center py-24 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-10 w-10 text-muted-foreground/30" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-sm text-muted-foreground",
							children: "No pieces match your search."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: onResetFilters,
							className: "mt-3 text-xs uppercase tracking-luxe text-accent link-underline",
							children: "Clear all filters"
						})
					]
				}) : gridView ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3",
					children: paginated.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, {
						product: p,
						index: i
					}, p.id))
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-4",
					children: paginated.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, {
						product: p,
						index: i,
						variant: "list"
					}, p.id))
				}),
				totalPages > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-16 flex items-center justify-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setSearch({ page: Math.max(1, page - 1) }),
							disabled: page <= 1,
							className: "flex h-10 w-10 items-center justify-center border border-border transition hover:border-foreground disabled:opacity-30",
							"aria-label": "Previous page",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-4 w-4" })
						}),
						Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setSearch({ page: p }),
							className: `flex h-10 min-w-10 items-center justify-center border text-xs uppercase tracking-luxe transition ${p === page ? "border-accent bg-accent/5 text-foreground" : "border-border text-muted-foreground hover:border-foreground"}`,
							children: p
						}, p)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setSearch({ page: Math.min(totalPages, page + 1) }),
							disabled: page >= totalPages,
							className: "flex h-10 w-10 items-center justify-center border border-border transition hover:border-foreground disabled:opacity-30",
							"aria-label": "Next page",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })
						})
					]
				})
			] })]
		}),
		mobileFilters && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "fixed inset-0 z-[70] flex lg:hidden animate-fade-in",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 bg-black/40 backdrop-blur-sm",
				onClick: () => setMobileFilters(false)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative ml-auto flex h-full w-full max-w-sm flex-col overflow-y-auto bg-background p-6 shadow-2xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-serif text-2xl",
							children: "Filters"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setMobileFilters(false),
							"aria-label": "Close",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
						})]
					}),
					!restrictCategorySlug && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-[10px] uppercase tracking-luxe text-muted-foreground",
							children: "Category"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex flex-wrap gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => {
									setSearch({
										cat: void 0,
										page: 1
									});
									setMobileFilters(false);
								},
								className: `px-3 py-1.5 text-[10px] uppercase tracking-luxe transition ${!params.cat ? "bg-foreground text-background" : "border border-border"}`,
								children: "All"
							}), subcats.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => {
									setSearch({
										cat: c.slug,
										page: 1
									});
									setMobileFilters(false);
								},
								className: `px-3 py-1.5 text-[10px] uppercase tracking-luxe transition ${params.cat === c.slug ? "bg-foreground text-background" : "border border-border"}`,
								children: c.name
							}, c.id))]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6",
						children: filterSidebar
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setMobileFilters(false),
						className: "btn-gold mt-8 w-full py-4 text-xs uppercase tracking-luxe",
						children: [
							"Show ",
							filtered.length,
							" piece",
							filtered.length !== 1 ? "s" : ""
						]
					})
				]
			})]
		})
	] });
}
//#endregion
export { shopSearchSchema as n, Shop as t };
