import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-B53tpCKD.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as Mail, D as MessageCircle, J as ArrowRight, P as Instagram, W as ChevronRight, f as Star } from "../_libs/lucide-react.mjs";
import { a as SiteLayout, i as INSTAGRAM_URL, p as whatsappLink } from "./site-layout-Cg2V6MLS.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { r as useProducts } from "./db-Dt9Bwu6d.mjs";
import { t as ProductCard } from "./product-card-Ck9qO05U.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-D26AZFRQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var testimonials = [
	{
		name: "Hira A.",
		city: "Lahore",
		text: "The craftsmanship is unmatched. My Aurora Tote feels heirloom-quality.",
		rating: 5
	},
	{
		name: "Sana M.",
		city: "Karachi",
		text: "Elegant, understated and beautifully made. ÉCLAT has become my signature.",
		rating: 5
	},
	{
		name: "Mahnoor R.",
		city: "Islamabad",
		text: "The Noire Crossbody is the most luxurious bag I own. Simply exquisite.",
		rating: 5
	}
];
var instagramPosts = [
	"https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80",
	"https://images.unsplash.com/photo-1591348122449-02525d70379b?auto=format&fit=crop&w=600&q=80",
	"https://images.unsplash.com/photo-1559563458-527698bf5295?auto=format&fit=crop&w=600&q=80",
	"https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80",
	"https://images.unsplash.com/photo-1571945153237-4929e783af4a?auto=format&fit=crop&w=600&q=80",
	"https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=600&q=80"
];
function NewsletterBanner() {
	const [email, setEmail] = (0, import_react.useState)("");
	const [submitted, setSubmitted] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const subscribe = async (e) => {
		e.preventDefault();
		setBusy(true);
		try {
			const { error } = await supabase.from("newsletter_subscribers").insert({ email });
			if (error) if (error.code === "23505") {
				toast.success("You're already subscribed!");
				setSubmitted(true);
			} else throw error;
			else {
				setSubmitted(true);
				toast.success("Welcome to the ÉCLAT journal.");
			}
		} catch (err) {
			toast.error(err.message ?? "Failed to subscribe");
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative overflow-hidden bg-foreground text-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-0 opacity-[0.03]",
			style: { backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative mx-auto max-w-3xl px-6 py-20 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "mx-auto h-8 w-8 text-gold opacity-80" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-6 font-serif text-3xl md:text-4xl",
					children: "Join the ÉCLAT Journal"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mx-auto mt-4 max-w-md text-sm leading-relaxed text-background/70",
					children: "Be the first to discover new collections, exclusive offers and behind-the-scenes stories from our atelier."
				}),
				submitted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-8 text-sm text-accent animate-fade-up",
					children: "Thank you. Welcome to the maison."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: subscribe,
					className: "mx-auto mt-8 flex max-w-md gap-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "email",
						required: true,
						value: email,
						onChange: (e) => setEmail(e.target.value),
						placeholder: "your@email.com",
						className: "flex-1 border border-background/20 bg-transparent px-5 py-4 text-sm text-background placeholder:text-background/40 transition focus:border-accent focus:outline-none"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: busy,
						className: "bg-accent px-8 py-4 text-xs uppercase tracking-luxe text-accent-foreground transition hover:bg-accent/90 disabled:opacity-50",
						children: busy ? "…" : "Subscribe"
					})]
				})
			]
		})]
	});
}
function Home() {
	const { data: products = [], isLoading } = useProducts();
	const featured = products.slice(0, 3);
	const newArrivals = products.filter((p) => p.is_new).slice(0, 4);
	const bestSellers = products.filter((p) => p.is_best_seller).slice(0, 4);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteLayout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "relative h-[88vh] min-h-[640px] w-full overflow-hidden",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "https://images.unsplash.com/photo-1591348122449-02525d70379b?auto=format&fit=crop&w=2000&q=80",
					alt: "ÉCLAT luxury handbag",
					className: "absolute inset-0 h-full w-full object-cover animate-ken-burns"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/50" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white animate-fade-up",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs uppercase tracking-luxe text-white/80",
							children: "Maison ÉCLAT · Pakistan"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "mt-6 font-serif text-5xl leading-[1.05] md:text-7xl lg:text-8xl",
							children: [
								"Timeless Elegance,",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								"Crafted for Pakistan."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-6 max-w-xl text-sm leading-relaxed text-white/80 md:text-base",
							children: "A new house of leather, born of quiet luxury and contemporary form."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-10 flex flex-col gap-3 sm:flex-row",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/shop",
								className: "group inline-flex items-center justify-center gap-2 border border-white/80 px-8 py-4 text-xs uppercase tracking-luxe transition hover:bg-white hover:text-foreground",
								children: ["Shop the Maison", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5 transition-transform group-hover:translate-x-1" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: whatsappLink("Hello ÉCLAT, I'd like to place an order."),
								target: "_blank",
								rel: "noreferrer",
								className: "btn-gold inline-flex items-center justify-center gap-2 px-8 py-4 text-xs uppercase tracking-luxe",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "h-4 w-4" }), " Order on WhatsApp"]
							})]
						})
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "mx-auto grid max-w-7xl gap-6 px-6 py-24 md:grid-cols-2",
			children: [{
				to: "/handbags",
				label: "Handbags",
				sub: "Totes, Crossbodies & Mini Bags",
				img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1400&q=80"
			}, {
				to: "/shoes",
				label: "Shoes",
				sub: "Heels, Flats & Loafers",
				img: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1400&q=80"
			}].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: c.to,
				className: "group relative block aspect-[4/5] overflow-hidden bg-secondary md:aspect-[5/6]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: c.img,
						alt: c.label,
						loading: "lazy",
						className: "h-full w-full object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-110"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/0" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute inset-x-0 bottom-0 p-8 text-white",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-serif text-3xl md:text-4xl",
								children: c.label
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-white/70",
								children: c.sub
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "mt-3 inline-flex items-center gap-2 text-xs uppercase tracking-luxe",
								children: ["Discover ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5 transition-transform group-hover:translate-x-1" })]
							})
						]
					})
				]
			}, c.to))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-7xl px-6 pb-24",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs uppercase tracking-luxe text-muted-foreground",
							children: "The Edit"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-4 font-serif text-4xl md:text-5xl",
							children: "Featured Pieces"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-6 h-px w-12 bg-accent" })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-16 grid gap-10 md:grid-cols-3",
					children: isLoading ? Array.from({ length: 3 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "aspect-[4/5] animate-pulse bg-secondary" }, i)) : featured.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, {
						product: p,
						index: i
					}, p.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-12 text-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/shop",
						className: "inline-flex items-center gap-2 text-xs uppercase tracking-luxe link-underline",
						children: ["View Full Collection ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3.5 w-3.5" })]
					})
				})
			]
		}),
		bestSellers.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "bg-secondary/40",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-7xl px-6 py-24",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs uppercase tracking-luxe text-muted-foreground",
								children: "Most Loved"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-4 font-serif text-4xl md:text-5xl",
								children: "Best Sellers"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-6 h-px w-12 bg-accent" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-16 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4",
						children: bestSellers.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, {
							product: p,
							index: i
						}, p.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-12 text-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/shop",
							search: { tag: "best" },
							className: "inline-flex items-center gap-2 text-xs uppercase tracking-luxe link-underline",
							children: ["Shop Best Sellers ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3.5 w-3.5" })]
						})
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "relative overflow-hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto grid max-w-7xl gap-16 px-6 py-24 md:grid-cols-2 md:py-32",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative aspect-[4/5] overflow-hidden",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "https://images.unsplash.com/photo-1559563458-527698bf5295?auto=format&fit=crop&w=1200&q=80",
						alt: "Atelier",
						loading: "lazy",
						className: "h-full w-full object-cover"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col justify-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs uppercase tracking-luxe text-muted-foreground",
							children: "Our Story"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "mt-4 font-serif text-4xl leading-tight md:text-5xl",
							children: [
								"A maison rooted in ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", {
									className: "text-accent",
									children: "quiet"
								}),
								" luxury."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-8 max-w-md text-base leading-relaxed text-muted-foreground",
							children: "ÉCLAT brings together refined craftsmanship and contemporary design, creating handbags and shoes that embody sophistication and everyday luxury for women across Pakistan."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/about",
							className: "mt-10 inline-flex w-fit items-center gap-2 text-xs uppercase tracking-luxe link-underline",
							children: ["Discover the Maison ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5" })]
						})
					]
				})]
			})
		}),
		newArrivals.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-7xl px-6 py-24",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs uppercase tracking-luxe text-muted-foreground",
							children: "Just In"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-4 font-serif text-4xl md:text-5xl",
							children: "New Arrivals"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-6 h-px w-12 bg-accent" })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-16 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4",
					children: newArrivals.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, {
						product: p,
						index: i
					}, p.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-12 text-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/shop",
						search: { tag: "new" },
						className: "inline-flex items-center gap-2 text-xs uppercase tracking-luxe link-underline",
						children: ["Shop New Arrivals ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3.5 w-3.5" })]
					})
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-7xl px-6 py-24 md:py-32",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs uppercase tracking-luxe text-muted-foreground",
						children: "Voices"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-4 font-serif text-4xl md:text-5xl",
						children: "From Our Clientele"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-6 h-px w-12 bg-accent" })
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-16 grid gap-8 md:grid-cols-3",
				children: testimonials.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
					className: "border border-border/60 bg-card p-8 text-center animate-fade-up",
					style: { animationDelay: `${i * 120}ms` },
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex justify-center gap-1 text-accent",
							children: Array.from({ length: t.rating }).map((_, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-3.5 w-3.5 fill-current" }, idx))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("blockquote", {
							className: "mt-6 font-serif text-lg italic leading-relaxed",
							children: [
								"\"",
								t.text,
								"\""
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", {
							className: "mt-6 text-xs uppercase tracking-luxe text-muted-foreground",
							children: [
								t.name,
								" · ",
								t.city
							]
						})
					]
				}, t.name))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewsletterBanner, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-7xl px-6 py-24",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Instagram, { className: "h-6 w-6 text-muted-foreground" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-4 font-serif text-3xl md:text-4xl",
							children: "Follow @eclat.pk"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm text-muted-foreground",
							children: "See the latest from our atelier on Instagram"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-10 grid grid-cols-3 gap-3 md:grid-cols-6",
					children: instagramPosts.map((url, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: INSTAGRAM_URL,
						target: "_blank",
						rel: "noreferrer",
						className: "group relative aspect-square overflow-hidden bg-secondary",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: url,
							alt: `ÉCLAT Instagram post ${i + 1}`,
							loading: "lazy",
							className: "h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/30",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Instagram, { className: "h-6 w-6 text-white opacity-0 transition group-hover:opacity-100" })
						})]
					}, i))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 text-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: INSTAGRAM_URL,
						target: "_blank",
						rel: "noreferrer",
						className: "inline-flex items-center gap-2 text-xs uppercase tracking-luxe link-underline",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Instagram, { className: "h-3.5 w-3.5" }), " Follow Us on Instagram"]
					})
				})
			]
		})
	] });
}
//#endregion
export { Home as component };
