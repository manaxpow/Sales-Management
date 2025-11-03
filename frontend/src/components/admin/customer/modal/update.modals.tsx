import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import { Edit, X } from "lucide-react";
import type {
  CustomerResponse,
  UpdateCustomerRequest,
} from "../../../../types/customer.types";

interface EditCustomerModalProps {
  customer: CustomerResponse | null;
  open: boolean;
  onClose: () => void;
  onSave: (data: UpdateCustomerRequest) => void;
}

export const EditCustomerModal = ({
  customer,
  open,
  onClose,
  onSave,
}: EditCustomerModalProps) => {
  const [formData, setFormData] = useState<UpdateCustomerRequest>({
    name: customer?.name || "",
    phone: customer?.phone || "",
    email: customer?.email || "",
    address: customer?.address || "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof UpdateCustomerRequest, string>>
  >({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof UpdateCustomerRequest, string>> = {};

    if (!formData.name?.trim()) newErrors.name = "Tên khách hàng là bắt buộc";

    if (!formData.email?.trim()) newErrors.email = "Email là bắt buộc";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Email không hợp lệ";

    if (!formData.phone?.trim()) newErrors.phone = "Số điện thoại là bắt buộc";
    else if (!/^[0-9+\-\s()]+$/.test(formData.phone))
      newErrors.phone =
        "Số điện thoại chỉ được chứa số, +, -, khoảng trắng, hoặc ()";

    if (!formData.address?.trim()) newErrors.address = "Địa chỉ là bắt buộc";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        address: formData.address.trim(),
      });
      onClose();
    }
  };

  const handleChange =
    (field: keyof UpdateCustomerRequest) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  // Reset form khi customer thay đổi
  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || "",
        phone: customer.phone || "",
        email: customer.email || "",
        address: customer.address || "",
      });
      setErrors({});
    }
  }, [customer]);

  if (!customer) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle className="flex items-center justify-between">
        <Typography
          variant="h6"
          component="div"
          className="flex items-center gap-2"
        >
          <Edit className="w-5 h-5" />
          Chỉnh sửa khách hàng
        </Typography>
        <IconButton onClick={onClose} size="small">
          <X className="w-4 h-4" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box className="flex flex-col gap-4">
          <TextField
            label="Tên khách hàng *"
            fullWidth
            value={formData.name}
            onChange={handleChange("name")}
            error={!!errors.name}
            helperText={errors.name}
            size="small"
            placeholder="Nhập tên khách hàng"
          />

          <TextField
            label="Email *"
            fullWidth
            value={formData.email}
            onChange={handleChange("email")}
            error={!!errors.email}
            helperText={errors.email}
            size="small"
            placeholder="vd: customer@example.com"
          />

          <TextField
            label="Số điện thoại *"
            fullWidth
            value={formData.phone}
            onChange={handleChange("phone")}
            error={!!errors.phone}
            helperText={errors.phone}
            size="small"
            placeholder="vd: 0912345678"
          />

          <TextField
            label="Địa chỉ *"
            fullWidth
            value={formData.address}
            onChange={handleChange("address")}
            error={!!errors.address}
            helperText={errors.address}
            size="small"
            multiline
            minRows={2}
            placeholder="Nhập địa chỉ"
          />

          <Box className="bg-gray-50 p-3 rounded-md">
            <Typography variant="caption" color="text.secondary">
              Lưu ý: Tất cả trường đều bắt buộc. Các trường hệ thống (ví dụ
              <code> createdAt </code>) được quản lý bởi backend.
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSubmit} variant="contained">
          Lưu thay đổi
        </Button>
      </DialogActions>
    </Dialog>
  );
};
