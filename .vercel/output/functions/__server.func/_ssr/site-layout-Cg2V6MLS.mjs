import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-B53tpCKD.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { D as MessageCircle, E as Moon, I as Heart, L as Facebook, O as Menu, P as Instagram, a as User, d as Sun, m as ShoppingBag, r as X, y as Search } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/site-layout-Cg2V6MLS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Ctx$2 = (0, import_react.createContext)(null);
var KEY$1 = "eclat-cart-v1";
var keyOf = (i) => `${i.productId}::${i.color ?? ""}::${i.size ?? ""}`;
function CartProvider({ children }) {
	const [items, setItems] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		try {
			const raw = localStorage.getItem(KEY$1);
			if (raw) setItems(JSON.parse(raw));
		} catch {}
	}, []);
	(0, import_react.useEffect)(() => {
		try {
			localStorage.setItem(KEY$1, JSON.stringify(items));
		} catch {}
	}, [items]);
	const value = (0, import_react.useMemo)(() => {
		const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
		return {
			items,
			add: (item) => setItems((curr) => {
				const k = keyOf(item);
				const idx = curr.findIndex((x) => keyOf(x) === k);
				if (idx >= 0) {
					const next = curr.slice();
					next[idx] = {
						...next[idx],
						qty: next[idx].qty + item.qty
					};
					return next;
				}
				return [...curr, item];
			}),
			remove: (k) => setItems((curr) => curr.filter((x) => keyOf(x) !== k)),
			setQty: (k, qty) => setItems((curr) => curr.map((x) => keyOf(x) === k ? {
				...x,
				qty: Math.max(1, qty)
			} : x)),
			clear: () => setItems([]),
			count: items.reduce((s, i) => s + i.qty, 0),
			subtotal
		};
	}, [items]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ctx$2.Provider, {
		value,
		children
	});
}
function useCart() {
	const c = (0, import_react.useContext)(Ctx$2);
	if (!c) throw new Error("useCart must be used within CartProvider");
	return c;
}
var cartKey = keyOf;
var Ctx$1 = (0, import_react.createContext)(null);
var KEY = "eclat-wishlist-v1";
function WishlistProvider({ children }) {
	const [ids, setIds] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		try {
			const raw = localStorage.getItem(KEY);
			if (raw) setIds(JSON.parse(raw));
		} catch {}
	}, []);
	(0, import_react.useEffect)(() => {
		try {
			localStorage.setItem(KEY, JSON.stringify(ids));
		} catch {}
	}, [ids]);
	const value = (0, import_react.useMemo)(() => ({
		ids,
		toggle: (id) => setIds((curr) => curr.includes(id) ? curr.filter((x) => x !== id) : [...curr, id]),
		has: (id) => ids.includes(id),
		clear: () => setIds([])
	}), [ids]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ctx$1.Provider, {
		value,
		children
	});
}
function useWishlist() {
	const c = (0, import_react.useContext)(Ctx$1);
	if (!c) throw new Error("useWishlist must be used within WishlistProvider");
	return c;
}
var Ctx = (0, import_react.createContext)(null);
function AuthProvider({ children }) {
	const [session, setSession] = (0, import_react.useState)(null);
	const [user, setUser] = (0, import_react.useState)(null);
	const [isAdmin, setIsAdmin] = (0, import_react.useState)(false);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
			setSession(sess);
			setUser(sess?.user ?? null);
			if (sess?.user) setTimeout(() => {
				supabase.from("user_roles").select("role").eq("user_id", sess.user.id).eq("role", "admin").maybeSingle().then(({ data }) => setIsAdmin(!!data));
			}, 0);
			else setIsAdmin(false);
		});
		supabase.auth.getSession().then(({ data: { session: s } }) => {
			setSession(s);
			setUser(s?.user ?? null);
			if (s?.user) supabase.from("user_roles").select("role").eq("user_id", s.user.id).eq("role", "admin").maybeSingle().then(({ data }) => setIsAdmin(!!data));
			setLoading(false);
		});
		return () => sub.subscription.unsubscribe();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ctx.Provider, {
		value: {
			user,
			session,
			isAdmin,
			loading,
			signOut: async () => {
				await supabase.auth.signOut();
			}
		},
		children
	});
}
function useAuth() {
	const c = (0, import_react.useContext)(Ctx);
	if (!c) throw new Error("useAuth must be used within AuthProvider");
	return c;
}
var formatPKR = (n) => `PKR ${Number(n).toLocaleString("en-PK", { maximumFractionDigits: 0 })}`;
var WHATSAPP_NUMBER = "923001234567";
var INSTAGRAM_URL = "https://instagram.com/eclat.pk";
var FACEBOOK_URL = "https://facebook.com/eclat.pk";
function whatsappLink(message) {
	return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
function useDarkMode() {
	const [dark, setDark] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const isDark = localStorage.getItem("eclat-theme") === "dark";
		setDark(isDark);
		document.documentElement.classList.toggle("dark", isDark);
	}, []);
	const toggle = () => {
		const next = !dark;
		setDark(next);
		document.documentElement.classList.toggle("dark", next);
		localStorage.setItem("eclat-theme", next ? "dark" : "light");
	};
	return {
		dark,
		toggle
	};
}
var nav = [
	{
		to: "/",
		label: "Home"
	},
	{
		to: "/shop",
		label: "Shop"
	},
	{
		to: "/handbags",
		label: "Handbags"
	},
	{
		to: "/shoes",
		label: "Shoes"
	},
	{
		to: "/about",
		label: "About"
	},
	{
		to: "/contact",
		label: "Contact"
	}
];
function Header() {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [searchOpen, setSearchOpen] = (0, import_react.useState)(false);
	const { dark, toggle } = useDarkMode();
	const { count } = useCart();
	const { ids } = useWishlist();
	const { user, isAdmin } = useAuth();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-7xl items-center justify-between gap-8 px-6 py-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						"aria-label": "Menu",
						className: "md:hidden",
						onClick: () => setOpen(true),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-5 w-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "flex items-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-serif text-2xl tracking-[0.4em] md:text-3xl",
							children: "ÉCLAT"
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "hidden gap-7 text-xs uppercase tracking-luxe md:flex",
						children: nav.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: n.to,
							className: "link-underline hover:text-foreground",
							activeProps: { className: "text-foreground" },
							inactiveProps: { className: "text-muted-foreground" },
							children: n.label
						}, n.to))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-4 md:border-l md:border-border/40 md:pl-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								"aria-label": "Search",
								onClick: () => setSearchOpen(true),
								className: "text-muted-foreground hover:text-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-4 w-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								"aria-label": "Toggle theme",
								onClick: toggle,
								className: "text-muted-foreground hover:text-foreground",
								children: dark ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "h-4 w-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/wishlist",
								"aria-label": "Wishlist",
								className: "relative text-muted-foreground hover:text-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "h-4 w-4" }), ids.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[9px] font-medium text-accent-foreground",
									children: ids.length
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/cart",
								"aria-label": "Cart",
								className: "relative text-muted-foreground hover:text-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "h-4 w-4" }), count > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[9px] font-medium text-accent-foreground",
									children: count
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: user ? isAdmin ? "/admin" : "/account" : "/auth",
								"aria-label": "Account",
								className: "text-muted-foreground hover:text-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-4 w-4" })
							})
						]
					})]
				})]
			})
		}),
		open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "fixed inset-0 z-[60] flex flex-col bg-background animate-fade-in md:hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-[1fr_auto_1fr] items-center gap-4 border-b border-border/60 px-6 py-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-center font-serif text-2xl tracking-[0.4em]",
						children: "ÉCLAT"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						"aria-label": "Close",
						onClick: () => setOpen(false),
						className: "justify-self-end",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "flex flex-1 flex-col items-center gap-7 pt-16 text-sm uppercase tracking-luxe",
				children: [
					nav.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: n.to,
						onClick: () => setOpen(false),
						children: n.label
					}, n.to)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/cart",
						onClick: () => setOpen(false),
						children: [
							"Cart (",
							count,
							")"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/wishlist",
						onClick: () => setOpen(false),
						children: "Wishlist"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: user ? "/account" : "/auth",
						onClick: () => setOpen(false),
						children: user ? "Account" : "Sign In"
					}),
					isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/admin",
						onClick: () => setOpen(false),
						children: "Admin"
					})
				]
			})]
		}),
		searchOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchOverlay, { onClose: () => setSearchOpen(false) })
	] });
}
function SearchOverlay({ onClose }) {
	const [q, setQ] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		onClose();
	}, [useRouterState().location.pathname]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-[80] flex flex-col bg-background/95 backdrop-blur-md animate-fade-in",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-center justify-end px-6 py-5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: onClose,
				"aria-label": "Close search",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto w-full max-w-2xl px-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				action: "/shop",
				className: "flex items-center gap-3 border-b border-border pb-3",
				onSubmit: () => onClose(),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-5 w-5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					name: "q",
					autoFocus: true,
					value: q,
					onChange: (e) => setQ(e.target.value),
					placeholder: "Search for a piece…",
					className: "flex-1 bg-transparent py-2 font-serif text-3xl outline-none placeholder:text-muted-foreground/60"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-xs uppercase tracking-luxe text-muted-foreground",
				children: "Press Enter to search the boutique"
			})]
		})]
	});
}
function Footer() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
		className: "mt-32 border-t border-border/60 bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-7xl px-6 py-16",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-12 md:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-serif text-2xl tracking-[0.4em]",
						children: "ÉCLAT"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm text-muted-foreground",
						children: "Timeless elegance, crafted for Pakistan."
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "text-xs uppercase tracking-luxe text-muted-foreground",
						children: "Explore"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-4 space-y-2 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/shop",
								className: "link-underline",
								children: "Shop All"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/handbags",
								className: "link-underline",
								children: "Handbags"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/shoes",
								className: "link-underline",
								children: "Shoes"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/about",
								className: "link-underline",
								children: "About"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/contact",
								className: "link-underline",
								children: "Contact"
							}) })
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "text-xs uppercase tracking-luxe text-muted-foreground",
						children: "Connect"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-4 space-y-3 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: INSTAGRAM_URL,
								target: "_blank",
								rel: "noreferrer",
								className: "flex items-center gap-2 link-underline",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Instagram, { className: "h-4 w-4" }), " Instagram"]
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: FACEBOOK_URL,
								target: "_blank",
								rel: "noreferrer",
								className: "flex items-center gap-2 link-underline",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Facebook, { className: "h-4 w-4" }), " Facebook"]
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: whatsappLink("Hello ÉCLAT, I'd like to know more."),
								target: "_blank",
								rel: "noreferrer",
								className: "flex items-center gap-2 link-underline",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "h-4 w-4" }), " WhatsApp"]
							}) })
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "text-xs uppercase tracking-luxe text-muted-foreground",
						children: "Atelier"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 text-sm text-muted-foreground",
						children: [
							"Lahore · Karachi · Islamabad",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							"hello@eclat.pk",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							"+",
							WHATSAPP_NUMBER
						]
					})] })
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-12 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground md:flex-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					"© ",
					(/* @__PURE__ */ new Date()).getFullYear(),
					" ÉCLAT Maison. All rights reserved."
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "tracking-luxe uppercase",
					children: "Handcrafted in Pakistan"
				})]
			})]
		})
	});
}
function WhatsappFloat() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
		href: whatsappLink("Hello ÉCLAT, I have a question about your bags."),
		target: "_blank",
		rel: "noreferrer",
		"aria-label": "Chat on WhatsApp",
		className: "fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition hover:scale-105",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "h-6 w-6" })
	});
}
function SiteLayout({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen flex-col bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "flex-1",
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WhatsappFloat, {})
		]
	});
}
//#endregion
export { SiteLayout as a, cartKey as c, useCart as d, useWishlist as f, INSTAGRAM_URL as i, formatPKR as l, CartProvider as n, WHATSAPP_NUMBER as o, whatsappLink as p, FACEBOOK_URL as r, WishlistProvider as s, AuthProvider as t, useAuth as u };
