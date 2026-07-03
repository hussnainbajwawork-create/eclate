import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-B53tpCKD.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { F as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { Y as ArrowLeft } from "../_libs/lucide-react.mjs";
import { a as SiteLayout, u as useAuth } from "./site-layout-Cg2V6MLS.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as createLovableAuth } from "../_libs/lovable.dev__cloud-auth-js.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-B74OA4Ry.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var lovableAuth = createLovableAuth();
var lovable = { auth: { signInWithOAuth: async (provider, opts) => {
	const result = await lovableAuth.signInWithOAuth(provider, {
		redirect_uri: opts?.redirect_uri,
		extraParams: { ...opts?.extraParams }
	});
	if (result.redirected) return result;
	if (result.error) return result;
	try {
		await supabase.auth.setSession(result.tokens);
	} catch (e) {
		return { error: e instanceof Error ? e : new Error(String(e)) };
	}
	return result;
} } };
function Auth() {
	const { user, loading } = useAuth();
	const navigate = useNavigate();
	const [mode, setMode] = (0, import_react.useState)("signin");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [fullName, setFullName] = (0, import_react.useState)("");
	const [resetSent, setResetSent] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!loading && user) navigate({ to: "/account" });
	}, [
		loading,
		user,
		navigate
	]);
	const submit = async (e) => {
		e.preventDefault();
		setBusy(true);
		try {
			if (mode === "forgot") {
				const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/account` });
				if (error) throw error;
				setResetSent(true);
				toast.success("Password reset link sent to your email");
			} else if (mode === "signin") {
				const { error } = await supabase.auth.signInWithPassword({
					email,
					password
				});
				if (error) throw error;
				toast.success("Welcome back");
			} else {
				if (password.length < 6) {
					toast.error("Password must be at least 6 characters");
					setBusy(false);
					return;
				}
				const redirect = `${window.location.origin}/account`;
				const { error } = await supabase.auth.signUp({
					email,
					password,
					options: {
						emailRedirectTo: redirect,
						data: { full_name: fullName }
					}
				});
				if (error) throw error;
				toast.success("Account created. Check your email to confirm.");
			}
		} catch (err) {
			toast.error(err.message ?? "Authentication failed");
		} finally {
			setBusy(false);
		}
	};
	const google = async () => {
		setBusy(true);
		try {
			const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
			if (result.error) throw new Error(String(result.error));
		} catch (err) {
			toast.error(err.message ?? "Google sign-in failed");
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-md px-6 py-20",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-center font-serif text-5xl",
				children: {
					signin: "Welcome Back",
					signup: "Create Account",
					forgot: "Reset Password"
				}[mode]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-center text-sm text-muted-foreground",
				children: {
					signin: "Sign in to track your orders and manage your wishlist.",
					signup: "Join the ÉCLAT clientele for a personalized shopping experience.",
					forgot: "Enter your email and we'll send you a link to reset your password."
				}[mode]
			}),
			mode === "forgot" && resetSent ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 border border-border/60 bg-card p-8 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto flex h-14 w-14 items-center justify-center border border-accent text-accent",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
							className: "h-6 w-6",
							fill: "none",
							viewBox: "0 0 24 24",
							stroke: "currentColor",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								strokeLinecap: "round",
								strokeLinejoin: "round",
								strokeWidth: 2,
								d: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 text-sm text-muted-foreground",
						children: [
							"We've sent a password reset link to ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-foreground",
								children: email
							}),
							". Check your inbox and spam folder."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => {
							setMode("signin");
							setResetSent(false);
						},
						className: "mt-6 flex items-center gap-2 mx-auto text-xs uppercase tracking-luxe link-underline",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-3 w-3" }), " Back to Sign In"]
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: submit,
				className: "mt-10 space-y-5 border border-border/60 bg-card p-8",
				children: [
					mode === "signup" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-[10px] uppercase tracking-luxe text-muted-foreground",
						children: "Full Name"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						required: true,
						value: fullName,
						onChange: (e) => setFullName(e.target.value),
						className: "mt-1 w-full border-0 border-b border-border bg-transparent py-3 text-sm transition focus:border-accent focus:outline-none",
						placeholder: "Your full name"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-[10px] uppercase tracking-luxe text-muted-foreground",
						children: "Email"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						required: true,
						type: "email",
						value: email,
						onChange: (e) => setEmail(e.target.value),
						className: "mt-1 w-full border-0 border-b border-border bg-transparent py-3 text-sm transition focus:border-accent focus:outline-none",
						placeholder: "your@email.com"
					})] }),
					mode !== "forgot" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-[10px] uppercase tracking-luxe text-muted-foreground",
						children: "Password"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						required: true,
						type: "password",
						minLength: 6,
						value: password,
						onChange: (e) => setPassword(e.target.value),
						className: "mt-1 w-full border-0 border-b border-border bg-transparent py-3 text-sm transition focus:border-accent focus:outline-none",
						placeholder: mode === "signup" ? "Min 6 characters" : "Your password"
					})] }),
					mode === "signin" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-right",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setMode("forgot"),
							className: "text-xs text-muted-foreground link-underline",
							children: "Forgot password?"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: busy,
						className: "btn-gold w-full py-4 text-xs uppercase tracking-luxe disabled:opacity-50",
						children: busy ? "Please wait…" : mode === "signin" ? "Sign In" : mode === "signup" ? "Create Account" : "Send Reset Link"
					}),
					mode !== "forgot" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative my-2 text-center text-[10px] uppercase tracking-luxe text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "bg-card px-3 relative z-10",
							children: "or"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inset-x-0 top-1/2 h-px bg-border" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: google,
						disabled: busy,
						className: "w-full border border-border py-3 text-xs uppercase tracking-luxe transition hover:border-foreground disabled:opacity-50",
						children: "Continue with Google"
					})] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 text-center text-xs text-muted-foreground",
				children: [
					mode === "signin" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						"New to ÉCLAT?",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setMode("signup"),
							className: "link-underline text-foreground",
							children: "Create an account"
						})
					] }),
					mode === "signup" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						"Already have an account?",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setMode("signin"),
							className: "link-underline text-foreground",
							children: "Sign in"
						})
					] }),
					mode === "forgot" && !resetSent && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						"Remember your password?",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setMode("signin"),
							className: "link-underline text-foreground",
							children: "Sign in"
						})
					] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-center text-xs text-muted-foreground",
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
