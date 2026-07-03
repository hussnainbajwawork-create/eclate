import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Product, Category } from "@/lib/db";

/* ─── Stats ─── */
export type DashboardStats = {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  pendingOrders: number;
  lowStockProducts: number;
};

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const [products, orders, customers, lowStock] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("orders").select("id, total, status"),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("products").select("id", { count: "exact", head: true }).eq("stock", "low_stock"),
  ]);

  const orderData = orders.data ?? [];
  const totalRevenue = orderData
    .filter((o) => o.status === "delivered" || o.status === "confirmed" || o.status === "shipped")
    .reduce((sum, o) => sum + Number(o.total), 0);
  const pendingOrders = orderData.filter((o) => o.status === "pending").length;

  return {
    totalProducts: products.count ?? 0,
    totalOrders: orderData.length,
    totalRevenue,
    totalCustomers: customers.count ?? 0,
    pendingOrders,
    lowStockProducts: lowStock.count ?? 0,
  };
}

export function useDashboardStats() {
  return useQuery({ queryKey: ["admin", "stats"], queryFn: fetchDashboardStats });
}

/* ─── Orders with revenue over time ─── */
export type OrderRow = {
  id: string;
  customer_name: string;
  phone: string;
  email: string | null;
  address: string;
  city: string;
  notes: string | null;
  total: number;
  status: string;
  whatsapp_sent: boolean;
  created_at: string;
  updated_at: string;
  order_items: {
    name_snapshot: string;
    qty: number;
    price_snapshot: number;
    color: string | null;
    size: string | null;
  }[];
};

export async function fetchAdminOrders(): Promise<OrderRow[]> {
  const { data, error } = await supabase
    .from("orders")
    .select(
      "id,customer_name,phone,email,address,city,notes,total,status,whatsapp_sent,created_at,updated_at,order_items(name_snapshot,qty,price_snapshot,color,size)"
    )
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((o: any) => ({ ...o, total: Number(o.total) }));
}

export function useAdminOrders() {
  return useQuery({ queryKey: ["admin", "orders"], queryFn: fetchAdminOrders });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("orders")
        .update({ status: status as any })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "orders"] });
      qc.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
  });
}

/* ─── Customers ─── */
export type CustomerRow = {
  id: string;
  full_name: string | null;
  phone: string | null;
  city: string | null;
  created_at: string;
  order_count: number;
  total_spent: number;
};

export async function fetchCustomers(): Promise<CustomerRow[]> {
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id, full_name, phone, city, created_at")
    .order("created_at", { ascending: false });
  if (error) throw error;

  // Fetch order aggregates
  const { data: orders } = await supabase
    .from("orders")
    .select("user_id, total");

  const orderMap = new Map<string, { count: number; total: number }>();
  (orders ?? []).forEach((o: any) => {
    if (!o.user_id) return;
    const existing = orderMap.get(o.user_id) ?? { count: 0, total: 0 };
    existing.count++;
    existing.total += Number(o.total);
    orderMap.set(o.user_id, existing);
  });

  return (profiles ?? []).map((p: any) => {
    const agg = orderMap.get(p.id) ?? { count: 0, total: 0 };
    return { ...p, order_count: agg.count, total_spent: agg.total };
  });
}

export function useCustomers() {
  return useQuery({ queryKey: ["admin", "customers"], queryFn: fetchCustomers });
}

/* ─── Contact Messages ─── */
export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  created_at: string;
};

export async function fetchContactMessages(): Promise<ContactMessage[]> {
  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export function useContactMessages() {
  return useQuery({ queryKey: ["admin", "messages"], queryFn: fetchContactMessages });
}

export function useMarkMessageRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("contact_messages")
        .update({ read: true })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "messages"] }),
  });
}

/* ─── Product mutations ─── */
export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
  });
}

export type ProductPayload = {
  name: string;
  slug: string;
  price: number;
  description: string | null;
  category_id: string | null;
  sizes: string[];
  details: string[];
  stock: "in_stock" | "low_stock" | "sold_out";
  delivery_info: string | null;
  is_new: boolean;
  is_best_seller: boolean;
  active: boolean;
};

export function useSaveProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      payload,
      images,
      colors,
    }: {
      id?: string;
      payload: ProductPayload;
      images: { url: string; alt: string }[];
      colors: { name: string; hex: string }[];
    }) => {
      let productId = id ?? "";

      if (!id) {
        const { data, error } = await supabase
          .from("products")
          .insert(payload)
          .select("id")
          .single();
        if (error) throw error;
        productId = data.id;
      } else {
        const { error } = await supabase
          .from("products")
          .update(payload)
          .eq("id", id);
        if (error) throw error;
      }

      // Replace images
      await supabase.from("product_images").delete().eq("product_id", productId);
      if (images.length > 0) {
        const rows = images.map((img, i) => ({
          product_id: productId,
          url: img.url,
          alt: img.alt || payload.name,
          sort_order: i,
        }));
        const { error } = await supabase.from("product_images").insert(rows);
        if (error) throw error;
      }

      // Replace colors
      await supabase.from("product_colors").delete().eq("product_id", productId);
      if (colors.length > 0) {
        const rows = colors.map((c, i) => ({
          product_id: productId,
          name: c.name,
          hex: c.hex,
          sort_order: i,
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
    },
  });
}

/* ─── Category mutations ─── */
export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useSaveCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id?: string;
      data: { name: string; slug: string; description?: string | null; parent_id?: string | null; image_url?: string | null; sort_order?: number };
    }) => {
      if (id) {
        const { error } = await supabase.from("categories").update(data).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("categories").insert(data);
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}

/* ─── Image upload ─── */
export async function uploadProductImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await supabase.storage
    .from("product-images")
    .upload(path, file, { cacheControl: "31536000", upsert: false });
  if (error) throw error;

  const { data } = supabase.storage.from("product-images").getPublicUrl(path);
  return data.publicUrl;
}

/* ─── Newsletter ─── */
export async function fetchNewsletterSubscribers() {
  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export function useNewsletterSubscribers() {
  return useQuery({ queryKey: ["admin", "newsletter"], queryFn: fetchNewsletterSubscribers });
}

/* ─── Revenue chart data ─── */
export type RevenueDataPoint = { date: string; revenue: number; orders: number };

export function useRevenueChart() {
  return useQuery({
    queryKey: ["admin", "revenue-chart"],
    queryFn: async (): Promise<RevenueDataPoint[]> => {
      const { data, error } = await supabase
        .from("orders")
        .select("created_at, total, status")
        .order("created_at");
      if (error) throw error;

      const map = new Map<string, { revenue: number; orders: number }>();
      (data ?? []).forEach((o: any) => {
        const date = new Date(o.created_at).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
        });
        const existing = map.get(date) ?? { revenue: 0, orders: 0 };
        existing.orders++;
        if (o.status !== "cancelled") existing.revenue += Number(o.total);
        map.set(date, existing);
      });

      return Array.from(map.entries()).map(([date, vals]) => ({ date, ...vals }));
    },
  });
}
