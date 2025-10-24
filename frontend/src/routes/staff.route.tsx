import type { RouteObject } from "react-router-dom";
import ManageCustomer from "../pages/admin/manage-customer";

export const staffRoutes: RouteObject[] = [
  {
    path: "customers",
    element: <ManageCustomer />,
  },
  
];
