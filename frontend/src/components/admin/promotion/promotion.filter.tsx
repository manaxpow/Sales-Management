import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { TextField, Select, MenuItem, FormControl, InputLabel, Button, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import type { PromotionFilters } from '../../../types/promotion.type';

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

interface PromotionFilterProps {
  filters: PromotionFilters;
  onFiltersChange: (filters: PromotionFilters) => void;
  onClearFilters: () => void;
}

const PromotionFilter = ({
  filters,
  onFiltersChange,
  onClearFilters,
}: PromotionFilterProps) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      search: e.target.value,
    });
  };

  const handleStatusChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    onFiltersChange({
      ...filters,
      status: e.target.value as 'all' | 'active' | 'inactive',
    });
  };

  const hasActiveFilters = filters.search || filters.status !== 'all';

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
          label="Search Employees"
          variant="outlined"
          size="small"
          value={filters.search}
          onChange={handleSearchChange}
          placeholder="Search by promotion name..."
          InputProps={{
            startAdornment: (
              <Search className="w-4 h-4 text-gray-400 mr-2" />
            ),
          }}
        />

        {/* Status Filter */}
        <StyledFormControl variant="outlined" size="small">
          <InputLabel id="status-label">Status</InputLabel>
          <StyledSelect
            labelId="status-label"
            id="status"
            value={filters.status}
            onChange={handleStatusChange}
            label="Status"
            inputProps={{ 'aria-label': 'Status filter' }}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </StyledSelect>
        </StyledFormControl>
      </Box>
    </Box>
  );
};

export default PromotionFilter;