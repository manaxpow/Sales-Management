import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Divider,
} from "@mui/material";
import { CreditCard, Package } from "lucide-react";

interface PaymentDialogProps {
  open: boolean;
  total: number;
  discount?: number;
  finalTotal: number;
  itemCount: number;
  customerName?: string;
  promotionCode?: string;
  onClose: () => void;
  onConfirm: () => void;
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
}: PaymentDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle className="text-xl font-bold text-center">
        Xác nhận thanh toán
      </DialogTitle>
      <DialogContent dividers>
        <Box className="space-y-4">
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
        </Box>
      </DialogContent>
      <DialogActions className="gap-2 p-4">
        <Button onClick={onClose} size="large">
          Hủy
        </Button>
        <Button
          variant="contained"
          size="large"
          startIcon={<CreditCard />}
          onClick={onConfirm}
        >
          Thanh toán
        </Button>
      </DialogActions>
    </Dialog>
  );
};
