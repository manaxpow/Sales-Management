import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Avatar,
  Chip,
  IconButton,
} from '@mui/material';
import { X, Eye } from 'lucide-react';

interface SimpleStaff {
  id: number;
  username: string;
  fullName: string;
  role: 'admin' | 'staff';
}

interface ViewStaffModalProps {
  staff: SimpleStaff | null;
  open: boolean;
  onClose: () => void;
}

export const ViewStaffModal = ({
  staff,
  open,
  onClose,
}: ViewStaffModalProps) => {
  if (!staff) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle className="flex items-center justify-between">
        <Typography
          variant="h6"
          component="div"
          className="flex items-center gap-2"
        >
          <Eye className="w-5 h-5" />
          Staff Details
        </Typography>
        <IconButton onClick={onClose} size="small">
          <X className="w-4 h-4" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box className="space-y-4">
          {/* Avatar + Basic Info */}
          <Box className="flex items-center gap-4">
            <Avatar
              className="w-16 h-16"
              sx={{
                backgroundColor: '#dbeafe',
                color: '#1e40af',
                fontSize: '1rem',
                fontWeight: 500,
              }}
            >
              {staff.fullName
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </Avatar>
            <Box>
              <Typography variant="h6" className="font-semibold">
                {staff.fullName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                @{staff.username}
              </Typography>
            </Box>
          </Box>

          {/* Details */}
          <Box className="space-y-3">
            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                className="mb-1"
              >
                Staff ID
              </Typography>
              <Typography variant="body2">{staff.id}</Typography>
            </Box>

            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                className="mb-1"
              >
                Role
              </Typography>
              <Chip
                label={staff.role === 'admin' ? 'Admin' : 'Staff'}
                color={staff.role === 'admin' ? 'primary' : 'default'}
                size="small"
              />
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
