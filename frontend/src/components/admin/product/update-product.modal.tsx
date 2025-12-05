import React, { useEffect, useState } from "react";
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
  FormHelperText,
  InputAdornment,
  CircularProgress,
  FormGroup,
  FormControlLabel,
  Switch,
  IconButton,
} from "@mui/material";
import { X, Edit, Package, DollarSign, CheckCircle } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateProductSchema,
  type UpdateProductType,
} from "../../../common/helpers/product.validate";
import { useFetchData } from "../../../hooks/fetchData";
import { CategoryService } from "../../../services/category.service";
import { getSuppliers } from "../../../services/supplier.service";
import type { Supplier } from "../../../types/supplier.types";
import { toast } from "react-toastify";
import type { ProductResponse } from "../../../types/product.type";
import { UpdateProductService } from "../../../services/product.service";

const units = ["Chiếc", "Cặp", "Bộ", "Cái", "Hộp", "Gói"];

interface EditProductModalProps {
  open: boolean;
  onClose: () => void;
  product: ProductResponse | null;
  onSave: () => void;
  loading?: boolean;
}

const EditProductModal: React.FC<EditProductModalProps> = ({
  open,
  onClose,
  product,
  onSave,
  loading = false,
}) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateProductType>({
    resolver: zodResolver(updateProductSchema),
    mode: "onBlur",
    defaultValues: {
      productName: "",
      categoryId: 0,
      supplierId: 0,
      price: undefined,
      unit: "",
      status: 1,
    },
  });

  const { data: categories } = useFetchData(CategoryService.getAll, {});
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  // const [imagePreview, setImagePreview] = useState<string | null>(null);
  // const [, setImageFile] = useState<File | null>(null);

  // Load supplier list
  const fetchSuppliers = async () => {
    const response = await getSuppliers();
    if (response.success) {
      setSuppliers(response.data || []);
    } else {
      console.error(
        "API Error Response:",
        response.message || "No message provided"
      );
      setSuppliers([]);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  // Reset form khi mở modal
  useEffect(() => {
    console.log(product);

    if (product && open) {
      reset({
        productName: product.productName,
        categoryId: Number(product.categoryId) || 0,
        supplierId: Number(product.supplierId) || 0,
        price: product.price,
        unit: product.unit,
        status: product.status,
      });
      // setImagePreview(null);
      // setImageFile(null);
    }
  }, [product, open, reset]);

  // const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (!file) return;

  //   if (!file.type.startsWith("image/")) {
  //     alert("Vui lòng chọn file ảnh hợp lệ (JPG, PNG, WebP)");
  //     return;
  //   }
  //   if (file.size > 5 * 1024 * 1024) {
  //     alert("Kích thước ảnh không được vượt quá 5MB");
  //     return;
  //   }

  //   const reader = new FileReader();
  //   reader.onloadend = () => {
  //     setImagePreview(reader.result as string);
  //   };
  //   reader.readAsDataURL(file);
  //   setImageFile(file);
  // };

  const onSubmit = async (data: UpdateProductType) => {
    try {
      if (product) {
        const payload = {
          ProductId: product.productId,
          ProductName: data.productName,
          CategoryId: data.categoryId,
          SupplierId: data.supplierId,
          Price: data.price,
          Unit: data.unit,
          Status: data.status,
        };

        const res = await UpdateProductService(payload);

        if (res.success) {
          toast.success("Update product success");
          onSave();
          onClose();
        } else {
          toast.error("Update fail with mess: " + res.message);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi cập nhật sản phẩm");
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className="flex items-center justify-between bg-gray-50 border-b">
        <div className="flex items-center gap-2">
          <Edit className="w-5 h-5 text-blue-600" />
          <Typography variant="h6" className="font-bold text-gray-900">
            Chỉnh sửa sản phẩm
          </Typography>
        </div>
        <IconButton onClick={onClose} disabled={loading || isSubmitting}>
          <X className="w-4 h-4 text-gray-500" />
        </IconButton>
      </DialogTitle>

      <DialogContent className="p-6 space-y-6">
        {/* Ảnh sản phẩm */}
        {/* <Box>
          <Typography
            variant="subtitle1"
            className="mb-3 font-medium flex items-center gap-2 text-gray-900"
          >
            <ImageIcon className="w-5 h-5 text-blue-600" />
            Hình ảnh sản phẩm
          </Typography>

          <label htmlFor="image-upload" className="block cursor-pointer">
            <Box className="relative w-64 h-64 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden hover:border-blue-400 transition-all duration-200 bg-gray-50">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Box className="flex flex-col items-center justify-center h-full text-gray-500">
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
        </Box> */}

        {/* Form thông tin */}
        <Box display={"flex"} flexDirection={"column"} gap={3} mt={5}>
          {/* Tên sản phẩm */}
          <TextField
            fullWidth
            label="Tên sản phẩm *"
            {...register("productName")}
            error={!!errors.productName}
            helperText={errors.productName?.message}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Package className="w-4 h-4 text-gray-500" />
                </InputAdornment>
              ),
            }}
          />

          {/* Category & Supplier */}
          <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormControl fullWidth error={!!errors.categoryId}>
              <InputLabel>Danh mục *</InputLabel>
              <Controller
                name="categoryId"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Danh mục *"
                    value={field.value === 0 ? "" : field.value}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  >
                    <MenuItem value="">Chọn danh mục</MenuItem>
                    {(categories ?? []).map((cat) => (
                      <MenuItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              <FormHelperText>{errors.categoryId?.message}</FormHelperText>
            </FormControl>

            <FormControl fullWidth error={!!errors.supplierId}>
              <InputLabel>Nhà cung cấp *</InputLabel>
              <Controller
                name="supplierId"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Nhà cung cấp *"
                    value={field.value === 0 ? "" : field.value}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  >
                    <MenuItem value="">Chọn nhà cung cấp</MenuItem>
                    {suppliers.map((sup) => (
                      <MenuItem key={sup.id} value={sup.id}>
                        {sup.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              <FormHelperText>{errors.supplierId?.message}</FormHelperText>
            </FormControl>
          </Box>

          {/* Giá & Đơn vị */}
          <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              fullWidth
              label="Giá bán *"
              type="number"
              {...register("price", { valueAsNumber: true })}
              error={!!errors.price}
              helperText={errors.price?.message || "Đơn vị: VND"}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DollarSign className="w-4 h-4 text-red-500" />
                  </InputAdornment>
                ),
                inputProps: { min: 0, step: "1000" },
              }}
            />

            <FormControl fullWidth error={!!errors.unit}>
              <InputLabel>Đơn vị</InputLabel>
              <Controller
                name="unit"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Đơn vị"
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value)}
                  >
                    <MenuItem value="">Chọn đơn vị</MenuItem>
                    {units.map((u) => (
                      <MenuItem key={u} value={u}>
                        {u}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              <FormHelperText>{errors.unit?.message}</FormHelperText>
            </FormControl>
          </Box>

          {/* Trạng thái */}
          <Box className="bg-gray-50 p-4 rounded-lg">
            <Typography
              variant="subtitle1"
              className="mb-3 font-medium flex items-center gap-2 text-gray-900"
            >
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              Trạng thái
            </Typography>

            <Controller
              name="status"
              control={control}
              render={({ field: { value, onChange } }) => (
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={value === 1}
                        onChange={(e) => onChange(e.target.checked ? 1 : 2)}
                      />
                    }
                    label={
                      <Typography>
                        {value === 1 ? "Hoạt động" : "Ngừng kinh doanh"}
                      </Typography>
                    }
                  />
                </FormGroup>
              )}
            />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions className="p-4 bg-gray-50 border-t">
        <Button
          onClick={onClose}
          startIcon={<X className="w-4 h-4" />}
          variant="outlined"
          disabled={loading || isSubmitting}
        >
          Hủy
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          startIcon={
            isSubmitting ? (
              <CircularProgress size={20} className="text-white" />
            ) : (
              <Edit className="w-4 h-4" />
            )
          }
          variant="contained"
          color="primary"
          disabled={isSubmitting || loading}
        >
          {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProductModal;
