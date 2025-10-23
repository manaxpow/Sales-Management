import React from "react";
import { Search, Filter, X } from "lucide-react";
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";

export interface CustomerFilters {
  search: string;
  status: "all" | "active" | "inactive";
}

interface CustomerFilterProps {
  filters: CustomerFilters;
  onFiltersChange: (filters: CustomerFilters) => void;
  onClearFilters: () => void;
}

const CustomerFilter = ({
  filters,
  onFiltersChange,
  onClearFilters,
}: CustomerFilterProps) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, search: e.target.value });
  };

  // Không dùng generic, giữ SelectChangeEvent mặc định (string)
  const handleStatusChange = (e: SelectChangeEvent) => {
    onFiltersChange({
      ...filters,
      status: e.target.value as "all" | "active" | "inactive",
    });
  };

  const hasActiveFilters = Boolean(filters.search) || filters.status !== "all";

  return (
    <Box className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <Box className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-800">
          Bộ lọc khách hàng
        </h3>
        {hasActiveFilters && (
          <Button
            onClick={onClearFilters}
            startIcon={<X className="w-4 h-4" />}
            className="ml-auto normal-case text-gray-600 hover:text-gray-800 hover:bg-gray-100"
            size="small"
          >
            Xóa tất cả
          </Button>
        )}
      </Box>

      <Box className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Ô tìm kiếm */}
        <TextField
          label="Tìm kiếm khách hàng"
          variant="outlined"
          size="small"
          value={filters.search}
          onChange={handleSearchChange}
          placeholder="Tìm theo tên, email, SĐT hoặc địa chỉ..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search className="w-4 h-4 text-gray-400" />
              </InputAdornment>
            ),
          }}
        />

        {/* Trạng thái */}
        <FormControl variant="outlined" size="small">
          <InputLabel id="status-label">Trạng thái</InputLabel>
          <Select
            labelId="status-label"
            id="status"
            value={filters.status}
            onChange={handleStatusChange}
            label="Trạng thái"
            inputProps={{ "aria-label": "Lọc theo trạng thái" }}
            sx={{
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#d1d5db" },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#9ca3af",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#3b82f6",
                borderWidth: 2,
              },
            }}
          >
            <MenuItem value="all">Tất cả</MenuItem>
            <MenuItem value="active">Đang hoạt động</MenuItem>
            <MenuItem value="inactive">Ngừng hoạt động</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};

export default CustomerFilter;
