import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { G as ChevronLeft, l as Trash2 } from "../_libs/lucide-react.mjs";
import { a as SiteLayout, c as cartKey, d as useCart, l as formatPKR } from "./site-layout-Cg2V6MLS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cart-BIr-HNeL.js
var import_jsx_runtime = require_jsx_runtime();
function Cart() {
	const { items, remove, setQty, subtotal } = useCart();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-5xl px-6 pt-16 pb-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/shop",
				className: "inline-flex items-center gap-1 text-[11px] uppercase tracking-luxe text-muted-foreground hover:text-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-3 w-3" }), " Continue Shopping"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-6 font-serif text-5xl md:text-6xl",
				children: "Your Bag"
			}),
			items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-16 border border-border/60 bg-card p-16 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Your bag is empty."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/shop",
					className: "mt-6 inline-block btn-gold px-8 py-4 text-xs uppercase tracking-luxe",
					children: "Discover the Maison"
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-12 grid gap-12 lg:grid-cols-[1fr_360px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y divide-border/60 border-y border-border/60",
					children: items.map((it) => {
						const k = cartKey(it);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex gap-5 py-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/collections/$productId",
								params: { productId: it.slug },
								className: "block h-28 w-24 shrink-0 overflow-hidden bg-secondary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: it.image,
									alt: it.name,
									className: "h-full w-full object-cover"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-baseline justify-between gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/collections/$productId",
											params: { productId: it.slug },
											className: "font-serif text-lg link-underline",
											children: it.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-sm text-muted-foreground",
											children: formatPKR(it.price)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-xs text-muted-foreground",
										children: [it.color, it.size].filter(Boolean).join(" · ")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-4 flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center border border-border",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: () => setQty(k, it.qty - 1),
													className: "px-3 py-1.5",
													children: "−"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "min-w-[2rem] text-center text-sm",
													children: it.qty
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: () => setQty(k, it.qty + 1),
													className: "px-3 py-1.5",
													children: "+"
												})
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => remove(k),
											"aria-label": "Remove",
											className: "text-muted-foreground hover:text-foreground",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
										})]
									})
								]
							})]
						}, k);
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "h-fit border border-border/60 bg-card p-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-serif text-2xl",
							children: "Order Summary"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "mt-6 space-y-3 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-muted-foreground",
									children: "Subtotal"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: formatPKR(subtotal) })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-muted-foreground",
									children: "Delivery"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: subtotal >= 1e4 ? "Complimentary" : formatPKR(300) })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex items-baseline justify-between border-t border-border/60 pt-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs uppercase tracking-luxe text-muted-foreground",
								children: "Total"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-serif text-2xl",
								children: formatPKR(subtotal + (subtotal >= 1e4 || subtotal === 0 ? 0 : 300))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/checkout",
							className: "btn-gold mt-8 block w-full py-4 text-center text-xs uppercase tracking-luxe",
							children: "Checkout"
						})
					]
				})]
			})
		]
	}) });
}
//#endregion
export { Cart as component };
