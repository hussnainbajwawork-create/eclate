import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { I as Heart } from "../_libs/lucide-react.mjs";
import { f as useWishlist, l as formatPKR } from "./site-layout-Cg2V6MLS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/product-card-Ck9qO05U.js
var import_jsx_runtime = require_jsx_runtime();
function ProductCard({ product, index = 0, variant = "grid" }) {
	const { has, toggle } = useWishlist();
	const wished = has(product.id);
	const img = product.images[0]?.url ?? "https://images.unsplash.com/photo-1559563458-527698bf5295?auto=format&fit=crop&w=900&q=80";
	if (variant === "list") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "group flex gap-5 border border-border/60 bg-card p-4 transition hover:shadow-md animate-fade-up",
		style: { animationDelay: `${index * 40}ms` },
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/collections/$productId",
			params: { productId: product.slug },
			className: "relative block h-40 w-32 shrink-0 overflow-hidden bg-secondary",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: img,
					alt: product.name,
					loading: "lazy",
					className: "h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
				}),
				product.is_new && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "absolute left-2 top-2 bg-background/90 px-2 py-0.5 text-[9px] uppercase tracking-luxe",
					children: "New"
				}),
				product.stock === "sold_out" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "absolute right-2 top-2 bg-foreground/90 px-2 py-0.5 text-[9px] uppercase tracking-luxe text-background",
					children: "Sold Out"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-1 flex-col justify-between py-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/collections/$productId",
					params: { productId: product.slug },
					className: "block",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-serif text-xl transition group-hover:text-accent",
						children: product.name
					})
				}),
				product.category && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mt-1 block text-[10px] uppercase tracking-luxe text-muted-foreground",
					children: product.category.name
				}),
				product.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground",
					children: product.description
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-serif text-lg",
						children: formatPKR(product.price)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-1",
						children: product.colors.slice(0, 5).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							title: c.name,
							className: "h-3 w-3 rounded-full border border-border",
							style: { backgroundColor: c.hex }
						}, c.id))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: (e) => {
						e.preventDefault();
						toggle(product.id);
					},
					"aria-label": "Toggle wishlist",
					className: "flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-accent hover:text-accent",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: `h-3.5 w-3.5 ${wished ? "fill-current text-accent" : ""}` })
				})]
			})]
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "group animate-fade-up",
		style: { animationDelay: `${index * 60}ms` },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/collections/$productId",
					params: { productId: product.slug },
					className: "block",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative aspect-[4/5] overflow-hidden bg-secondary",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: img,
								alt: product.name,
								loading: "lazy",
								className: "h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
							}),
							product.is_new && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute left-3 top-3 bg-background/90 px-2 py-1 text-[10px] uppercase tracking-luxe",
								children: "New"
							}),
							product.is_best_seller && !product.is_new && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute left-3 top-3 bg-accent/90 px-2 py-1 text-[10px] uppercase tracking-luxe text-accent-foreground",
								children: "Best Seller"
							}),
							product.stock === "sold_out" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute right-3 top-3 bg-foreground/90 px-2 py-1 text-[10px] uppercase tracking-luxe text-background",
								children: "Sold Out"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute inset-x-3 bottom-3 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block w-full bg-foreground py-3 text-center text-[11px] uppercase tracking-luxe text-background",
									children: "View Piece"
								})
							})
						]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: (e) => {
						e.preventDefault();
						toggle(product.id);
					},
					"aria-label": "Toggle wishlist",
					className: "absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur transition hover:bg-background",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: `h-3.5 w-3.5 ${wished ? "fill-current text-accent" : ""}` })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/collections/$productId",
				params: { productId: product.slug },
				className: "block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 flex items-baseline justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-serif text-lg",
						children: product.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted-foreground",
						children: formatPKR(product.price)
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 flex gap-1.5",
				children: product.colors.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					title: c.name,
					className: "h-3.5 w-3.5 rounded-full border border-border",
					style: { backgroundColor: c.hex }
				}, c.id))
			})
		]
	});
}
//#endregion
export { ProductCard as t };
