import {
  Users,
  UserCog,
  Tag,
  Package,
  Factory,
  Boxes,
  Gift,
  ClipboardList,
  ShoppingCart,
  PackageSearch,
  Warehouse,
  LayoutDashboard,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

export type navItemProps = {
  label: string;
  path: string;
  icon: LucideIcon;
};

// Menu dành cho Admin
export const adminMenuItems = [
  {
    label: "Thống kê",
    path: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Quản lý tài khoản",
    path: "/admin/accounts",
    icon: UserCog,
  },
  {
    label: "Quản lý khách hàng",
    path: "/admin/customers",
    icon: Users,
  },
  {
    label: "Quản lý danh mục",
    path: "/admin/categories",
    icon: Tag,
  },
  {
    label: "Quản lý nhà cung cấp",
    path: "/admin/suppliers",
    icon: Factory,
  },
  {
    label: "Quản lý sản phẩm",
    path: "/admin/products",
    icon: Package,
  },
  {
    label: "Quản lý tồn kho",
    path: "/admin/inventory",
    icon: Boxes,
  },
  {
    label: "Quản lý khuyến mãi",
    path: "/admin/promotions",
    icon: Gift,
  },
  {
    label: "Quản lý đơn hàng",
    path: "/admin/orders",
    icon: ClipboardList,
  },
];

// Menu dành cho Sales person
export const salesMenuItems = [
  {
    label: "Quản lý đơn hàng",
    path: "/sales/orders",
    icon: ShoppingCart,
  },
  {
    label: "Quản lý sản phẩm",
    path: "/sales/products",
    icon: PackageSearch,
  },
  {
    label: "Quản lý tồn kho",
    path: "/sales/inventory",
    icon: Warehouse,
  },
];
