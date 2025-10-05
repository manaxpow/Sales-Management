import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/main.layout";
import { clientRoutes } from "./client.route";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [...clientRoutes],
  },
]);
