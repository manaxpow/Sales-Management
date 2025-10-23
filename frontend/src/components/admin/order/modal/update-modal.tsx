import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import type { Order } from '../../../../types/order.types';

interface EditOrderModalProps {
  order: Order | null;
  open: boolean;
  onClose: () => void;
  onSave: (data: Partial<Order>) => void;
}

export const EditOrderModal: React.FC<EditOrderModalProps> = ({ order, open, onClose, onSave }) => {
  const [formData, setFormData] = React.useState<Partial<Order>>({});

  React.useEffect(() => {
    if (order) {
      setFormData({
        customerName: order.customerName,
        phoneNumber: order.phoneNumber,
        orderCode: order.orderCode,
        totalPaymentAmount: order.totalPaymentAmount,
        status: order.status,
      });
    }
  }, [order]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name as string]: name === 'totalPaymentAmount' ? parseFloat(value as string) : value,
    }));
  };

  const handleStatusChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setFormData(prev => ({
      ...prev,
      status: e.target.value as 'pending' | 'completed' | 'canceled',
    }));
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  if (!order) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Order - {order.orderCode}</DialogTitle>
      <DialogContent dividers className="space-y-4">
        <TextField
          label="Customer Name"
          name="customerName"
          value={formData.customerName || ''}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          size="small"
        />
        <TextField
          label="Phone Number"
          name="phoneNumber"
          value={formData.phoneNumber || ''}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          size="small"
        />
        <TextField
          label="Order Code"
          name="orderCode"
          value={formData.orderCode || ''}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          size="small"
          disabled
        />
        <TextField
          label="Total Payment Amount"
          name="totalPaymentAmount"
          type="number"
          value={formData.totalPaymentAmount || ''}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          size="small"
        />
        <FormControl fullWidth variant="outlined" size="small">
          <InputLabel id="status-label">Status</InputLabel>
          <Select
            labelId="status-label"
            id="status"
            name="status"
            value={formData.status || ''}
            onChange={handleStatusChange}
            label="Status"
          >
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="canceled">Canceled</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};
