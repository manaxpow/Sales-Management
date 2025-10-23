import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import { Trash2, X } from "lucide-react";
import type { SimpleCustomer } from "../customer.pagination";

interface DeleteCustomerModalProps {
  customer: SimpleCustomer | null;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteCustomerModal = ({
  customer,
  open,
  onClose,
  onConfirm,
}: DeleteCustomerModalProps) => {
  if (!customer) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle className="flex items-center justify-between">
        <Box className="flex items-center gap-2">
          <Trash2 className="w-5 h-5 text-red-500" />
          <Typography variant="h6">Xóa khách hàng</Typography>
        </Box>
        <IconButton onClick={onClose} size="small" aria-label="Đóng">
          <X className="w-4 h-4" />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Alert severity="warning" className="mb-4">
          Hành động này không thể hoàn tác. Toàn bộ dữ liệu liên quan đến khách
          hàng sẽ bị xóa vĩnh viễn.
        </Alert>

        <Typography>
          Bạn có chắc muốn xóa khách hàng <strong>{customer.name}</strong>
          {customer.email ? (
            <> ({customer.email})</>
          ) : customer.phone ? (
            <> ({customer.phone})</>
          ) : null}
          ?
        </Typography>

        <Box className="mt-3 p-3 bg-gray-50 rounded-md">
          <Typography variant="caption" color="text.secondary">
            Customer ID: {customer.id}
          </Typography>
          <br />
          <Typography variant="caption" color="text.secondary">
            Trạng thái: {customer.status ?? "active"}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          startIcon={<Trash2 className="w-4 h-4" />}
        >
          Xóa khách hàng
        </Button>
      </DialogActions>
    </Dialog>
  );
};
