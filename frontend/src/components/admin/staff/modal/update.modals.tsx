import { useState, useEffect, type ChangeEvent } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  type SelectChangeEvent,
} from '@mui/material';
import { Edit, X } from 'lucide-react';

interface SimpleStaff {
  id: number;
  username: string;
  fullName: string;
  role: 'admin' | 'staff';
}

interface SimpleStaffFormData {
  fullName: string;
  role: 'admin' | 'staff';
}

interface EditStaffModalProps {
  staff: SimpleStaff | null;
  open: boolean;
  onClose: () => void;
  onSave: (data: SimpleStaff & SimpleStaffFormData) => void;
}

export const EditStaffModal = ({
  staff,
  open,
  onClose,
  onSave,
}: EditStaffModalProps) => {
  const [formData, setFormData] = useState<SimpleStaffFormData>({
    fullName: staff?.fullName || '',
    role: staff?.role || 'staff',
  });

  const [errors, setErrors] = useState<Partial<SimpleStaffFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<SimpleStaffFormData> = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm() && staff) {
      onSave({
        id: staff.id,
        username: staff.username, // vẫn giữ username để backend không bị undefined
        fullName: formData.fullName,
        role: formData.role,
      });
      onClose();
    }
  };

  const handleChange =
    (field: keyof SimpleStaffFormData) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value as string,
      }));

      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: undefined,
        }));
      }
    };

  useEffect(() => {
    if (staff) {
      setFormData({
        fullName: staff.fullName,
        role: staff.role,
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
            value={staff?.username ?? ''}
            disabled 
            size="small"
          />

          <FormControl fullWidth size="small">
            <InputLabel>Role</InputLabel>
            <Select label="Role" value={formData.role} onChange={handleChange('role')}>
              <MenuItem value="staff">Staff</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>

          <Box className="bg-gray-50 p-3 rounded-md">
            <Typography variant="caption" color="text.secondary">
              Note: You can change the staff role here. Other system fields are managed automatically.
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