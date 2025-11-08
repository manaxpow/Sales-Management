import { useState, useEffect } from 'react';
import { Package, Plus, Eye, Edit, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';
import InventoryFilter from './inventory.filter';
import InventoryPagination from './inventory.pagination';
import { ViewInventoryModal } from './modal/view-modal';
import { EditInventoryModal } from './modal/edit-modal';
import { DeleteInventoryModal } from './modal/delete-modal';
import {
  Box,
  Typography,
  Button,
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
import { useNavigate } from 'react-router-dom';
import type { 
  Product,
  InventoryFormData, 
  InventoryFilters
} from '../../../types/inventory.types';
import { getInventory, updateInventory } from '../../../services/inventory.service';

const InventoryManagement: React.FC = () => {
  const [inventory, setInventory] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<InventoryFilters>({
    search: '',
    status: 'ALL',
  });
  const [page, setPage] = useState(1); // API uses 1-based indexing
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Product | null>(null);

  // UI states
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'success',
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

  const handleEditItem = (item: Product) => {
    setSelectedItem(item);
    setEditModalOpen(true);
  };

  const handleDeleteItem = (item: Product) => {
    setSelectedItem(item);
    setDeleteModalOpen(true);
  };

  const handleSaveItem = async (data: InventoryFormData) => {
    if (selectedItem) {
      try {
        const response = await updateInventory(selectedItem.id, data.quantity);
        
        if (response.success) {
          // Update local state to reflect the change
          setInventory(prev =>
            prev.map(item =>
              item.id === selectedItem.id
                ? { ...item, quantity: data.quantity }
                : item
            )
          );
          setSnackbar({
            open: true,
            message: `Inventory for ${selectedItem.productName} updated successfully`,
            severity: 'success',
          });
          setEditModalOpen(false);
          setSelectedItem(null);
        } else {
          setSnackbar({
            open: true,
            message: 'Failed to update inventory. Please try again.',
            severity: 'error',
          });
        }
      } catch (error) {
        console.error('Error updating inventory:', error);
        setSnackbar({
          open: true,
          message: 'Error updating inventory. Please try again.',
          severity: 'error',
        });
      }
    }
  };

  const handleConfirmDelete = () => {
    if (selectedItem) {
      setInventory(prev => prev.filter(item => item.id !== selectedItem.id));
      setSnackbar({
        open: true,
        message: `Inventory item for ${selectedItem.productName} deleted successfully`,
        severity: 'success',
      });
      setDeleteModalOpen(false);
      setSelectedItem(null);
    }
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
          <Box className="flex items-center justify-between">
            <Box className="flex items-center gap-3">
              <Package className="w-8 h-8 text-blue-600" />
              <Box>
                <Typography variant="h4" component="h1" className="text-2xl font-bold text-gray-900" gutterBottom={false}>
                  Inventory Management
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage your product inventory and stock levels
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              startIcon={<Plus className="w-4 h-4" />}
              className="normal-case"
              onClick={() => navigate('/admin/inventory/create')}
            >
              Add New Item
            </Button>
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
                          <Tooltip title="Edit Quantity" arrow>
                            <IconButton
                              size="small"
                              onClick={() => handleEditItem(item)}
                            >
                              <Edit className="w-4 h-4" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Item" arrow>
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteItem(item)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                      <Box className="flex flex-col items-center">
                        <Package className="w-12 h-12 text-gray-300 mb-4" />
                        <Typography variant="h6" className="text-lg font-medium text-gray-900 mb-2">
                          {loading ? 'Loading...' : 'No inventory items found'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {!loading && (filters.search || filters.status !== 'ALL')
                            ? 'Try adjusting your filters to see more results.'
                            : !loading && 'Get started by adding your first inventory item.'}
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

        {/* Modals */}
        <ViewInventoryModal
          inventory={selectedItem}
          open={viewModalOpen}
          onClose={() => {
            setViewModalOpen(false);
            setSelectedItem(null);
          }}
        />

        <EditInventoryModal
          inventory={selectedItem}
          open={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setSelectedItem(null);
          }}
          onSave={handleSaveItem}
        />

        <DeleteInventoryModal
          inventory={selectedItem}
          open={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setSelectedItem(null);
          }}
          onConfirm={handleConfirmDelete}
        />

        {/* Success/Error Snackbar */}
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
