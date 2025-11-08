import {
  Avatar,
  Box,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
} from "@mui/material";
import {
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Edit,
  Filter,
  Hash,
  Phone,
  Trash2,
  User,
  XCircle,
  Package,
} from "lucide-react";
import type { Order } from "../../../pages/staff/order";

interface OrderTableProps {
  orders: Order[];
  loading: boolean;
  page: number;
  rowsPerPage: number;
  onPageChange: (p: number) => void;
  onRowsPerPageChange: (r: number) => void;
  onEdit: (order: Order) => void;
  onDelete: (id: string) => void;
  onViewDetail?: (order: Order) => void;
}

const OrderTable = ({
  orders,
  loading,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onEdit,
  onDelete,
  onViewDetail,
}: OrderTableProps) => {
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN").format(price) + "₫";

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusChip = (status: Order["status"]) => {
    switch (status) {
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
        return null;
    }
  };

  const paginated = orders.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Paper className="overflow-hidden shadow-sm rounded-lg">
      <TableContainer className="max-h-[700px]">
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell className="bg-gray-50 font-bold p-3">
                <Hash size={16} className="inline mr-1 text-blue-600" /> Mã HD
              </TableCell>
              <TableCell className="bg-gray-50 font-bold p-3">
                <User size={16} className="inline mr-1 text-purple-600" /> Khách
              </TableCell>
              <TableCell className="bg-gray-50 font-bold p-3">
                <Phone size={16} className="inline mr-1 text-green-600" /> SĐT
              </TableCell>
              <TableCell className="bg-gray-50 font-bold p-3">
                <Calendar size={16} className="inline mr-1 text-teal-600" />{" "}
                Ngày tạo
              </TableCell>
              <TableCell className="bg-gray-50 font-bold p-3 text-right">
                <DollarSign size={16} className="inline mr-1 text-red-600" />{" "}
                Thành tiền
              </TableCell>
              <TableCell className="bg-gray-50 font-bold p-3 text-center">
                <Filter size={16} className="inline mr-1 text-indigo-600" />{" "}
                Trạng thái
              </TableCell>
              <TableCell className="bg-gray-50 font-bold p-3 text-center w-32">
                Thao tác
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12">
                  <CircularProgress size={40} />
                </TableCell>
              </TableRow>
            ) : paginated.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-12 text-gray-500"
                >
                  Không có đơn hàng nào
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((order) => (
                <TableRow
                  key={order.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <TableCell className="p-3 font-medium">
                    <Chip
                      label={order.id}
                      size="small"
                      className="bg-blue-50 text-blue-700 text-xs font-medium"
                    />
                  </TableCell>

                  <TableCell className="p-3">
                    <Box className="flex items-center gap-2">
                      <Avatar className="w-8 h-8 text-xs">
                        {order.customerName?.[0]?.toUpperCase() || "K"}
                      </Avatar>
                      <span className="font-medium truncate max-w-[120px]">
                        {order.customerName || "Khách lẻ"}
                      </span>
                    </Box>
                  </TableCell>

                  <TableCell className="p-3">
                    <a
                      href={`tel:${order.phoneNumber}`}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      {order.phoneNumber}
                    </a>
                  </TableCell>

                  <TableCell className="p-3 text-sm text-gray-600">
                    {formatDate(order.createdDate)}
                  </TableCell>

                  <TableCell className="p-3 text-right font-semibold text-red-600">
                    {formatPrice(order.totalPaymentAmount)}
                  </TableCell>

                  <TableCell className="p-3 text-center">
                    {getStatusChip(order.status)}
                  </TableCell>

                  {/* === CỘT THAO TÁC === */}
                  <TableCell className="p-3 text-center">
                    <Box className="flex justify-center gap-1">
                      {/* XEM CHI TIẾT */}
                      <Tooltip title="Xem chi tiết">
                        <IconButton
                          size="small"
                          color="info"
                          onClick={() => onViewDetail?.(order)}
                          className="hover:bg-blue-50"
                        >
                          <Package size={16} />
                        </IconButton>
                      </Tooltip>

                      {/* CẬP NHẬT */}
                      <Tooltip title="Cập nhật trạng thái">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => onEdit(order)}
                          className="hover:bg-indigo-50"
                        >
                          <Edit size={16} />
                        </IconButton>
                      </Tooltip>

                      {/* XÓA */}
                      <Tooltip title="Xóa đơn hàng">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => onDelete(order.id)}
                          className="hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* === PHÂN TRANG === */}
      {!loading && orders.length > 0 && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={orders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, p) => onPageChange(p)}
          onRowsPerPageChange={(e) => {
            onRowsPerPageChange(parseInt(e.target.value, 10));
          }}
          labelRowsPerPage="Hiển thị:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} của ${count}`
          }
        />
      )}
    </Paper>
  );
};

export default OrderTable;
