import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/collections._productId-E5kLvZjS.js
var $$splitComponentImporter = () => import("./collections._productId-qkBSPGpL.mjs");
var Route = createFileRoute("/collections/$productId")({
	head: ({ params }) => ({ meta: [{ title: `${params.productId} — ÉCLAT` }, {
		name: "description",
		content: `Discover ${params.productId} at ÉCLAT — handcrafted in Pakistan.`
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
