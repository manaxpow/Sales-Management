import type { RouteObject } from "react-router-dom";
import ManageCustomer from "../pages/admin/manage-customer";
import ProfileAdminPage from "../pages/admin/profile.page";
import { ManageStaff } from "../pages/admin/manage-staff";
import CreateStaffPage from "../pages/admin/create-staff";

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
];
