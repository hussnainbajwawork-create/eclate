import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { G as ChevronLeft, l as Trash2 } from "../_libs/lucide-react.mjs";
import { a as SiteLayout, f as useWishlist } from "./site-layout-Cg2V6MLS.mjs";
import { r as useProducts } from "./db-B_9CSSwt.mjs";
import { t as ProductCard } from "./product-card-Ck9qO05U.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/wishlist-xMHjeuay.js
var import_jsx_runtime = require_jsx_runtime();
function Wishlist() {
	const { ids, clear } = useWishlist();
	const { data: products = [] } = useProducts();
	const items = products.filter((p) => ids.includes(p.id));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-7xl px-6 pt-16 pb-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/shop",
				className: "inline-flex items-center gap-1 text-[11px] uppercase tracking-luxe text-muted-foreground hover:text-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-3 w-3" }), " Continue Shopping"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex items-end justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-serif text-5xl md:text-6xl",
					children: "Wishlist"
				}), items.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: clear,
					className: "flex items-center gap-2 text-xs uppercase tracking-luxe text-muted-foreground link-underline",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" }), " Clear"]
				})]
			}),
			items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-16 border border-border/60 bg-card p-16 text-center text-sm text-muted-foreground",
				children: "Your wishlist is empty. Mark pieces you love with the heart."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4",
				children: items.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, {
					product: p,
					index: i
				}, p.id))
			})
		]
	}) });
}
//#endregion
export { Wishlist as component };
