import { createFileRoute } from "@tanstack/react-router";
import { Shop } from "./shop";

export const Route = createFileRoute("/shoes")({
  head: () => ({
    meta: [
      { title: "Shoes — ÉCLAT" },
      { name: "description", content: "The ÉCLAT shoe edit — heels, flats and loafers in fine Italian leather." },
    ],
  }),
  component: () => <Shop restrictCategorySlug="shoes" />,
});
