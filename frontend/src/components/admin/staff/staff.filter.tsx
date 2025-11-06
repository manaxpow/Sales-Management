import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { TextField, Button, Box } from '@mui/material';

interface SimpleStaffFilters {
  search: string;
}

interface StaffFilterProps {
  filters: SimpleStaffFilters;
  onFiltersChange: (filters: SimpleStaffFilters) => void;
  onClearFilters: () => void;
}

const StaffFilter = ({ filters, onFiltersChange, onClearFilters }: StaffFilterProps) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      search: e.target.value,
    });
  };

  const hasActiveFilters = filters.search !== '';

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
            Clear
          </Button>
        )}
      </Box>

      {/* Search Input */}
      <TextField
        label="Search Employees"
        variant="outlined"
        size="small"
        value={filters.search}
        onChange={handleSearchChange}
        placeholder="Search by username or full name..."
        InputProps={{
          startAdornment: <Search className="w-4 h-4 text-gray-400 mr-2" />,
        }}
        fullWidth
      />
    </Box>
  );
};

export default StaffFilter;
