import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, IconButton, Box } from "@mui/material";
import { Trash2, X } from "lucide-react";

// Simplified Staff interface matching database structure
interface SimpleStaff {
  id: string;
  username: string;
  fullName: string;
  status: 'active' | 'inactive';
}

interface DeleteStaffModalProps {
  staff: SimpleStaff | null;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteStaffModal = ({
  staff,
  open,
  onClose,
  onConfirm,
}: DeleteStaffModalProps) => {
  if (!staff) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle className="flex items-center justify-between">
        <Box className="flex items-center gap-2">
          <Trash2 className="w-5 h-5 text-red-500" />
          <Typography variant="h6">Delete Staff</Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <X className="w-4 h-4" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Alert severity="warning" className="mb-4">
          This action cannot be undone. All data associated with this staff member will be permanently deleted.
        </Alert>
        <Typography>
          Are you sure you want to delete <strong>{staff.fullName}</strong> (@{staff.username})?
        </Typography>
        <Box className="mt-3 p-3 bg-gray-50 rounded-md">
          <Typography variant="caption" color="text.secondary">
            Staff ID: {staff.id}
          </Typography>
          <br />
          <Typography variant="caption" color="text.secondary">
            Status: {staff.status}
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
          Delete Staff
        </Button>
      </DialogActions>
    </Dialog>
  );
};
