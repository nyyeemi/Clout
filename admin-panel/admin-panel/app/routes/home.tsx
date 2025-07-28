import type { Route } from "./+types/home";
import { Dashboard } from "../dashboard/dashboard";
import { redirect, type LoaderFunctionArgs } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Admin Dashboard" },
    { name: "description", content: "Welcome to clout enterprises. " },
  ];
}

export function loader({ request }: LoaderFunctionArgs) {
  const isLoggedIn = Boolean(localStorage.getItem("token"));
  if (!isLoggedIn) {
    throw redirect("/login");
  }
  return null;
}

export default function Home() {
  return <Dashboard />;
}
