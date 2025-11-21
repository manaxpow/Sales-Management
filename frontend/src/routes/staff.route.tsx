import type { RouteObject } from "react-router-dom";
import ManageCustomer from "../pages/staff/manage-customer";
import Sale from "../pages/staff/sale";
import CreateCustomerPage from "../pages/admin/create-customer";
import OrderManagement from "../pages/staff/order";
import InventoryManagementPage from "../pages/staff/inventory.management";
import ProductManagement from "../pages/staff/manage-product";

export const staffRoutes: RouteObject[] = [
  {
    path: "customers",
    element: <ManageCustomer />,
  },
  {
    path: "customers/create",
    element: <CreateCustomerPage />,
  },
  {
    path: "sale",
    element: <Sale />,
  },
  {
    path: "orders",
    element: <OrderManagement />,
  },
  {
    path: "inventory",
    element: <InventoryManagementPage />,
  },
  {
    path: "products",
    element: <ProductManagement />,
  },
];
