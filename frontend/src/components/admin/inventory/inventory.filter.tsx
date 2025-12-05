import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { TextField, Select, MenuItem, FormControl, InputLabel, Button, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

// Filters interface
interface InventoryFilters {
  search: string;
  status: 'ALL' | 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
}

const StyledFormControl = styled(FormControl)(() => ({
  minWidth: 120,
  width: '100%',
}));

const StyledSelect = styled(Select)(() => ({
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#d1d5db', // gray-300
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#9ca3af', // gray-400
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#3b82f6', // blue-500
    borderWidth: '2px',
  },
}));

interface InventoryFilterProps {
  filters: InventoryFilters;
  onFiltersChange: (filters: InventoryFilters) => void;
  onClearFilters: () => void;
}

const InventoryFilter = ({
  filters,
  onFiltersChange,
  onClearFilters,
}: InventoryFilterProps) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      search: e.target.value,
    });
  };

  const handleStatusChange = (e: React.ChangeEvent<{ value: unknown }> | { target: { value: unknown } }) => {
    onFiltersChange({
      ...filters,
      status: e.target.value as 'ALL' | 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK',
    });
  };

  const hasActiveFilters = filters.search || filters.status !== 'ALL';

  return (
    <Box className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <Box className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
        {hasActiveFilters && (
          <Button
            onClick={onClearFilters}
            startIcon={<X className="w-4 h-4" />}
            className="ml-auto normal-case text-gray-600 hover:text-gray-800 hover:bg-gray-100"
            size="small"
          >
            Clear All
          </Button>
        )}
      </Box>

      <Box className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search Input */}
        <TextField
          label="Search Products"
          variant="outlined"
          size="small"
          value={filters.search}
          onChange={handleSearchChange}
          placeholder="Search by product name or barcode..."
          InputProps={{
            startAdornment: (
              <Search className="w-4 h-4 text-gray-400 mr-2" />
            ),
          }}
        />

        {/* Status Filter */}
        <StyledFormControl variant="outlined" size="small">
          <InputLabel id="status-label">Stock Status</InputLabel>
          <StyledSelect
            labelId="status-label"
            id="status"
            value={filters.status}
            onChange={handleStatusChange}
            label="Stock Status"
            inputProps={{ 'aria-label': 'Stock status filter' }}
          >
            <MenuItem value="ALL">All Status</MenuItem>
            <MenuItem value="IN_STOCK">In Stock</MenuItem>
            <MenuItem value="LOW_STOCK">Low Stock</MenuItem>
            <MenuItem value="OUT_OF_STOCK">Out of Stock</MenuItem>
          </StyledSelect>
        </StyledFormControl>
      </Box>
    </Box>
  );
};

export default InventoryFilter;
