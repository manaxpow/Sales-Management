import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import { Trash2, X } from "lucide-react";
import type { Promotion } from "../../../../types/promotion.type";

// Simplified Promotion interface matching database structure

interface DeletePromotionModalProps {
  Promotion: Promotion | null;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeletePromotionModal = ({
  Promotion,
  open,
  onClose,
  onConfirm,
}: DeletePromotionModalProps) => {
  if (!Promotion) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle className="flex items-center justify-between">
        <Box className="flex items-center gap-2">
          <Trash2 className="w-5 h-5 text-red-500" />
          <Typography variant="h6">Delete Promotion</Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <X className="w-4 h-4" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Alert severity="warning" className="mb-4">
          This action cannot be undone. All data associated with this Promotion
          member will be permanently deleted.
        </Alert>
        <Typography>
          Are you sure you want to delete{" "}
          <strong>{Promotion.promotionCode}</strong> (@
          {Promotion.promotionCode})?
        </Typography>
        <Box className="mt-3 p-3 bg-gray-50 rounded-md">
          <Typography variant="caption" color="text.secondary">
            Promotion ID: {Promotion.promotionId}
          </Typography>
          <br />
          <Typography variant="caption" color="text.secondary">
            Status: {Promotion.status}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          startIcon={<Trash2 className="w-4 h-4" />}
        >
          Delete Promotion
        </Button>
      </DialogActions>
    </Dialog>
  );
};
