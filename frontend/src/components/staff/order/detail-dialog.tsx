import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Grid,
  Divider,
  CircularProgress,
} from "@mui/material";
import { Package, CheckCircle, Clock, XCircle, X as XIcon } from "lucide-react";
import type { OrderDetailResponse } from "../../../pages/staff/order";

interface Props {
  open: boolean;
  onClose: () => void;
  detail: OrderDetailResponse | null;
  loading: boolean;
}

const OrderDetailDialog = ({ open, onClose, detail, loading }: Props) => {
  const formatPrice = (p: number) =>
    new Intl.NumberFormat("vi-VN").format(p) + "₫";

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const statusMap = {
    0: "pending",
    1: "completed",
    2: "canceled",
  } as const;

  type StatusKey = keyof typeof statusMap;

  const getStatusChip = (status: number) => {
    const key = String(status) as unknown as StatusKey;
    const s = statusMap[key];

    switch (s) {
      case "completed":
        return (
          <Chip
            label="Hoàn thành"
            size="small"
            color="success"
            icon={<CheckCircle size={14} />}
          />
        );
      case "pending":
        return (
          <Chip
            label="Chờ xử lý"
            size="small"
            color="warning"
            icon={<Clock size={14} />}
          />
        );
      case "canceled":
        return (
          <Chip
            label="Đã hủy"
            size="small"
            color="error"
            icon={<XCircle size={14} />}
          />
        );
      default:
        return <Chip label="Không xác định" size="small" color="default" />;
    }
  };

  if (!detail) return null;

  const finalAmount = detail.order.totalAmount - detail.order.discountAmount;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
        <Box className="flex items-center gap-2">
          <Package className="w-6 h-6 text-blue-600" />
          <Typography variant="h6" className="font-bold">
            Chi tiết đơn hàng #{detail.order.id}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent className="p-6">
        {loading ? (
          <Box className="flex justify-center py-12">
            <CircularProgress />
          </Box>
        ) : (
          <Box className="space-y-6">
            {/* Thông tin chung */}
            <Paper className="p-4 bg-gray-50 rounded-lg">
              <Typography variant="subtitle1" className="font-bold mb-3">
                Thông tin đơn hàng
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="body2" className="text-gray-600">
                    Khách hàng:
                  </Typography>
                  <Typography className="font-medium">
                    {detail.order.customerName}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="body2" className="text-gray-600">
                    SĐT:
                  </Typography>
                  <a
                    href={`tel:${detail.order.phoneNumber}`}
                    className="text-blue-600"
                  >
                    {detail.order.phoneNumber}
                  </a>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="body2" className="text-gray-600">
                    Ngày đặt:
                  </Typography>
                  <Typography>{formatDate(detail.order.orderDate)}</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="body2" className="text-gray-600">
                    Trạng thái:
                  </Typography>
                  {getStatusChip(detail.order.status)}
                </Grid>
              </Grid>
            </Paper>

            {/* Danh sách sản phẩm */}
            <Paper className="p-4">
              <Typography variant="subtitle1" className="font-bold mb-3">
                Sản phẩm ({detail.items.length})
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <strong>Sản phẩm</strong>
                      </TableCell>
                      <TableCell align="center">
                        <strong>SL</strong>
                      </TableCell>
                      <TableCell align="right">
                        <strong>Giá</strong>
                      </TableCell>
                      <TableCell align="right">
                        <strong>Thành tiền</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {detail.items.map((item) => (
                      <TableRow key={item.orderItemId}>
                        <TableCell>
                          <Box className="flex items-center gap-2">
                            <Chip
                              label={item.productName}
                              size="small"
                              className="bg-blue-50 text-blue-700"
                            />
                          </Box>
                        </TableCell>
                        <TableCell align="center">{item.quantity}</TableCell>
                        <TableCell align="right">
                          {formatPrice(item.price)}
                        </TableCell>
                        <TableCell align="right" className="font-medium">
                          {formatPrice(item.subTotal)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>

            {/* Tổng tiền */}
            <Paper className="p-4 bg-blue-50 rounded-lg space-y-2">
              <Box className="flex justify-between items-center">
                <Typography variant="subtitle1" className="font-medium">
                  Tổng tiền hàng:
                </Typography>
                <Typography variant="subtitle1" className="text-gray-700">
                  {formatPrice(detail.order.totalAmount)}
                </Typography>
              </Box>

              {detail.order.discountAmount > 0 && (
                <Box className="flex justify-between items-center">
                  <Typography
                    variant="subtitle1"
                    className="text-green-600 font-medium"
                  >
                    Giảm giá:
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    className="text-green-600 font-medium"
                  >
                    -{formatPrice(detail.order.discountAmount)}
                  </Typography>
                </Box>
              )}

              <Divider className="my-2" />

              <Box className="flex justify-between items-center">
                <Typography variant="h6" className="font-bold text-blue-700">
                  Tiền phải trả:
                </Typography>
                <Typography variant="h5" className="font-bold text-red-600">
                  {formatPrice(finalAmount)}
                </Typography>
              </Box>
            </Paper>
          </Box>
        )}
      </DialogContent>

      <DialogActions className="p-4 bg-gray-50 border-t">
        <Button onClick={onClose} startIcon={<XIcon />}>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderDetailDialog;
