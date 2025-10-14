import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import { Edit, X } from 'lucide-react';

// Simplified Staff interface matching database structure
interface SimpleStaff {
  id: string;
  username: string;
  fullName: string;
  status: 'active' | 'inactive';
}

// Simplified form data
interface SimpleStaffFormData {
  fullName: string;
  username: string;
}

interface EditStaffModalProps {
  staff: SimpleStaff | null;
  open: boolean;
  onClose: () => void;
  onSave: (data: SimpleStaffFormData) => void;
}

export const EditStaffModal = ({
  staff,
  open,
  onClose,
  onSave,
}: EditStaffModalProps) => {
  const [formData, setFormData] = useState<SimpleStaffFormData>({
    fullName: staff?.fullName || '',
    username: staff?.username || '',
  });

  const [errors, setErrors] = useState<Partial<SimpleStaffFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<SimpleStaffFormData> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (!/^[a-zA-Z0-9._]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, dots, and underscores';
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

  const handleChange = (field: keyof SimpleStaffFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  // Reset form when staff changes
  React.useEffect(() => {
    if (staff) {
      setFormData({
        fullName: staff.fullName,
        username: staff.username,
      });
      setErrors({});
    }
  }, [staff]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle className="flex items-center justify-between">
        <Typography variant="h6" component="div" className="flex items-center gap-2">
          <Edit className="w-5 h-5" />
          Edit Staff
        </Typography>
        <IconButton onClick={onClose} size="small">
          <X className="w-4 h-4" />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box className="flex flex-col gap-4">
          <TextField
            label="Full Name"
            fullWidth
            value={formData.fullName}
            onChange={handleChange('fullName')}
            error={!!errors.fullName}
            helperText={errors.fullName}
            size="small"
            placeholder="Enter full name"
          />
          <TextField
            label="Username"
            fullWidth
            value={formData.username}
            onChange={handleChange('username')}
            error={!!errors.username}
            helperText={errors.username || 'Username can only contain letters, numbers, dots, and underscores'}
            size="small"
            placeholder="Enter username"
          />
          <Box className="bg-gray-50 p-3 rounded-md">
            <Typography variant="caption" color="text.secondary">
              Note: Only name and username can be edited. Other fields are managed by the system.
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};
