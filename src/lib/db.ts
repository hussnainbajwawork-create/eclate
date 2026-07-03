import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export type ProductColor = { id: string; name: string; hex: string; sort_order: number };
export type ProductImage = { id: string; url: string; alt: string | null; sort_order: number };
export type Category = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  parent_id: string | null;
  image_url: string | null;
  sort_order: number;
};
export type StockStatus = "in_stock" | "low_stock" | "sold_out";

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price: number;
  category_id: string | null;
  sizes: string[];
  details: string[];
  stock: StockStatus;
  delivery_info: string | null;
  is_new: boolean;
  is_best_seller: boolean;
  active: boolean;
  category?: Category | null;
  images: ProductImage[];
  colors: ProductColor[];
};

const PRODUCT_SELECT =
  "*, category:categories(*), images:product_images(*), colors:product_colors(*)";

function normalizeProduct(p: any): Product {
  return {
    ...p,
    price: Number(p.price),
    images: (p.images ?? []).slice().sort((a: any, b: any) => a.sort_order - b.sort_order),
    colors: (p.colors ?? []).slice().sort((a: any, b: any) => a.sort_order - b.sort_order),
  };
}

export async function fetchProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("active", true)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map(normalizeProduct);
  } catch (err) {
    console.error("[fetchProducts] Error fetching products:", err);
    return [];
  }
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw error;
    return data ? normalizeProduct(data) : null;
  } catch (err) {
    console.error(`[fetchProductBySlug] Error fetching product "${slug}":`, err);
    return null;
  }
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order");
    if (error) throw error;
    return data ?? [];
  } catch (err) {
    console.error("[fetchCategories] Error fetching categories:", err);
    return [];
  }
}

export function useProducts() {
  return useQuery({ queryKey: ["products"], queryFn: fetchProducts });
}
export function useCategories() {
  return useQuery({ queryKey: ["categories"], queryFn: fetchCategories });
}
export function useProduct(slug: string) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: () => fetchProductBySlug(slug),
    enabled: !!slug,
  });
}
