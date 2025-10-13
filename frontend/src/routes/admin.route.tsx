import type { RouteObject } from "react-router-dom";
import ManageCustomer from "../pages/admin/manage-customer";
import { ManageAccounts } from "../pages/admin/manage-accounts";
import ProfileAdminPage from "../pages/admin/profile.page";

export const adminRoutes: RouteObject[] = [
  {
    path: "customers",
    element: <ManageCustomer />,
  },
  {
    path: "accounts",
    element: <ManageAccounts />,
  },
  {
    path: "profile",
    element: <ProfileAdminPage />,
  },
];
