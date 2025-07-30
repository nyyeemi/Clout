import type { Route } from "./+types/home";
import { Dashboard } from "../dashboard/dashboard";
import {
  redirect,
  useNavigate,
  useParams,
  type LoaderFunctionArgs,
} from "react-router";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "~/redux/store/store";
import { logoutAndReset } from "~/redux/slices/authSlice";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Admin Dashboard" },
    { name: "description", content: "Welcome to clout enterprises. " },
  ];
}

export default function Competition() {
  const { id } = useParams();

  return (
    <div>
      {" "}
      <p>{id}</p>{" "}
    </div>
  );
}
