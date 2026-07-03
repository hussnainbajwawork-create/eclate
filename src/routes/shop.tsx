import { createFileRoute } from "@tanstack/react-router";
import { Shop, shopSearchSchema } from "@/components/shop";

export const Route = createFileRoute("/shop")({
  validateSearch: shopSearchSchema,
  head: () => ({
    meta: [
      { title: "Shop — ÉCLAT" },
      { name: "description", content: "Shop the ÉCLAT collection — handbags & shoes, handcrafted in Pakistan." },
    ],
  }),
  component: ShopRouteComponent,
});

function ShopRouteComponent() {
  const params = Route.useSearch();
  const navigate = Route.useNavigate();

  const setSearch = (next: Partial<typeof params>) =>
    navigate({ search: { ...params, ...next } });

  const onResetFilters = () => {
    navigate({ search: {} });
  };

  return (
    <Shop
      params={params}
      setSearch={setSearch}
      onResetFilters={onResetFilters}
    />
  );
}
