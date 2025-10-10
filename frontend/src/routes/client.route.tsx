import type { RouteObject } from "react-router-dom";
import ClientLayout from "../layout/client/client.layout";
import HomePage from "../pages/home.page";
import ProductDetailPage  from "../pages/product-detail.page";
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
       {
        path: "/product/:id",  // http://localhost:5173/product/1
        element: <ProductDetailPage />,
      },
      ...authRoutes,
    ],
  },
];
