import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import { X, Trash2, Package, AlertTriangle } from 'lucide-react';
import type { Product } from '../../../../types/inventory.types';

interface DeleteInventoryModalProps {
  inventory: Product | null;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteInventoryModal = ({
  inventory,
  open,
  onClose,
  onConfirm,
}: DeleteInventoryModalProps) => {
  if (!inventory) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle className="flex items-center justify-between">
        <Typography variant="h6" component="div" className="flex items-center gap-2">
          <Trash2 className="w-5 h-5 text-red-600" />
          Delete Inventory Item
        </Typography>
        <IconButton onClick={onClose} size="small">
          <X className="w-4 h-4" />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box className="space-y-4">
          {/* Warning Message */}
          <Box className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <Box>
              <Typography variant="subtitle1" className="font-semibold text-red-900 mb-1">
                This action cannot be undone
              </Typography>
              <Typography variant="body2" color="error.dark">
                Deleting this inventory item will permanently remove it from the system. 
                This action cannot be reversed.
              </Typography>
            </Box>
          </Box>

          {/* Product Info */}
          <Box className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <Package className="w-6 h-6 text-blue-600" />
            <Box className="flex-1">
              <Typography variant="subtitle1" className="font-semibold">
                {inventory.productName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                SKU: {inventory.barcode}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Current Quantity: {inventory.quantity}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Unit Price: ${inventory.price.toLocaleString()}
              </Typography>
            </Box>
          </Box>

          {/* Confirmation Question */}
          <Box className="text-center py-2">
            <Typography variant="body1" className="font-medium text-gray-900">
              Are you sure you want to delete this inventory item?
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions className="p-4">
        <Button 
          onClick={onClose} 
          variant="outlined"
          className="normal-case"
        >
          Cancel
        </Button>
        <Button 
          onClick={handleConfirm} 
          variant="contained" 
          color="error"
          startIcon={<Trash2 className="w-4 h-4" />}
          className="normal-case"
        >
          Delete Item
        </Button>
      </DialogActions>
    </Dialog>
  );
};
