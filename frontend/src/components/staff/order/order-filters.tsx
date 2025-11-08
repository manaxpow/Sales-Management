import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import { Search, X } from "lucide-react";
import type { OrderFilters } from "../../../pages/staff/order";

const OrderFilter = ({
  filters,
  onChange,
  onClear,
}: {
  filters: OrderFilters;
  onChange: (f: OrderFilters) => void;
  onClear: () => void;
}) => {
  return (
    <Paper className="p-4 mb-4 bg-white shadow-sm rounded-lg">
      <Box className="flex flex-col md:flex-row gap-4 items-end">
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Tìm đơn hàng, khách, mã HD..."
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={20} className="text-gray-500" />
              </InputAdornment>
            ),
          }}
        />

        <FormControl variant="outlined" size="small" className="w-[180px]">
          <InputLabel>Trạng thái</InputLabel>
          <Select
            value={filters.status}
            onChange={(e) =>
              onChange({ ...filters, status: e.target.value as never })
            }
            label="Trạng thái arty"
          >
            <MenuItem value="all">Tất cả</MenuItem>
            <MenuItem value="pending">Chờ xử lý</MenuItem>
            <MenuItem value="completed">Hoàn thành</MenuItem>
            <MenuItem value="canceled">Đã hủy</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Từ ngày"
          type="date"
          size="small"
          InputLabelProps={{ shrink: true }}
          value={filters.dateRange.startDate || ""}
          onChange={(e) =>
            onChange({
              ...filters,
              dateRange: { ...filters.dateRange, startDate: e.target.value },
            })
          }
          className="w-[160px]"
        />

        <TextField
          label="Đến ngày"
          type="date"
          size="small"
          InputLabelProps={{ shrink: true }}
          value={filters.dateRange.endDate || ""}
          onChange={(e) =>
            onChange({
              ...filters,
              dateRange: { ...filters.dateRange, endDate: e.target.value },
            })
          }
          className="w-[160px]"
        />

        <Button
          variant="outlined"
          startIcon={<X size={16} />}
          onClick={onClear}
          disabled={
            !filters.search &&
            filters.status === "all" &&
            !filters.dateRange.startDate &&
            !filters.dateRange.endDate
          }
        >
          Xóa lọc
        </Button>
      </Box>
    </Paper>
  );
};

export default OrderFilter;
