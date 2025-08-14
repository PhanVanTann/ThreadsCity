import {
  type RouteConfig,
  route,
  index,
  layout,
  prefix,
} from "@react-router/dev/routes";

export default [
  layout("routes/layout.tsx", [
    index("routes/home.tsx"),
    route("search", "routes/search.tsx"),
    route("profile/:userId", "routes/profileUser.tsx"),
    route("notifications", "routes/notifications.tsx"),
    route("post/:postid", "routes/postcomment.tsx"),
  ]),

  layout("routes/auth/layout.tsx", [
    route("login", "routes/auth/login.tsx"),
    route("register", "routes/auth/register.tsx"),
  ]),

  // Sửa đường dẫn admin:
  layout("admin/layout.tsx", [
    route("dashboard", "admin/dashboard.tsx"),
    route("postprocessing", "admin/postprocessing.tsx"),
  ]),
] satisfies RouteConfig;
