import type { RouteObject } from "react-router-dom";

export const authRoutes: RouteObject[] = [
  {
    path: "/auth",
    children: [
      {
        path: "login",
        element: <div>login</div>,
      },
      {
        path: "register",
        element: <div>register</div>,
      },
    ],
  },
];
