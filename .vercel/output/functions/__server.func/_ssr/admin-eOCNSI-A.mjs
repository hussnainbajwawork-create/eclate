import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-B53tpCKD.mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, o as require_react, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { F as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { $ as ChartColumn, A as Mail, D as MessageCircle, F as Image, H as Clock, K as ChevronDown, N as LayoutDashboard, Q as CircleCheckBig, R as Eye, S as Plus, T as Package, U as ChevronUp, Y as TriangleAlert, Z as CircleX, _ as Settings, c as TrendingUp, i as Users, j as LogOut, l as Trash2, m as ShoppingBag, o as Upload, r as X, s as Truck, u as Tag, w as Pencil, y as Search, z as EyeOff } from "../_libs/lucide-react.mjs";
import { a as SiteLayout, l as formatPKR, u as useAuth } from "./site-layout-Cg2V6MLS.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { r as useProducts, t as useCategories } from "./db-Dt9Bwu6d.mjs";
import { a as Area, c as ResponsiveContainer, i as XAxis, l as Tooltip, n as BarChart, o as CartesianGrid, r as YAxis, s as Bar, t as AreaChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-eOCNSI-A.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
async function fetchDashboardStats() {
	const [products, orders, customers, lowStock] = await Promise.all([
		supabase.from("products").select("id", {
			count: "exact",
			head: true
		}),
		supabase.from("orders").select("id, total, status"),
		supabase.from("profiles").select("id", {
			count: "exact",
			head: true
		}),
		supabase.from("products").select("id", {
			count: "exact",
			head: true
		}).eq("stock", "low_stock")
	]);
	const orderData = orders.data ?? [];
	const totalRevenue = orderData.filter((o) => o.status === "delivered" || o.status === "confirmed" || o.status === "shipped").reduce((sum, o) => sum + Number(o.total), 0);
	const pendingOrders = orderData.filter((o) => o.status === "pending").length;
	return {
		totalProducts: products.count ?? 0,
		totalOrders: orderData.length,
		totalRevenue,
		totalCustomers: customers.count ?? 0,
		pendingOrders,
		lowStockProducts: lowStock.count ?? 0
	};
}
function useDashboardStats() {
	return useQuery({
		queryKey: ["admin", "stats"],
		queryFn: fetchDashboardStats
	});
}
async function fetchAdminOrders() {
	const { data, error } = await supabase.from("orders").select("id,customer_name,phone,email,address,city,notes,total,status,whatsapp_sent,created_at,updated_at,order_items(name_snapshot,qty,price_snapshot,color,size)").order("created_at", { ascending: false });
	if (error) throw error;
	return (data ?? []).map((o) => ({
		...o,
		total: Number(o.total)
	}));
}
function useAdminOrders() {
	return useQuery({
		queryKey: ["admin", "orders"],
		queryFn: fetchAdminOrders
	});
}
function useUpdateOrderStatus() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async ({ id, status }) => {
			const { error } = await supabase.from("orders").update({ status }).eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["admin", "orders"] });
			qc.invalidateQueries({ queryKey: ["admin", "stats"] });
		}
	});
}
async function fetchCustomers() {
	const { data: profiles, error } = await supabase.from("profiles").select("id, full_name, phone, city, created_at").order("created_at", { ascending: false });
	if (error) throw error;
	const { data: orders } = await supabase.from("orders").select("user_id, total");
	const orderMap = /* @__PURE__ */ new Map();
	(orders ?? []).forEach((o) => {
		if (!o.user_id) return;
		const existing = orderMap.get(o.user_id) ?? {
			count: 0,
			total: 0
		};
		existing.count++;
		existing.total += Number(o.total);
		orderMap.set(o.user_id, existing);
	});
	return (profiles ?? []).map((p) => {
		const agg = orderMap.get(p.id) ?? {
			count: 0,
			total: 0
		};
		return {
			...p,
			order_count: agg.count,
			total_spent: agg.total
		};
	});
}
function useCustomers() {
	return useQuery({
		queryKey: ["admin", "customers"],
		queryFn: fetchCustomers
	});
}
async function fetchContactMessages() {
	const { data, error } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
	if (error) throw error;
	return data ?? [];
}
function useContactMessages() {
	return useQuery({
		queryKey: ["admin", "messages"],
		queryFn: fetchContactMessages
	});
}
function useMarkMessageRead() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("contact_messages").update({ read: true }).eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "messages"] })
	});
}
function useDeleteProduct() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("products").delete().eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["products"] });
			qc.invalidateQueries({ queryKey: ["admin", "stats"] });
		}
	});
}
function useSaveProduct() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async ({ id, payload, images, colors }) => {
			let productId = id ?? "";
			if (!id) {
				const { data, error } = await supabase.from("products").insert(payload).select("id").single();
				if (error) throw error;
				productId = data.id;
			} else {
				const { error } = await supabase.from("products").update(payload).eq("id", id);
				if (error) throw error;
			}
			await supabase.from("product_images").delete().eq("product_id", productId);
			if (images.length > 0) {
				const rows = images.map((img, i) => ({
					product_id: productId,
					url: img.url,
					alt: img.alt || payload.name,
					sort_order: i
				}));
				const { error } = await supabase.from("product_images").insert(rows);
				if (error) throw error;
			}
			await supabase.from("product_colors").delete().eq("product_id", productId);
			if (colors.length > 0) {
				const rows = colors.map((c, i) => ({
					product_id: productId,
					name: c.name,
					hex: c.hex,
					sort_order: i
				}));
				const { error } = await supabase.from("product_colors").insert(rows);
				if (error) throw error;
			}
			return productId;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["products"] });
			qc.invalidateQueries({ queryKey: ["product"] });
			qc.invalidateQueries({ queryKey: ["admin", "stats"] });
		}
	});
}
function useDeleteCategory() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("categories").delete().eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] })
	});
}
function useSaveCategory() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async ({ id, data }) => {
			if (id) {
				const { error } = await supabase.from("categories").update(data).eq("id", id);
				if (error) throw error;
			} else {
				const { error } = await supabase.from("categories").insert(data);
				if (error) throw error;
			}
		},
		onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] })
	});
}
async function uploadProductImage(file) {
	const ext = file.name.split(".").pop() ?? "jpg";
	const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
	const { error } = await supabase.storage.from("product-images").upload(path, file, {
		cacheControl: "31536000",
		upsert: false
	});
	if (error) throw error;
	const { data } = supabase.storage.from("product-images").getPublicUrl(path);
	return data.publicUrl;
}
function useRevenueChart() {
	return useQuery({
		queryKey: ["admin", "revenue-chart"],
		queryFn: async () => {
			const { data, error } = await supabase.from("orders").select("created_at, total, status").order("created_at");
			if (error) throw error;
			const map = /* @__PURE__ */ new Map();
			(data ?? []).forEach((o) => {
				const date = new Date(o.created_at).toLocaleDateString("en-GB", {
					day: "2-digit",
					month: "short"
				});
				const existing = map.get(date) ?? {
					revenue: 0,
					orders: 0
				};
				existing.orders++;
				if (o.status !== "cancelled") existing.revenue += Number(o.total);
				map.set(date, existing);
			});
			return Array.from(map.entries()).map(([date, vals]) => ({
				date,
				...vals
			}));
		}
	});
}
var TABS = [
	{
		id: "dashboard",
		label: "Dashboard",
		Icon: LayoutDashboard
	},
	{
		id: "products",
		label: "Products",
		Icon: Package
	},
	{
		id: "categories",
		label: "Categories",
		Icon: Tag
	},
	{
		id: "orders",
		label: "Orders",
		Icon: ShoppingBag
	},
	{
		id: "customers",
		label: "Customers",
		Icon: Users
	},
	{
		id: "messages",
		label: "Messages",
		Icon: Mail
	},
	{
		id: "analytics",
		label: "Analytics",
		Icon: ChartColumn
	},
	{
		id: "settings",
		label: "Settings",
		Icon: Settings
	}
];
function Admin() {
	const { user, isAdmin, loading, signOut } = useAuth();
	const navigate = useNavigate();
	const [tab, setTab] = (0, import_react.useState)("dashboard");
	(0, import_react.useEffect)(() => {
		if (!loading && !user) navigate({ to: "/auth" });
	}, [
		loading,
		user,
		navigate
	]);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-5xl px-6 py-32 text-center text-sm text-muted-foreground",
		children: "Loading…"
	}) });
	if (user && !isAdmin) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-xl px-6 py-32 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-serif text-4xl",
				children: "Access reserved"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-sm text-muted-foreground",
				children: [
					"This area is reserved for the ÉCLAT atelier team. If you should have access, ask an admin to grant you the",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono",
						children: " admin"
					}),
					" role."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-xs text-muted-foreground",
				children: ["Your user id: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono",
					children: user?.id
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/account",
				className: "mt-8 inline-block text-xs uppercase tracking-luxe link-underline",
				children: "Back to account"
			})
		]
	}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-[1400px] px-6 pt-10 pb-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs uppercase tracking-luxe text-muted-foreground",
					children: "Atelier"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-3 font-serif text-4xl md:text-5xl",
					children: "Admin Dashboard"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: signOut,
					className: "flex items-center gap-2 border border-border px-4 py-2 text-xs uppercase tracking-luxe transition hover:border-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-3.5 w-3.5" }), " Sign Out"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "mt-8 flex gap-1 overflow-x-auto border-b border-border/60 pb-px scrollbar-hide",
				children: TABS.map(({ id, label, Icon }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setTab(id),
					className: `flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-xs uppercase tracking-luxe transition ${tab === id ? "border-accent text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3.5 w-3.5" }),
						" ",
						label
					]
				}, id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 animate-fade-in",
				children: [
					tab === "dashboard" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashboardTab, {}),
					tab === "products" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductsTab, {}),
					tab === "categories" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoriesTab, {}),
					tab === "orders" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrdersTab, {}),
					tab === "customers" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomersTab, {}),
					tab === "messages" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessagesTab, {}),
					tab === "analytics" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnalyticsTab, {}),
					tab === "settings" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsTab, {})
				]
			}, tab)
		]
	}) });
}
function AdminInput({ label, value, onChange, ...rest }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-[10px] uppercase tracking-luxe text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			...rest,
			value,
			onChange: (e) => onChange(e.target.value),
			className: "mt-1 w-full border border-border bg-transparent px-3 py-2.5 text-sm transition focus:border-accent focus:outline-none"
		})]
	});
}
function AdminTextarea({ label, value, onChange, rows, placeholder }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-[10px] uppercase tracking-luxe text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
			rows,
			placeholder,
			value,
			onChange: (e) => onChange(e.target.value),
			className: "mt-1 w-full border border-border bg-transparent px-3 py-2.5 text-sm transition focus:border-accent focus:outline-none"
		})]
	});
}
function AdminSelect({ label, value, onChange, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-[10px] uppercase tracking-luxe text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
			value,
			onChange: (e) => onChange(e.target.value),
			className: "mt-1 w-full border border-border bg-transparent px-3 py-2.5 text-sm transition focus:border-accent focus:outline-none",
			children
		})]
	});
}
function StatCard({ label, value, sub, icon: Icon, accent }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `border p-6 transition hover:shadow-md ${accent ? "border-accent/40 bg-accent/5" : "border-border/60 bg-card"}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[10px] uppercase tracking-luxe text-muted-foreground",
					children: label
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 font-serif text-3xl",
					children: value
				}),
				sub && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: sub
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `flex h-10 w-10 items-center justify-center ${accent ? "bg-accent/10 text-accent" : "bg-secondary text-muted-foreground"}`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
			})]
		})
	});
}
function StatusBadge({ status }) {
	const styles = {
		pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
		confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
		shipped: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
		delivered: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
		cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
	};
	const Icon = {
		pending: Clock,
		confirmed: CircleCheckBig,
		shipped: Truck,
		delivered: CircleCheckBig,
		cancelled: CircleX
	}[status] ?? Clock;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: `inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1 text-[10px] font-medium uppercase tracking-luxe ${styles[status] ?? "bg-secondary text-foreground"}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3 w-3" }),
			" ",
			status
		]
	});
}
function EmptyState({ icon: Icon, title, description }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center border border-border/60 bg-card px-6 py-16 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex h-14 w-14 items-center justify-center bg-secondary text-muted-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-6 w-6" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-4 font-serif text-xl",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-sm text-sm text-muted-foreground",
				children: description
			})
		]
	});
}
function DashboardTab() {
	const { data: stats, isLoading } = useDashboardStats();
	const { data: orders = [] } = useAdminOrders();
	const recentOrders = orders.slice(0, 5);
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted-foreground",
		children: "Loading dashboard…"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Total Products",
						value: stats?.totalProducts ?? 0,
						icon: Package
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Total Orders",
						value: stats?.totalOrders ?? 0,
						sub: `${stats?.pendingOrders ?? 0} pending`,
						icon: ShoppingBag
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Revenue",
						value: formatPKR(stats?.totalRevenue ?? 0),
						icon: TrendingUp,
						accent: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Customers",
						value: stats?.totalCustomers ?? 0,
						icon: Users
					})
				]
			}),
			(stats?.lowStockProducts ?? 0) > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 border border-amber-300/50 bg-amber-50 px-5 py-3 text-sm dark:border-amber-700/50 dark:bg-amber-900/20",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4 text-amber-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: stats?.lowStockProducts }), " product(s) are running low on stock."] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-[1fr_380px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-serif text-2xl",
					children: "Recent Orders"
				}), recentOrders.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm text-muted-foreground",
					children: "No orders yet."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 overflow-x-auto border border-border/60 bg-card",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-secondary/50 text-left text-[10px] uppercase tracking-luxe text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Order"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Customer"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Total"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Status"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Date"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y divide-border/60",
							children: recentOrders.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "transition hover:bg-secondary/30",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "px-4 py-3 font-mono text-xs",
										children: ["#", o.id.slice(0, 8)]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3",
										children: o.customer_name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 font-serif",
										children: formatPKR(o.total)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: o.status })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 text-xs text-muted-foreground",
										children: new Date(o.created_at).toLocaleDateString()
									})
								]
							}, o.id))
						})]
					})
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-serif text-2xl",
					children: "Quick Stats"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Low Stock Items",
						value: stats?.lowStockProducts ?? 0,
						icon: TriangleAlert,
						accent: (stats?.lowStockProducts ?? 0) > 0
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Pending Orders",
						value: stats?.pendingOrders ?? 0,
						icon: Clock,
						accent: (stats?.pendingOrders ?? 0) > 0
					})]
				})] })]
			})
		]
	});
}
function ProductsTab() {
	const { data: products = [] } = useProducts();
	const { data: categories = [] } = useCategories();
	const deleteProduct = useDeleteProduct();
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [searchQ, setSearchQ] = (0, import_react.useState)("");
	const [filterStock, setFilterStock] = (0, import_react.useState)("all");
	const filtered = products.filter((p) => {
		if (searchQ && !p.name.toLowerCase().includes(searchQ.toLowerCase())) return false;
		if (filterStock !== "all" && p.stock !== filterStock) return false;
		return true;
	});
	const remove = async (p) => {
		if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
		try {
			await deleteProduct.mutateAsync(p.id);
			toast.success("Product deleted");
		} catch (err) {
			toast.error(err.message);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "font-serif text-2xl",
				children: ["Products ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-lg text-muted-foreground",
					children: [
						"(",
						products.length,
						")"
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => setEditing({
					name: "",
					price: 0,
					slug: "",
					sizes: [],
					details: [],
					stock: "in_stock",
					is_new: false,
					is_best_seller: false,
					active: true,
					images: [],
					colors: []
				}),
				className: "btn-gold flex items-center gap-2 px-5 py-2.5 text-xs uppercase tracking-luxe",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), " New Product"]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-5 flex flex-wrap gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: searchQ,
					onChange: (e) => setSearchQ(e.target.value),
					placeholder: "Search products…",
					className: "w-full border border-border bg-transparent py-2.5 pl-9 pr-4 text-sm transition focus:border-accent focus:outline-none"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
				value: filterStock,
				onChange: (e) => setFilterStock(e.target.value),
				className: "border border-border bg-transparent px-3 py-2.5 text-xs uppercase tracking-luxe transition focus:border-accent focus:outline-none",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "all",
						children: "All Stock"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "in_stock",
						children: "In Stock"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "low_stock",
						children: "Low Stock"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "sold_out",
						children: "Sold Out"
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-5 overflow-x-auto border border-border/60 bg-card",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "bg-secondary/50 text-left text-[10px] uppercase tracking-luxe text-muted-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "Image"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "Name"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "Category"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "Price"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "Stock"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "Flags"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3",
							children: "Active"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-4 py-3" })
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
					className: "divide-y divide-border/60",
					children: [filtered.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "transition hover:bg-secondary/30",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-12 w-12 overflow-hidden bg-secondary",
									children: p.images[0]?.url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: p.images[0].url,
										alt: "",
										className: "h-full w-full object-cover"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex h-full w-full items-center justify-center text-muted-foreground",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "h-4 w-4" })
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 font-serif",
								children: p.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-xs",
								children: p.category?.name ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: formatPKR(p.price)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: p.stock === "in_stock" ? "confirmed" : p.stock === "low_stock" ? "pending" : "cancelled" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-1",
									children: [p.is_new && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "bg-blue-100 px-1.5 py-0.5 text-[9px] uppercase tracking-luxe text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
										children: "New"
									}), p.is_best_seller && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "bg-amber-100 px-1.5 py-0.5 text-[9px] uppercase tracking-luxe text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
										children: "Best"
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: p.active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4 text-emerald-600" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4 text-muted-foreground" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-4 py-3 text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setEditing(p),
									"aria-label": "Edit",
									className: "mr-3 text-muted-foreground transition hover:text-foreground",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => remove(p),
									"aria-label": "Delete",
									className: "text-muted-foreground transition hover:text-destructive",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
								})]
							})
						]
					}, p.id)), filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						colSpan: 8,
						className: "px-4 py-12 text-center text-sm text-muted-foreground",
						children: "No products found."
					}) })]
				})]
			})
		}),
		editing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductDialog, {
			product: editing,
			categories,
			onClose: () => setEditing(null),
			onSaved: () => setEditing(null)
		})
	] });
}
function ProductDialog({ product, categories, onClose, onSaved }) {
	const isNew = !product.id;
	const saveProduct = useSaveProduct();
	const [form, setForm] = (0, import_react.useState)({
		name: product.name ?? "",
		slug: product.slug ?? "",
		price: product.price ?? 0,
		description: product.description ?? "",
		category_id: product.category_id ?? "",
		sizes: (product.sizes ?? []).join(", "),
		details: (product.details ?? []).join("\n"),
		stock: product.stock ?? "in_stock",
		delivery_info: product.delivery_info ?? "",
		is_new: product.is_new ?? false,
		is_best_seller: product.is_best_seller ?? false,
		active: product.active ?? true
	});
	const [imageUrls, setImageUrls] = (0, import_react.useState)((product.images ?? []).map((i) => i.url));
	const [colors, setColors] = (0, import_react.useState)((product.colors ?? []).map((c) => ({
		name: c.name,
		hex: c.hex
	})));
	const [newColorName, setNewColorName] = (0, import_react.useState)("");
	const [newColorHex, setNewColorHex] = (0, import_react.useState)("#000000");
	const [newImageUrl, setNewImageUrl] = (0, import_react.useState)("");
	const [uploading, setUploading] = (0, import_react.useState)(false);
	const handleFileUpload = async (e) => {
		const files = e.target.files;
		if (!files || files.length === 0) return;
		setUploading(true);
		try {
			for (const file of Array.from(files)) {
				const url = await uploadProductImage(file);
				setImageUrls((prev) => [...prev, url]);
			}
			toast.success("Image(s) uploaded");
		} catch (err) {
			toast.error(err.message ?? "Upload failed");
		} finally {
			setUploading(false);
		}
	};
	const save = async (e) => {
		e.preventDefault();
		const slug = form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
		const payload = {
			name: form.name,
			slug,
			price: Number(form.price),
			description: form.description || null,
			category_id: form.category_id || null,
			sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
			details: form.details.split("\n").map((s) => s.trim()).filter(Boolean),
			stock: form.stock,
			delivery_info: form.delivery_info || null,
			is_new: form.is_new,
			is_best_seller: form.is_best_seller,
			active: form.active
		};
		try {
			await saveProduct.mutateAsync({
				id: product.id,
				payload,
				images: imageUrls.map((url) => ({
					url,
					alt: form.name
				})),
				colors
			});
			toast.success(isNew ? "Product created" : "Product updated");
			onSaved();
		} catch (err) {
			toast.error(err.message ?? "Save failed");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm animate-fade-in",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: save,
			className: "my-8 w-full max-w-4xl border border-border bg-background p-8 shadow-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-serif text-2xl",
						children: isNew ? "New Product" : "Edit Product"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						"aria-label": "Close",
						className: "text-muted-foreground hover:text-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 grid gap-5 md:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminInput, {
							label: "Name",
							value: form.name,
							onChange: (v) => setForm({
								...form,
								name: v
							}),
							required: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminInput, {
							label: "Slug",
							value: form.slug,
							onChange: (v) => setForm({
								...form,
								slug: v
							}),
							placeholder: "auto-generated"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminInput, {
							label: "Price (PKR)",
							type: "number",
							value: String(form.price),
							onChange: (v) => setForm({
								...form,
								price: Number(v)
							}),
							required: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminSelect, {
							label: "Category",
							value: form.category_id,
							onChange: (v) => setForm({
								...form,
								category_id: v
							}),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "— None —"
							}), categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: c.id,
								children: [c.parent_id ? "↳ " : "", c.name]
							}, c.id))]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminSelect, {
							label: "Stock Status",
							value: form.stock,
							onChange: (v) => setForm({
								...form,
								stock: v
							}),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "in_stock",
									children: "In Stock"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "low_stock",
									children: "Low Stock"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "sold_out",
									children: "Sold Out"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminInput, {
							label: "Sizes (comma-separated)",
							value: form.sizes,
							onChange: (v) => setForm({
								...form,
								sizes: v
							}),
							placeholder: "Standard or 36, 37, 38"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "md:col-span-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminInput, {
								label: "Delivery Info",
								value: form.delivery_info,
								onChange: (v) => setForm({
									...form,
									delivery_info: v
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "md:col-span-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminTextarea, {
								label: "Description",
								value: form.description,
								onChange: (v) => setForm({
									...form,
									description: v
								}),
								rows: 3
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "md:col-span-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminTextarea, {
								label: "Details (one per line)",
								value: form.details,
								onChange: (v) => setForm({
									...form,
									details: v
								}),
								rows: 4
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "md:col-span-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] uppercase tracking-luxe text-muted-foreground",
									children: "Product Images"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 flex flex-wrap gap-3",
									children: [imageUrls.map((url, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "group relative h-24 w-24 overflow-hidden border border-border bg-secondary",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: url,
											alt: "",
											className: "h-full w-full object-cover"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setImageUrls((prev) => prev.filter((_, idx) => idx !== i)),
											className: "absolute right-1 top-1 flex h-5 w-5 items-center justify-center bg-black/60 text-white opacity-0 transition group-hover:opacity-100",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" })
										})]
									}, url + i)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex h-24 w-24 cursor-pointer flex-col items-center justify-center border border-dashed border-border text-muted-foreground transition hover:border-accent hover:text-accent",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-5 w-5" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "mt-1 text-[9px] uppercase tracking-luxe",
												children: uploading ? "Uploading…" : "Upload"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "file",
												accept: "image/*",
												multiple: true,
												className: "hidden",
												onChange: handleFileUpload,
												disabled: uploading
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: newImageUrl,
										onChange: (e) => setNewImageUrl(e.target.value),
										placeholder: "Or paste image URL…",
										className: "flex-1 border border-border bg-transparent px-3 py-2 text-xs transition focus:border-accent focus:outline-none"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => {
											if (newImageUrl.trim()) {
												setImageUrls((prev) => [...prev, newImageUrl.trim()]);
												setNewImageUrl("");
											}
										},
										className: "border border-border px-3 py-2 text-xs uppercase tracking-luxe transition hover:border-accent",
										children: "Add"
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "md:col-span-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] uppercase tracking-luxe text-muted-foreground",
									children: "Colors"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 flex flex-wrap gap-2",
									children: colors.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 border border-border px-3 py-1.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "h-4 w-4 rounded-full border border-border",
												style: { backgroundColor: c.hex }
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs",
												children: c.name
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => setColors((prev) => prev.filter((_, idx) => idx !== i)),
												className: "text-muted-foreground hover:text-destructive",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" })
											})
										]
									}, i))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 flex gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											value: newColorName,
											onChange: (e) => setNewColorName(e.target.value),
											placeholder: "Color name",
											className: "flex-1 border border-border bg-transparent px-3 py-2 text-xs transition focus:border-accent focus:outline-none"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "color",
											value: newColorHex,
											onChange: (e) => setNewColorHex(e.target.value),
											className: "h-9 w-12 cursor-pointer border border-border bg-transparent"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => {
												if (newColorName.trim()) {
													setColors((prev) => [...prev, {
														name: newColorName.trim(),
														hex: newColorHex
													}]);
													setNewColorName("");
													setNewColorHex("#000000");
												}
											},
											className: "border border-border px-3 py-2 text-xs uppercase tracking-luxe transition hover:border-accent",
											children: "Add"
										})
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-6 text-xs uppercase tracking-luxe md:col-span-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex items-center gap-2 cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: form.is_new,
										onChange: (e) => setForm({
											...form,
											is_new: e.target.checked
										}),
										className: "accent-accent"
									}), "New Arrival"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex items-center gap-2 cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: form.is_best_seller,
										onChange: (e) => setForm({
											...form,
											is_best_seller: e.target.checked
										}),
										className: "accent-accent"
									}), "Best Seller"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex items-center gap-2 cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: form.active,
										onChange: (e) => setForm({
											...form,
											active: e.target.checked
										}),
										className: "accent-accent"
									}), "Active (visible to customers)"]
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 flex justify-end gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "border border-border px-6 py-2.5 text-xs uppercase tracking-luxe transition hover:border-foreground",
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: saveProduct.isPending,
						className: "btn-gold px-8 py-2.5 text-xs uppercase tracking-luxe disabled:opacity-50",
						children: saveProduct.isPending ? "Saving…" : "Save Product"
					})]
				})
			]
		})
	});
}
function CategoriesTab() {
	const { data: cats = [] } = useCategories();
	const deleteCategory = useDeleteCategory();
	const saveCategory = useSaveCategory();
	const [editingId, setEditingId] = (0, import_react.useState)(null);
	const [form, setForm] = (0, import_react.useState)({
		name: "",
		slug: "",
		description: "",
		parent_id: "",
		image_url: ""
	});
	const startEdit = (c) => {
		setEditingId(c.id);
		setForm({
			name: c.name,
			slug: c.slug,
			description: c.description ?? "",
			parent_id: c.parent_id ?? "",
			image_url: c.image_url ?? ""
		});
	};
	const resetForm = () => {
		setEditingId(null);
		setForm({
			name: "",
			slug: "",
			description: "",
			parent_id: "",
			image_url: ""
		});
	};
	const submit = async (e) => {
		e.preventDefault();
		try {
			await saveCategory.mutateAsync({
				id: editingId ?? void 0,
				data: {
					name: form.name,
					slug: form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
					description: form.description || null,
					parent_id: form.parent_id || null,
					image_url: form.image_url || null
				}
			});
			toast.success(editingId ? "Category updated" : "Category created");
			resetForm();
		} catch (err) {
			toast.error(err.message);
		}
	};
	const remove = async (id) => {
		if (!confirm("Delete category? Products in this category will become uncategorized.")) return;
		try {
			await deleteCategory.mutateAsync(id);
			toast.success("Category deleted");
		} catch (err) {
			toast.error(err.message);
		}
	};
	const rootCats = cats.filter((c) => !c.parent_id);
	const subCats = (parentId) => cats.filter((c) => c.parent_id === parentId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
			className: "font-serif text-2xl",
			children: ["Categories ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-lg text-muted-foreground",
				children: [
					"(",
					cats.length,
					")"
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: submit,
			className: "mt-6 border border-border/60 bg-card p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-xs uppercase tracking-luxe text-muted-foreground",
					children: editingId ? "Edit Category" : "New Category"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminInput, {
							label: "Name",
							value: form.name,
							onChange: (v) => setForm({
								...form,
								name: v
							}),
							required: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminInput, {
							label: "Slug",
							value: form.slug,
							onChange: (v) => setForm({
								...form,
								slug: v
							}),
							placeholder: "auto"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminSelect, {
							label: "Parent Category",
							value: form.parent_id,
							onChange: (v) => setForm({
								...form,
								parent_id: v
							}),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "— Root (Top-level) —"
							}), rootCats.filter((c) => c.id !== editingId).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: c.id,
								children: c.name
							}, c.id))]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminInput, {
							label: "Image URL",
							value: form.image_url,
							onChange: (v) => setForm({
								...form,
								image_url: v
							}),
							placeholder: "Optional"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminTextarea, {
						label: "Description",
						value: form.description,
						onChange: (v) => setForm({
							...form,
							description: v
						}),
						rows: 2
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: saveCategory.isPending,
						className: "btn-gold px-6 py-2.5 text-xs uppercase tracking-luxe disabled:opacity-50",
						children: saveCategory.isPending ? "Saving…" : editingId ? "Update" : "Add Category"
					}), editingId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: resetForm,
						className: "border border-border px-5 py-2.5 text-xs uppercase tracking-luxe",
						children: "Cancel"
					})]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 border border-border/60 bg-card divide-y divide-border/60",
			children: [rootCats.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "px-4 py-8 text-center text-sm text-muted-foreground",
				children: "No categories yet. Add one above."
			}), rootCats.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between px-5 py-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [c.image_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: c.image_url,
						alt: "",
						className: "h-8 w-8 object-cover"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-serif text-base",
							children: c.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "ml-3 text-xs text-muted-foreground",
							children: c.slug
						}),
						c.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 text-xs text-muted-foreground",
							children: c.description
						})
					] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => startEdit(c),
						"aria-label": "Edit",
						className: "text-muted-foreground transition hover:text-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => remove(c.id),
						"aria-label": "Delete",
						className: "text-muted-foreground transition hover:text-destructive",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
					})]
				})]
			}), subCats(c.id).map((sub) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border-t border-border/40 bg-secondary/30 px-5 py-3 pl-12",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: "↳"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-serif",
							children: sub.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: sub.slug
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => startEdit(sub),
						"aria-label": "Edit",
						className: "text-muted-foreground transition hover:text-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-3.5 w-3.5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => remove(sub.id),
						"aria-label": "Delete",
						className: "text-muted-foreground transition hover:text-destructive",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
					})]
				})]
			}, sub.id))] }, c.id))]
		})
	] });
}
function OrdersTab() {
	const { data: orders = [], isLoading } = useAdminOrders();
	const updateStatus = useUpdateOrderStatus();
	const [searchQ, setSearchQ] = (0, import_react.useState)("");
	const [filterStatus, setFilterStatus] = (0, import_react.useState)("all");
	const [expandedId, setExpandedId] = (0, import_react.useState)(null);
	const filtered = orders.filter((o) => {
		if (filterStatus !== "all" && o.status !== filterStatus) return false;
		if (searchQ) {
			const q = searchQ.toLowerCase();
			return o.customer_name.toLowerCase().includes(q) || o.phone.includes(q) || o.id.includes(q);
		}
		return true;
	});
	const handleStatus = async (id, status) => {
		try {
			await updateStatus.mutateAsync({
				id,
				status
			});
			toast.success("Order updated");
		} catch (err) {
			toast.error(err.message);
		}
	};
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted-foreground",
		children: "Loading orders…"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
			className: "font-serif text-2xl",
			children: ["Orders ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-lg text-muted-foreground",
				children: [
					"(",
					orders.length,
					")"
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-5 flex flex-wrap gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: searchQ,
					onChange: (e) => setSearchQ(e.target.value),
					placeholder: "Search by name, phone, or order ID…",
					className: "w-full border border-border bg-transparent py-2.5 pl-9 pr-4 text-sm transition focus:border-accent focus:outline-none"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
				value: filterStatus,
				onChange: (e) => setFilterStatus(e.target.value),
				className: "border border-border bg-transparent px-3 py-2.5 text-xs uppercase tracking-luxe transition focus:border-accent focus:outline-none",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "all",
					children: "All Statuses"
				}), [
					"pending",
					"confirmed",
					"shipped",
					"delivered",
					"cancelled"
				].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: s,
					children: s
				}, s))]
			})]
		}),
		filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			icon: ShoppingBag,
			title: "No orders found",
			description: "Orders matching your filters will appear here."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-5 space-y-3",
			children: filtered.map((o) => {
				const expanded = expandedId === o.id;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "border border-border/60 bg-card transition hover:shadow-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setExpandedId(expanded ? null : o.id),
						className: "flex w-full flex-wrap items-center justify-between gap-3 px-5 py-4 text-left",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-mono text-xs text-muted-foreground",
									children: ["#", o.id.slice(0, 8)]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-serif text-base",
									children: o.customer_name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: o.status })
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs text-muted-foreground",
									children: [
										o.city,
										" · ",
										new Date(o.created_at).toLocaleDateString()
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-serif text-lg",
									children: formatPKR(o.total)
								}),
								expanded ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "h-4 w-4 text-muted-foreground" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4 text-muted-foreground" })
							]
						})]
					}), expanded && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-t border-border/60 px-5 py-5 animate-fade-in",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-2",
								children: [
									"pending",
									"confirmed",
									"shipped",
									"delivered"
								].map((s, i) => {
									const done = i <= [
										"pending",
										"confirmed",
										"shipped",
										"delivered"
									].indexOf(o.status) && o.status !== "cancelled";
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: `flex items-center gap-1.5 px-3 py-1.5 text-[10px] uppercase tracking-luxe ${done ? "bg-accent/10 text-accent" : "bg-secondary text-muted-foreground"}`,
										children: [done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "h-3 w-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3 w-3" }), s]
									}, s);
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-5 grid gap-6 md:grid-cols-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "text-[10px] uppercase tracking-luxe text-muted-foreground",
									children: "Customer Details"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
									className: "mt-2 space-y-1 text-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
												className: "text-muted-foreground",
												children: "Name:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: o.customer_name })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
												className: "text-muted-foreground",
												children: "Phone:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: o.phone })]
										}),
										o.email && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
												className: "text-muted-foreground",
												children: "Email:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: o.email })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
												className: "text-muted-foreground",
												children: "Address:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", { children: [
												o.address,
												", ",
												o.city
											] })]
										}),
										o.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
												className: "text-muted-foreground",
												children: "Notes:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: o.notes })]
										})
									]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "text-[10px] uppercase tracking-luxe text-muted-foreground",
									children: "Items"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "mt-2 space-y-1 text-sm",
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
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-5 flex flex-wrap items-center gap-3 border-t border-border/60 pt-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] uppercase tracking-luxe text-muted-foreground",
										children: "Update Status:"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										value: o.status,
										onChange: (e) => handleStatus(o.id, e.target.value),
										className: "border border-border bg-transparent px-3 py-1.5 text-xs uppercase tracking-luxe transition focus:border-accent focus:outline-none",
										children: [
											"pending",
											"confirmed",
											"shipped",
											"delivered",
											"cancelled"
										].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: s,
											children: s
										}, s))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: `https://wa.me/${o.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hello ${o.customer_name}, your ÉCLAT order #${o.id.slice(0, 8)} has been ${o.status}. Thank you for shopping with us!`)}`,
										target: "_blank",
										rel: "noreferrer",
										className: "flex items-center gap-1.5 border border-border px-3 py-1.5 text-xs uppercase tracking-luxe transition hover:border-[#25D366] hover:text-[#25D366]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "h-3 w-3" }), " WhatsApp"]
									})
								]
							})
						]
					})]
				}, o.id);
			})
		})
	] });
}
function CustomersTab() {
	const { data: customers = [], isLoading } = useCustomers();
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted-foreground",
		children: "Loading customers…"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
		className: "font-serif text-2xl",
		children: ["Customers ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "text-lg text-muted-foreground",
			children: [
				"(",
				customers.length,
				")"
			]
		})]
	}), customers.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
		icon: Users,
		title: "No customers yet",
		description: "Customer accounts will appear here once users register."
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-5 overflow-x-auto border border-border/60 bg-card",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "w-full text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
				className: "bg-secondary/50 text-left text-[10px] uppercase tracking-luxe text-muted-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-3",
						children: "Name"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-3",
						children: "Phone"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-3",
						children: "City"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-3",
						children: "Orders"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-3",
						children: "Total Spent"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-3",
						children: "Joined"
					})
				] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
				className: "divide-y divide-border/60",
				children: customers.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "transition hover:bg-secondary/30",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 font-serif",
							children: c.full_name || "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 text-xs",
							children: c.phone || "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 text-xs",
							children: c.city || "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3",
							children: c.order_count
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 font-serif",
							children: formatPKR(c.total_spent)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 text-xs text-muted-foreground",
							children: new Date(c.created_at).toLocaleDateString()
						})
					]
				}, c.id))
			})]
		})
	})] });
}
function MessagesTab() {
	const { data: messages = [], isLoading } = useContactMessages();
	const markRead = useMarkMessageRead();
	const [expandedId, setExpandedId] = (0, import_react.useState)(null);
	const unreadCount = messages.filter((m) => !m.read).length;
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted-foreground",
		children: "Loading messages…"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-serif text-2xl",
			children: "Messages"
		}), unreadCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "flex h-6 min-w-6 items-center justify-center bg-accent px-2 text-[10px] font-medium text-accent-foreground",
			children: [unreadCount, " new"]
		})]
	}), messages.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
		icon: Mail,
		title: "No messages",
		description: "Contact form submissions will appear here."
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "mt-5 space-y-2",
		children: messages.map((m) => {
			const expanded = expandedId === m.id;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: `border bg-card transition hover:shadow-sm ${m.read ? "border-border/60" : "border-accent/40"}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => {
						setExpandedId(expanded ? null : m.id);
						if (!m.read) markRead.mutate(m.id);
					},
					className: "flex w-full items-center justify-between gap-3 px-5 py-4 text-left",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [
							!m.read && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-accent" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `font-serif ${m.read ? "" : "font-semibold"}`,
								children: m.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted-foreground",
								children: m.email
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted-foreground",
						children: new Date(m.created_at).toLocaleDateString()
					})]
				}), expanded && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-t border-border/60 px-5 py-4 animate-fade-in",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap",
						children: m.message
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 flex gap-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: `mailto:${m.email}`,
							className: "flex items-center gap-1.5 border border-border px-3 py-1.5 text-xs uppercase tracking-luxe transition hover:border-accent",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-3 w-3" }), " Reply via Email"]
						})
					})]
				})]
			}, m.id);
		})
	})] });
}
function AnalyticsTab() {
	const { data: stats } = useDashboardStats();
	const { data: chartData = [] } = useRevenueChart();
	const { data: products = [] } = useProducts();
	const { data: orders = [] } = useAdminOrders();
	const productOrderCounts = /* @__PURE__ */ new Map();
	orders.forEach((o) => {
		o.order_items.forEach((item) => {
			const key = item.name_snapshot;
			const existing = productOrderCounts.get(key) ?? {
				name: key,
				count: 0,
				revenue: 0
			};
			existing.count += item.qty;
			existing.revenue += Number(item.price_snapshot) * item.qty;
			productOrderCounts.set(key, existing);
		});
	});
	const popularProducts = Array.from(productOrderCounts.values()).sort((a, b) => b.count - a.count).slice(0, 10);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-serif text-2xl",
				children: "Analytics"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border border-border/60 bg-card p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-xs uppercase tracking-luxe text-muted-foreground",
					children: "Revenue Over Time"
				}), chartData.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 h-72",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
							data: chartData,
							margin: {
								top: 5,
								right: 10,
								left: 10,
								bottom: 5
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
									id: "colorRevenue",
									x1: "0",
									y1: "0",
									x2: "0",
									y2: "1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "5%",
										stopColor: "oklch(0.732 0.083 78)",
										stopOpacity: .3
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "95%",
										stopColor: "oklch(0.732 0.083 78)",
										stopOpacity: 0
									})]
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									strokeDasharray: "3 3",
									stroke: "var(--border)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "date",
									tick: { fontSize: 10 },
									stroke: "var(--muted-foreground)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									tick: { fontSize: 10 },
									stroke: "var(--muted-foreground)",
									tickFormatter: (v) => `${(v / 1e3).toFixed(0)}k`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
									contentStyle: {
										background: "var(--card)",
										border: "1px solid var(--border)",
										borderRadius: 0,
										fontSize: 12
									},
									formatter: (value) => [formatPKR(value), "Revenue"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
									type: "monotone",
									dataKey: "revenue",
									stroke: "oklch(0.732 0.083 78)",
									fillOpacity: 1,
									fill: "url(#colorRevenue)"
								})
							]
						})
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm text-muted-foreground",
					children: "No order data available yet."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border border-border/60 bg-card p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-xs uppercase tracking-luxe text-muted-foreground",
					children: "Orders Per Day"
				}), chartData.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 h-56",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
							data: chartData,
							margin: {
								top: 5,
								right: 10,
								left: 10,
								bottom: 5
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									strokeDasharray: "3 3",
									stroke: "var(--border)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "date",
									tick: { fontSize: 10 },
									stroke: "var(--muted-foreground)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									tick: { fontSize: 10 },
									stroke: "var(--muted-foreground)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
									background: "var(--card)",
									border: "1px solid var(--border)",
									borderRadius: 0,
									fontSize: 12
								} }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "orders",
									fill: "oklch(0.732 0.083 78)",
									radius: [
										2,
										2,
										0,
										0
									]
								})
							]
						})
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm text-muted-foreground",
					children: "No order data available yet."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border border-border/60 bg-card p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-xs uppercase tracking-luxe text-muted-foreground",
					children: "Popular Products"
				}), popularProducts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm text-muted-foreground",
					children: "No sales data yet."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "text-left text-[10px] uppercase tracking-luxe text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "pb-2 pr-4",
									children: "#"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "pb-2 pr-4",
									children: "Product"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "pb-2 pr-4",
									children: "Units Sold"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "pb-2",
									children: "Revenue"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y divide-border/60",
							children: popularProducts.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-2.5 pr-4 text-muted-foreground",
									children: i + 1
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-2.5 pr-4 font-serif",
									children: p.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-2.5 pr-4",
									children: p.count
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-2.5 font-serif",
									children: formatPKR(p.revenue)
								})
							] }, p.name))
						})]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Avg. Order Value",
						value: formatPKR(stats && stats.totalOrders > 0 ? stats.totalRevenue / stats.totalOrders : 0),
						icon: TrendingUp
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Total Products",
						value: stats?.totalProducts ?? 0,
						icon: Package
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Total Customers",
						value: stats?.totalCustomers ?? 0,
						icon: Users
					})
				]
			})
		]
	});
}
function SettingsTab() {
	const [settings, setSettings] = (0, import_react.useState)({
		whatsapp: "923001234567",
		email: "hello@eclat.pk",
		instagram: "https://instagram.com/eclat.pk",
		facebook: "https://facebook.com/eclat.pk",
		freeShippingThreshold: "10000",
		deliveryCharge: "300"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-2xl space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-serif text-2xl",
				children: "Store Settings"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border border-border/60 bg-card p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-xs uppercase tracking-luxe text-muted-foreground",
					children: "Contact Information"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 grid gap-4 md:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminInput, {
							label: "WhatsApp Number (E.164)",
							value: settings.whatsapp,
							onChange: (v) => setSettings({
								...settings,
								whatsapp: v
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminInput, {
							label: "Email",
							value: settings.email,
							onChange: (v) => setSettings({
								...settings,
								email: v
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminInput, {
							label: "Instagram URL",
							value: settings.instagram,
							onChange: (v) => setSettings({
								...settings,
								instagram: v
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminInput, {
							label: "Facebook URL",
							value: settings.facebook,
							onChange: (v) => setSettings({
								...settings,
								facebook: v
							})
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border border-border/60 bg-card p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-xs uppercase tracking-luxe text-muted-foreground",
					children: "Delivery Settings"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 grid gap-4 md:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminInput, {
						label: "Free Shipping Threshold (PKR)",
						type: "number",
						value: settings.freeShippingThreshold,
						onChange: (v) => setSettings({
							...settings,
							freeShippingThreshold: v
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminInput, {
						label: "Delivery Charge (PKR)",
						type: "number",
						value: settings.deliveryCharge,
						onChange: (v) => setSettings({
							...settings,
							deliveryCharge: v
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border border-border/60 bg-card p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-xs uppercase tracking-luxe text-muted-foreground",
					children: "Application Info"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "mt-4 space-y-2 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-muted-foreground",
								children: "Framework:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: "TanStack Start + React 19" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-muted-foreground",
								children: "Backend:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: "Supabase" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-muted-foreground",
								children: "Styling:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: "Tailwind CSS v4" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-muted-foreground",
								children: "Deployment:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: "Vercel" })]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "Note: Settings are currently stored in the codebase. A future update will add a Supabase-backed settings table for dynamic configuration."
			})
		]
	});
}
//#endregion
export { Admin as component };
