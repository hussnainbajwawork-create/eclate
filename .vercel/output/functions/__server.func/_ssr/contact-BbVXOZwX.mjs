import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-B53tpCKD.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { A as Mail, C as Phone, D as MessageCircle, L as Facebook, P as Instagram, k as MapPin, q as Check, v as Send } from "../_libs/lucide-react.mjs";
import { a as SiteLayout, i as INSTAGRAM_URL, o as WHATSAPP_NUMBER, p as whatsappLink, r as FACEBOOK_URL } from "./site-layout-Cg2V6MLS.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/contact-BbVXOZwX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Contact() {
	const [sent, setSent] = (0, import_react.useState)(false);
	const [sending, setSending] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)({
		name: "",
		email: "",
		message: ""
	});
	const handleSubmit = async (e) => {
		e.preventDefault();
		setSending(true);
		try {
			const { error } = await supabase.from("contact_messages").insert({
				name: form.name,
				email: form.email,
				message: form.message
			});
			if (error) throw error;
			setSent(true);
			toast.success("Message sent. We'll be in touch shortly.");
		} catch (err) {
			toast.error(err.message ?? "Failed to send message. Please try WhatsApp instead.");
		} finally {
			setSending(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteLayout, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-3xl px-6 pt-20 pb-10 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs uppercase tracking-luxe text-muted-foreground",
				children: "Atelier ÉCLAT"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-4 font-serif text-5xl md:text-6xl",
				children: "Say Hello"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mx-auto mt-5 max-w-lg text-sm text-muted-foreground",
				children: "We respond to every message personally — usually within a few hours."
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto grid max-w-5xl gap-16 px-6 pb-24 md:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-10 w-10 items-center justify-center bg-accent/10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-4 w-4 text-accent" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-serif text-lg",
						children: "Atelier"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Gulberg III, Lahore · Pakistan"
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-10 w-10 items-center justify-center bg-accent/10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-4 w-4 text-accent" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-serif text-lg",
						children: "Phone"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: `tel:+${WHATSAPP_NUMBER}`,
						className: "mt-1 block text-sm text-muted-foreground link-underline",
						children: ["+", WHATSAPP_NUMBER]
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-10 w-10 items-center justify-center bg-accent/10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-4 w-4 text-accent" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-serif text-lg",
						children: "Email"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "mailto:hello@eclat.pk",
						className: "mt-1 block text-sm text-muted-foreground link-underline",
						children: "hello@eclat.pk"
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-t border-border/60 pt-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-xs uppercase tracking-luxe text-muted-foreground",
						children: "Follow Us"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: whatsappLink("Hello ÉCLAT"),
								target: "_blank",
								rel: "noreferrer",
								className: "flex h-11 w-11 items-center justify-center border border-border text-muted-foreground transition hover:border-[#25D366] hover:text-[#25D366]",
								"aria-label": "WhatsApp",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "h-4 w-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: INSTAGRAM_URL,
								target: "_blank",
								rel: "noreferrer",
								className: "flex h-11 w-11 items-center justify-center border border-border text-muted-foreground transition hover:border-[#E1306C] hover:text-[#E1306C]",
								"aria-label": "Instagram",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Instagram, { className: "h-4 w-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: FACEBOOK_URL,
								target: "_blank",
								rel: "noreferrer",
								className: "flex h-11 w-11 items-center justify-center border border-border text-muted-foreground transition hover:border-[#1877F2] hover:text-[#1877F2]",
								"aria-label": "Facebook",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Facebook, { className: "h-4 w-4" })
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: whatsappLink("Hello ÉCLAT, I'd like to get in touch."),
					target: "_blank",
					rel: "noreferrer",
					className: "flex items-center justify-center gap-2 bg-[#25D366] px-6 py-4 text-xs uppercase tracking-luxe text-white transition hover:bg-[#20BD5C]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "h-4 w-4" }), " Chat on WhatsApp"]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "border border-border/60 bg-card p-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-serif text-2xl",
				children: "Send a message"
			}), sent ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex flex-col items-center py-8 text-center animate-fade-up",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-14 w-14 items-center justify-center border border-accent text-accent",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-6 w-6" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 font-serif text-xl",
						children: "Thank you."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: "Our team will reply to you within 24 hours."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							setSent(false);
							setForm({
								name: "",
								email: "",
								message: ""
							});
						},
						className: "mt-6 text-xs uppercase tracking-luxe link-underline",
						children: "Send another message"
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "mt-6 space-y-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-[10px] uppercase tracking-luxe text-muted-foreground",
						children: "Name"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						required: true,
						value: form.name,
						onChange: (e) => setForm({
							...form,
							name: e.target.value
						}),
						className: "mt-1 w-full border-0 border-b border-border bg-transparent py-3 text-sm transition focus:border-accent focus:outline-none",
						placeholder: "Your name"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-[10px] uppercase tracking-luxe text-muted-foreground",
						children: "Email"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						required: true,
						type: "email",
						value: form.email,
						onChange: (e) => setForm({
							...form,
							email: e.target.value
						}),
						className: "mt-1 w-full border-0 border-b border-border bg-transparent py-3 text-sm transition focus:border-accent focus:outline-none",
						placeholder: "your@email.com"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-[10px] uppercase tracking-luxe text-muted-foreground",
						children: "Message"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						required: true,
						value: form.message,
						onChange: (e) => setForm({
							...form,
							message: e.target.value
						}),
						rows: 5,
						className: "mt-1 w-full border-0 border-b border-border bg-transparent py-3 text-sm transition focus:border-accent focus:outline-none",
						placeholder: "How can we help?"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "submit",
						disabled: sending,
						className: "btn-gold flex w-full items-center justify-center gap-2 py-4 text-xs uppercase tracking-luxe disabled:opacity-50",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-3.5 w-3.5" }),
							" ",
							sending ? "Sending…" : "Send Message"
						]
					})
				]
			})]
		})]
	})] });
}
//#endregion
export { Contact as component };
