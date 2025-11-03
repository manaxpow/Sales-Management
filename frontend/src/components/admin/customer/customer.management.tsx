import { useState, useEffect, useMemo, useCallback } from "react";
import { Users, Plus, Eye, Edit, Trash2 } from "lucide-react";
import CustomerFilter from "./customer.filter";
import CustomerPagination from "./customer.pagination";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  IconButton,
  Tooltip,
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { DeleteCustomerModal } from "./modal/delete-modal";
import { EditCustomerModal } from "./modal/update.modals";
import { ViewCustomerModal } from "./modal/view-modal";
import type {
  CustomerResponse,
  GetCustomerRequest,
  UpdateCustomerRequest,
} from "../../../types/customer.types";
import { customerService } from "../../../services/customer.service";

export interface SimpleCustomerFilters {
  search: string; // chỉ search
}

const CustomerManagement: React.FC = () => {
  const navigate = useNavigate();

  // filters
  const [filters, setFilters] = useState<SimpleCustomerFilters>({ search: "" });

  // paging (MUI zero-based, backend one-based)
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // data
  const [customers, setCustomers] = useState<CustomerResponse[]>([]);

  // ui
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "warning" | "info";
  }>({ open: false, message: "", severity: "success" });

  // modals
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerResponse | null>(null);

  const fetchCustomers = useCallback(async () => {
    const req: GetCustomerRequest = {
      search: filters.search.trim() || "",
      page: page + 1,
      limit: rowsPerPage,
    };
    setLoading(true);
    try {
      const res = await customerService.getAll(req);
      if (!res.success) {
        throw new Error(res.message || "Không lấy được danh sách khách hàng");
      }
      setCustomers(res.data?.customers ?? []);
    } catch (err) {
      setSnackbar({
        open: true,
        message:
          err instanceof Error ? err.message : "Lỗi tải danh sách khách hàng",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [filters.search, page, rowsPerPage]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // handlers
  const handleFiltersChange = (newFilters: SimpleCustomerFilters) => {
    setFilters(newFilters);
    setPage(0);
  };

  const handleClearFilters = () => {
    setFilters({ search: "" });
    setPage(0);
  };

  const handlePageChange = (newPage: number) => setPage(newPage);
  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  const handleViewCustomer = (cus: CustomerResponse) => {
    setSelectedCustomer(cus);
    setViewModalOpen(true);
  };

  // ✅ Chỉ mở modal edit, KHÔNG gọi update ở đây
  const handleEditCustomer = (cus: CustomerResponse) => {
    setSelectedCustomer(cus);
    setEditModalOpen(true);
  };

  // ✅ Chỉ mở modal delete, KHÔNG gọi delete ở đây
  const handleDeleteCustomer = (cus: CustomerResponse) => {
    setSelectedCustomer(cus);
    setDeleteModalOpen(true);
  };

  // Xác nhận xoá trong modal
  const handleConfirmDelete = async () => {
    if (!selectedCustomer) return;
    try {
      const res = await customerService.delete(selectedCustomer.id);
      if (!res.success)
        throw new Error(res.message || "Xoá khách hàng thất bại");
      setSnackbar({
        open: true,
        message: "Đã xóa khách hàng",
        severity: "success",
      });
      setDeleteModalOpen(false);
      setSelectedCustomer(null);
      fetchCustomers();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err instanceof Error ? err.message : "Lỗi xoá khách hàng",
        severity: "error",
      });
    }
  };

  // Lưu từ modal edit
  const handleSaveCustomer = async (data: UpdateCustomerRequest) => {
    if (!selectedCustomer) return;
    try {
      const res = await customerService.update(selectedCustomer.id, data);
      if (!res.success) throw new Error(res.message || "Cập nhật thất bại");
      setSnackbar({
        open: true,
        message: "Đã cập nhật khách hàng",
        severity: "success",
      });
      setEditModalOpen(false);
      setSelectedCustomer(null);
      fetchCustomers();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err instanceof Error ? err.message : "Lỗi cập nhật khách hàng",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  const paginatedCustomers = useMemo(() => customers, [customers]); // server-side paging

  return (
    <Box className="p-6 bg-gray-50 min-h-screen">
      <Box className="max-w-7xl mx-auto">
        {/* Header */}
        <Box className="mb-6">
          <Box className="flex items-center justify-between">
            <Box className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-600" />
              <Box>
                <Typography
                  variant="h4"
                  component="h1"
                  className="text-2xl font-bold text-gray-900"
                  gutterBottom={false}
                >
                  Customer Management
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Quản lý danh sách khách hàng
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              startIcon={<Plus className="w-4 h-4" />}
              className="normal-case"
              onClick={() => navigate("/admin/customers/create")}
            >
              Thêm khách hàng
            </Button>
          </Box>
        </Box>

        {/* Filters */}
        <CustomerFilter
          filters={{ search: filters.search }}
          onFiltersChange={(f) => handleFiltersChange({ search: f.search })}
          onClearFilters={handleClearFilters}
        />

        {/* Table */}
        <Paper className="mb-6" elevation={1}>
          {loading ? (
            <Box className="flex items-center justify-center py-16">
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead sx={{ backgroundColor: "#f9fafb" }}>
                  <TableRow>
                    <TableCell>Khách hàng</TableCell>
                    <TableCell>Liên hệ</TableCell>
                    <TableCell align="right">Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedCustomers.length > 0 ? (
                    paginatedCustomers.map((cus) => (
                      <TableRow
                        key={cus.id}
                        sx={{ "&:hover": { backgroundColor: "#f9fafb" } }}
                      >
                        <TableCell>
                          <Box className="flex items-center">
                            <Avatar className="mr-3">
                              {cus.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </Avatar>
                            <Box>
                              <Typography
                                variant="subtitle2"
                                className="font-medium text-gray-900"
                              >
                                {cus.name}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                ID: {cus.id}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>

                        <TableCell>
                          <Box className="flex flex-col">
                            {cus.email && (
                              <Typography variant="body2">
                                {cus.email}
                              </Typography>
                            )}
                            {cus.phone && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {cus.phone}
                              </Typography>
                            )}
                            {cus.address && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {cus.address}
                              </Typography>
                            )}
                          </Box>
                        </TableCell>

                        <TableCell align="right">
                          <Box className="flex items-center justify-end gap-1">
                            <Tooltip title="Xem chi tiết" arrow>
                              <IconButton
                                size="small"
                                onClick={() => handleViewCustomer(cus)}
                              >
                                <Eye className="w-4 h-4" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Chỉnh sửa" arrow>
                              <IconButton
                                size="small"
                                onClick={() => handleEditCustomer(cus)}
                              >
                                <Edit className="w-4 h-4" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Xóa" arrow>
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteCustomer(cus)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} align="center" sx={{ py: 6 }}>
                        <Box className="flex flex-col items-center">
                          <Users className="w-12 h-12 text-gray-300 mb-4" />
                          <Typography
                            variant="h6"
                            className="text-lg font-medium text-gray-900 mb-2"
                          >
                            Không tìm thấy khách hàng
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {filters.search
                              ? "Hãy điều chỉnh từ khoá để thấy thêm kết quả."
                              : "Bắt đầu bằng cách thêm khách hàng đầu tiên."}
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        {/* Pagination (client hoặc server-side tuỳ component của bạn) */}
        <CustomerPagination
          customers={customers}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />

        {/* Modals */}
        <ViewCustomerModal
          customer={selectedCustomer}
          open={viewModalOpen}
          onClose={() => {
            setViewModalOpen(false);
            setSelectedCustomer(null);
          }}
        />

        <EditCustomerModal
          customer={selectedCustomer}
          open={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setSelectedCustomer(null);
          }}
          onSave={handleSaveCustomer}
        />

        <DeleteCustomerModal
          customer={selectedCustomer}
          open={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setSelectedCustomer(null);
          }}
          onConfirm={handleConfirmDelete}
        />

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default CustomerManagement;
