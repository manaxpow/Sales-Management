import type { RouteObject } from "react-router-dom";
import ClientLayout from "../layout/client/client.layout";
import HomePage from "../pages/home.page";
import { authRoutes } from "./auth.route";

export const clientRoutes: RouteObject[] = [
  {
    element: <ClientLayout />,
    children: [
      {
        index: true,
        path: "/",
        element: <HomePage />,
      },
      ...authRoutes,
    ],
  },
];
