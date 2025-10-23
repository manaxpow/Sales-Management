import { useState, useMemo } from "react";
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
  IconButton,
  Typography,
  Avatar,
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
  Plus,
  Edit,
  Trash2,
  Image as ImageIcon,
  Package,
  Tag,
  DollarSign,
  CheckCircle,
  Truck,
  Settings2,
  Hash,
  Settings,
  X,
} from "lucide-react";

// Import modals
import EditProductModal from "../../components/admin/product/update-product.modal";
import AddProductModal, {
  type NewProductFormData,
} from "../../components/admin/product/add-product.modal";

export interface SimpleProduct {
  id: number;
  image?: string;
  name: string;
  code: string;
  category: string;
  supplier: string;
  status: "active" | "inactive";
  price: number;
  unit: string;
}

const mockProducts: SimpleProduct[] = [
  {
    id: 1,
    image: "https://picsum.photos/200?random=1",
    name: "iPhone 15 Pro Max 256GB",
    code: "IPH15PM-001",
    category: "Điện thoại",
    supplier: "Apple Việt Nam",
    status: "active",
    price: 29999000,
    unit: "Chiếc",
  },
  {
    id: 2,
    image: "https://picsum.photos/200?random=2",
    name: "Samsung Galaxy S24 Ultra",
    code: "SGS24U-002",
    category: "Điện thoại",
    supplier: "Samsung Việt Nam",
    status: "active",
    price: 25999000,
    unit: "Chiếc",
  },
  {
    id: 3,
    image: "https://picsum.photos/200?random=3",
    name: "MacBook Pro M3 14 inch",
    code: "MBP-M3-003",
    category: "Laptop",
    supplier: "Apple Việt Nam",
    status: "active",
    price: 49999000,
    unit: "Chiếc",
  },
  {
    id: 4,
    image: "https://picsum.photos/200?random=4",
    name: "Asus ROG Strix G16",
    code: "ROG-G16-004",
    category: "Laptop",
    supplier: "ASUS Việt Nam",
    status: "inactive",
    price: 35999000,
    unit: "Chiếc",
  },
  {
    id: 5,
    image: "https://picsum.photos/200?random=5",
    name: "iPad Pro M4 11 inch",
    code: "IPAD-M4-005",
    category: "Máy tính bảng",
    supplier: "Apple Việt Nam",
    status: "active",
    price: 24999000,
    unit: "Chiếc",
  },
  {
    id: 6,
    image: "https://picsum.photos/200?random=6",
    name: "AirPods Pro 2nd Gen",
    code: "AP-PRO2-006",
    category: "Tai nghe",
    supplier: "Apple Việt Nam",
    status: "active",
    price: 6990000,
    unit: "Cặp",
  },
  {
    id: 7,
    image: "https://picsum.photos/200?random=7",
    name: "Sony WH-1000XM5",
    code: "WH1000XM5-007",
    category: "Tai nghe",
    supplier: "Sony Việt Nam",
    status: "active",
    price: 12990000,
    unit: "Cặp",
  },
  {
    id: 8,
    image: "https://picsum.photos/200?random=8",
    name: "Ốp lưng iPhone 15 Pro",
    code: "CASE-IPH15-008",
    category: "Phụ kiện",
    supplier: "Spigen Việt Nam",
    status: "active",
    price: 890000,
    unit: "Cái",
  },
  {
    id: 9,
    image: "https://picsum.photos/200?random=9",
    name: "Chuột không dây Logitech MX Master 3",
    code: "LOGI-MX3-009",
    category: "Phụ kiện",
    supplier: "Logitech Việt Nam",
    status: "active",
    price: 2790000,
    unit: "Cái",
  },
  {
    id: 10,
    image: "https://picsum.photos/200?random=10",
    name: "Bàn phím cơ Keychron K2",
    code: "KEY-K2-010",
    category: "Phụ kiện",
    supplier: "Keychron Việt Nam",
    status: "inactive",
    price: 3490000,
    unit: "Cái",
  },
];

const ProductManagement = () => {
  const [products, setProducts] = useState<SimpleProduct[]>(mockProducts);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Tất cả");
  const [statusFilter, setStatusFilter] = useState("Tất cả");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<SimpleProduct | null>(
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

  const availableCategories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(products.map((p) => p.category))
    ).sort();
    return ["Tất cả", ...uniqueCategories];
  }, [products]);

  // Tạo URL ảnh placeholder từ Lorem Picsum dựa trên product ID
  const getPlaceholderImage = (productId: number) => {
    return `https://picsum.photos/200?random=${productId}`;
  };

  // Tự động generate unique code và ID cho sản phẩm mới
  const generateUniqueProductData = (newProductData: NewProductFormData) => {
    const categoryCode = newProductData.category
      .substring(0, 4)
      .toUpperCase()
      .replace(/[^A-Z]/g, "");

    const nameCode = newProductData.name
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .substring(0, 6);

    const randomCode = Math.random().toString(36).substring(2, 7).toUpperCase();
    const code = `${categoryCode}-${nameCode}-${randomCode}`;
    const id = Date.now() + Math.random();

    return { id, code };
  };

  const handleAddProduct = async (newProductData: NewProductFormData) => {
    setSaveLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const { id, code } = generateUniqueProductData(newProductData);

      const newProduct: SimpleProduct = {
        id,
        image: getPlaceholderImage(Math.floor(id)), // TODO: Sau này upload ảnh thật và lưu URL từ server
        name: newProductData.name,
        code,
        category: newProductData.category,
        supplier: newProductData.supplier,
        status: newProductData.status,
        price: newProductData.price,
        unit: newProductData.unit,
      };

      setProducts((prev) => [newProduct, ...prev]);
      setSnackbar({
        open: true,
        message: `Thêm sản phẩm "${newProduct.name}" thành công!`,
        severity: "success",
      });
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

  const handleEditProduct = (product: SimpleProduct) => {
    setEditingProduct(product);
    setEditModalOpen(true);
  };

  const handleSaveProduct = async (updatedData: {
    name: string;
    category: string;
    supplier: string;
    status: "active" | "inactive";
    price: number;
    unit: string;
  }) => {
    setSaveLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // TODO: Sau này khi edit, nếu có upload ảnh mới thì xử lý upload và cập nhật URL
      // Hiện tại giữ nguyên ảnh placeholder

      setProducts((prev) =>
        prev.map((product) =>
          product.id === editingProduct?.id
            ? {
                ...product,
                ...updatedData,
                // Giữ nguyên code, id và image khi edit
                code: product.code,
                id: product.id,
                image: product.image,
              }
            : product
        )
      );

      setSnackbar({
        open: true,
        message: "Cập nhật sản phẩm thành công!",
        severity: "success",
      });

      handleCloseEditModal();
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

  const handleOpenDeleteDialog = (id: number, name: string) => {
    setDeleteDialog({
      open: true,
      productId: id,
      productName: name,
    });
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialog({
      open: false,
      productId: null,
      productName: "",
    });
  };

  const handleConfirmDelete = () => {
    if (deleteDialog.productId) {
      const deletedProductName = deleteDialog.productName;
      setProducts((prev) =>
        prev.filter((product) => product.id !== deleteDialog.productId)
      );
      setSnackbar({
        open: true,
        message: `Đã xóa sản phẩm "${deletedProductName}"`,
        severity: "success",
      });
      handleCloseDeleteDialog();
    }
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setEditingProduct(null);
  };

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchLower) ||
          product.code.toLowerCase().includes(searchLower) ||
          product.category.toLowerCase().includes(searchLower) ||
          product.supplier.toLowerCase().includes(searchLower)
      );
    }

    if (categoryFilter !== "Tất cả") {
      filtered = filtered.filter(
        (product) => product.category === categoryFilter
      );
    }

    if (statusFilter !== "Tất cả") {
      filtered = filtered.filter((product) => product.status === statusFilter);
    }

    return filtered;
  }, [products, searchTerm, categoryFilter, statusFilter]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("Tất cả");
    setStatusFilter("Tất cả");
    setPage(0);
  };

  const handleCategoryFilterChange = (value: string) => {
    setCategoryFilter(value);
    setPage(0);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setPage(0);
  };

  const handleSnackbarClose = () => {
    setSnackbar({ open: false, message: "", severity: "success" });
  };

  const getStatusChip = (status: "active" | "inactive") => {
    const statusText = status === "active" ? "Hoạt động" : "Ngừng kinh doanh";
    return (
      <Chip
        label={statusText}
        color={status === "active" ? "success" : "error"}
        size="small"
        variant="filled"
      />
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "₫";
  };

  const paginatedProducts = filteredProducts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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
                Quản lý danh mục sản phẩm của bạn ({filteredProducts.length} sản
                phẩm)
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            startIcon={<Plus className="w-4 h-4" />}
            onClick={() => setAddModalOpen(true)}
            className="normal-case bg-green-600 hover:bg-green-700"
            disabled={saveLoading}
          >
            Thêm sản phẩm mới
          </Button>
        </Box>
      </Box>

      <Container maxWidth="xl" className="mt-6 mb-6 px-4">
        <Paper className="p-4 mb-4 bg-white shadow-sm rounded-lg">
          <Box className="flex flex-col md:flex-row gap-4 items-end">
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Tìm kiếm theo tên, mã, danh mục hoặc nhà cung cấp..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(0);
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

            <FormControl
              variant="outlined"
              size="small"
              className="min-w-[150px]"
            >
              <InputLabel>Danh mục</InputLabel>
              <Select
                value={categoryFilter}
                onChange={(e) =>
                  handleCategoryFilterChange(e.target.value as string)
                }
                label="Danh mục"
                disabled={saveLoading}
              >
                {availableCategories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl
              variant="outlined"
              size="small"
              className="min-w-[160px]"
            >
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) =>
                  handleStatusFilterChange(e.target.value as string)
                }
                label="Trạng thái"
                disabled={saveLoading}
              >
                <MenuItem value="Tất cả">Tất cả trạng thái</MenuItem>
                <MenuItem value="active">
                  <Box className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    Hoạt động
                  </Box>
                </MenuItem>
                <MenuItem value="inactive">
                  <Box className="flex items-center gap-2">
                    <X size={16} className="text-red-600" />
                    Ngừng kinh doanh
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="outlined"
              startIcon={<X size={16} />}
              onClick={handleClearFilters}
              size="small"
              className="whitespace-nowrap border-gray-300 hover:bg-gray-50"
              disabled={
                (!searchTerm.trim() &&
                  categoryFilter === "Tất cả" &&
                  statusFilter === "Tất cả") ||
                saveLoading
              }
            >
              Xóa bộ lọc
            </Button>
          </Box>

          {(searchTerm.trim() ||
            categoryFilter !== "Tất cả" ||
            statusFilter !== "Tất cả") && (
            <Box className="mt-3 flex flex-wrap gap-2">
              {searchTerm.trim() && (
                <Chip
                  label={`Tìm kiếm: "${searchTerm}"`}
                  size="small"
                  onDelete={() => setSearchTerm("")}
                  color="primary"
                  variant="outlined"
                  icon={<Search size={16} className="text-blue-500" />}
                />
              )}
              {categoryFilter !== "Tất cả" && (
                <Chip
                  label={`Danh mục: ${categoryFilter}`}
                  size="small"
                  onDelete={() => handleCategoryFilterChange("Tất cả")}
                  color="success"
                  variant="outlined"
                  icon={<Settings2 size={16} className="text-green-500" />}
                />
              )}
              {statusFilter !== "Tất cả" && (
                <Chip
                  label={`Trạng thái: ${
                    statusFilter === "active" ? "Hoạt động" : "Ngừng kinh doanh"
                  }`}
                  size="small"
                  onDelete={() => handleStatusFilterChange("Tất cả")}
                  color={statusFilter === "active" ? "success" : "error"}
                  variant="outlined"
                  icon={
                    statusFilter === "active" ? (
                      <CheckCircle size={16} className="text-green-500" />
                    ) : (
                      <X size={16} className="text-red-500" />
                    )
                  }
                />
              )}
              <Chip
                label={`${filteredProducts.length} sản phẩm`}
                size="small"
                color="default"
                variant="outlined"
                className="ml-2"
              />
            </Box>
          )}
        </Paper>

        <Paper className="w-full overflow-hidden shadow-sm rounded-lg">
          <TableContainer className="max-h-[1000px] overflow-auto">
            <Table stickyHeader className="min-w-full">
              <TableHead>
                <TableRow>
                  <TableCell className="bg-gray-50 text-gray-900 font-bold p-3 sticky top-0 w-16">
                    <div className="flex items-center gap-2 justify-center">
                      <ImageIcon size={16} className="text-blue-600" />
                    </div>
                  </TableCell>
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
                  <TableCell className="bg-gray-50 text-gray-900 font-bold p-3 sticky top-0 w-24">
                    <div className="flex items-center gap-2 justify-center">
                      <Settings size={16} className="text-indigo-600" />
                      <span>Thao tác</span>
                    </div>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      <Typography variant="body1" color="text.secondary">
                        {searchTerm.trim() ||
                        categoryFilter !== "Tất cả" ||
                        statusFilter !== "Tất cả"
                          ? "Không tìm thấy sản phẩm nào phù hợp với bộ lọc"
                          : "Không có sản phẩm nào"}
                      </Typography>
                      {searchTerm.trim() === "" &&
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
                        )}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedProducts.map((product) => (
                    <TableRow
                      key={product.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell className="p-3">
                        <Avatar
                          src={
                            product.image ||
                            getPlaceholderImage(Math.floor(product.id))
                          }
                          alt={product.name}
                          variant="square"
                          className="!w-12 !h-12 object-cover"
                        >
                          {!product.image && (
                            <ImageIcon className="w-6 h-6 text-gray-400" />
                          )}
                        </Avatar>
                      </TableCell>
                      <TableCell className="p-3 font-medium max-w-[200px] truncate">
                        {product.name}
                      </TableCell>
                      <TableCell className="p-3">
                        <Chip
                          label={product.code}
                          size="small"
                          className="!bg-blue-50 !text-blue-600 !text-xs"
                          icon={<Tag size={12} className="!text-blue-600" />}
                        />
                      </TableCell>
                      <TableCell className="p-3">
                        <Chip
                          label={product.category}
                          size="small"
                          className="text-xs"
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell className="p-3 text-sm max-w-[150px] truncate">
                        {product.supplier}
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
                      <TableCell className="p-3">
                        <div className="flex gap-1">
                          <IconButton
                            onClick={() => handleEditProduct(product)}
                            className="!text-blue-600 hover:bg-blue-50 p-1"
                            title="Chỉnh sửa"
                            size="small"
                            disabled={saveLoading}
                          >
                            <Edit size={16} />
                          </IconButton>
                          <IconButton
                            onClick={() =>
                              handleOpenDeleteDialog(product.id, product.name)
                            }
                            className="!text-red-600 hover:bg-red-50 p-1"
                            title="Xóa"
                            size="small"
                            disabled={saveLoading}
                          >
                            <Trash2 size={16} />
                          </IconButton>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {filteredProducts.length > 0 && (
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredProducts.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
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
            onClick={handleConfirmDelete}
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
