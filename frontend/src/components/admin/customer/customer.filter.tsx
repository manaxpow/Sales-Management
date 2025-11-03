import React from "react";
import { Search, Filter, X } from "lucide-react";
import { Box, Button, TextField, InputAdornment } from "@mui/material";

export interface CustomerFilters {
  search: string;
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
    onFiltersChange({ search: e.target.value });
  };

  const hasActiveFilters = !!filters.search?.trim();

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

      <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
      </Box>
    </Box>
  );
};

export default CustomerFilter;
