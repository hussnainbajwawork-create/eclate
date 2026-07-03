import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-B53tpCKD.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { F as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as SiteLayout, u as useAuth } from "./site-layout-Cg2V6MLS.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-DVHyIENi.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Auth() {
	const { user, loading } = useAuth();
	const navigate = useNavigate();
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!loading && user) navigate({ to: "/account" });
	}, [
		loading,
		user,
		navigate
	]);
	const google = async () => {
		setBusy(true);
		try {
			const { error } = await supabase.auth.signInWithOAuth({
				provider: "google",
				options: { redirectTo: window.location.origin }
			});
			if (error) throw error;
		} catch (err) {
			toast.error(err.message ?? "Google sign-in failed");
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-md px-6 py-32 flex flex-col items-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs uppercase tracking-luxe text-muted-foreground",
				children: "Maison ÉCLAT"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-4 text-center font-serif text-5xl",
				children: "Welcome"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-center text-sm text-muted-foreground max-w-xs",
				children: "Sign in or create an account to manage your orders, wishlist, and profile details."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10 w-full border border-border/60 bg-card p-8 text-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: google,
					disabled: busy,
					className: "w-full btn-gold py-4 text-xs uppercase tracking-luxe disabled:opacity-50 flex items-center justify-center gap-2",
					children: busy ? "Connecting…" : "Continue with Google"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-8 text-center text-xs text-muted-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "link-underline",
					children: "Back to home"
				})
			})
		]
	}) });
}
//#endregion
export { Auth as component };
