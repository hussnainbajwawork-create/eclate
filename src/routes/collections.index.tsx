import { createFileRoute, Link, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/collections/")({
  beforeLoad: () => {
    throw redirect({ to: "/shop" });
  },
  component: () => <Link to="/shop">Shop</Link>,
});
