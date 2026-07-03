import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as Shop } from "./shop-C_8OONLI.mjs";
import { t as Route } from "./shoes-BpnGpvV5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shoes-Cv6PV40I.js
var import_jsx_runtime = require_jsx_runtime();
function ShoesRouteComponent() {
	const params = Route.useSearch();
	const navigate = Route.useNavigate();
	const setSearch = (next) => navigate({ search: {
		...params,
		...next
	} });
	const onResetFilters = () => {
		navigate({ search: {} });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shop, {
		restrictCategorySlug: "shoes",
		params,
		setSearch,
		onResetFilters
	});
}
//#endregion
export { ShoesRouteComponent as component };
