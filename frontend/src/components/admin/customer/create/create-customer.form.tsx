import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import { ArrowLeft } from "lucide-react";

export interface CreateCustomerFormData {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  status: "active" | "inactive";
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  status?: string;
}

type FormTouched = Partial<Record<keyof CreateCustomerFormData, boolean>>;

interface CreateCustomerFormProps {
  onSubmit?: (data: CreateCustomerFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

const CreateCustomerForm = ({
  onSubmit,
  onCancel,
  isLoading = false,
}: CreateCustomerFormProps) => {
  // Form state
  const [formData, setFormData] = useState<CreateCustomerFormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    status: "active",
  });

  // Validation errors state
  const [errors, setErrors] = useState<FormErrors>({});
  // Track fields đã chạm
  const [touched, setTouched] = useState<FormTouched>({});

  // General error state
  const [submitError, setSubmitError] = useState<string>("");

  // ---- Validators theo từng field (giữ logic như bạn đang có) ----
  const validateField = (
    field: keyof CreateCustomerFormData,
    value: string
  ): string | undefined => {
    switch (field) {
      case "name":
        if (!value.trim()) return "Tên khách hàng là bắt buộc";
        if (value.trim().length < 2) return "Tên phải có ít nhất 2 ký tự";
        return;
      case "email":
        if (!value) return;
        if (!/^\S+@\S+\.\S+$/.test(value)) return "Email không hợp lệ";
        return;
      case "phone":
        if (!value) return;
        if (!/^[0-9+\-\s()]+$/.test(value))
          return "Số điện thoại chỉ chứa số, +, -, khoảng trắng hoặc ()";
        return;
      case "address":
        // hiện tại không bắt buộc và không ràng buộc thêm
        return;
      default:
        return;
    }
  };

  const validateAll = (data: CreateCustomerFormData): FormErrors => {
    const next: FormErrors = {};
    (Object.keys(data) as (keyof CreateCustomerFormData)[]).forEach((k) => {
      const msg = validateField(k, String(data[k] ?? ""));
      if (msg) next[k] = msg;
    });
    return next;
  };

  // Handle input changes
  const handleInputChange =
    (field: keyof CreateCustomerFormData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setFormData((prev) => ({ ...prev, [field]: value }));

      // Nếu field đã được chạm, validate ngay và cập nhật lỗi của field đó
      if (touched[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: validateField(field, value),
        }));
      }

      if (submitError) setSubmitError("");
    };

  const handleBlur =
    (field: keyof CreateCustomerFormData) =>
    (event: React.FocusEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setTouched((prev) => ({ ...prev, [field]: true }));
      setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }));
    };

  const handleStatusChange = (e: SelectChangeEvent) => {
    const value = e.target.value as "active" | "inactive";
    setFormData((prev) => ({ ...prev, status: value }));
    // không cần lỗi cho status vì luôn hợp lệ (mặc định đã chọn)
    if (submitError) setSubmitError("");
  };

  // Submit
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Đánh dấu tất cả field đã chạm để hiển thị lỗi đồng loạt khi submit
    setTouched({
      name: true,
      email: true,
      phone: true,
      address: true,
      status: true,
    });

    const nextErrors = validateAll(formData);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    try {
      setSubmitError("");
      if (onSubmit) {
        // chuẩn hoá giá trị rỗng -> undefined
        await onSubmit({
          name: formData.name.trim(),
          email: formData.email?.trim() || undefined,
          phone: formData.phone?.trim() || undefined,
          address: formData.address?.trim() || undefined,
          status: formData.status,
        });
      }
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Đã xảy ra lỗi khi tạo khách hàng"
      );
    }
  };

  // Cancel
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      // reset nếu không có handler
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        status: "active",
      });
      setErrors({});
      setTouched({});
      setSubmitError("");
    }
  };

  return (
    <Box className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card
        className="w-full max-w-md shadow-lg"
        sx={{ borderRadius: 2, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
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
                  aria-label="Quay lại"
                >
                  <ArrowLeft className="w-5 h-5" />
                </IconButton>
              )}
              <Typography
                variant="h4"
                component="h1"
                className="text-2xl font-bold text-gray-900 text-center flex-1"
              >
                Tạo khách hàng mới
              </Typography>
            </Box>
            <Typography
              variant="body2"
              color="text.secondary"
              className="text-center"
            >
              Nhập thông tin bên dưới để tạo khách hàng
            </Typography>
          </Box>

          {/* General Error */}
          {submitError && (
            <Alert
              severity="error"
              className="mb-4"
              onClose={() => setSubmitError("")}
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
            <TextField
              fullWidth
              label="Tên khách hàng *"
              value={formData.name}
              onChange={handleInputChange("name")}
              onBlur={handleBlur("name")}
              error={!!touched.name && !!errors.name}
              helperText={touched.name ? errors.name : ""}
              disabled={isLoading}
              placeholder="Nhập tên khách hàng"
              variant="outlined"
              size="medium"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />

            <TextField
              fullWidth
              label="Email"
              value={formData.email}
              onChange={handleInputChange("email")}
              onBlur={handleBlur("email")}
              error={!!touched.email && !!errors.email}
              helperText={touched.email ? errors.email : ""}
              disabled={isLoading}
              placeholder="ví dụ: customer@example.com"
              variant="outlined"
              size="medium"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />

            <TextField
              fullWidth
              label="Số điện thoại"
              value={formData.phone}
              onChange={handleInputChange("phone")}
              onBlur={handleBlur("phone")}
              error={!!touched.phone && !!errors.phone}
              helperText={touched.phone ? errors.phone : ""}
              disabled={isLoading}
              placeholder="ví dụ: 0912345678"
              variant="outlined"
              size="medium"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />

            <TextField
              fullWidth
              label="Địa chỉ"
              value={formData.address}
              onChange={handleInputChange("address")}
              onBlur={handleBlur("address")}
              error={!!touched.address && !!errors.address}
              helperText={touched.address ? errors.address : ""}
              disabled={isLoading}
              placeholder="Nhập địa chỉ"
              variant="outlined"
              size="medium"
              multiline
              minRows={2}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />

            <FormControl size="medium">
              <InputLabel id="status-label">Trạng thái</InputLabel>
              <Select
                labelId="status-label"
                value={formData.status}
                onChange={handleStatusChange}
                label="Trạng thái"
                disabled={isLoading}
                sx={{
                  "& .MuiOutlinedInput-notchedOutline": { borderRadius: 8 },
                }}
              >
                <MenuItem value="active">Đang hoạt động</MenuItem>
                <MenuItem value="inactive">Ngừng hoạt động</MenuItem>
              </Select>
            </FormControl>

            {/* Action Buttons */}
            <Box className="flex flex-col gap-3 pt-4">
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
                  backgroundColor: "#3b82f6",
                  "&:hover": { backgroundColor: "#2563eb" },
                  "&.Mui-disabled": { backgroundColor: "#9ca3af" },
                }}
              >
                {isLoading ? (
                  <Box className="flex items-center justify-center gap-2">
                    <CircularProgress size={20} className="text-white" />
                    <span>Đang tạo khách hàng...</span>
                  </Box>
                ) : (
                  "Tạo khách hàng"
                )}
              </Button>

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
                  borderColor: "#d1d5db",
                  color: "#6b7280",
                  "&:hover": {
                    borderColor: "#9ca3af",
                    backgroundColor: "#f9fafb",
                  },
                }}
              >
                Hủy
              </Button>
            </Box>
          </Box>

          {/* Requirements */}
          <Box className="mt-6 p-4 bg-blue-50 rounded-lg">
            <Typography
              variant="caption"
              color="text.secondary"
              className="block mb-2"
            >
              <strong>Yêu cầu:</strong>
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              className="block"
            >
              • Tên khách hàng: tối thiểu 2 ký tự
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              className="block"
            >
              • Email (không bắt buộc): đúng định dạng, ví dụ: user@domain.com
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              className="block"
            >
              • Số điện thoại (không bắt buộc): chỉ chứa số, +, -, khoảng trắng
              hoặc ()
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CreateCustomerForm;
