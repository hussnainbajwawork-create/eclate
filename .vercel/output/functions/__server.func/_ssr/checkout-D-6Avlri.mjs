import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-B53tpCKD.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { F as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { D as MessageCircle, q as Check } from "../_libs/lucide-react.mjs";
import { a as SiteLayout, d as useCart, l as formatPKR, p as whatsappLink, u as useAuth } from "./site-layout-Cg2V6MLS.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/checkout-D-6Avlri.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var inputCls = "w-full border-0 border-b border-border bg-transparent py-2.5 text-sm focus:border-accent focus:outline-none focus:ring-0";
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-[10px] uppercase tracking-luxe text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-2",
			children
		})]
	});
}
function Checkout() {
	const { items, subtotal, clear } = useCart();
	const { user } = useAuth();
	const navigate = useNavigate();
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [done, setDone] = (0, import_react.useState)(null);
	const delivery = subtotal >= 1e4 || subtotal === 0 ? 0 : 300;
	const total = subtotal + delivery;
	const onSubmit = async (e) => {
		e.preventDefault();
		if (items.length === 0) {
			toast.error("Your bag is empty");
			return;
		}
		setSubmitting(true);
		try {
			const fd = new FormData(e.currentTarget);
			const customer_name = String(fd.get("name") ?? "");
			const phone = String(fd.get("phone") ?? "");
			const email = String(fd.get("email") ?? "") || null;
			const address = String(fd.get("address") ?? "");
			const city = String(fd.get("city") ?? "");
			const notes = String(fd.get("notes") ?? "") || null;
			const { data: order, error } = await supabase.from("orders").insert({
				user_id: user?.id ?? null,
				customer_name,
				phone,
				email,
				address,
				city,
				notes,
				total
			}).select().single();
			if (error) throw error;
			const itemRows = items.map((i) => ({
				order_id: order.id,
				product_id: i.productId,
				name_snapshot: i.name,
				price_snapshot: i.price,
				qty: i.qty,
				color: i.color ?? null,
				size: i.size ?? null
			}));
			const { error: itemsError } = await supabase.from("order_items").insert(itemRows);
			if (itemsError) throw itemsError;
			const waUrl = whatsappLink(`Hello ÉCLAT, I'd like to confirm my order:\n\n${items.map((i) => `• ${i.name}${i.color ? ` · ${i.color}` : ""}${i.size ? ` · ${i.size}` : ""} × ${i.qty} — ${formatPKR(i.price * i.qty)}`).join("\n")}\n\nTotal: ${formatPKR(total)}\nName: ${customer_name}\nPhone: ${phone}\nAddress: ${address}, ${city}\nOrder ID: ${order.id.slice(0, 8)}`);
			await supabase.from("orders").update({ whatsapp_sent: true }).eq("id", order.id);
			clear();
			setDone({
				orderId: order.id,
				waUrl
			});
			window.open(waUrl, "_blank");
		} catch (err) {
			console.error(err);
			toast.error(err.message ?? "Could not place order");
		} finally {
			setSubmitting(false);
		}
	};
	if (done) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto flex max-w-2xl flex-col items-center px-6 py-32 text-center animate-fade-up",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex h-16 w-16 items-center justify-center rounded-full border border-accent text-accent",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-7 w-7" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-8 font-serif text-4xl md:text-5xl",
				children: "Merci."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-6 max-w-md text-sm leading-relaxed text-muted-foreground",
				children: [
					"Your order has been received. Order ID:",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-foreground",
						children: done.orderId.slice(0, 8)
					}),
					". Continue your conversation on WhatsApp to confirm details."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 flex gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: done.waUrl,
					target: "_blank",
					rel: "noreferrer",
					className: "btn-gold inline-flex items-center gap-2 px-6 py-3 text-xs uppercase tracking-luxe",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "h-4 w-4" }), " Open WhatsApp"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => navigate({ to: "/shop" }),
					className: "border border-border px-6 py-3 text-xs uppercase tracking-luxe link-underline",
					children: "Continue Shopping"
				})]
			})
		]
	}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteLayout, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-3xl px-6 pt-16 pb-10 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs uppercase tracking-luxe text-muted-foreground",
				children: "Checkout"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-4 font-serif text-5xl md:text-6xl",
				children: "Place Your Order"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mx-auto mt-5 max-w-lg text-sm text-muted-foreground",
				children: "Confirm your details. We'll continue on WhatsApp to arrange delivery."
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-4xl px-6 pb-32",
		children: [items.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-8 border border-border/60 bg-card p-6 text-center text-sm",
			children: ["Your bag is empty. ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/shop",
				className: "link-underline",
				children: "Shop the collection."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit,
			className: "border border-border/60 bg-card p-8 md:p-14 animate-fade-up",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-serif text-2xl",
					children: "Your Details"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 grid gap-6 md:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Full Name",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								name: "name",
								required: true,
								className: inputCls
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Phone Number",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								name: "phone",
								required: true,
								type: "tel",
								className: inputCls
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Email",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								name: "email",
								type: "email",
								defaultValue: user?.email ?? "",
								className: inputCls
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "City",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								name: "city",
								required: true,
								className: inputCls
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "md:col-span-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Address",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									name: "address",
									required: true,
									className: inputCls
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "md:col-span-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Delivery Notes",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									name: "notes",
									placeholder: "Optional",
									className: inputCls
								})
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-12 font-serif text-2xl",
					children: "Order Summary"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-6 divide-y divide-border/60 border-y border-border/60",
					children: items.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between py-4 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [i.name, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "ml-2 text-xs text-muted-foreground",
							children: ["× ", i.qty]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatPKR(i.price * i.qty) })]
					}, i.productId + i.color + i.size))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "mt-4 space-y-2 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-muted-foreground",
								children: "Subtotal"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: formatPKR(subtotal) })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-muted-foreground",
								children: "Delivery"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: delivery === 0 ? "Complimentary" : formatPKR(delivery) })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex items-baseline justify-between border-t border-border/60 pt-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-xs uppercase tracking-luxe text-muted-foreground",
								children: "Total"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "font-serif text-2xl",
								children: formatPKR(total)
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "submit",
					disabled: submitting || items.length === 0,
					className: "btn-gold mt-10 flex w-full items-center justify-center gap-2 py-5 text-xs uppercase tracking-luxe disabled:opacity-50",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "h-4 w-4" }),
						" ",
						submitting ? "Placing…" : "Place Order via WhatsApp"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-center text-[11px] text-muted-foreground",
					children: "Complimentary delivery on orders above PKR 10,000."
				})
			]
		})]
	})] });
}
//#endregion
export { Checkout as component };
