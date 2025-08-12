import {
  type RouteConfig,
  route,
  index,
  layout,
  prefix,
} from "@react-router/dev/routes";

export default [
  layout("routes/layout.tsx",[
     index("routes/home.tsx"),
     route("search", "routes/search.tsx"),
     route("profile/:userId", "routes/profileUser.tsx"),
      route("notifications", "routes/notifications.tsx"),
  ]),
 
    layout("routes/auth/layout.tsx",[
    route("login", "routes/auth/login.tsx"),
    route("register", "routes/auth/register.tsx"),
  ]),

] satisfies RouteConfig;
