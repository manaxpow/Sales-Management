import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
  FormHelperText,
  InputAdornment,
  CircularProgress,
  FormControlLabel,
  Switch,
  FormGroup,
} from "@mui/material";
import {
  X,
  Plus,
  Image as ImageIcon,
  Package,
  DollarSign,
  Upload,
  CheckCircle,
  Truck,
} from "lucide-react";

export interface NewProductFormData {
  name: string;
  category: string;
  supplier: string;
  status: "active" | "inactive";
  price: number;
  unit: string;
  imageFile?: File;
}

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (newProduct: NewProductFormData) => Promise<void>;
  loading?: boolean;
}

const categories = [
  "Điện thoại",
  "Laptop",
  "Máy tính bảng",
  "Tai nghe",
  "Phụ kiện",
];

const units = ["Chiếc", "Cặp", "Bộ", "Cái", "Hộp", "Gói"];

const AddProductModal: React.FC<AddProductModalProps> = ({
  open,
  onClose,
  onSave,
  loading = false,
}) => {
  const [formData, setFormData] = useState<NewProductFormData>({
    name: "",
    category: "",
    supplier: "",
    status: "active",
    price: 0,
    unit: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      // Reset form khi mở modal
      setFormData({
        name: "",
        category: "",
        supplier: "",
        status: "active",
        price: 0,
        unit: "",
      });
      setImagePreview(null);
      setImageFile(null);
      setErrors({});
    }
  }, [open]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Tên sản phẩm là bắt buộc";
    }

    if (formData.name?.trim().length < 3) {
      newErrors.name = "Tên sản phẩm phải có ít nhất 3 ký tự";
    }

    if (!formData.category) {
      newErrors.category = "Vui lòng chọn danh mục";
    }

    if (!formData.supplier?.trim()) {
      newErrors.supplier = "Nhà cung cấp là bắt buộc";
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = "Giá phải lớn hơn 0";
    }

    if (!formData.unit) {
      newErrors.unit = "Vui lòng chọn đơn vị";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = <K extends keyof NewProductFormData>(
    field: K,
    value: NewProductFormData[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Vui lòng chọn file ảnh hợp lệ (JPG, PNG, WebP)");
        event.target.value = "";
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Kích thước ảnh không được vượt quá 5MB");
        event.target.value = "";
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const submitData: NewProductFormData = {
        ...formData,
        ...(imageFile && { imageFile }),
      };

      await onSave(submitData);
      onClose();
    } catch (error) {
      console.error("Lỗi tạo sản phẩm:", error);
      alert("Có lỗi xảy ra khi tạo sản phẩm. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!loading && !isSubmitting) {
      onClose();
    }
  };

  const hasErrors = Object.values(errors).some((error) => error);
  const isDisabled = loading || isSubmitting || hasErrors;

  if (!open) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle className="flex items-center justify-between bg-gray-50 border-b">
        <div className="flex items-center gap-2">
          <Plus className="w-5 h-5 text-green-600" />
          <Typography variant="h6" className="font-bold text-gray-900">
            Thêm sản phẩm mới
          </Typography>
        </div>
        <IconButton
          onClick={handleClose}
          size="small"
          disabled={loading || isSubmitting}
          className="text-gray-500 hover:bg-gray-200"
        >
          <X className="w-4 h-4" />
        </IconButton>
      </DialogTitle>

      <DialogContent className="p-6">
        <Box className="space-y-6">
          <Box>
            <Typography
              variant="subtitle1"
              className="mb-3 font-medium flex items-center gap-2 text-gray-900"
            >
              <ImageIcon className="w-5 h-5 text-blue-600" />
              <span>Hình ảnh sản phẩm</span>
            </Typography>
            <label htmlFor="image-upload" className="block cursor-pointer">
              <Box className="relative w-64 h-64 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden hover:border-blue-400 transition-all duration-200 bg-gray-50">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Xem trước sản phẩm"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Box className="flex flex-col items-center justify-center h-full text-gray-500 hover:text-gray-700 transition-colors">
                    <Upload className="w-8 h-8 mb-2 text-gray-400" />
                    <Typography variant="body2" className="text-sm">
                      Click để tải ảnh lên
                    </Typography>
                  </Box>
                )}
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </Box>
            </label>
            <FormHelperText className="mt-2 text-sm text-gray-600">
              Hỗ trợ JPG, PNG, WebP. Tối đa 5MB. <em>Tùy chọn</em>
            </FormHelperText>
          </Box>

          <Box className="">
            <TextField
              fullWidth
              label="Tên sản phẩm *"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
              variant="outlined"
              disabled={isSubmitting}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Package className="w-4 h-4 text-gray-500" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormControl fullWidth error={!!errors.category} variant="outlined">
              <InputLabel>Danh mục *</InputLabel>
              <Select
                value={formData.category}
                onChange={(e) =>
                  handleInputChange("category", e.target.value as string)
                }
                label="Danh mục *"
                disabled={isSubmitting}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
              {errors.category && (
                <FormHelperText error>{errors.category}</FormHelperText>
              )}
            </FormControl>

            <TextField
              fullWidth
              label="Nhà cung cấp *"
              value={formData.supplier}
              onChange={(e) => handleInputChange("supplier", e.target.value)}
              error={!!errors.supplier}
              helperText={errors.supplier}
              variant="outlined"
              disabled={isSubmitting}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Truck className="w-4 h-4 text-gray-500" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              fullWidth
              label="Giá bán *"
              type="number"
              value={formData.price || ""}
              onChange={(e) => {
                const value =
                  e.target.value === "" ? 0 : parseFloat(e.target.value);
                handleInputChange("price", value);
              }}
              error={!!errors.price}
              helperText={errors.price || "Đơn vị: VND"}
              variant="outlined"
              disabled={isSubmitting}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DollarSign className="w-4 h-4 text-red-500" />
                  </InputAdornment>
                ),
                inputProps: { min: 0, step: "1000" },
              }}
              InputLabelProps={{ shrink: true }}
            />

            <FormControl fullWidth error={!!errors.unit} variant="outlined">
              <InputLabel>Đơn vị *</InputLabel>
              <Select
                value={formData.unit}
                onChange={(e) =>
                  handleInputChange("unit", e.target.value as string)
                }
                label="Đơn vị *"
                disabled={isSubmitting}
              >
                {units.map((unit) => (
                  <MenuItem key={unit} value={unit}>
                    {unit}
                  </MenuItem>
                ))}
              </Select>
              {errors.unit && (
                <FormHelperText error>{errors.unit}</FormHelperText>
              )}
            </FormControl>
          </Box>

          <Box className="bg-gray-50 p-4 rounded-lg">
            <Typography
              variant="subtitle1"
              className="mb-3 font-medium flex items-center gap-2 text-gray-900"
            >
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span>Trạng thái mặc định</span>
            </Typography>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.status === "active"}
                    onChange={(e) =>
                      handleInputChange(
                        "status",
                        e.target.checked ? "active" : "inactive"
                      )
                    }
                    color="primary"
                    disabled={isSubmitting}
                  />
                }
                label={
                  <Box className="flex items-center gap-2">
                    <CheckCircle
                      className={`w-4 h-4 ${
                        formData.status === "active"
                          ? "text-emerald-600"
                          : "text-gray-400"
                      }`}
                    />
                    <Typography variant="body1" className="text-gray-700">
                      {formData.status === "active"
                        ? "Hoạt động"
                        : "Ngừng kinh doanh"}
                    </Typography>
                  </Box>
                }
              />
            </FormGroup>
            <Chip
              label={
                formData.status === "active" ? "Hoạt động" : "Ngừng kinh doanh"
              }
              color={formData.status === "active" ? "success" : "default"}
              size="small"
              className="mt-2"
              variant={formData.status === "active" ? "filled" : "outlined"}
            />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions className="p-4 bg-gray-50 border-t flex justify-between">
        <Button
          onClick={handleClose}
          disabled={loading || isSubmitting}
          startIcon={<X className="w-4 h-4" />}
          variant="outlined"
          className="text-gray-600 hover:bg-gray-100 border-gray-300"
        >
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isDisabled}
          startIcon={
            isSubmitting ? (
              <CircularProgress size={20} className="text-white" />
            ) : (
              <Plus className="w-4 h-4" />
            )
          }
          className="bg-green-600 hover:bg-green-700 text-white min-w-[140px] shadow-sm"
        >
          {isSubmitting ? "Đang tạo..." : "Tạo sản phẩm"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProductModal;
