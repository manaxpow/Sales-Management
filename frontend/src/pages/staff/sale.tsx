// pages/Sale.tsx
import { useState, useEffect, useMemo } from "react";

import {
  Box,
  Container,
  Snackbar,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { GetProductsService } from "../../services/product.service";
import { customerService } from "../../services/customer.service";
import type { ProductFilter, ProductResponse } from "../../types/product.type";
import type {
  CustomerResponse,
  CreateCustomerRequest,
  GetCustomerRequest,
} from "../../types/customer.types";

// Components
import { SaleHeader } from "../../components/staff/sale/sale-header";
import { ProductFilters } from "../../components/staff/sale/product-filters";
import { ProductTable } from "../../components/staff/sale/product-table";
import { CartSidebar } from "../../components/staff/sale/cart-sidebar";
import { PaymentDialog } from "../../components/staff/sale/payment-dialog";

// Icons
import { UserPlus, CheckCircle } from "lucide-react";
import type { Category } from "../../types/category.types";
import { CategoryService } from "../../services/category.service";
import { GetPromotionsService } from "../../services/promotion.service";
import type { Promotion } from "../../types/promotion.type";
// Types
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

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  unit: string;
}

const Sale = () => {
  // === STATE ===
  const [products, setProducts] = useState<SimpleProduct[]>([]);
  const [customers, setCustomers] = useState<CustomerResponse[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);

  const [promotions, setPromotions] = useState<Promotion[]>([]); // Thêm
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(
    null
  ); // Thêm
  const [promotionSearch, setPromotionSearch] = useState(""); // Thêm
  const [promotionLoading, setPromotionLoading] = useState(false); // Thêm

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Tất cả");

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerResponse | null>(null);
  const [customerSearch, setCustomerSearch] = useState("");

  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [createCustomerOpen, setCreateCustomerOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState<CreateCustomerRequest>({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "warning" | "info";
  }>({ open: false, message: "", severity: "success" });

  // === FETCH PRODUCTS ===
  const fetchProducts = async () => {
    setLoadingProducts(true);
    setError(null);
    try {
      const filter: ProductFilter = {
        Page: 1,
        Limit: 1000,
        Status: 1,
        SortBy: "productId",
      };
      const response = await GetProductsService(filter);
      if (response.success && response.data?.products) {
        const apiProducts: SimpleProduct[] = response.data.products.map(
          (p: ProductResponse) => ({
            id: p.productId,
            image: `https://picsum.photos/200?random=${p.productId}`,
            name: p.productName,
            code: p.barcode,
            category: p.categoryName,
            supplier: p.supplierName,
            status: p.status === 1 ? "active" : "inactive",
            price: p.price,
            unit: p.unit || "Cái",
            stock: p.quantity,
          })
        );
        setProducts(apiProducts);
      } else {
        throw new Error(response.message || "Không thể tải sản phẩm");
      }
    } catch {
      setError("Lỗi kết nối server");
      setSnackbar({
        open: true,
        message: "Lỗi kết nối server",
        severity: "error",
      });
    } finally {
      setLoadingProducts(false);
    }
  };

  // === FETCH CUSTOMERS ===
  const fetchCustomers = async (search?: string) => {
    setLoadingCustomers(true);
    try {
      const req: GetCustomerRequest = {
        page: 1,
        limit: 100,
        search: search?.trim() || undefined,
      };
      const res = await customerService.getAll(req);
      if (res.success && res.data) {
        setCustomers(res.data.customers);
      }
    } catch {
      setSnackbar({
        open: true,
        message: "Không thể tải danh sách khách hàng",
        severity: "error",
      });
    } finally {
      setLoadingCustomers(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await CategoryService.getAll(); // <-- import CategoryService
      if (res.success && res.data) {
        setCategories(res.data);
      } else {
        setSnackbar({
          open: true,
          message: res.message ?? "Không thể tải danh mục",
          severity: "error",
        });
      }
    } catch {
      setSnackbar({
        open: true,
        message: "Lỗi kết nối server (categories)",
        severity: "error",
      });
    }
  };

  const fetchPromotions = async () => {
    setPromotionLoading(true);
    try {
      const res = await GetPromotionsService({
        page: 1,
        limit: 100,
        filters: { status: 1, PromotionCode: "", page: 1, limit: 100 },
      });
      if (res.success && res.data) {
        const now = new Date();
        const today = now.toISOString().split("T")[0];
        const valid = res.data.promotions.filter((p) => {
          const start = p.startDate.split("T")[0];
          const end = p.endDate.split("T")[0];
          return (
            p.status === 1 &&
            start <= today &&
            end >= today &&
            p.usedcount < p.usagelimit
          );
        });

        setPromotions(valid);
      }
    } catch (error) {
      console.error("Lỗi tải khuyến mãi:", error);
    } finally {
      setPromotionLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCustomers();
    fetchCategories();
    fetchPromotions();
  }, []);

  // === TÍNH TOÁN GIẢM GIÁ ===
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const discount = useMemo(() => {
    if (!selectedPromotion || total < selectedPromotion.minOrderAmount)
      return 0;
    let amount = 0;
    if (selectedPromotion.discountType === 1) {
      amount = total * (selectedPromotion.discountValue / 100);
    } else if (selectedPromotion.discountType === 2) {
      amount = selectedPromotion.discountValue;
    }
    return Math.min(amount, total);
  }, [selectedPromotion, total]);

  const finalTotal = total - discount;

  // Realtime search
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchCustomers(customerSearch);
    }, 300);
    return () => clearTimeout(delay);
  }, [customerSearch]);

  // === FILTERS ===
  const availableCategories = useMemo(() => {
    const uniq = categories.map((c) => c.name).sort();
    return ["Tất cả", ...uniq];
  }, [categories]);

  const filteredProducts = useMemo(() => {
    let filtered = products.filter((p) => p.status === "active");
    if (searchTerm.trim()) {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(lower) ||
          p.code.toLowerCase().includes(lower) ||
          p.category.toLowerCase().includes(lower) ||
          p.supplier.toLowerCase().includes(lower)
      );
    }
    if (categoryFilter !== "Tất cả") {
      filtered = filtered.filter((p) => p.category === categoryFilter);
    }
    return filtered;
  }, [products, searchTerm, categoryFilter]);

  const paginatedProducts = filteredProducts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // === CART ===
  const addToCart = (product: SimpleProduct) => {
    if (product.stock <= 0) {
      setSnackbar({
        open: true,
        message: `"${product.name}" đã hết hàng!`,
        severity: "error",
      });
      return;
    }
    const existing = cartItems.find((i) => i.id === product.id);
    const newQty = (existing?.quantity || 0) + 1;
    if (newQty > product.stock) {
      setSnackbar({
        open: true,
        message: `Chỉ còn ${product.stock} ${product.unit}!`,
        severity: "warning",
      });
      return;
    }
    setCartItems((prev) =>
      existing
        ? prev.map((i) =>
            i.id === product.id ? { ...i, quantity: newQty } : i
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
    setSnackbar({
      open: true,
      message: `Đã thêm "${product.name}"`,
      severity: "success",
    });
  };

  const updateQuantity = (id: number, delta: number) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;
    setCartItems(
      (prev) =>
        prev
          .map((item) => {
            if (item.id === id) {
              const newQty = item.quantity + delta;
              const available = product.stock + item.quantity;
              if (newQty > available) {
                setSnackbar({
                  open: true,
                  message: `Chỉ còn ${product.stock} ${product.unit}!`,
                  severity: "warning",
                });
                return item;
              }
              return newQty > 0 ? { ...item, quantity: newQty } : null;
            }
            return item;
          })
          .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (id: number) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
    setSnackbar({
      open: true,
      message: "Đã xóa khỏi giỏ",
      severity: "success",
    });
  };

  const calculateTotal = () =>
    cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePayment = () => {
    setSnackbar({
      open: true,
      message: `Thanh toán thành công! Tổng: ${formatPrice(calculateTotal())}`,
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
      message: "Bắt đầu đơn hàng mới",
      severity: "info",
    });
  };

  // === TẠO KHÁCH HÀNG ===
  const handleCreateCustomer = async () => {
    if (!newCustomer.name?.trim() || !newCustomer.phone?.trim()) {
      setSnackbar({
        open: true,
        message: "Vui lòng nhập tên và số điện thoại",
        severity: "warning",
      });
      return;
    }

    try {
      const res = await customerService.create(newCustomer);

      if (res.success && res.data) {
        const newCust: CustomerResponse = {
          id: res.data.id,
          name: res.data.name,
          phone: res.data.phone,
          email: res.data.email,
          address: res.data.address,
        };

        // Cập nhật danh sách
        setCustomers((prev) => [newCust, ...prev]);

        // Cập nhật thanh tìm kiếm + chọn khách
        setCustomerSearch(`${newCust.name} - ${newCust.phone}`);
        setSelectedCustomer(newCust);

        // Reset
        setCreateCustomerOpen(false);
        setNewCustomer({ name: "", phone: "", email: "", address: "" });

        setSnackbar({
          open: true,
          message: "Tạo khách hàng thành công!",
          severity: "success",
        });
      }
    } catch {
      setSnackbar({
        open: true,
        message: "Lỗi tạo khách hàng",
        severity: "error",
      });
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN").format(price) + "₫";

  return (
    <Box className="flex-grow p-6 bg-gray-50 min-h-screen">
      <Container maxWidth="xl" className="px-4">
        <SaleHeader
          loading={loadingProducts}
          productCount={filteredProducts.length}
          error={error}
          onRefresh={fetchProducts}
          onNewOrder={handleNewOrder}
        />

        <ProductFilters
          searchTerm={searchTerm}
          categoryFilter={categoryFilter}
          availableCategories={availableCategories}
          onSearchChange={(v) => {
            setSearchTerm(v);
            setPage(0);
          }}
          onCategoryChange={(v) => {
            setCategoryFilter(v);
            setPage(0);
          }}
          onClear={() => {
            setSearchTerm("");
            setCategoryFilter("Tất cả");
            setPage(0);
          }}
        />

        <Box className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
          <Box className="col-span-2">
            <ProductTable
              products={paginatedProducts}
              loading={loadingProducts}
              error={error}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={setPage}
              onRowsPerPageChange={(rows) => {
                setRowsPerPage(rows);
                setPage(0);
              }}
              onAddToCart={addToCart}
              onRetry={fetchProducts}
            />
          </Box>

          <CartSidebar
            customers={customers}
            selectedCustomer={selectedCustomer}
            customerSearch={customerSearch}
            cartItems={cartItems}
            products={products}
            loading={loadingCustomers}
            onCustomerChange={setSelectedCustomer} // Đúng kiểu: (CustomerResponse | null) => void
            onCustomerSearch={setCustomerSearch}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeFromCart}
            onCheckout={() => setPaymentDialogOpen(true)}
            onCreateCustomer={() => setCreateCustomerOpen(true)}
            // TRUYỀN KHUYẾN MÃI
            promotions={promotions}
            selectedPromotion={selectedPromotion}
            onPromotionChange={setSelectedPromotion}
            promotionSearch={promotionSearch}
            onPromotionSearch={setPromotionSearch}
            promotionLoading={promotionLoading}
            // TRUYỀN TỔNG TIỀN
            total={total}
            discount={discount}
            finalTotal={finalTotal}
          />
        </Box>
      </Container>

      <PaymentDialog
        open={paymentDialogOpen}
        total={total}
        discount={discount}
        finalTotal={finalTotal}
        itemCount={cartItems.reduce((s, i) => s + i.quantity, 0)}
        customerName={
          selectedCustomer
            ? `${selectedCustomer.name} (${selectedCustomer.phone})`
            : undefined
        }
        promotionCode={selectedPromotion?.promotionCode}
        onClose={() => setPaymentDialogOpen(false)}
        onConfirm={handlePayment}
      />

      <Dialog
        open={createCustomerOpen}
        onClose={() => setCreateCustomerOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-blue-600" />
          Tạo khách hàng mới
        </DialogTitle>
        <DialogContent dividers>
          <Box className="flex flex-col gap-6 pt-4">
            <TextField
              label="Họ tên *"
              fullWidth
              value={newCustomer.name}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, name: e.target.value })
              }
              required
              variant="outlined"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
            <TextField
              label="Số điện thoại *"
              fullWidth
              value={newCustomer.phone}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, phone: e.target.value })
              }
              required
              variant="outlined"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
            <TextField
              label="Email"
              fullWidth
              value={newCustomer.email}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, email: e.target.value })
              }
              type="email"
              variant="outlined"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
            <TextField
              label="Địa chỉ"
              fullWidth
              value={newCustomer.address}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, address: e.target.value })
              }
              multiline
              rows={2}
              variant="outlined"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateCustomerOpen(false)}>Hủy</Button>
          <Button
            variant="contained"
            onClick={handleCreateCustomer}
            startIcon={<CheckCircle />}
          >
            Tạo
          </Button>
        </DialogActions>
      </Dialog>

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
    </Box>
  );
};

export default Sale;
