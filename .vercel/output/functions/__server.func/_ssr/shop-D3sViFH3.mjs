import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as Shop } from "./shop-r793Z2iC.mjs";
import { t as Route } from "./shop-Fw1FE7Nu.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shop-D3sViFH3.js
var import_jsx_runtime = require_jsx_runtime();
function ShopRouteComponent() {
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
		params,
		setSearch,
		onResetFilters
	});
}
//#endregion
export { ShopRouteComponent as component };
