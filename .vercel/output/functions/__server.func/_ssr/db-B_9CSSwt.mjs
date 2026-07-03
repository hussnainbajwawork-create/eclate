import { t as supabase } from "./client-B53tpCKD.mjs";
import { n as useQuery } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/db-B_9CSSwt.js
var PRODUCT_SELECT = "*, category:categories(*), images:product_images(*), colors:product_colors(*)";
function normalizeProduct(p) {
	return {
		...p,
		price: Number(p.price),
		images: (p.images ?? []).slice().sort((a, b) => a.sort_order - b.sort_order),
		colors: (p.colors ?? []).slice().sort((a, b) => a.sort_order - b.sort_order)
	};
}
async function fetchProducts() {
	try {
		const { data, error } = await supabase.from("products").select(PRODUCT_SELECT).eq("active", true).order("created_at", { ascending: false });
		if (error) throw error;
		return (data ?? []).map(normalizeProduct);
	} catch (err) {
		console.error("[fetchProducts] Error fetching products:", err);
		return [];
	}
}
async function fetchProductBySlug(slug) {
	try {
		const { data, error } = await supabase.from("products").select(PRODUCT_SELECT).eq("slug", slug).maybeSingle();
		if (error) throw error;
		return data ? normalizeProduct(data) : null;
	} catch (err) {
		console.error(`[fetchProductBySlug] Error fetching product "${slug}":`, err);
		return null;
	}
}
async function fetchCategories() {
	try {
		const { data, error } = await supabase.from("categories").select("*").order("sort_order");
		if (error) throw error;
		return data ?? [];
	} catch (err) {
		console.error("[fetchCategories] Error fetching categories:", err);
		return [];
	}
}
function useProducts() {
	return useQuery({
		queryKey: ["products"],
		queryFn: fetchProducts
	});
}
function useCategories() {
	return useQuery({
		queryKey: ["categories"],
		queryFn: fetchCategories
	});
}
function useProduct(slug) {
	return useQuery({
		queryKey: ["product", slug],
		queryFn: () => fetchProductBySlug(slug),
		enabled: !!slug
	});
}
//#endregion
export { useProduct as n, useProducts as r, useCategories as t };
