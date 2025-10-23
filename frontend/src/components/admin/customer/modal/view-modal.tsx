import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Avatar,
  Chip,
  IconButton,
  Divider,
} from "@mui/material";
import { X, Eye } from "lucide-react";
import type { SimpleCustomer } from "../customer.pagination";

interface ViewCustomerModalProps {
  customer: SimpleCustomer | null;
  open: boolean;
  onClose: () => void;
}

export const ViewCustomerModal = ({
  customer,
  open,
  onClose,
}: ViewCustomerModalProps) => {
  if (!customer) return null;

  // Lấy initial từ tên
  const initials = customer.name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("");

  // Định dạng createdAt nếu có
  const createdAtLabel = customer.createdAt
    ? new Date(customer.createdAt).toLocaleString()
    : undefined;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle className="flex items-center justify-between">
        <Typography
          variant="h6"
          component="div"
          className="flex items-center gap-2"
        >
          <Eye className="w-5 h-5" />
          Thông tin khách hàng
        </Typography>
        <IconButton onClick={onClose} size="small" aria-label="Đóng">
          <X className="w-4 h-4" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box className="space-y-4">
          {/* Header */}
          <Box className="flex items-center gap-4">
            <Avatar
              className="w-16 h-16"
              sx={{
                width: 64,
                height: 64,
                backgroundColor: "#dbeafe",
                color: "#1e40af",
                fontSize: "1rem",
                fontWeight: 500,
              }}
            >
              {initials}
            </Avatar>
            <Box>
              <Typography variant="h6" className="font-semibold">
                {customer.name}
              </Typography>
              {(customer.email || customer.phone) && (
                <Typography variant="body2" color="text.secondary">
                  {customer.email ?? customer.phone}
                </Typography>
              )}
            </Box>
          </Box>

          <Divider />

          {/* Details */}
          <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                className="mb-1"
              >
                Customer ID
              </Typography>
              <Typography variant="body2">{customer.id}</Typography>
            </Box>

            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                className="mb-1"
              >
                Trạng thái
              </Typography>
              <Chip
                label={customer.status ?? "active"}
                color={
                  (customer.status ?? "active") === "active"
                    ? "success"
                    : "error"
                }
                size="small"
              />
            </Box>

            {customer.email && (
              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  className="mb-1"
                >
                  Email
                </Typography>
                <Typography variant="body2">{customer.email}</Typography>
              </Box>
            )}

            {customer.phone && (
              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  className="mb-1"
                >
                  Số điện thoại
                </Typography>
                <Typography variant="body2">{customer.phone}</Typography>
              </Box>
            )}

            {customer.address && (
              <Box className="md:col-span-2">
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  className="mb-1"
                >
                  Địa chỉ
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                  {customer.address}
                </Typography>
              </Box>
            )}

            {createdAtLabel && (
              <Box className="md:col-span-2">
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  className="mb-1"
                >
                  Ngày tạo
                </Typography>
                <Typography variant="body2">{createdAtLabel}</Typography>
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
};
