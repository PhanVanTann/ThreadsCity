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
  ]),
   

    route("login", "routes/auth/login.tsx"),
    route("register", "routes/auth/register.tsx"),


] satisfies RouteConfig;
