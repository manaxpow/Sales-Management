import type { RouteObject } from "react-router-dom";
import ManageCustomer from "../pages/admin/manage-customer";
import ProfileAdminPage from "../pages/admin/profile.page";
import { ManageStaff } from "../pages/admin/manage-staff";
import CreateStaffPage from "../pages/admin/create-staff";
import ProductManagement from "../pages/admin/manage-product";

export const adminRoutes: RouteObject[] = [
  {
    path: "customers",
    element: <ManageCustomer />,
  },
  {
    path: "staff",
    element: <ManageStaff />,
  },
  {
    path: "staff/create",
    element: <CreateStaffPage />,
  },
  {
    path: "profile",
    element: <ProfileAdminPage />,
  },
  {
    path: "products",
    element: <ProductManagement />,
  },
];
