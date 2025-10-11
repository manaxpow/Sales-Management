import type { RouteObject } from "react-router-dom";
import ManageCustomer from "../pages/admin/ManageCustomer";
import { ManageAccounts } from "../pages/admin/ManageAccounts";

export const adminRoutes: RouteObject[] = [
  {
    path: "customers",
    element: <ManageCustomer />,
  },
  {
    path: "accounts",
    element: <ManageAccounts />,
  },
];
