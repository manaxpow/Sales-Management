import { useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  Typography,
  Chip,
  TextField,
  InputAdornment,
  Container,
  Alert,
  Snackbar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";

import {
  Search,
  Trash2,
  Package,
  Tag,
  DollarSign,
  CheckCircle,
  Truck,
  Settings2,
  Hash,
  X,
} from "lucide-react";

// Import modals
import EditProductModal from "../../components/admin/product/update-product.modal";
import AddProductModal from "../../components/admin/product/add-product.modal";
import { useFetchData } from "../../hooks/fetchData";
import {
  DeleteProductService,
  GetProductsService,
} from "../../services/product.service";
import type {
  DeleteProductRequest,
  ProductFilter,
  ProductResponse,
} from "../../types/product.type";
import { CategoryService } from "../../services/category.service";
import { toast } from "react-toastify";

const ProductManagement = () => {
  const [filter, setFilter] = useState<ProductFilter>({
    Limit: 5,
    Page: 1,
    ProductName: "",
  });
  const { data, refetch } = useFetchData(GetProductsService, filter);
  // Sửa nút xóa bộ lọc
  const handleClearFilters = () => {
    setFilter({
      Limit: 5,
      Page: 1,
      ProductName: "",
      CategoryId: undefined,
      Status: undefined,
      SortBy: "CreatedAt",
    });
  };
  const { data: Category } = useFetchData(CategoryService.getAll, {});
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductResponse | null>(
    null
  );

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    productId: number | null;
    productName: string;
  }>({
    open: false,
    productId: null,
    productName: "",
  });
  const [saveLoading, setSaveLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const handleAddProduct = async () => {
    try {
      refetch();
      setAddModalOpen(false);
    } catch (error) {
      console.error("Lỗi thêm sản phẩm:", error);
      setSnackbar({
        open: true,
        message: "Thêm sản phẩm thất bại. Vui lòng thử lại.",
        severity: "error",
      });
    } finally {
      setSaveLoading(false);
    }
  };

  const handleSaveProduct = async () => {
    setSaveLoading(true);
    try {
      // update Product service
      setSnackbar({
        open: true,
        message: "Cập nhật sản phẩm thành công!",
        severity: "success",
      });
      handleCloseEditModal();
      refetch();
    } catch (error) {
      console.error("Lỗi cập nhật sản phẩm:", error);
      setSnackbar({
        open: true,
        message: "Cập nhật sản phẩm thất bại. Vui lòng thử lại.",
        severity: "error",
      });
    } finally {
      setSaveLoading(false);
    }
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialog({
      open: false,
      productId: null,
      productName: "",
    });
  };

  const handleConfirmDelete = async (id: number) => {
    // delete product service
    try {
      const deletePayload: DeleteProductRequest = {
        ProductId: id,
        Status: 3,
      };

      const res = await DeleteProductService(deletePayload);
      if (res.success) {
        toast.success("Delete product success");
        handleCloseDeleteDialog();
        refetch();
      } else {
        toast.error("Deleted product fail with mess " + res.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setEditingProduct(null);
  };

  const handleChangePage = (newPage: number) => {
    setFilter((prev) => ({ ...prev, Page: newPage + 1 }));
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFilter((prev) => ({
      ...prev,
      Limit: Number(event.target.value),
      Page: 1,
    }));
  };

  const handleSnackbarClose = () => {
    setSnackbar({ open: false, message: "", severity: "success" });
  };

  const getStatusChip = (status: number) => {
    const statusText = status === 1 ? "Hoạt động" : "Ngừng kinh doanh";
    return (
      <Chip
        label={statusText}
        color={status === 1 ? "success" : "error"}
        size="small"
        variant="filled"
      />
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "₫";
  };

  return (
    <Box className="flex-grow p-6 bg-gray-50">
      <Box className="mb-6">
        <Box className="flex items-center justify-between">
          <Box className="flex items-center gap-3">
            <Package className="w-8 h-8 text-blue-600" />
            <Box>
              <Typography
                variant="h4"
                component="h1"
                className="text-2xl font-bold text-gray-900"
                gutterBottom={false}
              >
                Quản lý sản phẩm
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Quản lý danh mục sản phẩm của bạn ({data?.totalProduct} sản
                phẩm)
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <Container maxWidth="xl" className="mt-6 mb-6 px-4">
        <Paper className="p-4 mb-4 bg-white shadow-sm rounded-lg">
          <Box className="flex flex-col md:flex-row gap-4 items-end">
            {/* Ô tìm kiếm */}
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Tìm kiếm theo tên, mã, danh mục hoặc nhà cung cấp..."
              value={filter.ProductName ?? ""}
              onChange={(e) => {
                const value = e.target.value;
                setFilter((prev) => ({ ...prev, ProductName: value, Page: 1 }));
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={20} className="text-gray-500" />
                  </InputAdornment>
                ),
              }}
              className="flex-1"
              disabled={saveLoading}
            />

            {/* Lọc danh mục */}
            <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Danh mục</InputLabel>
              <Select
                value={filter.CategoryId ?? ""}
                MenuProps={{ disablePortal: false }}
                onChange={(e) =>
                  setFilter((prev) => ({
                    ...prev,
                    CategoryId: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                    Page: 1,
                  }))
                }
                label="Danh mục"
                disabled={saveLoading}
              >
                <MenuItem value="">Tất cả danh mục</MenuItem>
                {Category?.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name || `Danh mục ${cat.id}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Lọc trạng thái */}
            <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                MenuProps={{ disablePortal: false }}
                value={filter.Status ?? ""}
                onChange={(e) =>
                  setFilter((prev) => ({
                    ...prev,
                    Status: e.target.value || undefined,
                    Page: 1,
                  }))
                }
                label="Trạng thái"
                disabled={saveLoading}
              >
                <MenuItem value="">Tất cả trạng thái</MenuItem>
                <MenuItem value={1}>
                  <Box className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    Hoạt động
                  </Box>
                </MenuItem>
                <MenuItem value={2}>
                  <Box className="flex items-center gap-2">
                    <X size={16} className="text-red-600" />
                    Ngừng kinh doanh
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>

            {/* Nút xóa bộ lọc */}
            <Button
              variant="outlined"
              startIcon={<X size={16} />}
              onClick={handleClearFilters}
              size="small"
              className="whitespace-nowrap border-gray-300 hover:bg-gray-50"
              disabled={saveLoading}
            >
              Xóa bộ lọc
            </Button>
          </Box>

          {/* Chip hiển thị kết quả */}
          {(filter.ProductName || filter.CategoryId || filter.Status) && (
            <Box className="mt-3 flex flex-wrap gap-2 items-center">
              {filter.ProductName && (
                <Chip
                  label={`Tên chứa: "${filter.ProductName}"`}
                  size="small"
                  onDelete={() =>
                    setFilter((prev) => ({ ...prev, ProductName: undefined }))
                  }
                />
              )}
              {filter.CategoryId && (
                <Chip
                  label={`Danh mục: ${
                    Category?.find((c) => c.id === filter.CategoryId)?.name ??
                    filter.CategoryId
                  }`}
                  size="small"
                  onDelete={() =>
                    setFilter((prev) => ({ ...prev, CategoryId: undefined }))
                  }
                />
              )}
              {filter.Status && (
                <Chip
                  label={`Trạng thái: ${
                    filter.Status === 1 ? "Hoạt động" : "Ngừng kinh doanh"
                  }`}
                  size="small"
                  onDelete={() =>
                    setFilter((prev) => ({ ...prev, Status: undefined }))
                  }
                />
              )}
              <Chip
                label={`${data?.totalProduct ?? 0} sản phẩm`}
                size="small"
                variant="outlined"
              />
            </Box>
          )}
        </Paper>

        <Paper className="w-full overflow-hidden shadow-sm rounded-lg">
          <TableContainer className="max-h-[1000px] overflow-auto">
            <Table stickyHeader className="min-w-full">
              <TableHead>
                <TableRow>
                  {/* <TableCell className="bg-gray-50 text-gray-900 font-bold p-3 sticky top-0 w-16">
                    <div className="flex items-center gap-2 justify-center">
                      <ImageIcon size={16} className="text-blue-600" />
                    </div>
                  </TableCell> */}
                  <TableCell className="bg-gray-50 text-gray-900 font-bold p-3 sticky top-0">
                    <div className="flex items-center gap-2">
                      <Package size={16} className="text-blue-600" />
                      <span>Tên sản phẩm</span>
                    </div>
                  </TableCell>
                  <TableCell className="bg-gray-50 text-gray-900 font-bold p-3 sticky top-0">
                    <div className="flex items-center gap-2">
                      <Tag size={16} className="text-purple-600" />
                      <span>Mã sản phẩm</span>
                    </div>
                  </TableCell>
                  <TableCell className="bg-gray-50 text-gray-900 font-bold p-3 sticky top-0">
                    <div className="flex items-center gap-2">
                      <Settings2 size={16} className="text-green-600" />
                      <span>Danh mục</span>
                    </div>
                  </TableCell>
                  <TableCell className="bg-gray-50 text-gray-900 font-bold p-3 sticky top-0">
                    <div className="flex items-center gap-2">
                      <Truck size={16} className="text-orange-600" />
                      <span>Nhà cung cấp</span>
                    </div>
                  </TableCell>
                  <TableCell className="bg-gray-50 text-gray-900 font-bold p-3 sticky top-0">
                    <div className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-emerald-600" />
                      <span>Trạng thái</span>
                    </div>
                  </TableCell>
                  <TableCell className="bg-gray-50 text-gray-900 font-bold p-3 sticky top-0">
                    <div className="flex items-center gap-2">
                      <DollarSign size={16} className="text-red-600" />
                      <span>Giá bán</span>
                    </div>
                  </TableCell>
                  <TableCell className="bg-gray-50 text-gray-900 font-bold p-3 sticky top-0 w-20">
                    <div className="flex items-center gap-2 justify-center">
                      <Hash size={16} className="text-teal-600" />
                      <span>Đơn vị</span>
                    </div>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {!data?.products ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      <Typography
                        variant="body1"
                        textAlign={"center"}
                        color="text.secondary"
                      >
                        {"Không có sản phẩm nào"}
                      </Typography>
                      {/* {searchTerm.trim() === "" &&
                        categoryFilter === "Tất cả" &&
                        statusFilter === "Tất cả" && (
                          <Button
                            variant="contained"
                            startIcon={<Plus className="w-4 h-4" />}
                            onClick={() => setAddModalOpen(true)}
                            className="mt-2 bg-green-600 hover:bg-green-700"
                            disabled={saveLoading}
                          >
                            Thêm sản phẩm đầu tiên
                          </Button>
                        )} */}
                    </TableCell>
                  </TableRow>
                ) : (
                  data?.products.map((product) => (
                    <TableRow
                      key={product.productId}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {/* <TableCell className="p-3">
                        <Avatar
                          src={getPlaceholderImage(
                            Math.floor(product.productId)
                          )}
                          alt={product.productName}
                          variant="square"
                          className="!w-12 !h-12 object-cover"
                        >
                          {!product.image && (
                            <ImageIcon className="w-6 h-6 text-gray-400" />
                          )}
                        </Avatar>
                      </TableCell> */}
                      <TableCell className="p-3 font-medium max-w-[200px] truncate">
                        {product.productName}
                      </TableCell>
                      <TableCell className="p-3">
                        <Chip
                          label={product.barcode}
                          size="small"
                          className="!bg-blue-50 !text-blue-600 !text-xs"
                          icon={<Tag size={12} className="!text-blue-600" />}
                        />
                      </TableCell>
                      <TableCell className="p-3">
                        <Chip
                          label={product.categoryName}
                          size="small"
                          className="text-xs"
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell className="p-3 text-sm max-w-[150px] truncate">
                        {product.supplierName}
                      </TableCell>
                      <TableCell className="p-3">
                        {getStatusChip(product.status)}
                      </TableCell>
                      <TableCell className="p-3 font-semibold text-gray-900 text-right">
                        {formatPrice(product.price)}
                      </TableCell>
                      <TableCell className="p-3 text-sm text-center">
                        {product.unit}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {data && data?.totalPage > 0 && (
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={data.totalProduct ? data.totalProduct : 1}
              rowsPerPage={filter.Limit ?? 5}
              page={(filter.Page ?? 1) - 1}
              onPageChange={(_event, newPage) => handleChangePage(newPage)}
              onRowsPerPageChange={handleChangeRowsPerPage}
              className="bg-gray-50"
              labelRowsPerPage="Hiển thị:"
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} của ${count !== -1 ? count : `hơn ${to}`}`
              }
              disabled={saveLoading}
            />
          )}
        </Paper>
      </Container>

      <Dialog
        open={deleteDialog.open}
        onClose={handleCloseDeleteDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="flex items-center gap-2 bg-red-50 border-b-red-200">
          <Trash2 className="w-5 h-5 text-red-600" />
          <Typography variant="h6" className="text-red-800">
            Xác nhận xóa sản phẩm
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText className="text-gray-700">
            Bạn có chắc chắn muốn xóa sản phẩm{" "}
            <strong>"{deleteDialog.productName}"</strong>? Thao tác này không
            thể hoàn tác và sẽ xóa vĩnh viễn dữ liệu sản phẩm.
          </DialogContentText>
        </DialogContent>
        <DialogActions className="p-4 bg-gray-50">
          <Button
            onClick={handleCloseDeleteDialog}
            variant="outlined"
            className="border-gray-300"
            disabled={saveLoading}
          >
            Hủy
          </Button>
          <Button
            onClick={() => handleConfirmDelete(deleteDialog.productId ?? 0)}
            variant="contained"
            color="error"
            startIcon={<Trash2 size={16} />}
            className="ml-2 bg-red-600 hover:bg-red-700"
            disabled={saveLoading}
          >
            Xóa vĩnh viễn
          </Button>
        </DialogActions>
      </Dialog>

      <AddProductModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSave={handleAddProduct}
        loading={saveLoading}
      />

      <EditProductModal
        product={editingProduct}
        open={editModalOpen}
        onClose={handleCloseEditModal}
        onSave={handleSaveProduct}
        loading={saveLoading}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductManagement;
