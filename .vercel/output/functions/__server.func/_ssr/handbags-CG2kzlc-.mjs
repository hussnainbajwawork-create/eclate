import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as shopSearchSchema } from "./shop-C_8OONLI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/handbags-CG2kzlc-.js
var $$splitComponentImporter = () => import("./handbags-BbSmsnDA.mjs");
var Route = createFileRoute("/handbags")({
	validateSearch: shopSearchSchema,
	head: () => ({ meta: [{ title: "Handbags — ÉCLAT" }, {
		name: "description",
		content: "Discover the ÉCLAT handbag collection — totes, shoulder bags, crossbodies and mini bags."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
