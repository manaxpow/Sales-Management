import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  IconButton,
  Divider,
} from '@mui/material';
import { X, Eye, Package, AlertTriangle, CheckCircle } from 'lucide-react';
import type { Product } from '../../../../types/inventory.types';

interface ViewInventoryModalProps {
  inventory: Product | null;
  open: boolean;
  onClose: () => void;
}

const getStockStatus = (quantity: number): 'in-stock' | 'low-stock' | 'out-of-stock' => {
  if (quantity === 0) return 'out-of-stock';
  if (quantity < 10) return 'low-stock';
  return 'in-stock';
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

export const ViewInventoryModal = ({
  inventory,
  open,
  onClose,
}: ViewInventoryModalProps) => {
  if (!inventory) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle className="flex items-center justify-between">
        <Typography variant="h6" component="div" className="flex items-center gap-2">
          <Eye className="w-5 h-5" />
          Inventory Details
        </Typography>
        <IconButton onClick={onClose} size="small">
          <X className="w-4 h-4" />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box className="space-y-4">
          {/* Product Header */}
          <Box className="flex items-center gap-3">
            <Box className="p-3 bg-blue-50 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </Box>
            <Box className="flex-1">
              <Typography variant="h6" className="font-semibold">
                {inventory.productName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                SKU: {inventory.barcode}
              </Typography>
            </Box>
          </Box>

          <Divider />

          {/* Product Information */}
          <Box className="space-y-3">
            <Typography variant="subtitle1" className="font-medium text-gray-900">
              Product Information
            </Typography>
            
            <Box className="grid grid-cols-2 gap-4">
              <Box>
                <Typography variant="subtitle2" color="text.secondary" className="mb-1">
                  Product ID
                </Typography>
                <Typography variant="body2" className="font-mono">
                  {inventory.productId}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="subtitle2" color="text.secondary" className="mb-1">
                  Price
                </Typography>
                <Typography variant="body2">
                  ${inventory.price.toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Divider />

          {/* Inventory Information */}
          <Box className="space-y-3">
            <Typography variant="subtitle1" className="font-medium text-gray-900">
              Inventory Information
            </Typography>
            
            <Box className="grid grid-cols-2 gap-4">
              <Box>
                <Typography variant="subtitle2" color="text.secondary" className="mb-1">
                  Current Quantity
                </Typography>
                <Typography
                  variant="h6"
                  className={`font-bold ${
                    inventory.quantity === 0 ? 'text-red-600' : 
                    inventory.quantity < 10 ? 'text-orange-600' : 
                    'text-green-600'
                  }`}
                >
                  {inventory.quantity}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="subtitle2" color="text.secondary" className="mb-1">
                  Stock Status
                </Typography>
                {getStatusChip(inventory.quantity)}
              </Box>
              
              <Box>
                <Typography variant="subtitle2" color="text.secondary" className="mb-1">
                  Total Value
                </Typography>
                <Typography variant="h6" className="font-semibold text-green-600">
                  ${(inventory.price * inventory.quantity).toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
