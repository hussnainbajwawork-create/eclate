import { createFileRoute } from "@tanstack/react-router";
import { Shop, shopSearchSchema } from "@/components/shop";

export const Route = createFileRoute("/handbags")({
  validateSearch: shopSearchSchema,
  head: () => ({
    meta: [
      { title: "Handbags — ÉCLAT" },
      { name: "description", content: "Discover the ÉCLAT handbag collection — totes, shoulder bags, crossbodies and mini bags." },
    ],
  }),
  component: HandbagsRouteComponent,
});

function HandbagsRouteComponent() {
  const params = Route.useSearch();
  const navigate = Route.useNavigate();

  const setSearch = (next: Partial<typeof params>) =>
    navigate({ search: { ...params, ...next } });

  const onResetFilters = () => {
    navigate({ search: {} });
  };

  return (
    <Shop
      restrictCategorySlug="handbags"
      params={params}
      setSearch={setSearch}
      onResetFilters={onResetFilters}
    />
  );
}
