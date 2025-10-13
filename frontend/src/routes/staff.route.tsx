import type { RouteObject } from "react-router-dom";
import ManageCustomer from "../pages/admin/manage-customer";
import ProfileStaffPage from "../pages/staff/profile-staff.page";

export const staffRoutes: RouteObject[] = [
  {
    path: "customers",
    element: <ManageCustomer />,
  },
  {
    path: "profile",
    element: <ProfileStaffPage />,
  },
];
