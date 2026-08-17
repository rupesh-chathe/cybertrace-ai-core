import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { api } from "@/lib/store";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: () => {
    api.hydrate();
    if (!api.getUser()) throw redirect({ to: "/login" });
  },
  component: () => <Outlet />,
});
