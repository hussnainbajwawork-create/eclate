import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Package, Tag, ShoppingBag, LogOut, Plus, Pencil, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site-layout";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { useCategories, useProducts, type Product, type Category } from "@/lib/db";
import { useQueryClient } from "@tanstack/react-query";
import { formatPKR } from "@/lib/format";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — ÉCLAT" }] }),
  component: Admin,
});

type Tab = "products" | "categories" | "orders";

function Admin() {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("products");

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
      <section className="mx-auto max-w-7xl px-6 pt-16 pb-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-luxe text-muted-foreground">Atelier</span>
            <h1 className="mt-3 font-serif text-5xl">Admin Dashboard</h1>
          </div>
          <button onClick={signOut} className="flex items-center gap-2 border border-border px-4 py-2 text-xs uppercase tracking-luxe">
            <LogOut className="h-3.5 w-3.5" /> Sign Out
          </button>
        </div>

        <nav className="mt-10 flex gap-6 border-b border-border/60 text-xs uppercase tracking-luxe">
          {[
            { id: "products", label: "Products", Icon: Package },
            { id: "categories", label: "Categories", Icon: Tag },
            { id: "orders", label: "Orders", Icon: ShoppingBag },
          ].map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id as Tab)}
              className={`flex items-center gap-2 border-b-2 pb-3 transition ${
                tab === id ? "border-accent text-foreground" : "border-transparent text-muted-foreground"
              }`}
            >
              <Icon className="h-3.5 w-3.5" /> {label}
            </button>
          ))}
        </nav>

        <div className="mt-10">
          {tab === "products" && <ProductsAdmin />}
          {tab === "categories" && <CategoriesAdmin />}
          {tab === "orders" && <OrdersAdmin />}
        </div>
      </section>
    </SiteLayout>
  );
}

/* ---------------------------- Products ---------------------------- */

function ProductsAdmin() {
  const { data: products = [], refetch } = useProducts();
  const { data: categories = [] } = useCategories();
  const [editing, setEditing] = useState<Partial<Product> | null>(null);

  const remove = async (p: Product) => {
    if (!confirm(`Delete ${p.name}?`)) return;
    const { error } = await supabase.from("products").delete().eq("id", p.id);
    if (error) return toast.error(error.message);
    toast.success("Product deleted");
    refetch();
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-2xl">Products ({products.length})</h2>
        <button
          onClick={() => setEditing({ name: "", price: 0, slug: "", sizes: [], details: [], stock: "in_stock", is_new: false, is_best_seller: false, active: true, images: [], colors: [] })}
          className="btn-gold flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-luxe"
        >
          <Plus className="h-3.5 w-3.5" /> New Product
        </button>
      </div>

      <div className="mt-6 overflow-x-auto border border-border/60 bg-card">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-left text-xs uppercase tracking-luxe text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {products.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3">
                  <img src={p.images[0]?.url} alt="" className="h-12 w-12 object-cover" />
                </td>
                <td className="px-4 py-3 font-serif">{p.name}</td>
                <td className="px-4 py-3 text-xs">{p.category?.name ?? "—"}</td>
                <td className="px-4 py-3">{formatPKR(p.price)}</td>
                <td className="px-4 py-3 text-xs uppercase">{p.stock}</td>
                <td className="px-4 py-3 text-xs">{p.active ? "Yes" : "No"}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setEditing(p)} aria-label="Edit" className="mr-2 text-muted-foreground hover:text-foreground">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => remove(p)} aria-label="Delete" className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <ProductDialog
          product={editing}
          categories={categories}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            refetch();
          }}
        />
      )}
    </>
  );
}

function ProductDialog({
  product,
  categories,
  onClose,
  onSaved,
}: {
  product: Partial<Product>;
  categories: Category[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const isNew = !product.id;
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
    images: (product.images ?? []).map((i) => i.url).join("\n"),
    colors: (product.colors ?? []).map((c) => `${c.name}|${c.hex}`).join("\n"),
  });
  const [busy, setBusy] = useState(false);
  const qc = useQueryClient();

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const payload = {
        name: form.name,
        slug: form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
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

      let productId: string = product.id ?? "";
      if (isNew) {
        const { data, error } = await supabase.from("products").insert(payload).select("id").single();
        if (error) throw error;
        productId = data.id;
      } else {
        const { error } = await supabase.from("products").update(payload).eq("id", product.id!);
        if (error) throw error;
      }


      // Replace images
      await supabase.from("product_images").delete().eq("product_id", productId);
      const imgs = form.images
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((url, i) => ({ product_id: productId, url, sort_order: i, alt: form.name }));
      if (imgs.length) await supabase.from("product_images").insert(imgs);

      // Replace colors
      await supabase.from("product_colors").delete().eq("product_id", productId);
      const cols = form.colors
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((row, i) => {
          const [name, hex] = row.split("|").map((x) => x.trim());
          return { product_id: productId, name: name ?? row, hex: hex ?? "#000000", sort_order: i };
        });
      if (cols.length) await supabase.from("product_colors").insert(cols);

      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["product"] });
      toast.success(isNew ? "Product created" : "Product updated");
      onSaved();
    } catch (err: any) {
      toast.error(err.message ?? "Save failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm">
      <form onSubmit={save} className="my-8 w-full max-w-3xl rounded-md border border-border bg-background p-8 shadow-2xl">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-2xl">{isNew ? "New Product" : "Edit Product"}</h3>
          <button type="button" onClick={onClose} aria-label="Close"><X className="h-5 w-5" /></button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Input label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
          <Input label="Slug" value={form.slug} onChange={(v) => setForm({ ...form, slug: v })} placeholder="auto" />
          <Input label="Price (PKR)" type="number" value={String(form.price)} onChange={(v) => setForm({ ...form, price: Number(v) })} required />
          <Select label="Category" value={form.category_id} onChange={(v) => setForm({ ...form, category_id: v })}>
            <option value="">— None —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </Select>
          <Select label="Stock" value={form.stock} onChange={(v) => setForm({ ...form, stock: v as any })}>
            <option value="in_stock">In stock</option>
            <option value="low_stock">Low stock</option>
            <option value="sold_out">Sold out</option>
          </Select>
          <Input label="Sizes (comma)" value={form.sizes} onChange={(v) => setForm({ ...form, sizes: v })} placeholder="Standard or 36, 37, 38" />
          <div className="md:col-span-2"><Input label="Delivery info" value={form.delivery_info} onChange={(v) => setForm({ ...form, delivery_info: v })} /></div>
          <div className="md:col-span-2"><Textarea label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} rows={3} /></div>
          <div className="md:col-span-2"><Textarea label="Details (one per line)" value={form.details} onChange={(v) => setForm({ ...form, details: v })} rows={4} /></div>
          <div className="md:col-span-2"><Textarea label="Image URLs (one per line)" value={form.images} onChange={(v) => setForm({ ...form, images: v })} rows={4} /></div>
          <div className="md:col-span-2"><Textarea label="Colors (Name|#hex per line)" value={form.colors} onChange={(v) => setForm({ ...form, colors: v })} rows={3} placeholder={"Camel|#C6A76A\nNoir|#111111"} /></div>

          <div className="flex items-center gap-6 text-xs uppercase tracking-luxe md:col-span-2">
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.is_new} onChange={(e) => setForm({ ...form, is_new: e.target.checked })} /> New arrival</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.is_best_seller} onChange={(e) => setForm({ ...form, is_best_seller: e.target.checked })} /> Best seller</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> Active</label>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="border border-border px-5 py-2 text-xs uppercase tracking-luxe">Cancel</button>
          <button type="submit" disabled={busy} className="btn-gold px-6 py-2 text-xs uppercase tracking-luxe">
            {busy ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  ...rest
}: { label: string; value: string; onChange: (v: string) => void } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-luxe text-muted-foreground">{label}</span>
      <input
        {...rest}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full border border-border bg-transparent px-3 py-2 text-sm focus:border-accent focus:outline-none"
      />
    </label>
  );
}
function Textarea({
  label,
  value,
  onChange,
  rows,
  placeholder,
}: { label: string; value: string; onChange: (v: string) => void; rows?: number; placeholder?: string }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-luxe text-muted-foreground">{label}</span>
      <textarea
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full border border-border bg-transparent px-3 py-2 text-sm focus:border-accent focus:outline-none"
      />
    </label>
  );
}
function Select({
  label,
  value,
  onChange,
  children,
}: { label: string; value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-luxe text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full border border-border bg-transparent px-3 py-2 text-sm focus:border-accent focus:outline-none"
      >
        {children}
      </select>
    </label>
  );
}

/* ---------------------------- Categories ---------------------------- */

function CategoriesAdmin() {
  const { data: cats = [], refetch } = useCategories();
  const [form, setForm] = useState({ name: "", slug: "", parent_id: "" });

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("categories").insert({
      name: form.name,
      slug: form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      parent_id: form.parent_id || null,
    });
    if (error) return toast.error(error.message);
    setForm({ name: "", slug: "", parent_id: "" });
    refetch();
  };
  const remove = async (id: string) => {
    if (!confirm("Delete category?")) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) return toast.error(error.message);
    refetch();
  };

  return (
    <>
      <h2 className="font-serif text-2xl">Categories</h2>
      <form onSubmit={add} className="mt-6 grid gap-3 border border-border/60 bg-card p-6 md:grid-cols-[1fr_1fr_1fr_auto]">
        <Input label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
        <Input label="Slug" value={form.slug} onChange={(v) => setForm({ ...form, slug: v })} placeholder="auto" />
        <Select label="Parent" value={form.parent_id} onChange={(v) => setForm({ ...form, parent_id: v })}>
          <option value="">— Root —</option>
          {cats.filter((c) => !c.parent_id).map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </Select>
        <button type="submit" className="btn-gold self-end px-5 py-2 text-xs uppercase tracking-luxe">Add</button>
      </form>

      <ul className="mt-6 divide-y divide-border/60 border border-border/60 bg-card">
        {cats.map((c) => (
          <li key={c.id} className="flex items-center justify-between px-4 py-3 text-sm">
            <span>
              {c.parent_id && <span className="mr-2 text-muted-foreground">↳</span>}
              <span className="font-serif text-base">{c.name}</span>
              <span className="ml-3 text-xs text-muted-foreground">{c.slug}</span>
            </span>
            <button onClick={() => remove(c.id)} aria-label="Delete" className="text-muted-foreground hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

/* ---------------------------- Orders ---------------------------- */

function OrdersAdmin() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    supabase
      .from("orders")
      .select("id,customer_name,phone,city,total,status,created_at,whatsapp_sent,order_items(name_snapshot,qty,price_snapshot,color,size)")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setOrders(data ?? []);
        setLoading(false);
      });
  };
  useEffect(load, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Order updated");
    load();
  };

  if (loading) return <p className="text-sm text-muted-foreground">Loading orders…</p>;

  return (
    <>
      <h2 className="font-serif text-2xl">Orders ({orders.length})</h2>
      <ul className="mt-6 space-y-4">
        {orders.map((o) => (
          <li key={o.id} className="border border-border/60 bg-card p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <div>
                <span className="font-mono text-sm">#{o.id.slice(0, 8)}</span>
                <span className="ml-3 font-serif text-lg">{o.customer_name}</span>
                <span className="ml-3 text-xs text-muted-foreground">{o.phone} · {o.city}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleString()}</span>
                <span className="font-serif text-lg">{formatPKR(o.total)}</span>
                <select
                  value={o.status}
                  onChange={(e) => updateStatus(o.id, e.target.value)}
                  className="border border-border bg-transparent px-2 py-1 text-xs uppercase tracking-luxe focus:border-accent focus:outline-none"
                >
                  {["pending", "confirmed", "shipped", "delivered", "cancelled"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
            <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
              {o.order_items.map((i: any, idx: number) => (
                <li key={idx}>
                  {i.name_snapshot}
                  {i.color && ` · ${i.color}`}
                  {i.size && ` · ${i.size}`} × {i.qty} — {formatPKR(i.price_snapshot * i.qty)}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </>
  );
}
