import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { ShoppingBag, RefreshCw, Plus } from "lucide-react";

interface SaleHeaderProps {
  loading: boolean;
  productCount: number;
  error: string | null;
  onRefresh: () => void;
  onNewOrder: () => void;
}

export const SaleHeader = ({
  loading,
  productCount,
  error,
  onRefresh,
  onNewOrder,
}: SaleHeaderProps) => {
  return (
    <Box className="mb-6">
      <Box className="flex items-center justify-between">
        <Box className="flex items-center gap-3">
          <ShoppingBag className="w-8 h-8 text-blue-600" />
          <Box>
            <Typography
              variant="h4"
              className="text-2xl font-bold text-gray-900"
            >
              Bán hàng
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {loading
                ? "Đang tải..."
                : error
                ? "Lỗi tải dữ liệu"
                : `${productCount} sản phẩm khả dụng`}
            </Typography>
          </Box>
        </Box>
        <Box className="flex gap-2">
          <Button
            variant="outlined"
            size="small"
            startIcon={
              loading ? (
                <CircularProgress size={16} />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )
            }
            onClick={onRefresh}
            disabled={loading}
          >
            Tải lại
          </Button>
          <Button
            variant="contained"
            startIcon={<Plus className="w-4 h-4" />}
            onClick={onNewOrder}
            className="bg-green-600 hover:bg-green-700"
          >
            Đơn hàng mới
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
