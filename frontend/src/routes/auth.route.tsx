import type { RouteObject } from "react-router-dom";
import Login from "../pages/auth/login";
import Register from "../pages/auth/register";

export const authRoutes: RouteObject[] = [
  {
    path: "/auth",
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },
];
