import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("login", "routes/login.tsx"),
  route("competition", "routes/competition.tsx"),
  route("competitions/:id/entries", "routes/entries.tsx"),
  route("competitions/:id/votes", "routes/votes.tsx"),
] satisfies RouteConfig;
