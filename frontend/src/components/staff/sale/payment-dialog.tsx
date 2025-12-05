import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Divider,
  CircularProgress,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import {
  CreditCard,
  Package,
  DollarSign,
  CreditCard as CardIcon,
} from "lucide-react";
import { useState } from "react";

interface PaymentDialogProps {
  open: boolean;
  total: number;
  discount?: number;
  finalTotal: number;
  itemCount: number;
  customerName?: string;
  promotionCode?: string;
  onClose: () => void;
  onConfirm: (paymentMethod: 1 | 2) => void; // ← TRUYỀN paymentMethod
  loading?: boolean;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("vi-VN").format(price) + "₫";

export const PaymentDialog = ({
  open,
  total,
  discount = 0,
  finalTotal,
  itemCount,
  customerName,
  promotionCode,
  onClose,
  onConfirm,
  loading = false,
}: PaymentDialogProps) => {
  const [paymentMethod, setPaymentMethod] = useState<"1" | "2">("1"); // 1: Tiền mặt, 2: Chuyển khoản

  const handleConfirm = () => {
    onConfirm(paymentMethod === "1" ? 1 : 2);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle className="text-xl font-bold text-center">
        Xác nhận thanh toán
      </DialogTitle>

      <DialogContent dividers>
        <Box className="space-y-4">
          {/* Thông tin khách & sản phẩm */}
          {customerName && (
            <Box className="flex items-center gap-2 text-sm">
              <Package className="w-4 h-4 text-blue-600" />
              <span>Khách:</span> <strong>{customerName}</strong>
            </Box>
          )}

          <Box className="flex items-center gap-2 text-sm">
            <Package className="w-4 h-4 text-green-600" />
            <span>Sản phẩm:</span> <strong>{itemCount} món</strong>
          </Box>

          {promotionCode && (
            <Box className="flex items-center gap-2 text-sm">
              <Package className="w-4 h-4 text-purple-600" />
              <span>Mã KM:</span>{" "}
              <strong className="text-purple-600">{promotionCode}</strong>
            </Box>
          )}

          <Divider />

          {/* Tổng tiền */}
          <Box className="space-y-2">
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

          <Divider />

          <Box className="flex justify-between items-center pt-2">
            <Typography variant="h6" className="font-bold">
              Thành tiền:
            </Typography>
            <Typography variant="h5" className="font-bold text-red-600">
              {formatPrice(finalTotal)}
            </Typography>
          </Box>

          <Divider />

          {/* HÌNH THỨC THANH TOÁN */}
          <Box>
            <Typography variant="subtitle1" className="mb-2 font-medium">
              Hình thức thanh toán
            </Typography>
            <RadioGroup
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as "1" | "2")}
              className="space-y-1"
            >
              <FormControlLabel
                value="1"
                control={<Radio size="small" />}
                label={
                  <Box className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span>Tiền mặt</span>
                  </Box>
                }
                disabled={loading}
              />
              <FormControlLabel
                value="2"
                control={<Radio size="small" />}
                label={
                  <Box className="flex items-center gap-2">
                    <CardIcon className="w-4 h-4 text-blue-600" />
                    <span>Chuyển khoản</span>
                  </Box>
                }
                disabled={loading}
              />
            </RadioGroup>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions className="gap-2 p-4">
        <Button
          onClick={onClose}
          size="large"
          disabled={loading}
          color="inherit"
        >
          Hủy
        </Button>

        <Button
          variant="contained"
          size="large"
          color="success"
          onClick={handleConfirm}
          disabled={loading}
          startIcon={
            loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <CreditCard />
            )
          }
          sx={{
            minWidth: 140,
            "& .MuiButton-startIcon": {
              marginRight: loading ? 1 : 0.5,
            },
          }}
        >
          {loading ? "Đang xử lý..." : "Thanh toán"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
