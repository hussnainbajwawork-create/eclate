import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Package, Tag, ShoppingBag, LogOut, Plus, Pencil, Trash2, X, Upload,
  BarChart3, Users, Mail, Settings, TrendingUp, AlertTriangle,
  ChevronDown, ChevronUp, Eye, EyeOff, MessageCircle, Clock,
  CheckCircle, Truck, XCircle, Search, Filter, ArrowUp, ArrowDown,
  Image as ImageIcon, LayoutDashboard, Bell, CreditCard, Banknote,
  ShieldCheck, ThumbsUp, ThumbsDown,
} from "lucide-react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site-layout";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { useCategories, useProducts, type Product, type Category } from "@/lib/db";
import { useQueryClient } from "@tanstack/react-query";
import { formatPKR } from "@/lib/format";
import {
  useDashboardStats, useAdminOrders, useUpdateOrderStatus,
  useApprovePayment, useRejectPayment,
  useCustomers, useContactMessages, useMarkMessageRead,
  useDeleteProduct, useSaveProduct, useDeleteCategory, useSaveCategory,
  uploadProductImage, useRevenueChart, useNewsletterSubscribers,
  type OrderRow, type ProductPayload, type PaymentRow,
} from "@/lib/admin-data";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from "recharts";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — ÉCLAT" }] }),
  component: Admin,
});

type Tab = "dashboard" | "products" | "categories" | "orders" | "customers" | "messages" | "analytics" | "settings";

const TABS: { id: Tab; label: string; Icon: any }[] = [
  { id: "dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { id: "products", label: "Products", Icon: Package },
  { id: "categories", label: "Categories", Icon: Tag },
  { id: "orders", label: "Orders", Icon: ShoppingBag },
  { id: "customers", label: "Customers", Icon: Users },
  { id: "messages", label: "Messages", Icon: Mail },
  { id: "analytics", label: "Analytics", Icon: BarChart3 },
  { id: "settings", label: "Settings", Icon: Settings },
];

/* ═══════════════════════════════════════════════════════════════
   Main Admin Shell
   ═══════════════════════════════════════════════════════════════ */
function Admin() {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("dashboard");

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  if (loading) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-5xl px-6 py-32 text-center text-sm text-muted-foreground">Loading…</div>
      </SiteLayout>
    );
  }

  if (user && !isAdmin) {
    return (
      <SiteLayout>
        <section className="mx-auto max-w-xl px-6 py-32 text-center">
          <h1 className="font-serif text-4xl">Access reserved</h1>
          <p className="mt-4 text-sm text-muted-foreground">
            This area is reserved for the ÉCLAT atelier team. If you should have access, ask an admin to grant you the
            <span className="font-mono"> admin</span> role.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">Your user id: <span className="font-mono">{user?.id}</span></p>
          <Link to="/account" className="mt-8 inline-block text-xs uppercase tracking-luxe link-underline">Back to account</Link>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="mx-auto max-w-[1400px] px-6 pt-10 pb-24">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-luxe text-muted-foreground">Atelier</span>
            <h1 className="mt-3 font-serif text-4xl md:text-5xl">Admin Dashboard</h1>
          </div>
          <button onClick={signOut} className="flex items-center gap-2 border border-border px-4 py-2 text-xs uppercase tracking-luxe transition hover:border-foreground">
            <LogOut className="h-3.5 w-3.5" /> Sign Out
          </button>
        </div>

        {/* Tab Nav */}
        <nav className="mt-8 flex gap-1 overflow-x-auto border-b border-border/60 pb-px scrollbar-hide">
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-xs uppercase tracking-luxe transition ${tab === id ? "border-accent text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
            >
              <Icon className="h-3.5 w-3.5" /> {label}
            </button>
          ))}
        </nav>

        {/* Tab Content */}
        <div className="mt-8 animate-fade-in" key={tab}>
          {tab === "dashboard" && <DashboardTab />}
          {tab === "products" && <ProductsTab />}
          {tab === "categories" && <CategoriesTab />}
          {tab === "orders" && <OrdersTab />}
          {tab === "customers" && <CustomersTab />}
          {tab === "messages" && <MessagesTab />}
          {tab === "analytics" && <AnalyticsTab />}
          {tab === "settings" && <SettingsTab />}
        </div>
      </section>
    </SiteLayout>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Shared UI atoms
   ═══════════════════════════════════════════════════════════════ */
function AdminInput({
  label, value, onChange, ...rest
}: { label: string; value: string; onChange: (v: string) => void } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-luxe text-muted-foreground">{label}</span>
      <input
        {...rest}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full border border-border bg-transparent px-3 py-2.5 text-sm transition focus:border-accent focus:outline-none"
      />
    </label>
  );
}

function AdminTextarea({
  label, value, onChange, rows, placeholder,
}: { label: string; value: string; onChange: (v: string) => void; rows?: number; placeholder?: string }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-luxe text-muted-foreground">{label}</span>
      <textarea
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full border border-border bg-transparent px-3 py-2.5 text-sm transition focus:border-accent focus:outline-none"
      />
    </label>
  );
}

function AdminSelect({
  label, value, onChange, children,
}: { label: string; value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-luxe text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full border border-border bg-transparent px-3 py-2.5 text-sm transition focus:border-accent focus:outline-none"
      >
        {children}
      </select>
    </label>
  );
}

function StatCard({ label, value, sub, icon: Icon, accent }: { label: string; value: string | number; sub?: string; icon: any; accent?: boolean }) {
  return (
    <div className={`border p-6 transition hover:shadow-md ${accent ? "border-accent/40 bg-accent/5" : "border-border/60 bg-card"}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-luxe text-muted-foreground">{label}</p>
          <p className="mt-2 font-serif text-3xl">{value}</p>
          {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
        </div>
        <div className={`flex h-10 w-10 items-center justify-center ${accent ? "bg-accent/10 text-accent" : "bg-secondary text-muted-foreground"}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    payment_submitted: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
    confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    shipped: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    delivered: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  };
  const icons: Record<string, any> = {
    pending: Clock,
    payment_submitted: CreditCard,
    confirmed: CheckCircle,
    shipped: Truck,
    delivered: CheckCircle,
    cancelled: XCircle,
  };
  const labels: Record<string, string> = {
    payment_submitted: "payment submitted",
  };
  const Icon = icons[status] ?? Clock;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1 text-[10px] font-medium uppercase tracking-luxe ${styles[status] ?? "bg-secondary text-foreground"}`}>
      <Icon className="h-3 w-3" /> {labels[status] ?? status}
    </span>
  );
}

function EmptyState({ icon: Icon, title, description }: { icon: any; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center border border-border/60 bg-card px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center bg-secondary text-muted-foreground">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-4 font-serif text-xl">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DASHBOARD TAB
   ═══════════════════════════════════════════════════════════════ */
function DashboardTab() {
  const { data: stats, isLoading } = useDashboardStats();
  const { data: orders = [] } = useAdminOrders();
  const recentOrders = orders.slice(0, 5);

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading dashboard…</p>;

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Products" value={stats?.totalProducts ?? 0} icon={Package} />
        <StatCard label="Total Orders" value={stats?.totalOrders ?? 0} sub={`${stats?.pendingOrders ?? 0} pending`} icon={ShoppingBag} />
        <StatCard label="Revenue" value={formatPKR(stats?.totalRevenue ?? 0)} icon={TrendingUp} accent />
        <StatCard label="Customers" value={stats?.totalCustomers ?? 0} icon={Users} />
      </div>

      {/* Alerts */}
      {(stats?.lowStockProducts ?? 0) > 0 && (
        <div className="flex items-center gap-3 border border-amber-300/50 bg-amber-50 px-5 py-3 text-sm dark:border-amber-700/50 dark:bg-amber-900/20">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <span><strong>{stats?.lowStockProducts}</strong> product(s) are running low on stock.</span>
        </div>
      )}

      {/* Recent Orders + Mini Chart */}
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div>
          <h2 className="font-serif text-2xl">Recent Orders</h2>
          {recentOrders.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">No orders yet.</p>
          ) : (
            <div className="mt-4 overflow-x-auto border border-border/60 bg-card">
              <table className="w-full text-sm">
                <thead className="bg-secondary/50 text-left text-[10px] uppercase tracking-luxe text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Order</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Total</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {recentOrders.map((o) => (
                    <tr key={o.id} className="transition hover:bg-secondary/30">
                      <td className="px-4 py-3 font-mono text-xs">#{o.id.slice(0, 8)}</td>
                      <td className="px-4 py-3">{o.customer_name}</td>
                      <td className="px-4 py-3 font-serif">{formatPKR(o.total)}</td>
                      <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div>
          <h2 className="font-serif text-2xl">Quick Stats</h2>
          <div className="mt-4 space-y-3">
            <StatCard label="Low Stock Items" value={stats?.lowStockProducts ?? 0} icon={AlertTriangle} accent={(stats?.lowStockProducts ?? 0) > 0} />
            <StatCard label="Pending Orders" value={stats?.pendingOrders ?? 0} icon={Clock} accent={(stats?.pendingOrders ?? 0) > 0} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PRODUCTS TAB
   ═══════════════════════════════════════════════════════════════ */
function ProductsTab() {
  const { data: products = [] } = useProducts();
  const { data: categories = [] } = useCategories();
  const deleteProduct = useDeleteProduct();
  const [editing, setEditing] = useState<Partial<Product> | null>(null);
  const [searchQ, setSearchQ] = useState("");
  const [filterStock, setFilterStock] = useState<string>("all");

  const filtered = products.filter((p) => {
    if (searchQ && !p.name.toLowerCase().includes(searchQ.toLowerCase())) return false;
    if (filterStock !== "all" && p.stock !== filterStock) return false;
    return true;
  });

  const remove = async (p: Product) => {
    if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    try {
      await deleteProduct.mutateAsync(p.id);
      toast.success("Product deleted");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-serif text-2xl">Products <span className="text-lg text-muted-foreground">({products.length})</span></h2>
        <button
          onClick={() =>
            setEditing({
              name: "", price: 0, slug: "", sizes: [], details: [], stock: "in_stock",
              is_new: false, is_best_seller: false, active: true, images: [], colors: [],
            })
          }
          className="btn-gold flex items-center gap-2 px-5 py-2.5 text-xs uppercase tracking-luxe"
        >
          <Plus className="h-3.5 w-3.5" /> New Product
        </button>
      </div>

      {/* Filters */}
      <div className="mt-5 flex flex-wrap gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={searchQ}
            onChange={(e) => setSearchQ(e.target.value)}
            placeholder="Search products…"
            className="w-full border border-border bg-transparent py-2.5 pl-9 pr-4 text-sm transition focus:border-accent focus:outline-none"
          />
        </div>
        <select
          value={filterStock}
          onChange={(e) => setFilterStock(e.target.value)}
          className="border border-border bg-transparent px-3 py-2.5 text-xs uppercase tracking-luxe transition focus:border-accent focus:outline-none"
        >
          <option value="all">All Stock</option>
          <option value="in_stock">In Stock</option>
          <option value="low_stock">Low Stock</option>
          <option value="sold_out">Sold Out</option>
        </select>
      </div>

      {/* Table */}
      <div className="mt-5 overflow-x-auto border border-border/60 bg-card">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-left text-[10px] uppercase tracking-luxe text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Flags</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {filtered.map((p) => (
              <tr key={p.id} className="transition hover:bg-secondary/30">
                <td className="px-4 py-3">
                  <div className="h-12 w-12 overflow-hidden bg-secondary">
                    {p.images[0]?.url ? (
                      <img src={p.images[0].url} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-muted-foreground"><ImageIcon className="h-4 w-4" /></div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 font-serif">{p.name}</td>
                <td className="px-4 py-3 text-xs">{p.category?.name ?? "—"}</td>
                <td className="px-4 py-3">{formatPKR(p.price)}</td>
                <td className="px-4 py-3"><StatusBadge status={p.stock === "in_stock" ? "confirmed" : p.stock === "low_stock" ? "pending" : "cancelled"} /></td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    {p.is_new && <span className="bg-blue-100 px-1.5 py-0.5 text-[9px] uppercase tracking-luxe text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">New</span>}
                    {p.is_best_seller && <span className="bg-amber-100 px-1.5 py-0.5 text-[9px] uppercase tracking-luxe text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">Best</span>}
                  </div>
                </td>
                <td className="px-4 py-3">
                  {p.active ? <Eye className="h-4 w-4 text-emerald-600" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setEditing(p)} aria-label="Edit" className="mr-3 text-muted-foreground transition hover:text-foreground">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => remove(p)} aria-label="Delete" className="text-muted-foreground transition hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-12 text-center text-sm text-muted-foreground">No products found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <ProductDialog
          product={editing}
          categories={categories}
          onClose={() => setEditing(null)}
          onSaved={() => setEditing(null)}
        />
      )}
    </>
  );
}

/* ─── Product Dialog ─── */
function ProductDialog({
  product, categories, onClose, onSaved,
}: {
  product: Partial<Product>;
  categories: Category[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const isNew = !product.id;
  const saveProduct = useSaveProduct();
  const [form, setForm] = useState({
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
    active: product.active ?? true,
  });
  const [imageUrls, setImageUrls] = useState<string[]>(
    (product.images ?? []).map((i) => i.url)
  );
  const [colors, setColors] = useState<{ name: string; hex: string }[]>(
    (product.colors ?? []).map((c) => ({ name: c.name, hex: c.hex }))
  );
  const [newColorName, setNewColorName] = useState("");
  const [newColorHex, setNewColorHex] = useState("#000000");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const url = await uploadProductImage(file);
        setImageUrls((prev) => [...prev, url]);
      }
      toast.success("Image(s) uploaded");
    } catch (err: any) {
      toast.error(err.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const payload: ProductPayload = {
      name: form.name,
      slug,
      price: Number(form.price),
      description: form.description || null,
      category_id: form.category_id || null,
      sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
      details: form.details.split("\n").map((s) => s.trim()).filter(Boolean),
      stock: form.stock as Product["stock"],
      delivery_info: form.delivery_info || null,
      is_new: form.is_new,
      is_best_seller: form.is_best_seller,
      active: form.active,
    };

    try {
      await saveProduct.mutateAsync({
        id: product.id,
        payload,
        images: imageUrls.map((url) => ({ url, alt: form.name })),
        colors,
      });
      toast.success(isNew ? "Product created" : "Product updated");
      onSaved();
    } catch (err: any) {
      toast.error(err.message ?? "Save failed");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
      <form onSubmit={save} className="my-8 w-full max-w-4xl border border-border bg-background p-8 shadow-2xl">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-2xl">{isNew ? "New Product" : "Edit Product"}</h3>
          <button type="button" onClick={onClose} aria-label="Close" className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <AdminInput label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
          <AdminInput label="Slug" value={form.slug} onChange={(v) => setForm({ ...form, slug: v })} placeholder="auto-generated" />
          <AdminInput label="Price (PKR)" type="number" value={String(form.price)} onChange={(v) => setForm({ ...form, price: Number(v) })} required />
          <AdminSelect label="Category" value={form.category_id} onChange={(v) => setForm({ ...form, category_id: v })}>
            <option value="">— None —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.parent_id ? "↳ " : ""}{c.name}</option>
            ))}
          </AdminSelect>
          <AdminSelect label="Stock Status" value={form.stock} onChange={(v) => setForm({ ...form, stock: v as any })}>
            <option value="in_stock">In Stock</option>
            <option value="low_stock">Low Stock</option>
            <option value="sold_out">Sold Out</option>
          </AdminSelect>
          <AdminInput label="Sizes (comma-separated)" value={form.sizes} onChange={(v) => setForm({ ...form, sizes: v })} placeholder="Standard or 36, 37, 38" />
          <div className="md:col-span-2">
            <AdminInput label="Delivery Info" value={form.delivery_info} onChange={(v) => setForm({ ...form, delivery_info: v })} />
          </div>
          <div className="md:col-span-2">
            <AdminTextarea label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} rows={3} />
          </div>
          <div className="md:col-span-2">
            <AdminTextarea label="Details (one per line)" value={form.details} onChange={(v) => setForm({ ...form, details: v })} rows={4} />
          </div>

          {/* Images */}
          <div className="md:col-span-2">
            <span className="text-[10px] uppercase tracking-luxe text-muted-foreground">Product Images</span>
            <div className="mt-2 flex flex-wrap gap-3">
              {imageUrls.map((url, i) => (
                <div key={url + i} className="group relative h-24 w-24 overflow-hidden border border-border bg-secondary">
                  <img src={url} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setImageUrls((prev) => prev.filter((_, idx) => idx !== i))}
                    className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center bg-black/60 text-white opacity-0 transition group-hover:opacity-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center border border-dashed border-border text-muted-foreground transition hover:border-accent hover:text-accent">
                <Upload className="h-5 w-5" />
                <span className="mt-1 text-[9px] uppercase tracking-luxe">{uploading ? "Uploading…" : "Upload"}</span>
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleFileUpload} disabled={uploading} />
              </label>
            </div>
            <div className="mt-2 flex gap-2">
              <input
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Or paste image URL…"
                className="flex-1 border border-border bg-transparent px-3 py-2 text-xs transition focus:border-accent focus:outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  if (newImageUrl.trim()) {
                    setImageUrls((prev) => [...prev, newImageUrl.trim()]);
                    setNewImageUrl("");
                  }
                }}
                className="border border-border px-3 py-2 text-xs uppercase tracking-luxe transition hover:border-accent"
              >
                Add
              </button>
            </div>
          </div>

          {/* Colors */}
          <div className="md:col-span-2">
            <span className="text-[10px] uppercase tracking-luxe text-muted-foreground">Colors</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {colors.map((c, i) => (
                <div key={i} className="flex items-center gap-2 border border-border px-3 py-1.5">
                  <span className="h-4 w-4 rounded-full border border-border" style={{ backgroundColor: c.hex }} />
                  <span className="text-xs">{c.name}</span>
                  <button type="button" onClick={() => setColors((prev) => prev.filter((_, idx) => idx !== i))} className="text-muted-foreground hover:text-destructive">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-2 flex gap-2">
              <input
                value={newColorName}
                onChange={(e) => setNewColorName(e.target.value)}
                placeholder="Color name"
                className="flex-1 border border-border bg-transparent px-3 py-2 text-xs transition focus:border-accent focus:outline-none"
              />
              <input
                type="color"
                value={newColorHex}
                onChange={(e) => setNewColorHex(e.target.value)}
                className="h-9 w-12 cursor-pointer border border-border bg-transparent"
              />
              <button
                type="button"
                onClick={() => {
                  if (newColorName.trim()) {
                    setColors((prev) => [...prev, { name: newColorName.trim(), hex: newColorHex }]);
                    setNewColorName("");
                    setNewColorHex("#000000");
                  }
                }}
                className="border border-border px-3 py-2 text-xs uppercase tracking-luxe transition hover:border-accent"
              >
                Add
              </button>
            </div>
          </div>

          {/* Flags */}
          <div className="flex flex-wrap items-center gap-6 text-xs uppercase tracking-luxe md:col-span-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.is_new} onChange={(e) => setForm({ ...form, is_new: e.target.checked })} className="accent-accent" />
              New Arrival
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.is_best_seller} onChange={(e) => setForm({ ...form, is_best_seller: e.target.checked })} className="accent-accent" />
              Best Seller
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="accent-accent" />
              Active (visible to customers)
            </label>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="border border-border px-6 py-2.5 text-xs uppercase tracking-luxe transition hover:border-foreground">
            Cancel
          </button>
          <button type="submit" disabled={saveProduct.isPending} className="btn-gold px-8 py-2.5 text-xs uppercase tracking-luxe disabled:opacity-50">
            {saveProduct.isPending ? "Saving…" : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CATEGORIES TAB
   ═══════════════════════════════════════════════════════════════ */
function CategoriesTab() {
  const { data: cats = [] } = useCategories();
  const deleteCategory = useDeleteCategory();
  const saveCategory = useSaveCategory();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", description: "", parent_id: "", image_url: "" });

  const startEdit = (c: Category) => {
    setEditingId(c.id);
    setForm({
      name: c.name,
      slug: c.slug,
      description: c.description ?? "",
      parent_id: c.parent_id ?? "",
      image_url: c.image_url ?? "",
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({ name: "", slug: "", description: "", parent_id: "", image_url: "" });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveCategory.mutateAsync({
        id: editingId ?? undefined,
        data: {
          name: form.name,
          slug: form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          description: form.description || null,
          parent_id: form.parent_id || null,
          image_url: form.image_url || null,
        },
      });
      toast.success(editingId ? "Category updated" : "Category created");
      resetForm();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete category? Products in this category will become uncategorized.")) return;
    try {
      await deleteCategory.mutateAsync(id);
      toast.success("Category deleted");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const rootCats = cats.filter((c) => !c.parent_id);
  const subCats = (parentId: string) => cats.filter((c) => c.parent_id === parentId);

  return (
    <>
      <h2 className="font-serif text-2xl">Categories <span className="text-lg text-muted-foreground">({cats.length})</span></h2>

      {/* Add/Edit Form */}
      <form onSubmit={submit} className="mt-6 border border-border/60 bg-card p-6">
        <h3 className="text-xs uppercase tracking-luxe text-muted-foreground">{editingId ? "Edit Category" : "New Category"}</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <AdminInput label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
          <AdminInput label="Slug" value={form.slug} onChange={(v) => setForm({ ...form, slug: v })} placeholder="auto" />
          <AdminSelect label="Parent Category" value={form.parent_id} onChange={(v) => setForm({ ...form, parent_id: v })}>
            <option value="">— Root (Top-level) —</option>
            {rootCats.filter(c => c.id !== editingId).map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </AdminSelect>
          <AdminInput label="Image URL" value={form.image_url} onChange={(v) => setForm({ ...form, image_url: v })} placeholder="Optional" />
        </div>
        <div className="mt-4">
          <AdminTextarea label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} rows={2} />
        </div>
        <div className="mt-4 flex gap-3">
          <button type="submit" disabled={saveCategory.isPending} className="btn-gold px-6 py-2.5 text-xs uppercase tracking-luxe disabled:opacity-50">
            {saveCategory.isPending ? "Saving…" : editingId ? "Update" : "Add Category"}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="border border-border px-5 py-2.5 text-xs uppercase tracking-luxe">
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Category Tree */}
      <div className="mt-6 border border-border/60 bg-card divide-y divide-border/60">
        {rootCats.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">No categories yet. Add one above.</p>
        )}
        {rootCats.map((c) => (
          <div key={c.id}>
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                {c.image_url && <img src={c.image_url} alt="" className="h-8 w-8 object-cover" />}
                <div>
                  <span className="font-serif text-base">{c.name}</span>
                  <span className="ml-3 text-xs text-muted-foreground">{c.slug}</span>
                  {c.description && <p className="mt-0.5 text-xs text-muted-foreground">{c.description}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => startEdit(c)} aria-label="Edit" className="text-muted-foreground transition hover:text-foreground">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => remove(c.id)} aria-label="Delete" className="text-muted-foreground transition hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            {subCats(c.id).map((sub) => (
              <div key={sub.id} className="flex items-center justify-between border-t border-border/40 bg-secondary/30 px-5 py-3 pl-12">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">↳</span>
                  <span className="font-serif">{sub.name}</span>
                  <span className="text-xs text-muted-foreground">{sub.slug}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => startEdit(sub)} aria-label="Edit" className="text-muted-foreground transition hover:text-foreground">
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => remove(sub.id)} aria-label="Delete" className="text-muted-foreground transition hover:text-destructive">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ORDERS TAB
   ═══════════════════════════════════════════════════════════════ */
function OrdersTab() {
  const { data: orders = [], isLoading } = useAdminOrders();
  const updateStatus = useUpdateOrderStatus();
  const approvePayment = useApprovePayment();
  const rejectPayment = useRejectPayment();
  const [searchQ, setSearchQ] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [rejectNotes, setRejectNotes] = useState("");
  const [showRejectModal, setShowRejectModal] = useState<{ paymentId: string; orderId: string } | null>(null);

  const filtered = orders.filter((o) => {
    if (filterStatus !== "all" && o.status !== filterStatus) return false;
    if (searchQ) {
      const q = searchQ.toLowerCase();
      return o.customer_name.toLowerCase().includes(q) || o.phone.includes(q) || o.id.includes(q);
    }
    return true;
  });

  const handleStatus = async (id: string, status: string) => {
    try {
      await updateStatus.mutateAsync({ id, status });
      toast.success("Order updated");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleApprove = async (paymentId: string, orderId: string) => {
    if (!confirm("Approve this payment and confirm the order?")) return;
    try {
      await approvePayment.mutateAsync({ paymentId, orderId });
      toast.success("Payment approved — order confirmed");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleReject = async () => {
    if (!showRejectModal) return;
    try {
      await rejectPayment.mutateAsync({
        paymentId: showRejectModal.paymentId,
        orderId: showRejectModal.orderId,
        notes: rejectNotes || undefined,
      });
      toast.success("Payment rejected — customer can resubmit");
      setShowRejectModal(null);
      setRejectNotes("");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading orders…</p>;

  return (
    <>
      <h2 className="font-serif text-2xl">Orders <span className="text-lg text-muted-foreground">({orders.length})</span></h2>

      <div className="mt-5 flex flex-wrap gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={searchQ}
            onChange={(e) => setSearchQ(e.target.value)}
            placeholder="Search by name, phone, or order ID…"
            className="w-full border border-border bg-transparent py-2.5 pl-9 pr-4 text-sm transition focus:border-accent focus:outline-none"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-border bg-transparent px-3 py-2.5 text-xs uppercase tracking-luxe transition focus:border-accent focus:outline-none"
        >
          <option value="all">All Statuses</option>
          {["pending", "payment_submitted", "confirmed", "shipped", "delivered", "cancelled"].map((s) => (
            <option key={s} value={s}>{s.replace("_", " ")}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={ShoppingBag} title="No orders found" description="Orders matching your filters will appear here." />
      ) : (
        <ul className="mt-5 space-y-3">
          {filtered.map((o) => {
            const expanded = expandedId === o.id;
            const payment = o.order_payments?.[0] ?? null;
            const halfAmount = Math.ceil(Number(o.total) / 2);

            return (
              <li key={o.id} className={`border bg-card transition hover:shadow-sm ${o.status === "payment_submitted" ? "border-orange-400/50" : "border-border/60"
                }`}>
                <button
                  type="button"
                  onClick={() => setExpandedId(expanded ? null : o.id)}
                  className="flex w-full flex-wrap items-center justify-between gap-3 px-5 py-4 text-left"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-xs text-muted-foreground">#{o.id.slice(0, 8)}</span>
                    <span className="font-serif text-base">{o.customer_name}</span>
                    <StatusBadge status={o.status} />
                    {payment && (
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[9px] uppercase tracking-luxe ${payment.status === "approved"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : payment.status === "rejected"
                            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                        }`}>
                        <Banknote className="h-2.5 w-2.5" /> {payment.status.replace("_", " ")}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground">{o.city} · {new Date(o.created_at).toLocaleDateString()}</span>
                    <span className="font-serif text-lg">{formatPKR(o.total)}</span>
                    {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                  </div>
                </button>

                {expanded && (
                  <div className="border-t border-border/60 px-5 py-5 animate-fade-in">
                    {/* Order Timeline */}
                    <div className="flex flex-wrap gap-2">
                      {["pending", "payment_submitted", "confirmed", "shipped", "delivered"].map((s, i) => {
                        const statusOrder = ["pending", "payment_submitted", "confirmed", "shipped", "delivered"];
                        const currentIdx = statusOrder.indexOf(o.status);
                        const done = i <= currentIdx && o.status !== "cancelled";
                        return (
                          <div key={s} className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] uppercase tracking-luxe ${done ? "bg-accent/10 text-accent" : "bg-secondary text-muted-foreground"
                            }`}>
                            {done ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                            {s.replace("_", " ")}
                          </div>
                        );
                      })}
                    </div>

                    {/* Payment Details */}
                    {payment && (
                      <div className="mt-5 border border-border/60 bg-secondary/20 p-5">
                        <h4 className="flex items-center gap-2 text-[10px] uppercase tracking-luxe text-muted-foreground">
                          <CreditCard className="h-3.5 w-3.5" /> Payment Details
                        </h4>
                        <div className="mt-3 grid gap-4 md:grid-cols-2">
                          <dl className="space-y-2 text-sm">
                            <div className="flex gap-2"><dt className="text-muted-foreground">Method:</dt><dd className="font-medium">{payment.bank_name}</dd></div>
                            <div className="flex gap-2"><dt className="text-muted-foreground">Transaction ID:</dt><dd className="font-mono text-xs">{payment.transaction_id}</dd></div>
                            <div className="flex gap-2"><dt className="text-muted-foreground">Amount:</dt><dd className="font-serif">{formatPKR(payment.amount)}</dd></div>
                            <div className="flex gap-2"><dt className="text-muted-foreground">50% of Total:</dt><dd className="font-serif text-accent">{formatPKR(halfAmount)}</dd></div>
                            <div className="flex gap-2"><dt className="text-muted-foreground">Submitted:</dt><dd className="text-xs">{new Date(payment.created_at).toLocaleString()}</dd></div>
                            {payment.admin_notes && (
                              <div className="flex gap-2"><dt className="text-muted-foreground">Admin Notes:</dt><dd>{payment.admin_notes}</dd></div>
                            )}
                          </dl>
                          {/* Receipt Preview */}
                          <div>
                            {payment.receipt_url && (
                              <button
                                type="button"
                                onClick={() => setReceiptPreview(payment.receipt_url)}
                                className="group relative block w-full overflow-hidden border border-border bg-secondary"
                              >
                                <img src={payment.receipt_url} alt="Receipt" className="h-40 w-full object-contain" />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100">
                                  <span className="text-xs uppercase tracking-luxe text-white">View Full Size</span>
                                </div>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Approve / Reject buttons */}
                        {payment.status === "pending_review" && (
                          <div className="mt-4 flex flex-wrap gap-3 border-t border-border/60 pt-4">
                            <button
                              onClick={() => handleApprove(payment.id, o.id)}
                              disabled={approvePayment.isPending}
                              className="flex items-center gap-2 bg-emerald-600 px-5 py-2.5 text-xs uppercase tracking-luxe text-white transition hover:bg-emerald-700 disabled:opacity-50"
                            >
                              <ThumbsUp className="h-3.5 w-3.5" /> {approvePayment.isPending ? "Approving…" : "Approve Payment"}
                            </button>
                            <button
                              onClick={() => setShowRejectModal({ paymentId: payment.id, orderId: o.id })}
                              className="flex items-center gap-2 border border-red-300 px-5 py-2.5 text-xs uppercase tracking-luxe text-red-600 transition hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                            >
                              <ThumbsDown className="h-3.5 w-3.5" /> Reject Payment
                            </button>
                          </div>
                        )}
                        {payment.status === "approved" && (
                          <p className="mt-4 flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
                            <ShieldCheck className="h-3.5 w-3.5" /> Payment verified
                            {payment.reviewed_at && <span className="text-muted-foreground"> · {new Date(payment.reviewed_at).toLocaleDateString()}</span>}
                          </p>
                        )}
                        {payment.status === "rejected" && (
                          <p className="mt-4 flex items-center gap-2 text-xs text-red-600 dark:text-red-400">
                            <XCircle className="h-3.5 w-3.5" /> Payment rejected
                            {payment.admin_notes && <span className="text-muted-foreground"> — {payment.admin_notes}</span>}
                          </p>
                        )}
                      </div>
                    )}

                    {/* No payment yet */}
                    {!payment && o.status === "pending" && (
                      <div className="mt-5 flex items-center gap-3 border border-amber-300/50 bg-amber-50 px-5 py-3 text-sm dark:border-amber-700/50 dark:bg-amber-900/20">
                        <Clock className="h-4 w-4 text-amber-600" />
                        <span>Awaiting 50% advance payment ({formatPKR(halfAmount)}) from customer.</span>
                      </div>
                    )}

                    {/* Customer & Items Details */}
                    <div className="mt-5 grid gap-6 md:grid-cols-2">
                      <div>
                        <h4 className="text-[10px] uppercase tracking-luxe text-muted-foreground">Customer Details</h4>
                        <dl className="mt-2 space-y-1 text-sm">
                          <div className="flex gap-2"><dt className="text-muted-foreground">Name:</dt><dd>{o.customer_name}</dd></div>
                          <div className="flex gap-2"><dt className="text-muted-foreground">Phone:</dt><dd>{o.phone}</dd></div>
                          {o.email && <div className="flex gap-2"><dt className="text-muted-foreground">Email:</dt><dd>{o.email}</dd></div>}
                          <div className="flex gap-2"><dt className="text-muted-foreground">Address:</dt><dd>{o.address}, {o.city}</dd></div>
                          {o.notes && <div className="flex gap-2"><dt className="text-muted-foreground">Notes:</dt><dd>{o.notes}</dd></div>}
                        </dl>
                      </div>
                      <div>
                        <h4 className="text-[10px] uppercase tracking-luxe text-muted-foreground">Items</h4>
                        <ul className="mt-2 space-y-1 text-sm">
                          {o.order_items.map((item, idx) => (
                            <li key={idx} className="flex items-center justify-between">
                              <span>
                                {item.name_snapshot}
                                {item.color && <span className="text-muted-foreground"> · {item.color}</span>}
                                {item.size && <span className="text-muted-foreground"> · {item.size}</span>}
                                <span className="text-muted-foreground"> × {item.qty}</span>
                              </span>
                              <span>{formatPKR(Number(item.price_snapshot) * item.qty)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-border/60 pt-4">
                      <span className="text-[10px] uppercase tracking-luxe text-muted-foreground">Update Status:</span>
                      <select
                        value={o.status}
                        onChange={(e) => handleStatus(o.id, e.target.value)}
                        className="border border-border bg-transparent px-3 py-1.5 text-xs uppercase tracking-luxe transition focus:border-accent focus:outline-none"
                      >
                        {["pending", "payment_submitted", "confirmed", "shipped", "delivered", "cancelled"].map((s) => (
                          <option key={s} value={s}>{s.replace("_", " ")}</option>
                        ))}
                      </select>
                      {/* Quick Actions */}
                      {o.status === "confirmed" && (
                        <button
                          onClick={() => handleStatus(o.id, "shipped")}
                          className="flex items-center gap-1.5 border border-border px-3 py-1.5 text-xs uppercase tracking-luxe transition hover:border-purple-500 hover:text-purple-500"
                        >
                          <Truck className="h-3 w-3" /> Mark Shipped
                        </button>
                      )}
                      {(o.status === "shipped" || o.status === "confirmed") && (
                        <button
                          onClick={() => handleStatus(o.id, "delivered")}
                          className="flex items-center gap-1.5 border border-border px-3 py-1.5 text-xs uppercase tracking-luxe transition hover:border-emerald-500 hover:text-emerald-500"
                        >
                          <CheckCircle className="h-3 w-3" /> Mark Delivered
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {/* Receipt Lightbox */}
      {receiptPreview && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fade-in"
          onClick={() => setReceiptPreview(null)}
        >
          <div className="max-h-[90vh] max-w-3xl overflow-auto" onClick={(e) => e.stopPropagation()}>
            <img src={receiptPreview} alt="Payment receipt" className="w-full rounded border border-border" />
            <button
              onClick={() => setReceiptPreview(null)}
              className="mt-4 mx-auto block border border-white/30 px-6 py-2 text-xs uppercase tracking-luxe text-white hover:bg-white/10"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md border border-border bg-background p-8 shadow-2xl">
            <h3 className="font-serif text-xl">Reject Payment</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              The customer will be notified and can resubmit payment proof.
            </p>
            <label className="mt-5 block">
              <span className="text-[10px] uppercase tracking-luxe text-muted-foreground">Reason (optional)</span>
              <textarea
                value={rejectNotes}
                onChange={(e) => setRejectNotes(e.target.value)}
                rows={3}
                placeholder="e.g. Screenshot is unclear, wrong amount…"
                className="mt-1 w-full border border-border bg-transparent px-3 py-2.5 text-sm transition focus:border-accent focus:outline-none"
              />
            </label>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => { setShowRejectModal(null); setRejectNotes(""); }}
                className="border border-border px-5 py-2.5 text-xs uppercase tracking-luxe transition hover:border-foreground"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={rejectPayment.isPending}
                className="bg-red-600 px-5 py-2.5 text-xs uppercase tracking-luxe text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                {rejectPayment.isPending ? "Rejecting…" : "Reject Payment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CUSTOMERS TAB
   ═══════════════════════════════════════════════════════════════ */
function CustomersTab() {
  const { data: customers = [], isLoading } = useCustomers();

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading customers…</p>;

  return (
    <>
      <h2 className="font-serif text-2xl">Customers <span className="text-lg text-muted-foreground">({customers.length})</span></h2>

      {customers.length === 0 ? (
        <EmptyState icon={Users} title="No customers yet" description="Customer accounts will appear here once users register." />
      ) : (
        <div className="mt-5 overflow-x-auto border border-border/60 bg-card">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 text-left text-[10px] uppercase tracking-luxe text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">City</th>
                <th className="px-4 py-3">Orders</th>
                <th className="px-4 py-3">Total Spent</th>
                <th className="px-4 py-3">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {customers.map((c) => (
                <tr key={c.id} className="transition hover:bg-secondary/30">
                  <td className="px-4 py-3 font-serif">{c.full_name || "—"}</td>
                  <td className="px-4 py-3 text-xs">{c.phone || "—"}</td>
                  <td className="px-4 py-3 text-xs">{c.city || "—"}</td>
                  <td className="px-4 py-3">{c.order_count}</td>
                  <td className="px-4 py-3 font-serif">{formatPKR(c.total_spent)}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MESSAGES TAB
   ═══════════════════════════════════════════════════════════════ */
function MessagesTab() {
  const { data: messages = [], isLoading } = useContactMessages();
  const markRead = useMarkMessageRead();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const unreadCount = messages.filter((m) => !m.read).length;

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading messages…</p>;

  return (
    <>
      <div className="flex items-center gap-3">
        <h2 className="font-serif text-2xl">Messages</h2>
        {unreadCount > 0 && (
          <span className="flex h-6 min-w-6 items-center justify-center bg-accent px-2 text-[10px] font-medium text-accent-foreground">
            {unreadCount} new
          </span>
        )}
      </div>

      {messages.length === 0 ? (
        <EmptyState icon={Mail} title="No messages" description="Contact form submissions will appear here." />
      ) : (
        <ul className="mt-5 space-y-2">
          {messages.map((m) => {
            const expanded = expandedId === m.id;
            return (
              <li key={m.id} className={`border bg-card transition hover:shadow-sm ${m.read ? "border-border/60" : "border-accent/40"}`}>
                <button
                  type="button"
                  onClick={() => {
                    setExpandedId(expanded ? null : m.id);
                    if (!m.read) markRead.mutate(m.id);
                  }}
                  className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
                >
                  <div className="flex items-center gap-3">
                    {!m.read && <span className="h-2 w-2 rounded-full bg-accent" />}
                    <span className={`font-serif ${m.read ? "" : "font-semibold"}`}>{m.name}</span>
                    <span className="text-xs text-muted-foreground">{m.email}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{new Date(m.created_at).toLocaleDateString()}</span>
                </button>
                {expanded && (
                  <div className="border-t border-border/60 px-5 py-4 animate-fade-in">
                    <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">{m.message}</p>
                    <div className="mt-4 flex gap-3">
                      <a
                        href={`mailto:${m.email}`}
                        className="flex items-center gap-1.5 border border-border px-3 py-1.5 text-xs uppercase tracking-luxe transition hover:border-accent"
                      >
                        <Mail className="h-3 w-3" /> Reply via Email
                      </a>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ANALYTICS TAB
   ═══════════════════════════════════════════════════════════════ */
function AnalyticsTab() {
  const { data: stats } = useDashboardStats();
  const { data: chartData = [] } = useRevenueChart();
  const { data: products = [] } = useProducts();
  const { data: orders = [] } = useAdminOrders();

  // Popular products by order frequency
  const productOrderCounts = new Map<string, { name: string; count: number; revenue: number }>();
  orders.forEach((o) => {
    o.order_items.forEach((item) => {
      const key = item.name_snapshot;
      const existing = productOrderCounts.get(key) ?? { name: key, count: 0, revenue: 0 };
      existing.count += item.qty;
      existing.revenue += Number(item.price_snapshot) * item.qty;
      productOrderCounts.set(key, existing);
    });
  });
  const popularProducts = Array.from(productOrderCounts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return (
    <div className="space-y-8">
      <h2 className="font-serif text-2xl">Analytics</h2>

      {/* Revenue Chart */}
      <div className="border border-border/60 bg-card p-6">
        <h3 className="text-xs uppercase tracking-luxe text-muted-foreground">Revenue Over Time</h3>
        {chartData.length > 0 ? (
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.732 0.083 78)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="oklch(0.732 0.083 78)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" />
                <YAxis tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 0, fontSize: 12 }}
                  formatter={(value: number) => [formatPKR(value), "Revenue"]}
                />
                <Area type="monotone" dataKey="revenue" stroke="oklch(0.732 0.083 78)" fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">No order data available yet.</p>
        )}
      </div>

      {/* Orders Chart */}
      <div className="border border-border/60 bg-card p-6">
        <h3 className="text-xs uppercase tracking-luxe text-muted-foreground">Orders Per Day</h3>
        {chartData.length > 0 ? (
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" />
                <YAxis tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 0, fontSize: 12 }}
                />
                <Bar dataKey="orders" fill="oklch(0.732 0.083 78)" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">No order data available yet.</p>
        )}
      </div>

      {/* Popular Products */}
      <div className="border border-border/60 bg-card p-6">
        <h3 className="text-xs uppercase tracking-luxe text-muted-foreground">Popular Products</h3>
        {popularProducts.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">No sales data yet.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-[10px] uppercase tracking-luxe text-muted-foreground">
                <tr>
                  <th className="pb-2 pr-4">#</th>
                  <th className="pb-2 pr-4">Product</th>
                  <th className="pb-2 pr-4">Units Sold</th>
                  <th className="pb-2">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {popularProducts.map((p, i) => (
                  <tr key={p.name}>
                    <td className="py-2.5 pr-4 text-muted-foreground">{i + 1}</td>
                    <td className="py-2.5 pr-4 font-serif">{p.name}</td>
                    <td className="py-2.5 pr-4">{p.count}</td>
                    <td className="py-2.5 font-serif">{formatPKR(p.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Avg. Order Value" value={formatPKR(stats && stats.totalOrders > 0 ? stats.totalRevenue / stats.totalOrders : 0)} icon={TrendingUp} />
        <StatCard label="Total Products" value={stats?.totalProducts ?? 0} icon={Package} />
        <StatCard label="Total Customers" value={stats?.totalCustomers ?? 0} icon={Users} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SETTINGS TAB
   ═══════════════════════════════════════════════════════════════ */
function SettingsTab() {
  const [settings, setSettings] = useState({
    whatsapp: "923227505007",
    email: "hello@eclat.pk",
    instagram: "https://www.instagram.com/eclat14_?igsh=bTN0c2hjdWgwbTF4",
    facebook: "https://facebook.com/eclat.pk",
    freeShippingThreshold: "10000",
    deliveryCharge: "300",
  });

  return (
    <div className="max-w-2xl space-y-8">
      <h2 className="font-serif text-2xl">Store Settings</h2>

      <div className="border border-border/60 bg-card p-6">
        <h3 className="text-xs uppercase tracking-luxe text-muted-foreground">Contact Information</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <AdminInput label="WhatsApp Number (E.164)" value={settings.whatsapp} onChange={(v) => setSettings({ ...settings, whatsapp: v })} />
          <AdminInput label="Email" value={settings.email} onChange={(v) => setSettings({ ...settings, email: v })} />
          <AdminInput label="Instagram URL" value={settings.instagram} onChange={(v) => setSettings({ ...settings, instagram: v })} />
          <AdminInput label="Facebook URL" value={settings.facebook} onChange={(v) => setSettings({ ...settings, facebook: v })} />
        </div>
      </div>

      <div className="border border-border/60 bg-card p-6">
        <h3 className="text-xs uppercase tracking-luxe text-muted-foreground">Delivery Settings</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <AdminInput label="Free Shipping Threshold (PKR)" type="number" value={settings.freeShippingThreshold} onChange={(v) => setSettings({ ...settings, freeShippingThreshold: v })} />
          <AdminInput label="Delivery Charge (PKR)" type="number" value={settings.deliveryCharge} onChange={(v) => setSettings({ ...settings, deliveryCharge: v })} />
        </div>
      </div>

      <div className="border border-border/60 bg-card p-6">
        <h3 className="text-xs uppercase tracking-luxe text-muted-foreground">Application Info</h3>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex gap-3"><dt className="text-muted-foreground">Framework:</dt><dd>TanStack Start + React 19</dd></div>
          <div className="flex gap-3"><dt className="text-muted-foreground">Backend:</dt><dd>Supabase</dd></div>
          <div className="flex gap-3"><dt className="text-muted-foreground">Styling:</dt><dd>Tailwind CSS v4</dd></div>
          <div className="flex gap-3"><dt className="text-muted-foreground">Deployment:</dt><dd>Vercel</dd></div>
        </dl>
      </div>

      <p className="text-xs text-muted-foreground">
        Note: Settings are currently stored in the codebase. A future update will add a Supabase-backed settings table for dynamic configuration.
      </p>
    </div>
  );
}
