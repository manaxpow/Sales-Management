import type { RouteObject } from "react-router-dom";
import ManageCustomer from "../pages/admin/manage-customer";
import Sale from "../pages/staff/sale";

export const staffRoutes: RouteObject[] = [
  {
    path: "customers",
    element: <ManageCustomer />,
  },
  {
    path: "sale",
    element: <Sale />,
  },
];
