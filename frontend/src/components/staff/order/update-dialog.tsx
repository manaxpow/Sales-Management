import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Divider,
} from "@mui/material";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Check,
  X as XIcon,
} from "lucide-react";
import type { Order } from "../../../pages/staff/order";

interface Props {
  open: boolean;
  order: Order | null;
  onClose: () => void;
  onConfirm: (status: Order["status"]) => void;
}

const UpdateStatusDialog = ({ open, order, onClose, onConfirm }: Props) => {
  const [newStatus, setNewStatus] = useState<Order["status"]>("pending");

  useEffect(() => {
    if (order) setNewStatus(order.status);
  }, [order]);

  if (!order) return null;

  const formatPrice = (p: number) =>
    new Intl.NumberFormat("vi-VN").format(p) + "₫";
  const finalAmount = order.totalPaymentAmount - order.discountAmount;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
        <Box className="flex items-center gap-2">
          <Package className="w-6 h-6 text-blue-600" />
          <Typography variant="h6" className="font-bold">
            Cập nhật trạng thái đơn hàng
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent className="p-6">
        <Box className="space-y-4">
          <Box className="bg-gray-50 p-4 rounded-lg space-y-3">
            <Box className="flex justify-between">
              <Typography variant="subtitle2" className="text-gray-600">
                Mã hóa đơn:
              </Typography>
              <Chip
                label={order.id}
                size="small"
                className="bg-blue-100 text-blue-700 font-medium"
              />
            </Box>
            <Box className="flex justify-between">
              <Typography variant="subtitle2" className="text-gray-600">
                Khách hàng:
              </Typography>
              <Typography variant="body2" className="font-medium">
                {order.customerName}
              </Typography>
            </Box>
            <Box className="flex justify-between">
              <Typography variant="subtitle2" className="text-gray-600">
                Số điện thoại:
              </Typography>
              <a
                href={`tel:${order.phoneNumber}`}
                className="text-blue-600 font-medium"
              >
                {order.phoneNumber}
              </a>
            </Box>

            <Box className="flex justify-between">
              <Typography variant="subtitle2" className="text-gray-600">
                Tổng tiền hàng:
              </Typography>
              <Typography variant="body2" className="font-medium">
                {formatPrice(order.totalPaymentAmount)}
              </Typography>
            </Box>

            {order.discountAmount > 0 && (
              <Box className="flex justify-between">
                <Typography
                  variant="subtitle2"
                  className="text-green-600 font-medium"
                >
                  Giảm giá:
                </Typography>
                <Typography
                  variant="body2"
                  className="text-green-600 font-medium"
                >
                  -{formatPrice(order.discountAmount)}
                </Typography>
              </Box>
            )}

            <Divider className="my-2" />

            <Box className="flex justify-between">
              <Typography
                variant="subtitle1"
                className="font-bold text-blue-700"
              >
                Tiền phải trả:
              </Typography>
              <Typography variant="h6" className="font-bold text-red-600">
                {formatPrice(finalAmount)}
              </Typography>
            </Box>
          </Box>

          <Divider />

          <FormControl fullWidth>
            <InputLabel>Trạng thái mới</InputLabel>
            <Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as never)}
              label="Trạng thái mới"
              variant="outlined"
            >
              <MenuItem value="pending">
                <Box className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-yellow-600" />
                  <span>Chờ xử lý</span>
                </Box>
              </MenuItem>
              <MenuItem value="completed">
                <Box className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Hoàn thành</span>
                </Box>
              </MenuItem>
              <MenuItem value="canceled">
                <Box className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-600" />
                  <span>Đã hủy</span>
                </Box>
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>

      <DialogActions className="p-4 bg-gray-50 border-t">
        <Button onClick={onClose} startIcon={<XIcon className="w-4 h-4" />}>
          Hủy bỏ
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Check className="w-4 h-4" />}
          onClick={() => {
            onConfirm(newStatus);
            onClose();
          }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600"
        >
          Cập nhật
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateStatusDialog;
