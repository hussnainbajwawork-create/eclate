import { createFileRoute } from "@tanstack/react-router";
import { Shop } from "./shop";

export const Route = createFileRoute("/handbags")({
  head: () => ({
    meta: [
      { title: "Handbags — ÉCLAT" },
      { name: "description", content: "Discover the ÉCLAT handbag collection — totes, shoulder bags, crossbodies and mini bags." },
    ],
  }),
  component: () => <Shop restrictCategorySlug="handbags" />,
});
