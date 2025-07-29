import type { Route } from "./+types/home";
import { Dashboard } from "../dashboard/dashboard";
import { redirect, useNavigate, type LoaderFunctionArgs } from "react-router";
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
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.auth.accessToken);

  useEffect(() => {
    //localStorage.getItem("token");
    if (!token) {
      navigate("/");
      logoutAndReset();
    }
  }, [navigate, token]);

  return <Dashboard />;
}
