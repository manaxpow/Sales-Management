import { useState, useEffect, useMemo } from "react";
import { Users, Plus, Eye, Edit, Trash2 } from "lucide-react";
import CustomerFilter from "./customer.filter";
import CustomerPagination, { type SimpleCustomer } from "./customer.pagination";
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
  Chip,
  IconButton,
  Tooltip,
  Alert,
  Snackbar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { DeleteCustomerModal } from "./modal/delete-modal";
import { EditCustomerModal } from "./modal/update.modals";
import { ViewCustomerModal } from "./modal/view-modal";

export interface SimpleCustomerFormData {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  status?: "active" | "inactive";
}

export interface SimpleCustomerFilters {
  search: string;
  status: "all" | "active" | "inactive";
}

/** ====== Mock data (có thể thay bằng API/DB thật) ====== */
const generateMockCustomers = (): SimpleCustomer[] => {
  const names = [
    "Nguyễn Văn An",
    "Trần Thị Bình",
    "Lê Minh Châu",
    "Phạm Hoàng Duy",
    "Võ Thị Em",
    "Bùi Quang Huy",
    "Đỗ Quốc Khánh",
    "Huỳnh Nhật Linh",
    "Phan Thảo My",
    "Mai Thanh Nam",
    "Trương Gia Phúc",
    "Đặng Hữu Quý",
    "Hoàng Khánh Linh",
    "Ngô Nhật Tân",
    "Tạ Bảo Trâm",
    "Vũ Minh Tuấn",
    "Lâm Thu Uyên",
    "Dương Quốc Vinh",
    "Phùng Anh Vũ",
    "Cao Mỹ Yến",
  ];
  const customers: SimpleCustomer[] = [];
  for (let i = 1; i <= 50; i++) {
    const name = names[Math.floor(Math.random() * names.length)];
    const phone = `09${Math.floor(10000000 + Math.random() * 89999999)}`;
    const email = `${name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/\s+/g, ".")}${Math.floor(Math.random() * 100)}@example.com`;
    const address = `Số ${Math.floor(Math.random() * 200)}, Đường ABC, Quận ${
      1 + Math.floor(Math.random() * 10)
    }, TP.HCM`;
    const status: "active" | "inactive" =
      Math.random() > 0.2 ? "active" : "inactive";
    const createdAt = new Date(
      Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000
    ).toISOString();

    customers.push({
      id: i, // giả lập customer_id tự tăng
      name,
      phone,
      email,
      address,
      status,
      createdAt,
    });
  }
  return customers.sort((a, b) => a.name.localeCompare(b.name));
};

const mockCustomers = generateMockCustomers();

/** ====== Component chính ====== */
const CustomerManagement: React.FC = () => {
  const [customers, setCustomers] = useState<SimpleCustomer[]>(mockCustomers);
  const [filteredCustomers, setFilteredCustomers] =
    useState<SimpleCustomer[]>(mockCustomers);

  const [filters, setFilters] = useState<SimpleCustomerFilters>({
    search: "",
    status: "all",
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] =
    useState<SimpleCustomer | null>(null);

  // UI states
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "warning" | "info";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  /** ====== Filter + Search ====== */
  useEffect(() => {
    const text = filters.search.trim().toLowerCase();

    const filtered = customers.filter((c) => {
      const matchesSearch =
        text === "" ||
        c.name.toLowerCase().includes(text) ||
        (c.email ?? "").toLowerCase().includes(text) ||
        (c.phone ?? "").toLowerCase().includes(text) ||
        (c.address ?? "").toLowerCase().includes(text);

      const matchesStatus =
        filters.status === "all" || (c.status ?? "active") === filters.status;

      return matchesSearch && matchesStatus;
    });

    setFilteredCustomers(filtered);
    setPage(0); // Reset khi thay đổi filter
  }, [customers, filters]);

  /** ====== Pagination (client-side) ====== */
  const paginatedCustomers = useMemo(() => {
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredCustomers.slice(start, end);
  }, [filteredCustomers, page, rowsPerPage]);

  /** ====== Handlers ====== */
  const handleFiltersChange = (newFilters: SimpleCustomerFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({ search: "", status: "all" });
  };

  const handlePageChange = (newPage: number) => setPage(newPage);

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  const handleViewCustomer = (cus: SimpleCustomer) => {
    setSelectedCustomer(cus);
    setViewModalOpen(true);
  };

  const handleEditCustomer = (cus: SimpleCustomer) => {
    setSelectedCustomer(cus);
    setEditModalOpen(true);
  };

  const handleDeleteCustomer = (cus: SimpleCustomer) => {
    setSelectedCustomer(cus);
    setDeleteModalOpen(true);
  };

  const handleSaveCustomer = (data: SimpleCustomerFormData) => {
    if (selectedCustomer) {
      setCustomers((prev) =>
        prev.map((c) => (c.id === selectedCustomer.id ? { ...c, ...data } : c))
      );
      setSnackbar({
        open: true,
        message: `Đã cập nhật khách hàng: ${data.name}`,
        severity: "success",
      });
    }
  };

  const handleConfirmDelete = () => {
    if (selectedCustomer) {
      setCustomers((prev) => prev.filter((c) => c.id !== selectedCustomer.id));
      setSnackbar({
        open: true,
        message: `Đã xóa khách hàng: ${selectedCustomer.name}`,
        severity: "success",
      });
      setDeleteModalOpen(false);
      setSelectedCustomer(null);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const getStatusChip = (status?: "active" | "inactive") => (
    <Chip
      label={status ?? "active"}
      color={(status ?? "active") === "active" ? "success" : "error"}
      size="small"
      variant="filled"
    />
  );

  /** ====== Render ====== */
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
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
        />

        {/* Table */}
        <Paper className="mb-6" elevation={1}>
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: "#f9fafb" }}>
                <TableRow>
                  <TableCell>Khách hàng</TableCell>
                  <TableCell>Liên hệ</TableCell>
                  <TableCell>Trạng thái</TableCell>
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
                            <Typography variant="body2" color="text.secondary">
                              ID: {cus.id}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Box className="flex flex-col">
                          {cus.email && (
                            <Typography variant="body2">{cus.email}</Typography>
                          )}
                          {cus.phone && (
                            <Typography variant="body2" color="text.secondary">
                              {cus.phone}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>

                      <TableCell>{getStatusChip(cus.status)}</TableCell>

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
                    <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                      <Box className="flex flex-col items-center">
                        <Users className="w-12 h-12 text-gray-300 mb-4" />
                        <Typography
                          variant="h6"
                          className="text-lg font-medium text-gray-900 mb-2"
                        >
                          Không tìm thấy khách hàng
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {filters.search || filters.status !== "all"
                            ? "Hãy điều chỉnh bộ lọc để thấy thêm kết quả."
                            : "Bắt đầu bằng cách thêm khách hàng đầu tiên."}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Pagination */}
        {filteredCustomers.length > 0 && (
          <CustomerPagination
            customers={filteredCustomers}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        )}

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
          autoHideDuration={6000}
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
