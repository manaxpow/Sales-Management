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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import { Edit, X } from "lucide-react";
import type { SimpleCustomer } from "../customer.pagination";
import type { SimpleCustomerFormData } from "../customer.management";

interface EditCustomerModalProps {
  customer: SimpleCustomer | null;
  open: boolean;
  onClose: () => void;
  onSave: (data: SimpleCustomerFormData) => void;
}

export const EditCustomerModal = ({
  customer,
  open,
  onClose,
  onSave,
}: EditCustomerModalProps) => {
  const [formData, setFormData] = useState<SimpleCustomerFormData>({
    name: customer?.name || "",
    phone: customer?.phone ?? "",
    email: customer?.email ?? "",
    address: customer?.address ?? "",
    status: customer?.status ?? "active",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof SimpleCustomerFormData, string>>
  >({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof SimpleCustomerFormData, string>> = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Tên khách hàng là bắt buộc";
    }

    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (formData.phone && !/^[0-9+\-\s()]+$/.test(formData.phone)) {
      newErrors.phone =
        "Số điện thoại chỉ được chứa số, +, -, khoảng trắng, hoặc ()";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave({
        name: formData.name.trim(),
        phone: formData.phone?.trim() || undefined,
        email: formData.email?.trim() || undefined,
        address: formData.address?.trim() || undefined,
        status: formData.status,
      });
      onClose();
    }
  };

  const handleChange =
    (field: keyof SimpleCustomerFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const handleStatusChange = (e: SelectChangeEvent) => {
    setFormData((prev) => ({
      ...prev,
      status: e.target.value as "active" | "inactive",
    }));
  };

  // Reset form khi customer thay đổi
  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || "",
        phone: customer.phone ?? "",
        email: customer.email ?? "",
        address: customer.address ?? "",
        status: customer.status ?? "active",
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
            label="Email"
            fullWidth
            value={formData.email}
            onChange={handleChange("email")}
            error={!!errors.email}
            helperText={errors.email}
            size="small"
            placeholder="vd: customer@example.com"
          />

          <TextField
            label="Số điện thoại"
            fullWidth
            value={formData.phone}
            onChange={handleChange("phone")}
            error={!!errors.phone}
            helperText={errors.phone}
            size="small"
            placeholder="vd: 0912345678"
          />

          <TextField
            label="Địa chỉ"
            fullWidth
            value={formData.address}
            onChange={handleChange("address")}
            size="small"
            multiline
            minRows={2}
            placeholder="Nhập địa chỉ"
          />

          <FormControl size="small">
            <InputLabel id="status-label">Trạng thái</InputLabel>
            <Select
              labelId="status-label"
              value={formData.status ?? "active"}
              label="Trạng thái"
              onChange={handleStatusChange}
              sx={{
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#d1d5db",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#9ca3af",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#3b82f6",
                  borderWidth: 2,
                },
              }}
            >
              <MenuItem value="active">Đang hoạt động</MenuItem>
              <MenuItem value="inactive">Ngừng hoạt động</MenuItem>
            </Select>
          </FormControl>

          <Box className="bg-gray-50 p-3 rounded-md">
            <Typography variant="caption" color="text.secondary">
              Lưu ý: Bạn có thể chỉnh sửa tên, email, SĐT, địa chỉ và trạng
              thái. Các trường hệ thống khác (vd.
              <code> created_at</code>) được quản lý bởi backend.
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
