import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as shopSearchSchema } from "./shop-r793Z2iC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shop-Fw1FE7Nu.js
var $$splitComponentImporter = () => import("./shop-D3sViFH3.mjs");
var Route = createFileRoute("/shop")({
	validateSearch: shopSearchSchema,
	head: () => ({ meta: [{ title: "Shop — ÉCLAT" }, {
		name: "description",
		content: "Shop the ÉCLAT collection — handbags & shoes, handcrafted in Pakistan."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
