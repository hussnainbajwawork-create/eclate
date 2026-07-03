import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-B53tpCKD.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { F as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { $ as CircleCheckBig, A as Mail, C as Phone, H as Clock, T as Package, a as User, j as LogOut, k as MapPin, q as Check, w as Pencil } from "../_libs/lucide-react.mjs";
import { a as SiteLayout, l as formatPKR, u as useAuth } from "./site-layout-Cg2V6MLS.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/account-uNgI8aYn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STATUS_STEPS = [
	"pending",
	"confirmed",
	"shipped",
	"delivered"
];
function OrderTimeline({ status }) {
	const currentIdx = STATUS_STEPS.indexOf(status);
	const isCancelled = status === "cancelled";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-1",
		children: [STATUS_STEPS.map((s, i) => {
			const done = !isCancelled && i <= currentIdx;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `flex items-center gap-1 px-2 py-1 text-[9px] uppercase tracking-luxe transition ${done ? "bg-accent/10 text-accent" : isCancelled ? "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400" : "bg-secondary text-muted-foreground"}`,
					children: [done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "h-2.5 w-2.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-2.5 w-2.5" }), s]
				}), i < STATUS_STEPS.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `h-px w-4 ${done && i < currentIdx ? "bg-accent" : "bg-border"}` })]
			}, s);
		}), isCancelled && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "ml-1 bg-red-100 px-2 py-1 text-[9px] uppercase tracking-luxe text-red-600 dark:bg-red-900/20 dark:text-red-400",
			children: "Cancelled"
		})]
	});
}
function Account() {
	const { user, loading, signOut, isAdmin } = useAuth();
	const navigate = useNavigate();
	const [orders, setOrders] = (0, import_react.useState)([]);
	const [loadingOrders, setLoadingOrders] = (0, import_react.useState)(true);
	const [profile, setProfile] = (0, import_react.useState)({
		full_name: null,
		phone: null,
		address: null,
		city: null
	});
	const [editingProfile, setEditingProfile] = (0, import_react.useState)(false);
	const [profileForm, setProfileForm] = (0, import_react.useState)({
		full_name: "",
		phone: "",
		address: "",
		city: ""
	});
	const [savingProfile, setSavingProfile] = (0, import_react.useState)(false);
	const [expandedOrder, setExpandedOrder] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!loading && !user) navigate({ to: "/auth" });
	}, [
		loading,
		user,
		navigate
	]);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		supabase.from("profiles").select("full_name, phone, address, city").eq("id", user.id).maybeSingle().then(({ data }) => {
			if (data) {
				setProfile(data);
				setProfileForm(data);
			}
		});
	}, [user]);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		supabase.from("orders").select("id,total,status,created_at,customer_name,city,order_items(name_snapshot,qty,price_snapshot,color,size)").eq("user_id", user.id).order("created_at", { ascending: false }).then(({ data }) => {
			setOrders(data ?? []);
			setLoadingOrders(false);
		});
	}, [user]);
	const saveProfile = async () => {
		if (!user) return;
		setSavingProfile(true);
		try {
			const { error } = await supabase.from("profiles").update({
				full_name: profileForm.full_name || null,
				phone: profileForm.phone || null,
				address: profileForm.address || null,
				city: profileForm.city || null
			}).eq("id", user.id);
			if (error) throw error;
			setProfile(profileForm);
			setEditingProfile(false);
			toast.success("Profile updated");
		} catch (err) {
			toast.error(err.message ?? "Failed to save profile");
		} finally {
			setSavingProfile(false);
		}
	};
	if (loading || !user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-5xl px-6 py-32 text-center text-sm text-muted-foreground",
		children: "Loading…"
	}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-5xl px-6 pt-16 pb-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-start justify-between gap-4 md:flex-row md:items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs uppercase tracking-luxe text-muted-foreground",
						children: "Maison Account"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "mt-3 font-serif text-5xl",
						children: ["Bonjour", profile.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: user.email
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-3",
					children: [isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/admin",
						className: "border border-border px-4 py-2 text-xs uppercase tracking-luxe transition hover:border-foreground",
						children: "Admin Dashboard"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: signOut,
						className: "flex items-center gap-2 border border-border px-4 py-2 text-xs uppercase tracking-luxe transition hover:border-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-3.5 w-3.5" }), " Sign Out"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-12 border border-border/60 bg-card p-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-2xl",
						children: "Your Profile"
					}), !editingProfile && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => {
							setEditingProfile(true);
							setProfileForm(profile);
						},
						className: "flex items-center gap-2 text-xs uppercase tracking-luxe text-muted-foreground transition hover:text-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-3 w-3" }), " Edit"]
					})]
				}), editingProfile ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 grid gap-4 md:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] uppercase tracking-luxe text-muted-foreground",
								children: "Full Name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: profileForm.full_name ?? "",
								onChange: (e) => setProfileForm({
									...profileForm,
									full_name: e.target.value
								}),
								className: "mt-1 w-full border border-border bg-transparent px-3 py-2.5 text-sm transition focus:border-accent focus:outline-none"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] uppercase tracking-luxe text-muted-foreground",
								children: "Phone"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: profileForm.phone ?? "",
								onChange: (e) => setProfileForm({
									...profileForm,
									phone: e.target.value
								}),
								type: "tel",
								className: "mt-1 w-full border border-border bg-transparent px-3 py-2.5 text-sm transition focus:border-accent focus:outline-none"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] uppercase tracking-luxe text-muted-foreground",
								children: "City"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: profileForm.city ?? "",
								onChange: (e) => setProfileForm({
									...profileForm,
									city: e.target.value
								}),
								className: "mt-1 w-full border border-border bg-transparent px-3 py-2.5 text-sm transition focus:border-accent focus:outline-none"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] uppercase tracking-luxe text-muted-foreground",
								children: "Address"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: profileForm.address ?? "",
								onChange: (e) => setProfileForm({
									...profileForm,
									address: e.target.value
								}),
								className: "mt-1 w-full border border-border bg-transparent px-3 py-2.5 text-sm transition focus:border-accent focus:outline-none"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-3 md:col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: saveProfile,
								disabled: savingProfile,
								className: "btn-gold flex items-center gap-2 px-6 py-2.5 text-xs uppercase tracking-luxe disabled:opacity-50",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" }),
									" ",
									savingProfile ? "Saving…" : "Save Profile"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setEditingProfile(false),
								className: "border border-border px-5 py-2.5 text-xs uppercase tracking-luxe transition hover:border-foreground",
								children: "Cancel"
							})]
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 grid gap-4 md:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-4 w-4 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] uppercase tracking-luxe text-muted-foreground",
								children: "Name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: profile.full_name || "Not set" })] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-4 w-4 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] uppercase tracking-luxe text-muted-foreground",
								children: "Phone"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: profile.phone || "Not set" })] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-4 w-4 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] uppercase tracking-luxe text-muted-foreground",
								children: "City"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: profile.city || "Not set" })] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-4 w-4 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] uppercase tracking-luxe text-muted-foreground",
								children: "Email"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: user.email })] })]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-16 font-serif text-3xl",
				children: "Order History"
			}),
			loadingOrders ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-8 text-sm text-muted-foreground",
				children: "Loading orders…"
			}) : orders.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 border border-border/60 bg-card p-16 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "mx-auto h-10 w-10 text-muted-foreground/30" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm text-muted-foreground",
						children: "You haven't placed an order yet."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/shop",
						className: "mt-6 inline-block btn-gold px-8 py-3 text-xs uppercase tracking-luxe",
						children: "Start Shopping"
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-8 space-y-4",
				children: orders.map((o) => {
					const expanded = expandedOrder === o.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "border border-border/60 bg-card transition hover:shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setExpandedOrder(expanded ? null : o.id),
							className: "flex w-full flex-wrap items-center justify-between gap-3 px-6 py-5 text-left",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-5 w-5 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-mono text-xs text-muted-foreground",
									children: ["#", o.id.slice(0, 8)]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-3 font-serif text-base",
									children: formatPKR(o.total)
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderTimeline, { status: o.status }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground",
									children: new Date(o.created_at).toLocaleDateString()
								})]
							})]
						}), expanded && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-t border-border/60 px-6 py-5 animate-fade-in",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "text-[10px] uppercase tracking-luxe text-muted-foreground",
									children: "Items"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "mt-3 space-y-2 text-sm",
									children: o.order_items.map((item, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											item.name_snapshot,
											item.color && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-muted-foreground",
												children: [" · ", item.color]
											}),
											item.size && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-muted-foreground",
												children: [" · ", item.size]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-muted-foreground",
												children: [" × ", item.qty]
											})
										] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatPKR(Number(item.price_snapshot) * item.qty) })]
									}, idx))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 flex items-baseline justify-between border-t border-border/60 pt-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs uppercase tracking-luxe text-muted-foreground",
										children: "Total"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-serif text-xl",
										children: formatPKR(o.total)
									})]
								})
							]
						})]
					}, o.id);
				})
			})
		]
	}) });
}
//#endregion
export { Account as component };
