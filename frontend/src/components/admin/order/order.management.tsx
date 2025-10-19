import { useState, useEffect, useMemo } from 'react';
import { ShoppingCart, Plus, Eye, Edit, Trash2 } from 'lucide-react';
import OrderFilter from './order.filter';
import OrderPagination from './order.pagination';
import { ViewOrderModal } from './modal/view-modal';
import { EditOrderModal } from './modal/update-modal';
import { DeleteOrderModal } from './modal/delete-modal';
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
  Card,
  CardContent,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { Order, OrderFilters } from '../../../types/order.types';

// Generate simplified mock data
const generateMockOrders = (): Order[] => {
  const customerNames = ['Alice Smith', 'Bob Johnson', 'Charlie Brown', 'Diana Prince', 'Eve Adams', 'Frank White', 'Grace Lee', 'Henry King', 'Ivy Green', 'Jack Black'];
  const phoneNumbers = ['111-222-3333', '444-555-6666', '777-888-9999', '123-456-7890', '098-765-4321'];
  const statuses: ('pending' | 'completed' | 'canceled')[] = ['pending', 'completed', 'canceled'];

  const orders: Order[] = [];

  for (let i = 1; i <= 60; i++) {
    const customerName = customerNames[Math.floor(Math.random() * customerNames.length)];
    const phoneNumber = phoneNumbers[Math.floor(Math.random() * phoneNumbers.length)];
    const orderCode = `ORD-${String(i).padStart(4, '0')}`;
    const createdDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // Last 30 days
    const totalPaymentAmount = parseFloat((Math.random() * 1000 + 50).toFixed(2));
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    orders.push({
      id: `ORDER-${String(i).padStart(3, '0')}`,
      customerName,
      phoneNumber,
      orderCode,
      createdDate,
      totalPaymentAmount,
      status,
    });
  }

  return orders.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
};

const mockOrders = generateMockOrders();

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(mockOrders);
  const [filters, setFilters] = useState<OrderFilters>({
    search: '',
    status: 'all',
    dateRange: { startDate: null, endDate: null },
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

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

  // Filter and search logic
  useEffect(() => {
    const filtered = orders.filter((order) => {
      const matchesSearch =
        filters.search === '' ||
        order.customerName.toLowerCase().includes(filters.search.toLowerCase()) ||
        order.orderCode.toLowerCase().includes(filters.search.toLowerCase()) ||
        order.phoneNumber.includes(filters.search);

      const matchesStatus =
        filters.status === 'all' || order.status === filters.status;

      const orderDate = new Date(order.createdDate);
      const matchesStartDate =
        !filters.dateRange.startDate ||
        orderDate >= new Date(filters.dateRange.startDate);
      const matchesEndDate =
        !filters.dateRange.endDate ||
        orderDate <= new Date(filters.dateRange.endDate);

      return matchesSearch && matchesStatus && matchesStartDate && matchesEndDate;
    });

    setFilteredOrders(filtered);
    setPage(0); // Reset to first page when filters change
  }, [orders, filters]);

  // Pagination logic
  const paginatedOrders = useMemo(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredOrders.slice(startIndex, endIndex);
  }, [filteredOrders, page, rowsPerPage]);

  // Event handlers
  const handleFiltersChange = (newFilters: OrderFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      dateRange: { startDate: null, endDate: null },
    });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  const handleViewOrder = (orderMember: Order) => {
    setSelectedOrder(orderMember);
    setViewModalOpen(true);
  };

  const handleEditOrder = (orderMember: Order) => {
    setSelectedOrder(orderMember);
    setEditModalOpen(true);
  };

  const handleDeleteOrder = (orderMember: Order) => {
    setSelectedOrder(orderMember);
    setDeleteModalOpen(true);
  };

  const handleSaveOrder = (data: Partial<Order>) => {
    if (selectedOrder) {
      setOrders(prev =>
        prev.map(ord =>
          ord.id === selectedOrder.id
            ? { ...ord, ...data }
            : ord
        )
      );
      setSnackbar({
        open: true,
        message: `Order ${selectedOrder.orderCode} updated successfully`,
        severity: 'success',
      });
    }
  };

  const handleConfirmDelete = () => {
    if (selectedOrder) {
      setOrders(prev => prev.filter(ord => ord.id !== selectedOrder.id));
      setSnackbar({
        open: true,
        message: `Order ${selectedOrder.orderCode} deleted successfully`,
        severity: 'success',
      });
      setDeleteModalOpen(false);
      setSelectedOrder(null);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const getStatusChip = (status: 'pending' | 'completed' | 'canceled') => {
    let color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
    switch (status) {
      case 'completed':
        color = 'success';
        break;
      case 'pending':
        color = 'warning';
        break;
      case 'canceled':
        color = 'error';
        break;
      default:
        color = 'default';
    }
    return (
      <Chip
        label={status}
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
              <ShoppingCart className="w-8 h-8 text-blue-600" />
              <Box>
                <Typography variant="h4" component="h1" className="text-2xl font-bold text-gray-900" gutterBottom={false}>
                  Order Management
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage customer orders
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              startIcon={<Plus className="w-4 h-4" />}
              className="normal-case"
              onClick={() => navigate('/admin/orders/create')}
            >
              Add New Order
            </Button>
          </Box>
        </Box>

        {/* Filters */}
        <OrderFilter
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
        />

        {/* Order List */}
        <Paper className="mb-6" elevation={1}>
          {/* Desktop Table View */}
          <TableContainer className="hidden md:block">
            <Table>
              <TableHead sx={{ backgroundColor: '#f9fafb' }}>
                <TableRow>
                  <TableCell>Order Code</TableCell>
                  <TableCell>Customer Name</TableCell>
                  <TableCell>Phone Number</TableCell>
                  <TableCell>Created Date</TableCell>
                  <TableCell>Total Payment</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedOrders.length > 0 ? (
                  paginatedOrders.map((order) => (
                    <TableRow
                      key={order.id}
                      sx={{
                        '&:hover': {
                          backgroundColor: '#f9fafb',
                        },
                      }}
                    >
                      <TableCell>
                        <Typography variant="subtitle2" className="font-medium text-gray-900">
                          {order.orderCode}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" className="font-medium text-gray-900">
                          {order.customerName}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {order.phoneNumber}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(order.createdDate).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" className="font-medium text-gray-900">
                          ${order.totalPaymentAmount.toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {getStatusChip(order.status)}
                      </TableCell>
                      <TableCell align="right">
                        <Box className="flex items-center justify-end gap-1">
                          <Tooltip title="View Details" arrow>
                            <IconButton
                              size="small"
                              onClick={() => handleViewOrder(order)}
                            >
                              <Eye className="w-4 h-4" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit Order" arrow>
                            <IconButton
                              size="small"
                              onClick={() => handleEditOrder(order)}
                            >
                              <Edit className="w-4 h-4" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Order" arrow>
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteOrder(order)}
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
                    <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                      <Box className="flex flex-col items-center">
                        <ShoppingCart className="w-12 h-12 text-gray-300 mb-4" />
                        <Typography variant="h6" className="text-lg font-medium text-gray-900 mb-2">
                          No orders found
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {filters.search || filters.status !== 'all' || filters.dateRange.startDate || filters.dateRange.endDate
                            ? 'Try adjusting your filters to see more results.'
                            : 'Get started by adding your first order.'}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Mobile/Tablet Card View */}
          <Box className="md:hidden p-4">
            {paginatedOrders.length > 0 ? (
              <Box className="grid grid-cols-1 gap-4">
                {paginatedOrders.map((order) => (
                  <Card elevation={1} className="p-4" key={order.id}>
                    <CardContent className="space-y-2">
                      <Box className="flex justify-between items-center">
                        <Typography variant="subtitle1" className="font-semibold text-gray-900">
                          {order.orderCode}
                        </Typography>
                        {getStatusChip(order.status)}
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Customer: <span className="font-medium text-gray-800">{order.customerName}</span>
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Phone: <span className="font-medium text-gray-800">{order.phoneNumber}</span>
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Date: <span className="font-medium text-gray-800">{new Date(order.createdDate).toLocaleDateString()}</span>
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total: <span className="font-medium text-gray-800">${order.totalPaymentAmount.toFixed(2)}</span>
                      </Typography>
                      <Box className="flex justify-end gap-1 mt-2">
                        <Tooltip title="View Details" arrow>
                          <IconButton
                            size="small"
                            onClick={() => handleViewOrder(order)}
                          >
                            <Eye className="w-4 h-4" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Order" arrow>
                          <IconButton
                            size="small"
                            onClick={() => handleEditOrder(order)}
                          >
                            <Edit className="w-4 h-4" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Order" arrow>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteOrder(order)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            ) : (
              <Box className="flex flex-col items-center py-6">
                <ShoppingCart className="w-12 h-12 text-gray-300 mb-4" />
                <Typography variant="h6" className="text-lg font-medium text-gray-900 mb-2">
                  No orders found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {filters.search || filters.status !== 'all' || filters.dateRange.startDate || filters.dateRange.endDate
                    ? 'Try adjusting your filters to see more results.'
                    : 'Get started by adding your first order.'}
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>

        {/* Pagination */}
        {filteredOrders.length > 0 && (
          <OrderPagination
            orders={filteredOrders}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        )}

        {/* Modals */}
        <ViewOrderModal
          order={selectedOrder}
          open={viewModalOpen}
          onClose={() => {
            setViewModalOpen(false);
            setSelectedOrder(null);
          }}
        />

        <EditOrderModal
          order={selectedOrder}
          open={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setSelectedOrder(null);
          }}
          onSave={handleSaveOrder}
        />

        <DeleteOrderModal
          order={selectedOrder}
          open={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setSelectedOrder(null);
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

export default OrderManagement;
