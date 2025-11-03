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
  DialogActions,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Badge,
  Tooltip,
  Autocomplete,
  Card,
  CardContent,
} from "@mui/material";

import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Image as ImageIcon,
  Package,
  Tag,
  DollarSign,
  CheckCircle,
  Settings2,
  Hash,
  CreditCard,
  X,
  ShoppingBag,
  AlertCircle,
  User,
  Phone,
  Mail,
} from "lucide-react";

interface Customer {
  id: number;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  totalSpent?: number;
  joinDate?: string;
}

const mockCustomers: Customer[] = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    phone: "0901234567",
    email: "a@example.com",
    address: "Hà Nội",
    totalSpent: 125000000,
  },
  {
    id: 2,
    name: "Trần Thị B",
    phone: "0912345678",
    email: "b@example.com",
    address: "TP.HCM",
    totalSpent: 89000000,
  },
  {
    id: 3,
    name: "Lê Văn C",
    phone: "0923456789",
    address: "Đà Nẵng",
    totalSpent: 45000000,
  },
  {
    id: 4,
    name: "Phạm Thị D",
    phone: "0934567890",
    email: "d@example.com",
    address: "Cần Thơ",
  },
  {
    id: 5,
    name: "Hoàng Văn E",
    phone: "0945678901",
    address: "Hải Phòng",
    totalSpent: 67000000,
  },
];

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
  stock: number;
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
    stock: 12,
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
    stock: 8,
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
    stock: 5,
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
    stock: 0,
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
    stock: 15,
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
    stock: 3,
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
    stock: 20,
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
    stock: 2,
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
    stock: 7,
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
    stock: 0,
  },
];

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  unit: string;
}

const Sale = () => {
  const [products, setProducts] = useState<SimpleProduct[]>(mockProducts);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Tất cả");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [customerSearch, setCustomerSearch] = useState("");
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "warning";
  }>({ open: false, message: "", severity: "success" });

  const availableCategories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(products.map((p) => p.category))
    ).sort();
    return ["Tất cả", ...uniqueCategories];
  }, [products]);

  const filteredCustomers = useMemo(() => {
    if (!customerSearch.trim()) return mockCustomers;
    const lower = customerSearch.toLowerCase();
    return mockCustomers.filter(
      (c) =>
        c.name.toLowerCase().includes(lower) || c.phone.includes(customerSearch)
    );
  }, [customerSearch]);

  const filteredProducts = useMemo(() => {
    let filtered = products.filter((p) => p.status === "active");

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

    return filtered;
  }, [products, searchTerm, categoryFilter]);

  const handleChangePage = (event: unknown, newPage: number) =>
    setPage(newPage);
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("Tất cả");
    setPage(0);
  };

  const handleCategoryFilterChange = (value: string) => {
    setCategoryFilter(value);
    setPage(0);
  };

  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN").format(price) + "₫";

  const paginatedProducts = filteredProducts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const addToCart = (product: SimpleProduct) => {
    if (product.stock <= 0) {
      setSnackbar({
        open: true,
        message: `Sản phẩm "${product.name}" đã hết hàng!`,
        severity: "error",
      });
      return;
    }

    const existingItem = cartItems.find((item) => item.id === product.id);
    const newQuantity = (existingItem?.quantity || 0) + 1;

    if (newQuantity > product.stock) {
      setSnackbar({
        open: true,
        message: `Chỉ còn ${product.stock} ${product.unit} "${product.name}" trong kho!`,
        severity: "warning",
      });
      return;
    }

    setCartItems((prev) =>
      existingItem
        ? prev.map((item) =>
            item.id === product.id ? { ...item, quantity: newQuantity } : item
          )
        : [
            ...prev,
            {
              id: product.id,
              name: product.name,
              price: product.price,
              quantity: 1,
              unit: product.unit,
            },
          ]
    );

    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, stock: p.stock - 1 } : p))
    );

    setSnackbar({
      open: true,
      message: `Đã thêm "${product.name}" vào giỏ hàng`,
      severity: "success",
    });
  };

  const updateQuantity = (id: number, delta: number) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;

    setCartItems((prev) => {
      const updated = prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            if (newQty > product.stock + item.quantity) {
              setSnackbar({
                open: true,
                message: `Chỉ còn ${product.stock} ${product.unit} trong kho!`,
                severity: "warning",
              });
              return item;
            }
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];

      const cartQty = updated.find((i) => i.id === id)?.quantity || 0;
      const originalQty = prev.find((i) => i.id === id)?.quantity || 0;
      const stockChange = originalQty - cartQty;

      if (stockChange !== 0) {
        setProducts((p) =>
          p.map((item) =>
            item.id === id ? { ...item, stock: item.stock + stockChange } : item
          )
        );
      }

      return updated;
    });
  };

  const removeFromCart = (id: number) => {
    const removedItem = cartItems.find((i) => i.id === id);
    if (removedItem) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, stock: p.stock + removedItem.quantity } : p
        )
      );
    }
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    setSnackbar({
      open: true,
      message: "Đã xóa sản phẩm khỏi giỏ hàng",
      severity: "success",
    });
  };

  const calculateTotal = () =>
    cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePayment = () => {
    const orderInfo = {
      customer: selectedCustomer
        ? `${selectedCustomer.name} - ${selectedCustomer.phone}`
        : "Khách vãng lai",
      total: calculateTotal(),
      items: cartItems.length,
    };
    console.log("Đơn hàng:", orderInfo);

    setSnackbar({
      open: true,
      message: `Thanh toán thành công cho ${orderInfo.customer}!`,
      severity: "success",
    });
    setCartItems([]);
    setSelectedCustomer(null);
    setPaymentDialogOpen(false);
  };

  const handleNewOrder = () => {
    setCartItems([]);
    setSelectedCustomer(null);
    setCustomerSearch("");
    setSnackbar({
      open: true,
      message: "Đã bắt đầu đơn hàng mới",
      severity: "success",
    });
  };

  const getStockChip = (stock: number) => {
    if (stock === 0)
      return (
        <Chip
          label="Hết hàng"
          size="small"
          color="error"
          icon={<X size={14} />}
        />
      );
    if (stock <= 3)
      return (
        <Chip
          label={`Còn ${stock}`}
          size="small"
          color="warning"
          icon={<AlertCircle size={14} />}
        />
      );
    return (
      <Chip
        label={stock}
        size="small"
        color="success"
        icon={<CheckCircle size={14} />}
      />
    );
  };

  return (
    <Box className="flex-grow p-6 bg-gray-50">
      <Box className="mb-6">
        <Box className="flex items-center justify-between">
          <Box className="flex items-center gap-3">
            <ShoppingBag className="w-8 h-8 text-blue-600" />
            <Box>
              <Typography
                variant="h4"
                component="h1"
                className="text-2xl font-bold text-gray-900"
              >
                Bán hàng cho nhân viên
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Quản lý bán hàng ({filteredProducts.length} sản phẩm khả dụng)
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            startIcon={<Plus className="w-4 h-4" />}
            onClick={handleNewOrder}
            className="normal-case bg-green-600 hover:bg-green-700"
          >
            Đơn hàng mới
          </Button>
        </Box>
      </Box>

      <Container maxWidth="xl" className="mt-6 mb-6 px-4">
        <Paper className="p-4 mb-4 bg-white shadow-sm rounded-lg">
          <Box className="flex flex-col md:flex-row gap-4 items-end">
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Tìm kiếm sản phẩm..."
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
              >
                {availableCategories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="outlined"
              startIcon={<X size={16} />}
              onClick={handleClearFilters}
              size="small"
              disabled={!searchTerm.trim() && categoryFilter === "Tất cả"}
            >
              Xóa bộ lọc
            </Button>
          </Box>
        </Paper>

        <Box className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Paper className="col-span-2 overflow-hidden shadow-sm rounded-lg">
            <TableContainer className="max-h-[600px] overflow-auto">
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell className="bg-gray-50 font-bold p-3 sticky top-0 w-16">
                      <ImageIcon size={16} className="text-blue-600 mx-auto" />
                    </TableCell>
                    <TableCell className="bg-gray-50 font-bold p-3 sticky top-0">
                      <Package
                        size={16}
                        className="text-blue-600 inline mr-1"
                      />
                      Tên
                    </TableCell>
                    <TableCell className="bg-gray-50 font-bold p-3 sticky top-0">
                      <Tag size={16} className="text-purple-600 inline mr-1" />
                      Mã
                    </TableCell>
                    <TableCell className="bg-gray-50 font-bold p-3 sticky top-0">
                      <Settings2
                        size={16}
                        className="text-green-600 inline mr-1"
                      />
                      Danh mục
                    </TableCell>
                    <TableCell className="bg-gray-50 font-bold p-3 sticky top-0">
                      <DollarSign
                        size={16}
                        className="text-red-600 inline mr-1"
                      />
                      Giá
                    </TableCell>
                    <TableCell className="bg-gray-50 font-bold p-3 sticky top-0">
                      <Hash size={16} className="text-teal-600 inline mr-1" />
                      Tồn
                    </TableCell>
                    <TableCell className="bg-gray-50 font-bold p-3 sticky top-0">
                      <Hash size={16} className="text-teal-600 inline mr-1" />
                      Đơn vị
                    </TableCell>
                    <TableCell className="bg-gray-50 font-bold p-3 sticky top-0 w-24 text-center">
                      <ShoppingCart
                        size={16}
                        className="text-indigo-600 inline mr-1"
                      />
                      Thao tác
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedProducts.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center py-8 text-gray-500"
                      >
                        Không có sản phẩm phù hợp
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedProducts.map((product) => (
                      <TableRow key={product.id} className="hover:bg-gray-50">
                        <TableCell className="p-3">
                          <Avatar
                            src={product.image}
                            alt={product.name}
                            variant="square"
                            className="!w-12 !h-12 object-cover"
                          >
                            <ImageIcon className="w-6 h-6 text-gray-400" />
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
                          />
                        </TableCell>
                        <TableCell className="p-3">
                          <Chip
                            label={product.category}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell className="p-3 text-right font-semibold">
                          {formatPrice(product.price)}
                        </TableCell>
                        <TableCell className="p-3 text-center">
                          {getStockChip(product.stock)}
                        </TableCell>
                        <TableCell className="p-3 text-center">
                          {product.unit}
                        </TableCell>
                        <TableCell className="p-3">
                          <Tooltip
                            title={
                              product.stock === 0 ? "Hết hàng" : "Thêm vào giỏ"
                            }
                          >
                            <span>
                              <IconButton
                                onClick={() => addToCart(product)}
                                disabled={product.stock === 0}
                                className={
                                  product.stock === 0
                                    ? "!text-gray-400"
                                    : "!text-green-600 hover:bg-green-50"
                                }
                                size="small"
                              >
                                <Plus size={16} />
                              </IconButton>
                            </span>
                          </Tooltip>
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
                  `${from}-${to} của ${count}`
                }
              />
            )}
          </Paper>

          <Paper className="shadow-sm rounded-lg p-4">
            <Box className="mb-4">
              <Typography
                variant="h6"
                className="font-bold mb-3 flex items-center gap-2"
              >
                <User className="w-5 h-5 text-blue-600" /> Khách hàng
              </Typography>

              <Autocomplete
                options={filteredCustomers}
                getOptionLabel={(option) => `${option.name} - ${option.phone}`}
                value={selectedCustomer}
                onChange={(e, newValue) => setSelectedCustomer(newValue)}
                inputValue={customerSearch}
                onInputChange={(e, newInputValue) =>
                  setCustomerSearch(newInputValue)
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Tìm hoặc chọn khách hàng..."
                    variant="outlined"
                    size="small"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search size={18} className="text-gray-500" />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
                noOptionsText="Không tìm thấy khách hàng"
                renderOption={(props, option) => (
                  <li {...props} key={option.id}>
                    <Box className="flex flex-col">
                      <span className="font-medium">{option.name}</span>
                      <span className="text-sm text-gray-500">
                        {option.phone}
                        {option.email ? ` • ${option.email}` : ""}
                      </span>
                    </Box>
                  </li>
                )}
              />

              {selectedCustomer && (
                <Card variant="outlined" className="mt-3">
                  <CardContent className="p-3 space-y-2">
                    <Box className="flex items-center gap-2">
                      <User size={16} className="text-blue-600" />
                      <Typography variant="body2" className="font-medium">
                        {selectedCustomer.name}
                      </Typography>
                    </Box>
                    <Box className="flex items-center gap-2">
                      <Phone size={16} className="text-green-600" />
                      <Typography variant="body2">
                        {selectedCustomer.phone}
                      </Typography>
                    </Box>
                    {selectedCustomer.email && (
                      <Box className="flex items-center gap-2">
                        <Mail size={16} className="text-purple-600" />
                        <Typography variant="body2">
                          {selectedCustomer.email}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              )}
            </Box>

            <Divider className="mb-4" />

            <Box className="flex items-center justify-between mb-3">
              <Typography variant="h6" className="font-bold">
                Giỏ hàng
              </Typography>
              <Badge
                badgeContent={cartItems.reduce((s, i) => s + i.quantity, 0)}
                color="primary"
              >
                <ShoppingCart className="w-6 h-6 text-blue-600" />
              </Badge>
            </Box>

            {cartItems.length === 0 ? (
              <Typography
                variant="body2"
                color="text.secondary"
                className="text-center py-6"
              >
                Giỏ hàng trống
              </Typography>
            ) : (
              <>
                <List className="max-h-[300px] overflow-auto mb-3">
                  {cartItems.map((item) => {
                    const stock =
                      products.find((p) => p.id === item.id)?.stock || 0;
                    const available = stock + item.quantity;
                    return (
                      <ListItem key={item.id} divider>
                        <ListItemAvatar>
                          <Avatar className="bg-gray-200">
                            <Package className="text-blue-600" />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={item.name}
                          secondary={
                            <span>
                              {formatPrice(item.price)} × {item.quantity} ={" "}
                              {formatPrice(item.price * item.quantity)}
                              {available < 5 && available > 0 && (
                                <Chip
                                  label={`Còn ${available}`}
                                  size="small"
                                  color="warning"
                                  className="ml-2"
                                />
                              )}
                            </span>
                          }
                        />
                        <ListItemSecondaryAction className="flex items-center gap-1">
                          <IconButton
                            size="small"
                            onClick={() => updateQuantity(item.id, -1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={16} />
                          </IconButton>
                          <Chip label={item.quantity} size="small" />
                          <IconButton
                            size="small"
                            onClick={() => updateQuantity(item.id, 1)}
                            disabled={item.quantity >= available}
                          >
                            <Plus size={16} />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-600"
                          >
                            <Trash2 size={16} />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    );
                  })}
                </List>

                <Divider className="my-3" />
                <Box className="flex justify-between mb-3">
                  <Typography variant="subtitle1" className="font-bold">
                    Tổng cộng:
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    className="font-bold text-red-600"
                  >
                    {formatPrice(calculateTotal())}
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<CreditCard className="w-4 h-4" />}
                  onClick={() => setPaymentDialogOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={cartItems.length === 0}
                >
                  Thanh toán
                </Button>
              </>
            )}
          </Paper>
        </Box>
      </Container>

      <Dialog
        open={paymentDialogOpen}
        onClose={() => setPaymentDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="flex items-center gap-2 bg-blue-50">
          <CreditCard className="w-5 h-5 text-blue-600" />
          <Typography variant="h6" className="text-blue-800">
            Xác nhận thanh toán
          </Typography>
        </DialogTitle>
        <DialogContent className="pt-4">
          <Box className="space-y-3">
            <Box className="flex justify-between">
              <span className="font-medium">Khách hàng:</span>
              <span>
                {selectedCustomer
                  ? `${selectedCustomer.name} (${selectedCustomer.phone})`
                  : "Khách vãng lai"}
              </span>
            </Box>
            <Box className="flex justify-between">
              <span className="font-medium">Số sản phẩm:</span>
              <span>{cartItems.reduce((s, i) => s + i.quantity, 0)} món</span>
            </Box>
            <Box className="flex justify-between text-lg font-bold text-red-600">
              <span>Tổng tiền:</span>
              <span>{formatPrice(calculateTotal())}</span>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions className="p-4 bg-gray-50">
          <Button
            onClick={() => setPaymentDialogOpen(false)}
            variant="outlined"
          >
            Hủy
          </Button>
          <Button
            onClick={handlePayment}
            variant="contained"
            color="primary"
            startIcon={<CheckCircle size={16} />}
          >
            Xác nhận thanh toán
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Sale;
