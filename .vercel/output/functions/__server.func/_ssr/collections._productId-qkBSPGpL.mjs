import { i as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { B as Expand, D as MessageCircle, G as ChevronLeft, H as Clock, I as Heart, K as ChevronDown, V as Copy, W as ChevronRight, b as Ruler, g as Share2, h as ShieldCheck, m as ShoppingBag, n as ZoomIn, q as Check, r as X, s as Truck, t as ZoomOut, x as RotateCcw } from "../_libs/lucide-react.mjs";
import { a as SiteLayout, d as useCart, f as useWishlist, l as formatPKR, p as whatsappLink } from "./site-layout-Cg2V6MLS.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as useProduct, r as useProducts } from "./db-Dt9Bwu6d.mjs";
import { t as ProductCard } from "./product-card-Ck9qO05U.mjs";
import { t as Route } from "./collections._productId-E5kLvZjS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/collections._productId-qkBSPGpL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var RECENTLY_VIEWED_KEY = "eclat-recently-viewed";
var MAX_RECENT = 8;
function addToRecentlyViewed(slug) {
	try {
		const raw = localStorage.getItem(RECENTLY_VIEWED_KEY);
		let items = raw ? JSON.parse(raw) : [];
		items = items.filter((s) => s !== slug);
		items.unshift(slug);
		if (items.length > MAX_RECENT) items = items.slice(0, MAX_RECENT);
		localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(items));
	} catch {}
}
function getRecentlyViewed() {
	try {
		const raw = localStorage.getItem(RECENTLY_VIEWED_KEY);
		return raw ? JSON.parse(raw) : [];
	} catch {
		return [];
	}
}
function Accordion({ title, children, defaultOpen = false }) {
	const [open, setOpen] = (0, import_react.useState)(defaultOpen);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "border-b border-border/60",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => setOpen(!open),
			className: "flex w-full items-center justify-between py-4 text-left text-[11px] uppercase tracking-luxe",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: title }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: `h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}` })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `overflow-hidden transition-all duration-300 ${open ? "max-h-[800px] pb-5" : "max-h-0"}`,
			children
		})]
	});
}
function SizeGuide({ onClose }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-lg border border-border bg-background p-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-serif text-2xl",
						children: "Size Guide"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						"aria-label": "Close",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "text-[10px] uppercase tracking-luxe text-muted-foreground",
						children: "Shoes"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "border-b border-border text-left text-[10px] uppercase tracking-luxe text-muted-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pb-2 pr-4",
										children: "EU"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pb-2 pr-4",
										children: "UK"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pb-2 pr-4",
										children: "US"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pb-2",
										children: "CM"
									})
								] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
								className: "divide-y divide-border/40",
								children: [
									[
										36,
										3,
										5.5,
										22.5
									],
									[
										37,
										4,
										6.5,
										23.5
									],
									[
										38,
										5,
										7.5,
										24
									],
									[
										39,
										6,
										8.5,
										25
									],
									[
										40,
										7,
										9.5,
										25.5
									],
									[
										41,
										8,
										10.5,
										26.5
									]
								].map(([eu, uk, us, cm]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2 pr-4",
										children: eu
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2 pr-4",
										children: uk
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2 pr-4",
										children: us
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2",
										children: cm
									})
								] }, eu))
							})]
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "text-[10px] uppercase tracking-luxe text-muted-foreground",
						children: "Bags"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "border-b border-border text-left text-[10px] uppercase tracking-luxe text-muted-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pb-2 pr-4",
										children: "Size"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pb-2 pr-4",
										children: "Width"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pb-2 pr-4",
										children: "Height"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pb-2",
										children: "Depth"
									})
								] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
								className: "divide-y divide-border/40",
								children: [
									[
										"Mini",
										"18 cm",
										"12 cm",
										"6 cm"
									],
									[
										"Small",
										"22 cm",
										"16 cm",
										"8 cm"
									],
									[
										"Standard",
										"30 cm",
										"22 cm",
										"12 cm"
									],
									[
										"Large",
										"38 cm",
										"28 cm",
										"14 cm"
									]
								].map(([size, w, h, d]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2 pr-4 font-serif",
										children: size
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2 pr-4",
										children: w
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2 pr-4",
										children: h
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2",
										children: d
									})
								] }, size))
							})]
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 text-xs text-muted-foreground",
					children: "All measurements are approximate. For specific sizing questions, contact us on WhatsApp."
				})
			]
		})
	});
}
function ProductPage() {
	const { productId } = Route.useParams();
	const { data: product, isLoading } = useProduct(productId);
	const { data: allProducts = [] } = useProducts();
	const cart = useCart();
	const wishlist = useWishlist();
	const [sizeGuideOpen, setSizeGuideOpen] = (0, import_react.useState)(false);
	const [shareOpen, setShareOpen] = (0, import_react.useState)(false);
	const gallery = (0, import_react.useMemo)(() => product?.images.map((i) => i.url) ?? [], [product]);
	const [active, setActive] = (0, import_react.useState)(0);
	const [color, setColor] = (0, import_react.useState)(null);
	const [size, setSize] = (0, import_react.useState)("");
	const [qty, setQty] = (0, import_react.useState)(1);
	const [lightbox, setLightbox] = (0, import_react.useState)(false);
	const [zoom, setZoom] = (0, import_react.useState)(1);
	const [pan, setPan] = (0, import_react.useState)({
		x: 0,
		y: 0
	});
	const [dragging, setDragging] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (product) addToRecentlyViewed(product.slug);
	}, [product]);
	(0, import_react.useEffect)(() => {
		if (product) {
			setColor(product.colors[0] ?? null);
			setSize(product.sizes[0] ?? "");
			setActive(0);
		}
	}, [product]);
	const related = (0, import_react.useMemo)(() => allProducts.filter((p) => product && p.id !== product.id && p.category_id === product.category_id).slice(0, 4), [allProducts, product]);
	const recentSlugs = (0, import_react.useMemo)(() => {
		return getRecentlyViewed().filter((s) => s !== productId);
	}, [productId]);
	const recentProducts = (0, import_react.useMemo)(() => recentSlugs.map((s) => allProducts.find((p) => p.slug === s)).filter(Boolean).slice(0, 4), [recentSlugs, allProducts]);
	const next = (0, import_react.useCallback)(() => {
		if (!gallery.length) return;
		setActive((i) => (i + 1) % gallery.length);
		setZoom(1);
		setPan({
			x: 0,
			y: 0
		});
	}, [gallery.length]);
	const prev = (0, import_react.useCallback)(() => {
		if (!gallery.length) return;
		setActive((i) => (i - 1 + gallery.length) % gallery.length);
		setZoom(1);
		setPan({
			x: 0,
			y: 0
		});
	}, [gallery.length]);
	const closeLightbox = (0, import_react.useCallback)(() => {
		setLightbox(false);
		setZoom(1);
		setPan({
			x: 0,
			y: 0
		});
	}, []);
	(0, import_react.useEffect)(() => {
		if (!lightbox) return;
		const onKey = (e) => {
			if (e.key === "Escape") closeLightbox();
			if (e.key === "ArrowRight") next();
			if (e.key === "ArrowLeft") prev();
			if (e.key === "+" || e.key === "=") setZoom((z) => Math.min(z + .5, 4));
			if (e.key === "-") setZoom((z) => Math.max(z - .5, 1));
		};
		window.addEventListener("keydown", onKey);
		const prevOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			window.removeEventListener("keydown", onKey);
			document.body.style.overflow = prevOverflow;
		};
	}, [
		lightbox,
		next,
		prev,
		closeLightbox
	]);
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-7xl px-6 py-32 text-center text-sm text-muted-foreground",
		children: "Loading…"
	}) });
	if (!product) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-xl px-6 py-32 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-serif text-4xl",
				children: "Piece not found"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-muted-foreground",
				children: "The piece you are looking for may have been retired."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/shop",
				className: "mt-8 inline-block text-xs uppercase tracking-luxe link-underline",
				children: "Return to the Boutique"
			})
		]
	}) });
	const wished = wishlist.has(product.id);
	const soldOut = product.stock === "sold_out";
	const handleAddToCart = () => {
		cart.add({
			productId: product.id,
			slug: product.slug,
			name: product.name,
			price: product.price,
			image: gallery[0] ?? "",
			color: color?.name,
			size: size || void 0,
			qty
		});
		toast.success(`${product.name} added to bag`);
	};
	const waMsg = `Hello ÉCLAT, I'd like to order: ${product.name}${color ? ` · ${color.name}` : ""}${size ? ` · ${size}` : ""} × ${qty}. Total ${formatPKR(product.price * qty)}.`;
	const toggleZoom = () => {
		if (zoom > 1) {
			setZoom(1);
			setPan({
				x: 0,
				y: 0
			});
		} else setZoom(2);
	};
	const copyLink = () => {
		navigator.clipboard.writeText(window.location.href);
		toast.success("Link copied to clipboard");
		setShareOpen(false);
	};
	const shareWhatsApp = () => {
		window.open(whatsappLink(`Check out this piece from ÉCLAT: ${product.name} — ${window.location.href}`), "_blank");
		setShareOpen(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteLayout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto max-w-7xl px-6 pt-10",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "flex items-center gap-2 text-[11px] uppercase tracking-luxe text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/shop",
						className: "flex items-center gap-1 transition hover:text-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-3 w-3" }), " Shop"]
					}),
					product.category && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "/" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/shop",
						search: { cat: product.category.slug },
						className: "transition hover:text-foreground",
						children: product.category.name
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "/" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-foreground",
						children: product.name
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto grid max-w-7xl gap-10 px-6 pt-8 pb-20 lg:grid-cols-2 lg:gap-16",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "animate-fade-up",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => gallery.length > 0 && setLightbox(true),
					className: "group relative block aspect-[4/5] w-full overflow-hidden bg-secondary",
					"aria-label": "Open image lightbox",
					children: [
						gallery[active] && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: gallery[active],
							alt: `${product.name} — view ${active + 1}`,
							className: "h-full w-full object-cover animate-fade-in transition-transform duration-[1200ms] ease-out group-hover:scale-105"
						}, active),
						product.is_new && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute left-4 top-4 bg-background/90 px-3 py-1 text-[10px] uppercase tracking-luxe",
							children: "New"
						}),
						product.is_best_seller && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute left-4 top-4 bg-accent/90 px-3 py-1 text-[10px] uppercase tracking-luxe text-accent-foreground",
							children: product.is_new ? "" : "Best Seller"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center bg-background/80 text-foreground opacity-0 backdrop-blur transition group-hover:opacity-100",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Expand, { className: "h-4 w-4" })
						})
					]
				}), gallery.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 grid grid-cols-4 gap-3",
					children: gallery.map((src, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setActive(i),
						className: `relative aspect-square overflow-hidden bg-secondary transition ${active === i ? "ring-1 ring-accent ring-offset-2 ring-offset-background" : "opacity-70 hover:opacity-100"}`,
						"aria-label": `View ${i + 1}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src,
							alt: "",
							className: "h-full w-full object-cover"
						})
					}, src + i))
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "animate-fade-up lg:sticky lg:top-28 lg:self-start",
				style: { animationDelay: "120ms" },
				children: [
					product.category && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs uppercase tracking-luxe text-muted-foreground",
						children: product.category.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-3 font-serif text-4xl md:text-5xl",
						children: product.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 font-serif text-2xl text-accent",
						children: formatPKR(product.price)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 text-xs uppercase tracking-luxe",
						children: [
							product.stock === "in_stock" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-emerald-600",
								children: "In Stock"
							}),
							product.stock === "low_stock" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-amber-600",
								children: "Only a few left"
							}),
							product.stock === "sold_out" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-destructive",
								children: "Sold Out"
							})
						]
					}),
					product.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-8 text-sm leading-relaxed text-muted-foreground",
						children: product.description
					}),
					product.colors.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-10",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-baseline justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] uppercase tracking-luxe text-muted-foreground",
								children: "Colour"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs",
								children: color?.name
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 flex gap-3",
							children: product.colors.map((c) => {
								const selected = c.name === color?.name;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setColor({
										name: c.name,
										hex: c.hex
									}),
									"aria-label": c.name,
									className: `relative h-9 w-9 rounded-full border transition ${selected ? "border-accent" : "border-border hover:border-foreground/40"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "absolute inset-1 rounded-full",
										style: { backgroundColor: c.hex }
									}), selected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
										className: "absolute inset-0 m-auto h-3.5 w-3.5",
										style: { color: c.hex === "#111111" || c.hex === "#000000" ? "#fff" : "#111" }
									})]
								}, c.id);
							})
						})]
					}),
					product.sizes.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-baseline justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] uppercase tracking-luxe text-muted-foreground",
								children: "Size"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setSizeGuideOpen(true),
								className: "flex items-center gap-1 text-[10px] uppercase tracking-luxe text-muted-foreground link-underline",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ruler, { className: "h-3 w-3" }), " Size Guide"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 flex flex-wrap gap-2",
							children: product.sizes.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setSize(s),
								className: `min-w-[3rem] border px-3 py-2 text-xs uppercase tracking-luxe transition ${size === s ? "border-accent bg-accent/5" : "border-border hover:border-foreground/40"}`,
								children: s
							}, s))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex items-center gap-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] uppercase tracking-luxe text-muted-foreground",
							children: "Quantity"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center border border-border",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setQty((q) => Math.max(1, q - 1)),
									className: "px-3 py-2 transition hover:bg-secondary",
									children: "−"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "min-w-[2.5rem] text-center text-sm",
									children: qty
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setQty((q) => q + 1),
									className: "px-3 py-2 transition hover:bg-secondary",
									children: "+"
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-10 flex flex-col gap-3 sm:flex-row",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: handleAddToCart,
								disabled: soldOut,
								className: "btn-gold flex flex-1 items-center justify-center gap-2 py-5 text-xs uppercase tracking-luxe disabled:opacity-50",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "h-4 w-4" }),
									" ",
									soldOut ? "Sold Out" : "Add to Bag"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: whatsappLink(waMsg),
								target: "_blank",
								rel: "noreferrer",
								className: "flex flex-1 items-center justify-center gap-2 border border-border py-5 text-center text-xs uppercase tracking-luxe transition hover:border-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "h-4 w-4" }), " WhatsApp"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => wishlist.toggle(product.id),
								"aria-label": "Save to wishlist",
								className: `flex h-auto items-center justify-center border px-5 transition ${wished ? "border-accent text-accent" : "border-border hover:border-foreground"}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: `h-4 w-4 ${wished ? "fill-current" : ""}` })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setShareOpen(!shareOpen),
									"aria-label": "Share",
									className: "flex h-full items-center justify-center border border-border px-5 transition hover:border-foreground",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "h-4 w-4" })
								}), shareOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "absolute right-0 top-full z-20 mt-2 w-48 border border-border bg-background p-2 shadow-lg animate-fade-in",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: copyLink,
										className: "flex w-full items-center gap-2 px-3 py-2 text-xs uppercase tracking-luxe transition hover:bg-secondary",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3 w-3" }), " Copy Link"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: shareWhatsApp,
										className: "flex w-full items-center gap-2 px-3 py-2 text-xs uppercase tracking-luxe transition hover:bg-secondary",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "h-3 w-3" }), " WhatsApp"]
									})]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-10 grid grid-cols-1 gap-4 border-t border-border/60 pt-8 text-xs text-muted-foreground sm:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-4 w-4 text-accent" }), " Free delivery PKR 10k+"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4 text-accent" }), " Lifetime craftsmanship"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-4 w-4 text-accent" }), " 14-day exchange"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8",
						children: [
							product.details.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Accordion, {
								title: "The Details",
								defaultOpen: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "space-y-2 text-sm",
									children: product.details.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex gap-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-2 h-px w-4 bg-accent" }),
											" ",
											d
										]
									}, d))
								})
							}),
							product.delivery_info && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Accordion, {
								title: "Delivery & Returns",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-3 text-sm text-muted-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: product.delivery_info }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Free delivery on orders above PKR 10,000. Standard delivery takes 3-5 business days across Pakistan." }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "We accept exchanges within 14 days of delivery. Items must be unworn and in original packaging." })
									]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Accordion, {
								title: "Care Instructions",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2 text-sm text-muted-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Store in the provided dust bag when not in use." }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Avoid direct sunlight and moisture." }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Clean gently with a soft, dry cloth." }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "For leather products, condition periodically with a suitable leather cream." })
									]
								})
							})
						]
					})
				]
			})]
		}),
		related.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-7xl px-6 pb-16",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-baseline justify-between border-t border-border/60 pt-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-serif text-2xl md:text-3xl",
					children: "You may also love"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/shop",
					className: "text-xs uppercase tracking-luxe link-underline",
					children: "View all"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4",
				children: related.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, {
					product: p,
					index: i
				}, p.id))
			})]
		}),
		recentProducts.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-7xl px-6 pb-24",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-baseline justify-between border-t border-border/60 pt-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "font-serif text-2xl md:text-3xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "mb-1 mr-2 inline h-5 w-5 text-muted-foreground" }), "Recently Viewed"]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4",
				children: recentProducts.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, {
					product: p,
					index: i
				}, p.id))
			})]
		}),
		sizeGuideOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SizeGuide, { onClose: () => setSizeGuideOpen(false) }),
		lightbox && gallery.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "fixed inset-0 z-[100] flex flex-col bg-black/95 animate-fade-in",
			role: "dialog",
			"aria-modal": "true",
			"aria-label": `${product.name} gallery`,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between px-6 py-5 text-white",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-serif text-sm tracking-[0.3em]",
						children: [
							String(active + 1).padStart(2, "0"),
							" / ",
							String(gallery.length).padStart(2, "0")
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setZoom((z) => Math.max(z - .5, 1)),
								disabled: zoom <= 1,
								"aria-label": "Zoom out",
								className: "flex h-10 w-10 items-center justify-center border border-white/20 text-white transition hover:bg-white/10 disabled:opacity-30",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ZoomOut, { className: "h-4 w-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "w-12 text-center text-xs tracking-luxe text-white/70",
								children: [Math.round(zoom * 100), "%"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setZoom((z) => Math.min(z + .5, 4)),
								disabled: zoom >= 4,
								"aria-label": "Zoom in",
								className: "flex h-10 w-10 items-center justify-center border border-white/20 text-white transition hover:bg-white/10 disabled:opacity-30",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ZoomIn, { className: "h-4 w-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: closeLightbox,
								"aria-label": "Close",
								className: "ml-2 flex h-10 w-10 items-center justify-center border border-white/20 text-white transition hover:bg-white/10",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex flex-1 items-center justify-center overflow-hidden",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: prev,
							"aria-label": "Previous image",
							className: "absolute left-4 z-10 flex h-12 w-12 items-center justify-center border border-white/20 text-white transition hover:bg-white/10 md:left-8",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-5 w-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-full w-full items-center justify-center overflow-hidden",
							onMouseDown: (e) => {
								if (zoom <= 1) return;
								setDragging({
									x: e.clientX - pan.x,
									y: e.clientY - pan.y
								});
							},
							onMouseMove: (e) => {
								if (!dragging) return;
								setPan({
									x: e.clientX - dragging.x,
									y: e.clientY - dragging.y
								});
							},
							onMouseUp: () => setDragging(null),
							onMouseLeave: () => setDragging(null),
							style: { cursor: zoom > 1 ? dragging ? "grabbing" : "grab" : "zoom-in" },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: gallery[active],
								alt: `${product.name} — view ${active + 1}`,
								onClick: (e) => {
									if (zoom > 1) return;
									e.stopPropagation();
									toggleZoom();
								},
								draggable: false,
								className: "max-h-[80vh] max-w-[85vw] select-none object-contain transition-transform duration-300 ease-out animate-fade-in",
								style: {
									transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
									transitionDuration: dragging ? "0ms" : "300ms"
								}
							}, active)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: next,
							"aria-label": "Next image",
							className: "absolute right-4 z-10 flex h-12 w-12 items-center justify-center border border-white/20 text-white transition hover:bg-white/10 md:right-8",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-5 w-5" })
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex justify-center gap-2 px-6 pb-6 pt-4",
					children: gallery.map((src, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							setActive(i);
							setZoom(1);
							setPan({
								x: 0,
								y: 0
							});
						},
						"aria-label": `View ${i + 1}`,
						className: `h-16 w-16 overflow-hidden border transition ${active === i ? "border-accent" : "border-white/20 opacity-50 hover:opacity-100"}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src,
							alt: "",
							className: "h-full w-full object-cover"
						})
					}, src + i))
				})
			]
		})
	] });
}
//#endregion
export { ProductPage as component };
