import { createFileRoute } from "@tanstack/react-router";
import { Shop, shopSearchSchema } from "@/components/shop";

export const Route = createFileRoute("/shoes")({
  validateSearch: shopSearchSchema,
  head: () => ({
    meta: [
      { title: "Shoes — ÉCLAT" },
      { name: "description", content: "The ÉCLAT shoe edit — heels, flats and loafers in fine Italian leather." },
    ],
  }),
  component: ShoesRouteComponent,
});

function ShoesRouteComponent() {
  const params = Route.useSearch();
  const navigate = Route.useNavigate();

  const setSearch = (next: Partial<typeof params>) =>
    navigate({ search: { ...params, ...next } });

  const onResetFilters = () => {
    navigate({ search: {} });
  };

  return (
    <Shop
      restrictCategorySlug="shoes"
      params={params}
      setSearch={setSearch}
      onResetFilters={onResetFilters}
    />
  );
}
