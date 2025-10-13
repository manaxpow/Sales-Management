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
} from '@mui/material';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';

// Form data interface
interface CreateStaffFormData {
  username: string;
  fullName: string;
  password: string;
  confirmPassword: string;
}

// Form validation errors interface
interface FormErrors {
  username?: string;
  fullName?: string;
  password?: string;
  confirmPassword?: string;
}

interface CreateStaffFormProps {
  onSubmit?: (data: CreateStaffFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

const CreateStaffForm = ({
  onSubmit,
  onCancel,
  isLoading = false,
}: CreateStaffFormProps) => {
  // Form state
  const [formData, setFormData] = useState<CreateStaffFormData>({
    username: '',
    fullName: '',
    password: '',
    confirmPassword: '',
  });

  // Validation errors state
  const [errors, setErrors] = useState<FormErrors>({});

  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // General error state
  const [submitError, setSubmitError] = useState<string>('');

  // Validation rules
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9._]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, dots, and underscores';
    }

    // Full name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (field: keyof CreateStaffFormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }

    // Clear general error when user makes changes
    if (submitError) {
      setSubmitError('');
    }
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setSubmitError('');
      if (onSubmit) {
        await onSubmit(formData);
      }
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'An error occurred while creating staff');
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      // Reset form if no cancel handler provided
      setFormData({
        username: '',
        fullName: '',
        password: '',
        confirmPassword: '',
      });
      setErrors({});
      setSubmitError('');
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Box className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card 
        className="w-full max-w-md shadow-lg"
        sx={{
          borderRadius: 2,
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        }}
      >
        <CardContent className="p-8">
          {/* Header */}
          <Box className="mb-6">
            <Box className="flex items-center gap-3 mb-4">
              {onCancel && (
                <IconButton
                  onClick={handleCancel}
                  className="text-gray-500 hover:text-gray-700"
                  size="small"
                >
                  <ArrowLeft className="w-5 h-5" />
                </IconButton>
              )}
              <Typography 
                variant="h4" 
                component="h1" 
                className="text-2xl font-bold text-gray-900 text-center flex-1"
              >
                Create New Staff
              </Typography>
            </Box>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              className="text-center"
            >
              Fill in the information below to create a new staff account
            </Typography>
          </Box>

          {/* General Error Alert */}
          {submitError && (
            <Alert 
              severity="error" 
              className="mb-4"
              onClose={() => setSubmitError('')}
            >
              {submitError}
            </Alert>
          )}

          {/* Form */}
          <Box 
            component="form" 
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
          >
            {/* Username Field */}
            <TextField
              fullWidth
              label="Username"
              value={formData.username}
              onChange={handleInputChange('username')}
              error={!!errors.username}
              helperText={errors.username}
              disabled={isLoading}
              placeholder="Enter username"
              variant="outlined"
              size="medium"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />

            {/* Full Name Field */}
            <TextField
              fullWidth
              label="Full Name"
              value={formData.fullName}
              onChange={handleInputChange('fullName')}
              error={!!errors.fullName}
              helperText={errors.fullName}
              disabled={isLoading}
              placeholder="Enter full name"
              variant="outlined"
              size="medium"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />

            {/* Password Field */}
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleInputChange('password')}
              error={!!errors.password}
              helperText={errors.password || 'Must contain uppercase, lowercase, and number'}
              disabled={isLoading}
              placeholder="Enter password"
              variant="outlined"
              size="medium"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={togglePasswordVisibility}
                      edge="end"
                      disabled={isLoading}
                      className="text-gray-500"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />

            {/* Confirm Password Field */}
            <TextField
              fullWidth
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleInputChange('confirmPassword')}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              disabled={isLoading}
              placeholder="Confirm password"
              variant="outlined"
              size="medium"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={toggleConfirmPasswordVisibility}
                      edge="end"
                      disabled={isLoading}
                      className="text-gray-500"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />

            {/* Action Buttons */}
            <Box className="flex flex-col gap-3 pt-4">
              {/* Submit Button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isLoading}
                size="large"
                className="normal-case"
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  backgroundColor: '#3b82f6',
                  '&:hover': {
                    backgroundColor: '#2563eb',
                  },
                  '&.Mui-disabled': {
                    backgroundColor: '#9ca3af',
                  },
                }}
              >
                {isLoading ? (
                  <Box className="flex items-center justify-center gap-2">
                    <CircularProgress size={20} className="text-white" />
                    <span>Creating Staff...</span>
                  </Box>
                ) : (
                  'Create Staff'
                )}
              </Button>

              {/* Cancel Button */}
              <Button
                fullWidth
                variant="outlined"
                disabled={isLoading}
                size="large"
                onClick={handleCancel}
                className="normal-case"
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  borderColor: '#d1d5db',
                  color: '#6b7280',
                  '&:hover': {
                    borderColor: '#9ca3af',
                    backgroundColor: '#f9fafb',
                  },
                }}
              >
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
    </Box>
  );
};

export default CreateStaffForm;
