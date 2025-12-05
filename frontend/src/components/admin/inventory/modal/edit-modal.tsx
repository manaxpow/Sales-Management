import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  TextField,
} from '@mui/material';
import { X, Edit, Package } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { Product, InventoryFormData, InventoryFormErrors } from '../../../../types/inventory.types';

interface EditInventoryModalProps {
  inventory: Product | null;
  open: boolean;
  onClose: () => void;
  onSave: (data: InventoryFormData) => void;
}

export const EditInventoryModal = ({
  inventory,
  open,
  onClose,
  onSave,
}: EditInventoryModalProps) => {
  const [formData, setFormData] = useState<InventoryFormData>({
    quantity: 0,
  });
  const [errors, setErrors] = useState<InventoryFormErrors>({});

  useEffect(() => {
    if (inventory) {
      setFormData({
        quantity: inventory.quantity,
      });
      setErrors({});
    }
  }, [inventory, open]);

  const validateForm = (): boolean => {
    const newErrors: InventoryFormErrors = {};

    if (typeof formData.quantity === 'number' && formData.quantity < 0) {
      newErrors.quantity = 'Quantity cannot be negative';
    }

    if (typeof formData.quantity === 'number' && !Number.isInteger(formData.quantity)) {
      newErrors.quantity = 'Quantity must be a whole number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  const handleInputChange = (field: keyof InventoryFormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = field === 'quantity' ? parseInt(event.target.value) || 0 : event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value as number,
    }));

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  if (!inventory) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle className="flex items-center justify-between">
        <Typography variant="h6" component="div" className="flex items-center gap-2">
          <Edit className="w-5 h-5" />
          Update Inventory
        </Typography>
        <IconButton onClick={onClose} size="small">
          <X className="w-4 h-4" />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box className="space-y-4">
          {/* Product Info */}
          <Box className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <Package className="w-6 h-6 text-blue-600" />
            <Box>
              <Typography variant="subtitle1" className="font-semibold">
                {inventory.productName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                SKU: {inventory.barcode} | Current Stock: {inventory.quantity}
              </Typography>
            </Box>
          </Box>

          {/* Form */}
          <Box className="space-y-4">
            <Typography variant="subtitle1" className="font-medium text-gray-900">
              Update Quantity
            </Typography>

            <Box className="space-y-3">
              <TextField
                label="New Quantity"
                type="number"
                fullWidth
                value={formData.quantity}
                onChange={handleInputChange('quantity')}
                error={!!errors.quantity}
                helperText={errors.quantity}
                InputProps={{
                  inputProps: {
                    min: 0,
                    step: 1,
                  },
                }}
                variant="outlined"
                size="small"
              />

              <Box className="p-3 bg-blue-50 rounded-lg">
                <Typography variant="body2" color="text.secondary">
                  <strong>Note:</strong> This will update the current inventory quantity for this product.
                  The change will be recorded with the current timestamp.
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Update Inventory
        </Button>
      </DialogActions>
    </Dialog>
  );
};
