import { useState, useEffect } from "react";
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
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PromotionFilter from "./promotion.filter";
import PromotionPagination from "./promotion.pagination";
import type {
  Promotion,
  PromotionDelete,
  PromotionFilters,
} from "../../../types/promotion.type";
import { ViewPromotionModal } from "./modal/view-modal";
import { DeletePromotionModal } from "./modal/delete-modal";
import { EditPromotionModal } from "./modal/update.modals";
import {
  GetPromotionsService,
  UpdatePromotionService,
} from "../../../services/promotion.service";
import { useFetchData } from "../../../hooks/fetchData";
import { toast } from "react-toastify";

// Generate simplified mock data

const PromotionManagement: React.FC = () => {
  const [filters, setFilters] = useState<PromotionFilters>({
    PromotionCode: "",
    status: "all",
    page: 1,
    limit: 10,
  });
  const { data, refetch, loading } = useFetchData(
    GetPromotionsService,
    filters
  );
  const [Promotion, setPromotion] = useState<Promotion[]>(
    data?.promotions || []
  );
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
  // Filter and PromotionCode logic
  useEffect(() => {
    setPromotion(data?.promotions || []);
  }, [Promotion, data]);

  // Event handlers
  const handleFiltersChange = (newFilters: PromotionFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    console.log(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      PromotionCode: "",
      status: "all",
      page: 1,
      limit: 10,
    });
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage + 1,
    }));
  };
  const handleRowsPerPageChange = (rowsPerPage: number) => {
    setFilters((prev) => {
      return {
        ...prev,
        limit: rowsPerPage,
        page: 1,
      };
    });
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

  const handleSavePromotion = (data: Promotion) => {
    if (selectedPromotion) {
      setSnackbar({
        open: true,
        message: `Promotion ${data.promotionCode} updated successfully`,
        severity: "success",
      });
    }
    refetch();
  };

  const handleConfirmDelete = async () => {
    if (selectedPromotion) {
      try {
        const statusUpdate: PromotionDelete = {
          PromotionId: selectedPromotion?.promotionId,
          Status: 3,
        };
        const result = await UpdatePromotionService(statusUpdate);
        if (!result.success) {
          let errorMessage = "Unknown error";
          if (Array.isArray(result.data) && result.data[0]?.message) {
            errorMessage = result.data[0].message;
          } else if (
            result.data &&
            typeof result.data === "object" &&
            "message" in result.data
          ) {
            errorMessage =
              (result.data as { message?: string }).message || errorMessage;
          }
          toast.error("Promotion deleted fail with error: " + errorMessage);
        } else {
          toast.success("Promotion deleted successfully");
          refetch();
        }
      } catch (error) {
        toast.error("Deleted promotion failed with error " + error);
      }
      setSnackbar({
        open: true,
        message: `Promotion ${selectedPromotion.promotionCode} deleted successfully`,
        severity: "success",
      });
      setDeleteModalOpen(false);
      setSelectedPromotion(null);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const getStatusChip = (status: number) => {
    return (
      <Chip
        label={status == 1 ? "active" : "inactive"}
        color={status === 1 ? "success" : "error"}
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
        {loading ? (
          <CircularProgress />
        ) : (
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
                  {Promotion.length > 0 ? (
                    Promotion.map((PromotionMember) => (
                      <TableRow
                        key={PromotionMember.promotionId}
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
                                {PromotionMember.promotionCode}
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
                                onClick={() => {
                                  const now = new Date();
                                  const startDate = new Date(
                                    PromotionMember.startDate
                                  );
                                  const endDate = new Date(
                                    PromotionMember.startDate
                                  );
                                  if (now >= startDate && now <= endDate) {
                                    return toast.error(
                                      "Promotion has started, cannot update."
                                    );
                                  }
                                  handleEditPromotion(PromotionMember);
                                }}
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
                            {filters.PromotionCode || filters.status !== "all"
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
        )}
        {/* Pagination */}
        {Promotion.length > 0 && (
          <PromotionPagination
            Promotion={Promotion}
            total={data?.totalPromotion || 1}
            page={filters.page - 1 || 0}
            rowsPerPage={filters.limit}
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
