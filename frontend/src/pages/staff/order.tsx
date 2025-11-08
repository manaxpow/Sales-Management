import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { Package, RefreshCw } from "lucide-react";

import {
  GetOrdersService,
  UpdateOrderService,
  DeleteOrderService,
  GetOrderDetailService,
} from "../../services/order.service";
import { customerService } from "../../services/customer.service";

import OrderFilter from "../../components/staff/order/order-filters";
import OrderTable from "../../components/staff/order/order-table";
import OrderDetailDialog from "../../components/staff/order/detail-dialog";
import DeleteConfirmDialog from "../../components/staff/order/delete-dialog";
import UpdateStatusDialog from "../../components/staff/order/update-dialog";

export interface Order {
  id: string;
  userId: number;
  customerId: number;
  customerName: string;
  phoneNumber: string;
  createdDate: string;
  totalPaymentAmount: number;
  discountAmount: number;
  status: "pending" | "completed" | "canceled";
}

export interface OrderFilters {
  search: string;
  status: "all" | "pending" | "completed" | "canceled";
  dateRange: { startDate: string | null; endDate: string | null };
}

export interface OrderDetailResponse {
  order: {
    id: number;
    customerName: string;
    phoneNumber: string;
    orderDate: string;
    totalAmount: number;
    discountAmount: number;
    status: number;
  };
  items: {
    orderItemId: number;
    productid: number;
    productName: string;
    quantity: number;
    price: number;
    subTotal: number;
  }[];
}

const statusMap = { pending: 0, completed: 1, canceled: 2 } as const;
const statusReverseMap: Record<number, Order["status"]> = {
  0: "pending",
  1: "completed",
  2: "canceled",
};

const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<OrderFilters>({
    search: "",
    status: "all",
    dateRange: { startDate: null, endDate: null },
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderDetail, setOrderDetail] = useState<OrderDetailResponse | null>(
    null
  );
  const [loadingDetail, setLoadingDetail] = useState(false);

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({ open: false, message: "", severity: "success" });

  const customerCache = useMemo(
    () => new Map<number, { name: string; phone: string }>(),
    []
  );

  const fetchCustomer = useCallback(
    async (customerId: number) => {
      if (customerCache.has(customerId)) return customerCache.get(customerId)!;

      const res = await customerService.getById(customerId);
      const info = {
        name: res.success && res.data?.name ? res.data.name : "Khách lẻ",
        phone: res.success && res.data?.phone ? res.data.phone : "090xxx",
      };
      customerCache.set(customerId, info);
      return info;
    },
    [customerCache]
  );

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await GetOrdersService({
        status:
          filters.status === "all" ? undefined : statusMap[filters.status],
        dateFrom: filters.dateRange.startDate || undefined,
        dateTo: filters.dateRange.endDate || undefined,
      });

      if (res.success && res.data?.length) {
        const enriched: Order[] = [];
        for (const o of res.data) {
          const cust = await fetchCustomer(o.customerid);
          enriched.push({
            id: o.id.toString(),
            userId: o.userid,
            customerId: o.customerid,
            customerName: cust.name,
            phoneNumber: cust.phone,
            createdDate: o.orderDate,
            totalPaymentAmount: o.totalAmount,
            discountAmount: o.discountAmount,
            status: statusReverseMap[o.status] ?? "pending",
          });
        }
        setOrders(enriched);
      } else {
        setOrders([]);
      }
    } catch {
      setSnackbar({
        open: true,
        message: "Lỗi kết nối server",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filters.status, filters.dateRange.startDate, filters.dateRange.endDate]);

  const filteredOrders = useMemo(() => {
    let list = [...orders];
    if (filters.search.trim()) {
      const term = filters.search.toLowerCase();
      list = list.filter(
        (o) =>
          o.id.toLowerCase().includes(term) ||
          o.customerName.toLowerCase().includes(term) ||
          o.phoneNumber.includes(term)
      );
    }
    return list;
  }, [orders, filters.search]);

  const handleEdit = (order: Order) => {
    setSelectedOrder(order);
    setEditDialogOpen(true);
  };

  const handleUpdateStatus = async (status: Order["status"]) => {
    if (!selectedOrder) return;
    const id = parseInt(selectedOrder.id);
    const res = await UpdateOrderService(id, {
      Customerid: selectedOrder.customerId,
      Userid: selectedOrder.userId,
      TotalAmount: selectedOrder.totalPaymentAmount,
      DiscountAmount: selectedOrder.discountAmount,
      OrderDate: selectedOrder.createdDate,
      Status: statusMap[status],
    });

    if ("data" in res) {
      setOrders((prev) =>
        prev.map((o) => (o.id === selectedOrder.id ? { ...o, status } : o))
      );
      setSnackbar({
        open: true,
        message: `Cập nhật trạng thái đơn ${selectedOrder.id} thành công!`,
        severity: "success",
      });
    } else {
      setSnackbar({
        open: true,
        message: res.message ?? "Cập nhật thất bại",
        severity: "error",
      });
    }
  };

  const handleDeleteClick = (id: string) => {
    const order = orders.find((o) => o.id === id);
    if (order) {
      setSelectedOrder(order);
      setDeleteDialogOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedOrder) return;
    const id = parseInt(selectedOrder.id);
    const res = await DeleteOrderService(id);
    if ("data" in res) {
      setOrders((prev) => prev.filter((o) => o.id !== selectedOrder.id));
      setSnackbar({
        open: true,
        message: `Đã xóa đơn ${selectedOrder.id}`,
        severity: "info",
      });
    } else {
      setSnackbar({
        open: true,
        message: res.message ?? "Xóa thất bại",
        severity: "error",
      });
    }
  };

  const handleViewDetail = async (order: Order) => {
    setSelectedOrder(order);
    setLoadingDetail(true);
    setDetailDialogOpen(true);

    const res = await GetOrderDetailService(parseInt(order.id));
    if (res.success && res.data) {
      setOrderDetail({
        order: {
          ...res.data.order,
          customerName: order.customerName,
          phoneNumber: order.phoneNumber,
        },
        items: res.data.items,
      });
    } else {
      setSnackbar({
        open: true,
        message: res.message ?? "Không tải được chi tiết",
        severity: "error",
      });
    }
    setLoadingDetail(false);
  };

  const handleClear = () => {
    setFilters({
      search: "",
      status: "all",
      dateRange: { startDate: null, endDate: null },
    });
    setPage(0);
  };

  return (
    <Box className="flex-grow p-6 bg-gray-50 min-h-screen">
      <Container maxWidth="xl" className="px-4">
        <Box className="mb-6 flex justify-between items-center">
          <Box>
            <Typography
              variant="h5"
              className="font-bold flex items-center gap-2"
            >
              <Package className="w-6 h-6 text-blue-600" />
              Quản lý đơn hàng
            </Typography>
            <Typography className="text-gray-600 mt-1">
              Tổng: {filteredOrders.length} đơn hàng
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<RefreshCw size={16} />}
            onClick={fetchOrders}
            disabled={loading}
          >
            Làm mới
          </Button>
        </Box>
        <OrderFilter
          filters={filters}
          onChange={setFilters}
          onClear={handleClear}
        />
        <OrderTable
          orders={filteredOrders}
          loading={loading}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={setPage}
          onRowsPerPageChange={(r) => {
            setRowsPerPage(r);
            setPage(0);
          }}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          onViewDetail={handleViewDetail}
        />
        {/* Dialogs */}
        <UpdateStatusDialog
          open={editDialogOpen}
          order={selectedOrder}
          onClose={() => setEditDialogOpen(false)}
          onConfirm={handleUpdateStatus}
        />
        <DeleteConfirmDialog
          open={deleteDialogOpen}
          order={selectedOrder}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleDeleteConfirm}
        />
        <OrderDetailDialog
          open={detailDialogOpen}
          onClose={() => {
            setDetailDialogOpen(false);
            setOrderDetail(null);
          }}
          detail={orderDetail}
          loading={loadingDetail}
        />
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default OrderManagement;
