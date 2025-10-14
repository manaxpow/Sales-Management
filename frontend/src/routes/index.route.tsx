import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/main.layout";
import { clientRoutes } from "./client.route";
import AdminLayout from "../layout/admin/admin.layout";
import { adminRoutes } from "./admin.route";
import StaffLayout from "../layout/staff/staff.layout";
import { staffRoutes } from "./staff.route";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [...clientRoutes],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [...adminRoutes],
  },
  {
    path: "/staff",
    element: <StaffLayout />,
    children: [...staffRoutes],
  },
]);
