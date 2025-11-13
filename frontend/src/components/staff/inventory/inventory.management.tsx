import { useState, useEffect } from 'react';
import { Package, Eye, CheckCircle, AlertTriangle } from 'lucide-react';
import InventoryFilter from '../../admin/inventory/inventory.filter';
import InventoryPagination from '../../admin/inventory/inventory.pagination';
import { ViewInventoryModal } from '../../admin/inventory/modal/view-modal';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  Snackbar,
} from '@mui/material';
import type { 
  Product,
  InventoryFilters
} from '../../../types/inventory.types';
import { getInventory } from '../../../services/inventory.service';

const InventoryManagement = () => {
  const [inventory, setInventory] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<InventoryFilters>({
    search: '',
    status: 'ALL',
  });
  const [page, setPage] = useState(1); // API uses 1-based indexing
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Product | null>(null);

  // UI states
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'info',
  });

  // Get stock status
  const getStockStatus = (quantity: number): 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' => {
    if (quantity === 0) return 'OUT_OF_STOCK';
    if (quantity < 10) return 'LOW_STOCK';
    return 'IN_STOCK';
  };

  // Fetch inventory data
  useEffect(() => {
    const fetchInventory = async () => {
      setLoading(true);
      try {
        const response = await getInventory({
          page,
          pageSize: rowsPerPage,
          search: filters.search,
          status: filters.status,
        });
        
        if (response.success && response.data) {
          setInventory(response.data.products);
          setTotalCount(response.data.totalCount);
        } else {
          setInventory([]);
          setTotalCount(0);
        }
      } catch (error) {
        console.error('Error fetching inventory:', error);
        setInventory([]);
        setTotalCount(0);
        setSnackbar({
          open: true,
          message: 'Failed to load inventory data. Please try again.',
          severity: 'error',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, [page, rowsPerPage, filters]);

  // Event handlers
  const handleFiltersChange = (newFilters: InventoryFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: 'ALL',
    });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(1);
  };

  const handleViewItem = (item: Product) => {
    setSelectedItem(item);
    setViewModalOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const getStatusChip = (quantity: number) => {
    const status = getStockStatus(quantity);
    const config = {
      'IN_STOCK': { color: 'success' as const, icon: CheckCircle, label: 'In Stock' },
      'LOW_STOCK': { color: 'warning' as const, icon: AlertTriangle, label: 'Low Stock' },
      'OUT_OF_STOCK': { color: 'error' as const, icon: AlertTriangle, label: 'Out of Stock' },
    };
    
    const { color, icon: Icon, label } = config[status];
    
    return (
      <Chip
        icon={<Icon className="w-3 h-3" />}
        label={label}
        color={color}
        size="small"
        variant="filled"
      />
    );
  };

  return (
    <Box className="p-6 bg-gray-50 min-h-screen">
      <Box className="max-w-7xl mx-auto">
        {/* Header */}
        <Box className="mb-6">
          <Box className="flex items-center gap-3">
            <Package className="w-8 h-8 text-blue-600" />
            <Box>
              <Typography variant="h4" component="h1" className="text-2xl font-bold text-gray-900" gutterBottom={false}>
                Inventory View
              </Typography>
              <Typography variant="body2" color="text.secondary">
                View current product inventory and stock levels
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Filters */}
        <InventoryFilter
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
        />

        {/* Inventory Table */}
        <Paper className="mb-6" elevation={1}>
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: '#f9fafb' }}>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Barcode</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="center">Quantity</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Total Value</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inventory.length > 0 ? (
                  inventory.map((item) => (
                    <TableRow
                      key={item.id}
                      sx={{
                        '&:hover': {
                          backgroundColor: '#f9fafb',
                        },
                      }}
                    >
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2" className="font-medium text-gray-900">
                            {item.productName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            ID: {item.productId}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" className="font-mono text-sm">
                          {item.barcode}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" className="font-medium">
                          ${item.price.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography
                          variant="body2"
                          className={`font-medium ${
                            item.quantity === 0 ? 'text-red-600' : 
                            item.quantity < 10 ? 'text-orange-600' : 
                            'text-green-600'
                          }`}
                        >
                          {item.quantity}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        {getStatusChip(item.quantity)}
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" className="font-medium text-green-600">
                          ${(item.price * item.quantity).toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Box className="flex items-center justify-end gap-1">
                          <Tooltip title="View Details" arrow>
                            <IconButton
                              size="small"
                              onClick={() => handleViewItem(item)}
                            >
                              <Eye className="w-4 h-4" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                      <Box className="flex flex-col items-center">
                        <Package className="w-12 h-12 text-gray-300 mb-4" />
                        <Typography variant="h6" className="text-lg font-medium text-gray-900 mb-2">
                          {loading ? 'Loading...' : 'No inventory items found'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {!loading && (filters.search || filters.status !== 'ALL')
                            ? 'Try adjusting your filters to see more results.'
                            : !loading && 'No inventory data available at the moment.'}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Pagination */}
        {totalCount > 0 && (
          <InventoryPagination
            totalCount={totalCount}
            page={page - 1} // Convert to 0-based for the component
            rowsPerPage={rowsPerPage}
            onPageChange={(newPage) => handlePageChange(newPage + 1)} // Convert back to 1-based
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        )}

        {/* View Modal */}
        <ViewInventoryModal
          inventory={selectedItem}
          open={viewModalOpen}
          onClose={() => {
            setViewModalOpen(false);
            setSelectedItem(null);
          }}
        />

        {/* Error/Info Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default InventoryManagement;
