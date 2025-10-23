import type { RouteObject } from "react-router-dom";
import ManageCustomer from "../pages/admin/manage-customer";
import ProfileAdminPage from "../pages/admin/profile.page";
import { ManageStaff } from "../pages/admin/manage-staff";
import CreateStaffPage from "../pages/admin/create-staff";
import ProductManagement from "../pages/admin/manage-product";
import ManageSupplier from "../pages/admin/supplier/manage-supplier";
import SupplierProductsPage from "../pages/admin/supplier/suppliers-products.page";
import ManageCategoryPage from "../pages/admin/manage-category.page";
import ManagePromotion from "../pages/admin/manage-promotion";
import CreatePromotion from "../pages/admin/create-promotion";
import { ManageOrder } from "../pages/admin/manage-order";
import CreateCustomerPage from "../pages/admin/create-customer";

export const adminRoutes: RouteObject[] = [
  {
    path: "customers",
    element: <ManageCustomer />,
  },
  {
    path: "customers/create",
    element: <CreateCustomerPage />,
  },
  {
    path: "users",
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
  {
    path: "orders",
    element: <ManageOrder />,
  },
  {
    path: "suppliers",
    element: <ManageSupplier />,
  },
  {
    path: "suppliers/:id/products",
    element: <SupplierProductsPage />,
  },
  {
    path: "categories",
    element: <ManageCategoryPage />,
  },
  {
    path: "promotions",
    element: <ManagePromotion />,
  },
  {
    path: "promotions/create",
    element: <CreatePromotion />,
  },
];
