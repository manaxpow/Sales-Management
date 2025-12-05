import {
  Paper,
  Typography,
  Autocomplete,
  TextField,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  Chip,
  IconButton,
  Button,
  Badge,
  Box,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import {
  User,
  Phone,
  Mail,
  ShoppingCart,
  Package,
  Minus,
  Plus,
  Trash2,
  CreditCard,
  Search,
  UserPlus,
} from "lucide-react";

import type { CustomerResponse } from "../../../types/customer.types";
import type { SimpleProduct } from "../../../pages/staff/sale";
import type { Promotion } from "../../../types/promotion.type";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  unit: string;
}

interface CartSidebarProps {
  customers: CustomerResponse[];
  selectedCustomer: CustomerResponse | null;
  customerSearch: string;
  cartItems: CartItem[];
  products: SimpleProduct[];
  loading: boolean;
  onCustomerChange: (customer: CustomerResponse | null) => void;
  onCustomerSearch: (value: string) => void;
  onUpdateQuantity: (id: number, delta: number) => void;
  onRemoveItem: (id: number) => void;
  onCheckout: () => void;
  onCreateCustomer: () => void;

  promotions: Promotion[];
  selectedPromotion: Promotion | null;
  onPromotionChange: (p: Promotion | null) => void;
  promotionSearch: string;
  onPromotionSearch: (v: string) => void;
  promotionLoading: boolean;

  total: number;
  discount: number;
  finalTotal: number;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("vi-VN").format(price) + "₫";

export const CartSidebar = ({
  customers,
  selectedCustomer,
  customerSearch,
  cartItems,
  products,
  loading,
  onCustomerChange,
  onCustomerSearch,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onCreateCustomer,
  promotions,
  selectedPromotion,
  onPromotionChange,
  promotionSearch,
  onPromotionSearch,
  promotionLoading,
  total,
  discount,
  finalTotal,
}: CartSidebarProps) => {
  const totalItems = cartItems.reduce((s, i) => s + i.quantity, 0);

  return (
    <Paper className="shadow-sm rounded-lg p-4 h-fit sticky top-6">
      {/* === KHÁCH HÀNG === */}
      <Box className="mb-4">
        <Box className="flex items-center mb-2">
          <Typography
            variant="h6"
            className="font-bold mb-3 flex items-center gap-2 w-full"
          >
            <User className="w-5 h-5 text-blue-600" />
            Khách hàng
          </Typography>
          <Button
            fullWidth
            variant="outlined"
            size="small"
            startIcon={<UserPlus className="w-4 h-4" />}
            onClick={onCreateCustomer}
            className="mt-2"
            disabled={loading}
          >
            Tạo khách hàng mới
          </Button>
        </Box>

        <Autocomplete
          options={customers}
          getOptionLabel={(opt) => `${opt.name} - ${opt.phone}`}
          value={selectedCustomer}
          onChange={(_, v) => onCustomerChange(v)}
          inputValue={customerSearch}
          onInputChange={(_, v) => onCustomerSearch(v || "")}
          loading={loading}
          loadingText={<CircularProgress size={20} />}
          noOptionsText="Không tìm thấy"
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Tìm hoặc chọn khách..."
              variant="outlined"
              size="small"
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={18} className="text-gray-500" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <>
                    {loading && <CircularProgress color="inherit" size={20} />}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />

        {selectedCustomer && (
          <Card variant="outlined" className="mt-3">
            <CardContent className="p-3 space-y-1 text-sm">
              <Box className="flex items-center gap-2">
                <User size={14} className="text-blue-600" />
                {selectedCustomer.name}
              </Box>
              <Box className="flex items-center gap-2">
                <Phone size={14} className="text-green-600" />
                {selectedCustomer.phone}
              </Box>
              {selectedCustomer.email && (
                <Box className="flex items-center gap-2">
                  <Mail size={14} className="text-purple-600" />
                  {selectedCustomer.email}
                </Box>
              )}
              {selectedCustomer.address && (
                <Box className="flex items-center gap-2 text-gray-600">
                  <Package size={14} />
                  {selectedCustomer.address}
                </Box>
              )}
            </CardContent>
          </Card>
        )}
      </Box>

      <Divider className="mb-4" />

      {/* === KHUYẾN MÃI === */}
      <Box className="mb-4">
        <Typography
          variant="subtitle1"
          className="font-bold mb-2 flex items-center gap-2"
        >
          <Package className="w-5 h-5 text-green-600" />
          Khuyến mãi
        </Typography>

        <Autocomplete
          options={promotions}
          getOptionLabel={(opt) => `${opt.promotionCode} - ${opt.description}`}
          inputValue={promotionSearch}
          onInputChange={(_, v) => onPromotionSearch(v || "")}
          onChange={(_, v) => onPromotionChange(v)}
          value={selectedPromotion}
          loading={promotionLoading}
          noOptionsText="Không có khuyến mãi hợp lệ"
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Nhập mã khuyến mãi..."
              variant="outlined"
              size="small"
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={18} className="text-gray-500" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <>
                    {promotionLoading && (
                      <CircularProgress color="inherit" size={20} />
                    )}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />

        {selectedPromotion && (
          <Card variant="outlined" className="mt-2 p-2 text-xs">
            <Box className="flex justify-between items-center">
              <Box>
                <span className="font-medium">
                  {selectedPromotion.promotionCode}
                </span>
                <span className="text-gray-600 ml-1">
                  – {selectedPromotion.description}
                </span>
              </Box>
              <IconButton
                size="small"
                onClick={() => onPromotionChange(null)}
                className="text-red-600"
              >
                <Trash2 size={14} />
              </IconButton>
            </Box>
            {total < selectedPromotion.minOrderAmount ? (
              <Chip
                label={`Cần đơn tối thiểu ${formatPrice(
                  selectedPromotion.minOrderAmount
                )}`}
                size="small"
                color="error"
                className="mt-1 text-xs"
              />
            ) : (
              <Box className="mt-1 text-green-600 font-medium">
                Giảm: -{formatPrice(discount)}
              </Box>
            )}
          </Card>
        )}
      </Box>

      <Divider className="mb-4" />

      {/* === GIỎ HÀNG === */}
      <Box className="flex items-center justify-between mb-3">
        <Typography variant="h6" className="font-bold">
          Giỏ hàng
        </Typography>
        <Badge badgeContent={totalItems} color="primary">
          <ShoppingCart className="w-6 h-6 text-blue-600" />
        </Badge>
      </Box>

      {cartItems.length === 0 ? (
        <Typography className="text-center py-8 text-gray-500 italic">
          Chưa có sản phẩm nào
        </Typography>
      ) : (
        <>
          <List className="max-h-[320px] overflow-auto mb-3 -mx-2">
            {cartItems.map((item) => {
              const product = products.find((p) => p.id === item.id);
              const stock = product?.stock ?? 0;
              const available = stock + item.quantity;

              return (
                <ListItem key={item.id} divider className="px-2">
                  <ListItemAvatar>
                    <Avatar className="bg-gradient-to-br from-blue-100 to-blue-200">
                      <Package className="w-5 h-5 text-blue-600" />
                    </Avatar>
                  </ListItemAvatar>

                  <ListItemText
                    primary={
                      <Typography variant="body2" className="font-medium">
                        {item.name}
                      </Typography>
                    }
                    secondary={
                      <Box
                        component="span"
                        className="flex flex-col gap-1 mt-1"
                      >
                        <Typography
                          variant="caption"
                          component="span"
                          className="text-gray-600"
                        >
                          {formatPrice(item.price)} × {item.quantity}{" "}
                          {item.unit} ={" "}
                          <strong>
                            {formatPrice(item.price * item.quantity)}
                          </strong>
                        </Typography>

                        {available < 5 && available > 0 && (
                          <Chip
                            label={`Còn ${available}`}
                            size="small"
                            color="warning"
                            variant="outlined"
                            className="w-fit text-xs mt-1"
                          />
                        )}
                        {available === 0 && (
                          <Chip
                            label="Hết hàng"
                            size="small"
                            color="error"
                            variant="outlined"
                            className="w-fit text-xs mt-1"
                          />
                        )}
                      </Box>
                    }
                  />

                  <ListItemSecondaryAction className="flex items-center gap-1">
                    <IconButton
                      size="small"
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      disabled={item.quantity <= 1}
                      className="hover:bg-gray-100"
                    >
                      <Minus size={16} />
                    </IconButton>

                    <Chip
                      label={item.quantity}
                      size="small"
                      className="font-bold min-w-8"
                    />

                    <IconButton
                      size="small"
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      disabled={item.quantity >= available}
                      className="hover:bg-gray-100"
                    >
                      <Plus size={16} />
                    </IconButton>

                    <IconButton
                      size="small"
                      onClick={() => onRemoveItem(item.id)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
          </List>

          <Divider className="my-3" />

          <Box className="space-y-2 mb-2">
            <Box className="flex justify-between">
              <Typography variant="subtitle1">Tạm tính:</Typography>
              <Typography variant="subtitle1">{formatPrice(total)}</Typography>
            </Box>
            {discount > 0 && (
              <Box className="flex justify-between text-green-600">
                <Typography variant="subtitle1">Giảm giá:</Typography>
                <Typography variant="subtitle1">
                  - {formatPrice(discount)}
                </Typography>
              </Box>
            )}
          </Box>

          <Box className="flex justify-between items-center mb-4 border-t pt-2">
            <Typography variant="subtitle1" className="font-bold text-lg">
              Thành tiền:
            </Typography>
            <Typography variant="h6" className="font-bold text-red-600">
              {formatPrice(finalTotal)}
            </Typography>
          </Box>

          <Button
            variant="contained"
            fullWidth
            size="large"
            startIcon={<CreditCard className="w-5 h-5" />}
            onClick={onCheckout}
            disabled={cartItems.length === 0}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          >
            Thanh toán ({totalItems} sp) - {formatPrice(finalTotal)}
          </Button>
        </>
      )}
    </Paper>
  );
};
