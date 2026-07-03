import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { a as SiteLayout } from "./site-layout-Cg2V6MLS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/about-Bu-V5A4H.js
var import_jsx_runtime = require_jsx_runtime();
function About() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteLayout, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative h-[60vh] min-h-[420px] w-full overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "https://images.unsplash.com/photo-1571945153237-4929e783af4a?auto=format&fit=crop&w=2000&q=80",
				alt: "ÉCLAT atelier",
				className: "absolute inset-0 h-full w-full object-cover animate-ken-burns"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-b from-black/30 to-black/50" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs uppercase tracking-luxe text-white/80",
					children: "The Maison"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-4 font-serif text-5xl md:text-7xl",
					children: "Made by hand. Made to last."
				})]
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto grid max-w-5xl gap-16 px-6 py-24 md:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-serif text-3xl",
				children: "Our Story"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 text-sm leading-relaxed text-muted-foreground",
				children: "ÉCLAT was born in Lahore from a quiet conviction: that Pakistan deserved a luxury house of its own — one rooted in heritage craft and contemporary form. Each piece is finished by hand in our small atelier, using full-grain leathers, solid brass hardware and a discipline of restraint."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm leading-relaxed text-muted-foreground",
				children: "We believe in fewer, finer things. Bags and shoes that age with grace, carried for years rather than seasons."
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-serif text-3xl",
			children: "Our Values"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-6 space-y-4 text-sm",
			children: [
				["Craft first", "Hand-cut, hand-stitched, hand-finished."],
				["Quiet luxury", "Considered proportions, no shouting logos."],
				["Made in Pakistan", "Local artisans, fairly paid."],
				["Built to last", "Lifetime craftsmanship guarantee."]
			].map(([t, d]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-2 h-px w-6 bg-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-serif text-lg",
					children: t
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground",
					children: d
				})] })]
			}, t))
		})] })]
	})] });
}
//#endregion
export { About as component };
