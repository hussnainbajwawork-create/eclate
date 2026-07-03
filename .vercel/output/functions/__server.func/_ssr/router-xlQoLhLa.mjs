import { a as require_jsx_runtime, r as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { I as useRouter, c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, k as redirect, m as createFileRoute, p as lazyRouteComponent, s as Scripts } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as CartProvider, s as WishlistProvider, t as AuthProvider } from "./site-layout-Cg2V6MLS.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { n as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as Route$11 } from "./collections._productId-DdFpHXiM.mjs";
import { t as Route$12 } from "./handbags-BMCNI2Co.mjs";
import { t as Route$13 } from "./shop-Fw1FE7Nu.mjs";
import { t as Route$14 } from "./shoes-BxdNiLCa.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-xlQoLhLa.js
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-DRBrAMX6.css";
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-serif text-7xl text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$10 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "ÉCLAT — Timeless Elegance, Crafted for Pakistan" },
			{
				name: "description",
				content: "ÉCLAT — Pakistani luxury handbags & shoes. Refined craftsmanship, contemporary design, everyday elegance."
			},
			{
				property: "og:title",
				content: "ÉCLAT — Luxury Handbags"
			},
			{
				property: "og:description",
				content: "Timeless Elegance, Crafted for Pakistan."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$10.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WishlistProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CartProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, { position: "top-center" })] }) }) })
	});
}
var $$splitComponentImporter$9 = () => import("./wishlist-xMHjeuay.mjs");
var Route$9 = createFileRoute("/wishlist")({
	head: () => ({ meta: [{ title: "Wishlist — ÉCLAT" }] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./contact-BbVXOZwX.mjs");
var Route$8 = createFileRoute("/contact")({
	head: () => ({ meta: [{ title: "Contact — ÉCLAT" }, {
		name: "description",
		content: "Get in touch with the ÉCLAT atelier. WhatsApp, email or visit us in Lahore."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./checkout-D-6Avlri.mjs");
var Route$7 = createFileRoute("/checkout")({
	head: () => ({ meta: [{ title: "Checkout — ÉCLAT" }] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./cart-BIr-HNeL.mjs");
var Route$6 = createFileRoute("/cart")({
	head: () => ({ meta: [{ title: "Cart — ÉCLAT" }] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./auth-DVHyIENi.mjs");
var Route$5 = createFileRoute("/auth")({
	head: () => ({ meta: [{ title: "Sign In — ÉCLAT" }] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./admin-BK3kU99d.mjs");
var Route$4 = createFileRoute("/admin")({
	head: () => ({ meta: [{ title: "Admin — ÉCLAT" }] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./account-uNgI8aYn.mjs");
var Route$3 = createFileRoute("/account")({
	head: () => ({ meta: [{ title: "Account — ÉCLAT" }] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./about-Bu-V5A4H.mjs");
var Route$2 = createFileRoute("/about")({
	head: () => ({ meta: [{ title: "About — ÉCLAT" }, {
		name: "description",
		content: "ÉCLAT — a Pakistani maison of leather, born of quiet luxury and contemporary form."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./routes-BqF_WO_T.mjs");
var Route$1 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "ÉCLAT — Timeless Elegance, Crafted for Pakistan" },
		{
			name: "description",
			content: "ÉCLAT — a Pakistani maison of luxury handbags & shoes. Refined craftsmanship, contemporary design, everyday elegance."
		},
		{
			property: "og:title",
			content: "ÉCLAT — Luxury Handbags"
		},
		{
			property: "og:description",
			content: "Timeless Elegance, Crafted for Pakistan."
		},
		{
			property: "og:image",
			content: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1600&q=80"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./collections.index-Bl-VP-Os.mjs");
var Route = createFileRoute("/collections/")({
	beforeLoad: () => {
		throw redirect({ to: "/shop" });
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var WishlistRoute = Route$9.update({
	id: "/wishlist",
	path: "/wishlist",
	getParentRoute: () => Route$10
});
var ShopRoute = Route$13.update({
	id: "/shop",
	path: "/shop",
	getParentRoute: () => Route$10
});
var ShoesRoute = Route$14.update({
	id: "/shoes",
	path: "/shoes",
	getParentRoute: () => Route$10
});
var HandbagsRoute = Route$12.update({
	id: "/handbags",
	path: "/handbags",
	getParentRoute: () => Route$10
});
var ContactRoute = Route$8.update({
	id: "/contact",
	path: "/contact",
	getParentRoute: () => Route$10
});
var CheckoutRoute = Route$7.update({
	id: "/checkout",
	path: "/checkout",
	getParentRoute: () => Route$10
});
var CartRoute = Route$6.update({
	id: "/cart",
	path: "/cart",
	getParentRoute: () => Route$10
});
var AuthRoute = Route$5.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$10
});
var AdminRoute = Route$4.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => Route$10
});
var AccountRoute = Route$3.update({
	id: "/account",
	path: "/account",
	getParentRoute: () => Route$10
});
var AboutRoute = Route$2.update({
	id: "/about",
	path: "/about",
	getParentRoute: () => Route$10
});
var IndexRoute = Route$1.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$10
});
var CollectionsIndexRoute = Route.update({
	id: "/collections/",
	path: "/collections/",
	getParentRoute: () => Route$10
});
var rootRouteChildren = {
	IndexRoute,
	AboutRoute,
	AccountRoute,
	AdminRoute,
	AuthRoute,
	CartRoute,
	CheckoutRoute,
	ContactRoute,
	HandbagsRoute,
	ShoesRoute,
	ShopRoute,
	WishlistRoute,
	CollectionsProductIdRoute: Route$11.update({
		id: "/collections/$productId",
		path: "/collections/$productId",
		getParentRoute: () => Route$10
	}),
	CollectionsIndexRoute
};
var routeTree = Route$10._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
