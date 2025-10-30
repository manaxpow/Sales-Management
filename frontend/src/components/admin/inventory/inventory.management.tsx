import { useState, useEffect, useMemo } from 'react';
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
  InventoryWithProduct, 
  InventoryFormData, 
  InventoryFilters,
  Product,
  InventoryItem
} from '../../../types/inventory.types';

// Generate mock data
const generateMockProducts = (): Product[] => {
  const productNames = [
    'Laptop Dell XPS 13', 'iPhone 14 Pro', 'Samsung Galaxy S23', 'iPad Air',
    'MacBook Pro M2', 'ThinkPad X1 Carbon', 'Surface Pro 9', 'AirPods Pro',
    'Sony WH-1000XM5', 'Bose QuietComfort', 'Logitech MX Master 3', 'Dell UltraSharp 27"',
    'LG UltraGear 32"', 'Samsung SSD 1TB', 'WD Blue 2TB HDD', 'Corsair DDR5 32GB',
    'NVIDIA RTX 4090', 'AMD Ryzen 9 7950X', 'Intel Core i9-13900K', 'Apple Watch Series 8',
    'Fitbit Charge 5', 'Garmin Forerunner 255', 'JBL Flip 6', 'Sony PlayStation 5',
    'Xbox Series X', 'Nintendo Switch OLED', 'Dyson V15 Detect', 'Roomba i7+',
    'Instant Pot Duo', 'KitchenAid Mixer', 'Nespresso Vertuo', 'Breville Barista Express'
  ];

  const units = ['pcs', 'box', 'set', 'kg', 'liter', 'meter'];
  
  return productNames.map((name, index) => ({
    productId: index + 1,
    categoryId: Math.floor(Math.random() * 10) + 1,
    supplierId: Math.floor(Math.random() * 5) + 1,
    productName: name,
    barcode: `SKU${String(index + 1).padStart(6, '0')}`,
    price: Math.floor(Math.random() * 2000) + 50,
    unit: units[Math.floor(Math.random() * units.length)],
    createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
  }));
};

const generateMockInventory = (products: Product[]): InventoryItem[] => {
  return products.map((product, index) => ({
    inventoryId: index + 1,
    productId: product.productId,
    quantity: Math.floor(Math.random() * 200) - 20, // Some items will be out of stock
    updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  }));
};

// Combine inventory with product data
const generateInventoryWithProducts = (): InventoryWithProduct[] => {
  const products = generateMockProducts();
  const inventory = generateMockInventory(products);
  
  return inventory.map(inv => ({
    ...inv,
    product: products.find(p => p.productId === inv.productId)!,
  })).filter(item => item.product); // Filter out any items without products
};

const mockInventoryData = generateInventoryWithProducts();

const InventoryManagement: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryWithProduct[]>(mockInventoryData);
  const [filteredInventory, setFilteredInventory] = useState<InventoryWithProduct[]>(mockInventoryData);
  const [filters, setFilters] = useState<InventoryFilters>({
    search: '',
    status: 'all',
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryWithProduct | null>(null);

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
  const getStockStatus = (quantity: number): 'in-stock' | 'low-stock' | 'out-of-stock' => {
    if (quantity === 0) return 'out-of-stock';
    if (quantity < 10) return 'low-stock';
    return 'in-stock';
  };

  // Filter and search logic
  useEffect(() => {
    const filtered = inventory.filter((item) => {
      const matchesSearch =
        filters.search === '' ||
        item.product.productName.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.product.barcode.toLowerCase().includes(filters.search.toLowerCase());

      const itemStatus = getStockStatus(item.quantity);
      const matchesStatus = filters.status === 'all' || itemStatus === filters.status;

      return matchesSearch && matchesStatus;
    });

    setFilteredInventory(filtered);
    setPage(0); // Reset to first page when filters change
  }, [inventory, filters]);

  // Pagination logic
  const paginatedInventory = useMemo(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredInventory.slice(startIndex, endIndex);
  }, [filteredInventory, page, rowsPerPage]);

  // Event handlers
  const handleFiltersChange = (newFilters: InventoryFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
    });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  const handleViewItem = (item: InventoryWithProduct) => {
    setSelectedItem(item);
    setViewModalOpen(true);
  };

  const handleEditItem = (item: InventoryWithProduct) => {
    setSelectedItem(item);
    setEditModalOpen(true);
  };

  const handleDeleteItem = (item: InventoryWithProduct) => {
    setSelectedItem(item);
    setDeleteModalOpen(true);
  };

  const handleSaveItem = (data: InventoryFormData) => {
    if (selectedItem) {
      setInventory(prev =>
        prev.map(item =>
          item.inventoryId === selectedItem.inventoryId
            ? { ...item, quantity: data.quantity, updatedAt: new Date().toISOString() }
            : item
        )
      );
      setSnackbar({
        open: true,
        message: `Inventory for ${selectedItem.product.productName} updated successfully`,
        severity: 'success',
      });
    }
  };

  const handleConfirmDelete = () => {
    if (selectedItem) {
      setInventory(prev => prev.filter(item => item.inventoryId !== selectedItem.inventoryId));
      setSnackbar({
        open: true,
        message: `Inventory item for ${selectedItem.product.productName} deleted successfully`,
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
      'in-stock': { color: 'success' as const, icon: CheckCircle, label: 'In Stock' },
      'low-stock': { color: 'warning' as const, icon: AlertTriangle, label: 'Low Stock' },
      'out-of-stock': { color: 'error' as const, icon: AlertTriangle, label: 'Out of Stock' },
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
                {paginatedInventory.length > 0 ? (
                  paginatedInventory.map((item) => (
                    <TableRow
                      key={item.inventoryId}
                      sx={{
                        '&:hover': {
                          backgroundColor: '#f9fafb',
                        },
                      }}
                    >
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2" className="font-medium text-gray-900">
                            {item.product.productName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.product.unit}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" className="font-mono text-sm">
                          {item.product.barcode}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" className="font-medium">
                          ${item.product.price.toFixed(2)}
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
                          No inventory items found
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {filters.search || filters.status !== 'all'
                            ? 'Try adjusting your filters to see more results.'
                            : 'Get started by adding your first inventory item.'}
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
        {filteredInventory.length > 0 && (
          <InventoryPagination
            inventory={filteredInventory}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handlePageChange}
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
