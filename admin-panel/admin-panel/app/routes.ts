import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/login.tsx"),
  route("dashboard", "routes/home.tsx"),
  route("competition", "routes/competition.tsx"),
] satisfies RouteConfig;
