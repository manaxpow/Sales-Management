import { useState, useEffect, useMemo } from "react";
import { Users, Plus, Eye, Edit, Trash2 } from "lucide-react";
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
  Chip,
  IconButton,
  Tooltip,
  Alert,
  Snackbar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PromotionFilter from "./promotion.filter";
import PromotionPagination from "./promotion.pagination";
import type { Promotion } from "../../../types/promotion.type";
import { ViewPromotionModal } from "./modal/view-modal";
import { DeletePromotionModal } from "./modal/delete-modal";
import { EditPromotionModal } from "./modal/update.modals";

// Simplified Promotion interface matching database structure

// Simplified form data
interface PromotionFormData {
  code: string;
  description: string;
}

// Simplified filters
interface PromotionFilters {
  search: string;
  status: "all" | "active" | "inactive";
}

// Generate simplified mock data
const mockData: Promotion[] = [
  {
    id: 1,
    code: "SALE10",
    description: "Giảm 10% cho tất cả đơn hàng trên 500k",
    discountType: "fixed",
    discountValue: 10.0,
    minOrderAmount: 500000,
    usageLimit: 100,
    usedCount: 25,
    status: "active",
    startDate: "2025-10-01T00:00:00",
    endDate: "2025-10-31T23:59:59",
  },
  {
    id: 2,
    code: "FREESHIP",
    description: "Miễn phí vận chuyển cho đơn hàng từ 300k",
    discountType: "precent",
    discountValue: 30000,
    minOrderAmount: 300000,
    usageLimit: 200,
    usedCount: 60,
    status: "active",
    startDate: "2025-10-10T00:00:00",
    endDate: "2025-11-10T23:59:59",
  },
  {
    id: 3,
    code: "NEWUSER50K",
    description: "Giảm 50.000đ cho khách hàng mới",
    discountType: "precent",
    discountValue: 50000,
    minOrderAmount: 0,
    usageLimit: 1,
    usedCount: 0,
    status: "inactive",
    startDate: "2025-09-01T00:00:00",
    endDate: "2025-12-31T23:59:59",
  },
  {
    id: 4,
    code: "BLACKFRIDAY20",
    description: "Giảm 20% toàn bộ sản phẩm dịp Black Friday",
    discountType: "precent",
    discountValue: 20.0,
    minOrderAmount: 0,
    usageLimit: 500,
    usedCount: 120,
    status: "inactive",
    startDate: "2025-11-25T00:00:00",
    endDate: "2025-11-30T23:59:59",
  },
];

const PromotionManagement: React.FC = () => {
  const [Promotion, setPromotion] = useState<Promotion[]>(mockData);
  const [filteredPromotion, setFilteredPromotion] =
    useState<Promotion[]>(mockData);
  const [filters, setFilters] = useState<PromotionFilters>({
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
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(
    null
  );

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

  // Filter and search logic
  useEffect(() => {
    const filtered = Promotion.filter((promotion) => {
      const matchesSearch =
        filters.search === "" ||
        promotion.code.toLowerCase().includes(filters.search.toLowerCase()) ||
        promotion.code.toLowerCase().includes(filters.search.toLowerCase());

      const matchesStatus =
        filters.status === "all" || promotion.status === filters.status;

      return matchesSearch && matchesStatus;
    });

    setFilteredPromotion(filtered);
    setPage(0); // Reset to first page when filters change
  }, [Promotion, filters]);

  // Pagination logic
  const paginatedPromotion = useMemo(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredPromotion.slice(startIndex, endIndex);
  }, [filteredPromotion, page, rowsPerPage]);

  // Event handlers
  const handleFiltersChange = (newFilters: PromotionFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      search: "",
      status: "all",
    });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  const handleViewPromotion = (PromotionMember: Promotion) => {
    setSelectedPromotion(PromotionMember);
    setViewModalOpen(true);
  };

  const handleEditPromotion = (PromotionMember: Promotion) => {
    setSelectedPromotion(PromotionMember);
    setEditModalOpen(true);
  };

  const handleDeletePromotion = (PromotionMember: Promotion) => {
    setSelectedPromotion(PromotionMember);
    setDeleteModalOpen(true);
  };

  const handleSavePromotion = (data: PromotionFormData) => {
    if (selectedPromotion) {
      setPromotion((prev) =>
        prev.map((emp) =>
          emp.id === selectedPromotion.id ? { ...emp, ...data } : emp
        )
      );
      setSnackbar({
        open: true,
        message: `Promotion ${data.code} updated successfully`,
        severity: "success",
      });
    }
  };

  const handleConfirmDelete = () => {
    if (selectedPromotion) {
      setPromotion((prev) =>
        prev.filter((emp) => emp.id !== selectedPromotion.id)
      );
      setSnackbar({
        open: true,
        message: `Promotion ${selectedPromotion.code} deleted successfully`,
        severity: "success",
      });
      setDeleteModalOpen(false);
      setSelectedPromotion(null);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const getStatusChip = (status: "active" | "inactive") => {
    return (
      <Chip
        label={status}
        color={status === "active" ? "success" : "error"}
        size="small"
        variant="filled"
      />
    );
  };

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
                  Promotion Management
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage your promotion here
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              startIcon={<Plus className="w-4 h-4" />}
              className="normal-case"
              onClick={() => navigate("/admin/promotions/create")}
            >
              Add New Promotion
            </Button>
          </Box>
        </Box>

        {/* Filters */}
        <PromotionFilter
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
        />

        {/* Promotion Table */}
        <Paper className="mb-6" elevation={1}>
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: "#f9fafb" }}>
                <TableRow>
                  <TableCell>Promotion Code</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedPromotion.length > 0 ? (
                  paginatedPromotion.map((PromotionMember) => (
                    <TableRow
                      key={PromotionMember.id}
                      sx={{
                        "&:hover": {
                          backgroundColor: "#f9fafb",
                        },
                      }}
                    >
                      <TableCell>
                        <Box className="flex items-center">
                          <Box>
                            <Typography
                              variant="subtitle2"
                              className="font-medium text-gray-900"
                            >
                              {PromotionMember.code}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {getStatusChip(PromotionMember.status)}
                      </TableCell>
                      <TableCell align="right">
                        <Box className="flex items-center justify-end gap-1">
                          <Tooltip title="View Details" arrow>
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleViewPromotion(PromotionMember)
                              }
                            >
                              <Eye className="w-4 h-4" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit Promotion" arrow>
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleEditPromotion(PromotionMember)
                              }
                            >
                              <Edit className="w-4 h-4" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Promotion" arrow>
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleDeletePromotion(PromotionMember)
                              }
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
                          No Promotion found
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {filters.search || filters.status !== "all"
                            ? "Try adjusting your filters to see more results."
                            : "Get started by adding your first Promotion member."}
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
        {filteredPromotion.length > 0 && (
          <PromotionPagination
            Promotion={filteredPromotion}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        )}

        {/* Modals */}
        <ViewPromotionModal
          Promotion={selectedPromotion}
          open={viewModalOpen}
          onClose={() => {
            setViewModalOpen(false);
            setSelectedPromotion(null);
          }}
        />

        <EditPromotionModal
          Promotion={selectedPromotion}
          open={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setSelectedPromotion(null);
          }}
          onSave={handleSavePromotion}
        />

        <DeletePromotionModal
          Promotion={selectedPromotion}
          open={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setSelectedPromotion(null);
          }}
          onConfirm={handleConfirmDelete}
        />

        {/* Success/Error Snackbar */}
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

export default PromotionManagement;
