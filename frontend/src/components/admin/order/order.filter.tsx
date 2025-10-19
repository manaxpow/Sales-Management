import React from 'react';
import { Search, Filter, X, CalendarDays } from 'lucide-react';
import { TextField, Select, MenuItem, FormControl, InputLabel, Button, Box } from '@mui/material';
import type { OrderFilters } from '../../../types/order.types';


interface OrderFilterProps {
  filters: OrderFilters;
  onFiltersChange: (filters: OrderFilters) => void;
  onClearFilters: () => void;
}

const OrderFilter = ({
  filters,
  onFiltersChange,
  onClearFilters,
}: OrderFilterProps) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      search: e.target.value,
    });
  };

  const handleStatusChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    onFiltersChange({
      ...filters,
      status: e.target.value as 'all' | 'pending' | 'completed' | 'canceled',
    });
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        startDate: e.target.value || null,
      },
    });
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        endDate: e.target.value || null,
      },
    });
  };

  const hasActiveFilters =
    filters.search ||
    filters.status !== 'all' ||
    filters.dateRange.startDate !== null ||
    filters.dateRange.endDate !== null;

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

      <Box className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search Input */}
        <TextField
          label="Search Orders"
          variant="outlined"
          size="small"
          value={filters.search}
          onChange={handleSearchChange}
          placeholder="Search by customer name, order code, or phone number..."
          InputProps={{
            startAdornment: (
              <Search className="w-4 h-4 text-gray-400 mr-2" />
            ),
          }}
          className="md:col-span-2"
        />

        {/* Status Filter */}
        <FormControl variant="outlined" size="small" sx={{ minWidth: 120, width: '100%' }}>
          <InputLabel id="status-label">Status</InputLabel>
          <Select
            labelId="status-label"
            id="status"
            value={filters.status}
            onChange={handleStatusChange}
            label="Status"
            inputProps={{ 'aria-label': 'Status filter' }}
            sx={{
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
            }}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="canceled">Canceled</MenuItem>
          </Select>
        </FormControl>

        {/* Date Range Filters */}
        <TextField
          label="Start Date"
          type="date"
          variant="outlined"
          size="small"
          value={filters.dateRange.startDate || ''}
          onChange={handleStartDateChange}
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            startAdornment: (
              <CalendarDays className="w-4 h-4 text-gray-400 mr-2" />
            ),
          }}
        />
        <TextField
          label="End Date"
          type="date"
          variant="outlined"
          size="small"
          value={filters.dateRange.endDate || ''}
          onChange={handleEndDateChange}
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            startAdornment: (
              <CalendarDays className="w-4 h-4 text-gray-400 mr-2" />
            ),
          }}
        />
      </Box>
    </Box>
  );
};

export default OrderFilter;
