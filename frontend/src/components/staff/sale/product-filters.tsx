import {
  Box,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { Search, X } from "lucide-react";
import { InputAdornment } from "@mui/material";

interface ProductFiltersProps {
  searchTerm: string;
  categoryFilter: string;
  availableCategories: string[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onClear: () => void;
}

export const ProductFilters = ({
  searchTerm,
  categoryFilter,
  availableCategories,
  onSearchChange,
  onCategoryChange,
  onClear,
}: ProductFiltersProps) => {
  return (
    <Paper className="p-4 mb-4 bg-white shadow-sm rounded-lg">
      <Box className="flex flex-col md:flex-row gap-4 items-end">
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Tìm sản phẩm..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={20} className="text-gray-500" />
              </InputAdornment>
            ),
          }}
        />
        <FormControl variant="outlined" size="small" className="w-[200px]">
          <InputLabel>Danh mục</InputLabel>
          <Select
            value={categoryFilter}
            onChange={(e) => onCategoryChange(e.target.value as string)}
            label="Danh mục"
          >
            {availableCategories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="outlined"
          startIcon={<X size={16} />}
          onClick={onClear}
          disabled={!searchTerm && categoryFilter === "Tất cả"}
        >
          Xóa lọc
        </Button>
      </Box>
    </Paper>
  );
};
