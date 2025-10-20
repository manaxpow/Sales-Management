import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';
import type { Order } from '../../../../types/order.types';

interface ViewOrderModalProps {
  order: Order | null;
  open: boolean;
  onClose: () => void;
}

export const ViewOrderModal: React.FC<ViewOrderModalProps> = ({ order, open, onClose }) => {
  if (!order) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Order Details - {order.orderCode}</DialogTitle>
      <DialogContent dividers>
        <Box className="space-y-4">
          <Typography variant="subtitle1" className="font-semibold">Customer Name: <span className="font-normal">{order.customerName}</span></Typography>
          <Typography variant="subtitle1" className="font-semibold">Phone Number: <span className="font-normal">{order.phoneNumber}</span></Typography>
          <Typography variant="subtitle1" className="font-semibold">Order Code: <span className="font-normal">{order.orderCode}</span></Typography>
          <Typography variant="subtitle1" className="font-semibold">Created Date: <span className="font-normal">{new Date(order.createdDate).toLocaleDateString()}</span></Typography>
          <Typography variant="subtitle1" className="font-semibold">Total Payment: <span className="font-normal">${order.totalPaymentAmount.toFixed(2)}</span></Typography>
          <Typography variant="subtitle1" className="font-semibold">Status: <span className="font-normal">{order.status}</span></Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
