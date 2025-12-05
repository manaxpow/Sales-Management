import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  TablePagination,
  Box,
  CircularProgress,
  Typography,
  Button,
} from "@mui/material";
import {
  Image as ImageIcon,
  Package,
  Tag,
  Settings2,
  DollarSign,
  Hash,
  ShoppingCart,
  Plus,
  X,
  AlertCircle as AlertIcon,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

import type { SimpleProduct } from "../../../pages/staff/sale";

interface ProductTableProps {
  products: SimpleProduct[];
  loading: boolean;
  error: string | null;
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
  onAddToCart: (product: SimpleProduct) => void;
  onRetry: () => void;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("vi-VN").format(price) + "₫";

const getStockChip = (stock: number) => {
  if (stock === 0)
    return (
      <Chip label="Hết" size="small" color="error" icon={<X size={14} />} />
    );
  if (stock <= 3)
    return (
      <Chip
        label={`Còn ${stock}`}
        size="small"
        color="warning"
        icon={<AlertIcon size={14} />}
      />
    );
  return (
    <Chip
      label={stock}
      size="small"
      color="success"
      icon={<CheckCircle size={14} />}
    />
  );
};

export const ProductTable = ({
  products,
  loading,
  error,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onAddToCart,
  onRetry,
}: ProductTableProps) => {
  if (loading) {
    return (
      <Box className="p-12 text-center">
        <CircularProgress />
        <Typography className="mt-3">Đang tải sản phẩm...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="p-12 text-center text-red-600">
        <AlertCircle className="w-12 h-12 mx-auto mb-3" />
        <Typography>{error}</Typography>
        <Button variant="outlined" onClick={onRetry} className="mt-3">
          Thử lại
        </Button>
      </Box>
    );
  }

  const paginated = products.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Paper className="overflow-hidden shadow-sm rounded-lg">
      <TableContainer className="max-h-[600px]">
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell className="bg-gray-50 font-bold p-3 w-16">
                <ImageIcon size={16} className="mx-auto text-blue-600" />
              </TableCell>
              <TableCell className="bg-gray-50 font-bold p-3">
                <Package size={16} className="inline mr-1 text-blue-600" /> Tên
              </TableCell>
              <TableCell className="bg-gray-50 font-bold p-3">
                <Tag size={16} className="inline mr-1 text-purple-600" /> Mã
              </TableCell>
              <TableCell className="bg-gray-50 font-bold p-3">
                <Settings2 size={16} className="inline mr-1 text-green-600" />{" "}
                Danh mục
              </TableCell>
              <TableCell className="bg-gray-50 font-bold p-3">
                <DollarSign size={16} className="inline mr-1 text-red-600" />{" "}
                Giá
              </TableCell>
              <TableCell className="bg-gray-50 font-bold p-3">
                <Hash size={16} className="inline mr-1 text-teal-600" /> Tồn
              </TableCell>
              <TableCell className="bg-gray-50 font-bold p-3">
                <Hash size={16} className="inline mr-1 text-teal-600" /> Đơn vị
              </TableCell>
              <TableCell className="bg-gray-50 font-bold p-3 text-center w-24">
                <ShoppingCart
                  size={16}
                  className="inline mr-1 text-indigo-600"
                />{" "}
                Thao tác
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-12 text-gray-500"
                >
                  Không có sản phẩm phù hợp
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((product) => (
                <TableRow key={product.id} className="hover:bg-gray-50">
                  <TableCell className="p-3">
                    <Avatar
                      src={product.image}
                      alt={product.name}
                      variant="square"
                      className="!w-12 !h-12 object-cover"
                    >
                      <ImageIcon className="w-6 h-6 text-gray-400" />
                    </Avatar>
                  </TableCell>
                  <TableCell className="p-3 font-medium max-w-[200px] truncate">
                    {product.name}
                  </TableCell>
                  <TableCell className="p-3">
                    <Chip
                      label={product.code}
                      size="small"
                      className="!bg-blue-50 !text-blue-600 !text-xs"
                    />
                  </TableCell>
                  <TableCell className="p-3">
                    <Chip
                      label={product.category}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell className="p-3 text-right font-semibold">
                    {formatPrice(product.price)}
                  </TableCell>
                  <TableCell className="p-3 text-center">
                    {getStockChip(product.stock)}
                  </TableCell>
                  <TableCell className="p-3 text-center">
                    {product.unit}
                  </TableCell>
                  <TableCell className="p-3">
                    <Tooltip
                      title={product.stock === 0 ? "Hết hàng" : "Thêm vào giỏ"}
                    >
                      <span>
                        <IconButton
                          onClick={() => onAddToCart(product)}
                          disabled={product.stock === 0}
                          size="small"
                          className={
                            product.stock === 0
                              ? "!text-gray-400"
                              : "!text-green-600 hover:bg-green-50"
                          }
                        >
                          <Plus size={16} />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {products.length > 0 && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={products.length}
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
