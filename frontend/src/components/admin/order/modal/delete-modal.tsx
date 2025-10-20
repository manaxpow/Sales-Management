import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import type { Order } from '../../../../types/order.types';

interface DeleteOrderModalProps {
  order: Order | null;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteOrderModal: React.FC<DeleteOrderModalProps> = ({ order, open, onClose, onConfirm }) => {
  if (!order) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Delete Order</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete the order with code{' '}
          <span className="font-semibold">{order.orderCode}</span> by{' '}
          <span className="font-semibold">{order.customerName}</span>?
          This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};
