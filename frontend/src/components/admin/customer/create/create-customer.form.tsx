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
} from "@mui/material";
import type { CreateCustomerRequest } from "../../../../types/customer.types";
import { customerService } from "../../../../services/customer.service";
import { toast } from "react-toastify";

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

type RequiredCreateCustomerRequest = Omit<CreateCustomerRequest, "status"> & {
  name: string;
  email: string;
  phone: string;
  address: string;
};

type FormTouched = Partial<
  Record<keyof RequiredCreateCustomerRequest, boolean>
>;

const CreateCustomerForm = () => {
  const [formData, setFormData] = useState<RequiredCreateCustomerRequest>({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // Validation errors state
  const [errors, setErrors] = useState<FormErrors>({});
  // Track fields đã chạm
  const [touched, setTouched] = useState<FormTouched>({});

  // General error state
  const [submitError, setSubmitError] = useState<string>("");

  const [isLoading, setIsLoading] = useState(false);

  // ---- Validators: tất cả đều bắt buộc + format cơ bản cho email/phone ----
  const validateField = (
    field: keyof RequiredCreateCustomerRequest,
    value: string
  ): string | undefined => {
    const v = value?.trim() ?? "";
    switch (field) {
      case "name":
        if (!v) return "Tên khách hàng là bắt buộc";
        if (v.length < 2) return "Tên phải có ít nhất 2 ký tự";
        return;
      case "email":
        if (!v) return "Email khách hàng là bắt buộc";
        if (!/^\S+@\S+\.\S+$/.test(v)) return "Email không hợp lệ";
        return;
      case "phone":
        if (!v) return "Số điện thoại khách hàng là bắt buộc";
        if (!/^[0-9+\-\s()]+$/.test(v))
          return "Số điện thoại chỉ chứa số, +, -, khoảng trắng hoặc ()";
        return;
      case "address":
        if (!v) return "Địa chỉ là bắt buộc";
        return;
      default:
        return;
    }
  };

  const validateAll = (data: RequiredCreateCustomerRequest): FormErrors => {
    const next: FormErrors = {};
    (Object.keys(data) as (keyof RequiredCreateCustomerRequest)[]).forEach(
      (k) => {
        const msg = validateField(k, String(data[k] ?? ""));
        if (msg) next[k] = msg;
      }
    );
    return next;
  };

  // Handle input changes
  const handleInputChange =
    (field: keyof RequiredCreateCustomerRequest) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setFormData((prev) => ({ ...prev, [field]: value }));

      if (touched[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: validateField(field, value),
        }));
      }

      if (submitError) setSubmitError("");
    };

  const handleBlur =
    (field: keyof RequiredCreateCustomerRequest) =>
    (event: React.FocusEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setTouched((prev) => ({ ...prev, [field]: true }));
      setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }));
    };

  // Submit
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setTouched({
      name: true,
      email: true,
      phone: true,
      address: true,
    });

    const nextErrors = validateAll(formData);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    setSubmitError("");
    setIsLoading(true);
    const res = await customerService.create({
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
    });

    if (res.success) {
      toast("add success");
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
      });
    } else {
      setSubmitError(res.message);
    }
    setIsLoading(false);
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
              Nhập đầy đủ thông tin bên dưới để tạo khách hàng
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
              label="Email *"
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
              label="Số điện thoại *"
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
              label="Địa chỉ *"
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
              • Email: bắt buộc, đúng định dạng (ví dụ: user@domain.com)
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              className="block"
            >
              • Số điện thoại: bắt buộc, chỉ chứa số, +, -, khoảng trắng hoặc ()
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              className="block"
            >
              • Địa chỉ: bắt buộc
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CreateCustomerForm;
