import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  Divider,
} from "@mui/material";
import { AlertTriangle, Trash2, X as XIcon } from "lucide-react";
import type { Order } from "../../../pages/staff/order";

interface Props {
  open: boolean;
  order: Order | null;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmDialog = ({ open, order, onClose, onConfirm }: Props) => {
  if (!order) return null;

  const formatPrice = (p: number) =>
    new Intl.NumberFormat("vi-VN").format(p) + "₫";
  const finalAmount = order.totalPaymentAmount - order.discountAmount;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle className="bg-gradient-to-r from-red-50 to-pink-50 border-b">
        <Box className="flex items-center gap-2 text-red-700">
          <AlertTriangle className="w-6 h-6" />
          <Typography variant="h6" className="font-bold">
            Xác nhận xóa đơn hàng
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent className="p-6">
        <Typography variant="body1" className="mb-4">
          Bạn có <strong>chắc chắn</strong> muốn xóa đơn hàng này?
        </Typography>

        <Box className="bg-red-50 p-4 rounded-lg space-y-3 border border-red-200">
          <Box className="flex justify-between">
            <span className="text-gray-600">Mã HD:</span>
            <strong className="text-red-700">{order.id}</strong>
          </Box>
          <Box className="flex justify-between">
            <span className="text-gray-600">Khách:</span>
            <strong>{order.customerName}</strong>
          </Box>
          <Box className="flex justify-between">
            <span className="text-gray-600">Tổng tiền:</span>
            <strong>{formatPrice(order.totalPaymentAmount)}</strong>
          </Box>
          {order.discountAmount > 0 && (
            <Box className="flex justify-between">
              <span className="text-green-600 font-medium">Giảm giá:</span>
              <strong className="text-green-600 font-medium">
                -{formatPrice(order.discountAmount)}
              </strong>
            </Box>
          )}
          <Divider className="my-2" />
          <Box className="flex justify-between">
            <span className="font-bold text-blue-700">Tiền phải trả:</span>
            <strong className="text-red-600 font-bold">
              {formatPrice(finalAmount)}
            </strong>
          </Box>
        </Box>

        <Typography variant="body2" className="mt-4 text-red-600 font-medium">
          Hành động này <strong>không thể hoàn tác</strong>.
        </Typography>
      </DialogContent>

      <DialogActions className="p-4 bg-gray-50 border-t">
        <Button onClick={onClose} startIcon={<XIcon className="w-4 h-4" />}>
          Hủy
        </Button>
        <Button
          variant="contained"
          color="error"
          startIcon={<Trash2 className="w-4 h-4" />}
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className="bg-gradient-to-r from-red-600 to-pink-600"
        >
          Xóa vĩnh viễn
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmDialog;
