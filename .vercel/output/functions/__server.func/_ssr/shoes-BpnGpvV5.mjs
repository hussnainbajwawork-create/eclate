import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as shopSearchSchema } from "./shop-C_8OONLI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shoes-BpnGpvV5.js
var $$splitComponentImporter = () => import("./shoes-Cv6PV40I.mjs");
var Route = createFileRoute("/shoes")({
	validateSearch: shopSearchSchema,
	head: () => ({ meta: [{ title: "Shoes — ÉCLAT" }, {
		name: "description",
		content: "The ÉCLAT shoe edit — heels, flats and loafers in fine Italian leather."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
