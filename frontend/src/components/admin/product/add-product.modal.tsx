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
import { X, Plus, Package, DollarSign, CheckCircle } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createProductSchema,
  type CreateProductType,
} from "../../../common/helpers/product.validate";
import { useFetchData } from "../../../hooks/fetchData";
import { CategoryService } from "../../../services/category.service";
import { getSuppliers } from "../../../services/supplier.service";
import type { Supplier } from "../../../types/supplier.types";
import type { CreateProductRequest } from "../../../types/product.type";
import { createProductService } from "../../../services/product.service";
import { toast } from "react-toastify";

const units = ["Chiếc", "Cặp", "Bộ", "Cái", "Hộp", "Gói"];

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  loading?: boolean;
}

const AddProductModal: React.FC<AddProductModalProps> = ({
  open,
  onClose,
  onSave,
  loading = false,
}) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateProductType>({
    resolver: zodResolver(createProductSchema),
    mode: "onBlur",
    defaultValues: {
      productName: "",
      categoryId: 0,
      supplierId: 0,
      price: undefined,
    },
  });
  const { data: categories } = useFetchData(CategoryService.getAll, {});
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const fetchSuppliers = async () => {
    const response = await getSuppliers();
    if (response.success) {
      setSuppliers(response.data || []);
    } else {
      console.error('API Error Response:', response.message || 'No message provided');
      setSuppliers([]);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  // const [imagePreview, setImagePreview] = useState<string | null>(null);

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
  // };

  const onSubmit = async (data: CreateProductType) => {
    console.log("Form data:", data);
    try {
      const dataCreate: CreateProductRequest = {
        CategoryId: data.categoryId,
        Price: data.price,
        ProductName: data.productName,
        Status: data.status,
        SupplierId: data.supplierId,
        Unit: data.unit,
      };
      const res = await createProductService(dataCreate);
      if (res.success) {
        toast.success("create data success");
        onSave();
        reset();
      } else {
        toast.error("Create data fail with mess:" + res.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className="flex items-center justify-between bg-gray-50 border-b">
        <div className="flex items-center gap-2">
          <Plus className="w-5 h-5 text-green-600" />
          <Typography variant="h6" className="font-bold text-gray-900">
            Thêm sản phẩm mới
          </Typography>
        </div>
        <IconButton onClick={onClose} disabled={loading || isSubmitting}>
          <X className="w-4 h-4 text-gray-500" />
        </IconButton>
      </DialogTitle>

      <DialogContent className="p-6 space-y-6">
        {/* Ảnh */}
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
                  <Select {...field} label="Danh mục *">
                    <MenuItem key={0} value={0}>
                      chọn danh mục
                    </MenuItem>
                    {(categories ?? []).map((cat) => (
                      <MenuItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              <FormHelperText>
                {errors.categoryId?.message as string}
              </FormHelperText>
            </FormControl>

            <FormControl fullWidth error={!!errors.supplierId}>
              <InputLabel>Nhà cung cấp *</InputLabel>
              <Controller
                name="supplierId"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Nhà cung cấp*"
                    value={field.value ? field.value : 0}
                  >
                    <MenuItem key={0} value={0}>
                      Chọn nhà cung cấp
                    </MenuItem>
                    {suppliers.map((sup) => (
                      <MenuItem key={sup.id} value={sup.id}>
                        {sup.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              <FormHelperText>
                {errors.supplierId?.message as string}
              </FormHelperText>
            </FormControl>
          </Box>

          {/* Giá và đơn vị */}
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
                    value={field.value ? field.value : ""}
                  >
                    <MenuItem key={0} value={""}>
                      Chọn đơn vị
                    </MenuItem>
                    {units.map((u) => (
                      <MenuItem key={u} value={u}>
                        {u}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              <FormHelperText>{errors.unit?.message as string}</FormHelperText>
            </FormControl>
          </Box>

          {/* Trạng thái */}
          <Box className="bg-gray-50 p-4 rounded-lg">
            <Typography
              variant="subtitle1"
              className="mb-3 font-medium flex items-center gap-2 text-gray-900"
            >
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              Trạng thái mặc định
            </Typography>

            <Controller
              name="status"
              control={control}
              defaultValue={1} // 1: active
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
              <Plus className="w-4 h-4" />
            )
          }
          variant="contained"
          color="success"
          disabled={isSubmitting || loading}
        >
          {isSubmitting ? "Đang tạo..." : "Tạo sản phẩm"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProductModal;
