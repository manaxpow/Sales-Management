import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Snackbar,
} from '@mui/material';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StaffService }  from '../../../../services/staff.service';

interface CreateStaffFormData {
  username: string;
  fullName: string;
  password: string;
  confirmPassword: string;
  role?: 'admin' | 'staff';
}

interface FormErrors {
  username?: string;
  fullName?: string;
  password?: string;
  confirmPassword?: string;
  role?: string;
}

const CreateStaffForm: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<CreateStaffFormData>({
    username: '',
    fullName: '',
    password: '',
    confirmPassword: '',
    role: 'staff',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // --- Validation ---
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.username.trim()) newErrors.username = 'Username is required';
    else if (formData.username.length < 3) newErrors.username = 'Username must be at least 3 characters';
    else if (!/^[a-zA-Z0-9._]+$/.test(formData.username))
      newErrors.username = 'Username can only contain letters, numbers, dots, underscores';

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    else if (formData.fullName.length < 2) newErrors.fullName = 'Full name must be at least 2 characters';

    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password))
      newErrors.password = 'Password must contain uppercase, lowercase, and number';

    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- Handle input ---
  const handleChange = (field: keyof CreateStaffFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
    setSubmitError('');
  };

  // --- Submit form ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      setSubmitError('');

      const res = await StaffService.create({
        username: formData.username,
        fullName: formData.fullName,
        password: formData.password,
        role: formData.role || 'staff',
      });

      if (res.success) {
        setSnackbar({ open: true, message: `Staff ${formData.fullName} created successfully`, severity: 'success' });
        setTimeout(() => {
          navigate('/admin/users');
        }, 1500);
      } else {
        setSubmitError(res.message || 'Failed to create staff');
      }
    } catch (err: any) {
      setSubmitError(err?.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // --- Cancel ---
  const handleCancel = () => {
    navigate('/admin/users');
  };

  return (
    <Box className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg" sx={{ borderRadius: 2 }}>
        <CardContent className="p-8">
          {/* Header */}
          <Box className="mb-6 flex items-center gap-3">
            <IconButton onClick={handleCancel} size="small" className="text-gray-500">
              <ArrowLeft className="w-5 h-5" />
            </IconButton>
            <Typography variant="h4" component="h1" className="text-center flex-1">
              Create New Staff
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" className="text-center mb-4">
            Fill in the information below to create a new staff account
          </Typography>

          {/* General error */}
          {submitError && <Alert severity="error" className="mb-4">{submitError}</Alert>}

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit} className="flex flex-col gap-4">
            <TextField
              fullWidth
              label="Username"
              value={formData.username}
              onChange={handleChange('username')}
              error={!!errors.username}
              helperText={errors.username}
              disabled={isLoading}
              placeholder="Enter username"
            />

            <TextField
              fullWidth
              label="Full Name"
              value={formData.fullName}
              onChange={handleChange('fullName')}
              error={!!errors.fullName}
              helperText={errors.fullName}
              disabled={isLoading}
              placeholder="Enter full name"
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange('password')}
              error={!!errors.password}
              helperText={errors.password || 'Must contain uppercase, lowercase, and number'}
              disabled={isLoading}
              placeholder="Enter password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <EyeOff /> : <Eye />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange('confirmPassword')}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              disabled={isLoading}
              placeholder="Confirm password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                      {showConfirmPassword ? <EyeOff /> : <Eye />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box className="flex flex-col gap-3 pt-4">
              <Button type="submit" fullWidth variant="contained" disabled={isLoading}>
                {isLoading ? <CircularProgress size={20} /> : 'Create Staff'}
              </Button>
              <Button type="button" fullWidth variant="outlined" onClick={handleCancel}>
                Cancel
              </Button>
            </Box>
          </Box>

          {/* Form Requirements */}
          <Box className="mt-6 p-4 bg-blue-50 rounded-lg">
            <Typography variant="caption" color="text.secondary" className="block mb-2">
              <strong>Requirements:</strong>
            </Typography>
            <Typography variant="caption" color="text.secondary" className="block">
              • Username: 3+ characters, letters, numbers, dots, underscores only
            </Typography>
            <Typography variant="caption" color="text.secondary" className="block">
              • Full Name: 2+ characters
            </Typography>
            <Typography variant="caption" color="text.secondary" className="block">
              • Password: 6+ characters with uppercase, lowercase, and number
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateStaffForm;
