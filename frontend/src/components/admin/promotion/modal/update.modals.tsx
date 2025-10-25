import { useEffect, useState } from "react";
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
  InputAdornment,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  ActivitySquareIcon,
  CalendarDays,
  CalendarX,
  DollarSign,
  Edit,
  FileText,
  Hash,
  Percent,
  Tag,
  X,
} from "lucide-react";
import type {
  Promotion,
  PromotionUpdateFormData,
} from "../../../../types/promotion.type";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updatePromotionSchema,
  type UpdatePromotionSchema,
} from "../../../../common/helpers/promotion.validate";
import { UpdatePromotionService } from "../../../../services/promotion.service";
import { toast } from "react-toastify";
import { status } from "../../../../common/constants/index.constant";

interface EditPromotionModalProps {
  Promotion: Promotion | null;
  open: boolean;
  onClose: () => void;
  onSave: (data: Promotion) => void;
}

export const EditPromotionModal = ({
  Promotion,
  open,
  onClose,
  onSave,
}: EditPromotionModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(updatePromotionSchema),
    mode: "onBlur",
  });
  useEffect(() => {
    if (Promotion) {
      reset({
        description: Promotion.description,
        discountValue: Promotion.discountValue,
        endDate: Promotion.endDate?.toString().split("T")[0],
        minOrderAmount: Promotion.minOrderAmount,
        startDate: Promotion.startDate?.toString().split("T")[0],
        usageLimit: Promotion.usagelimit,
        status: Promotion.status,
      });
    }
  }, [Promotion, reset]);
  const [isLoading, setLoading] = useState(false);
  const onSubmit = async (data: UpdatePromotionSchema) => {
    setLoading(true);
    try {
      setLoading(true);
      const fixedData = {
        PromotionId: Promotion?.promotionId || 0,
        Description: data.description || "",
        DiscountValue: data.discountValue,
        MinOrderAmount: data.minOrderAmount,
        Usagelimit: data.usageLimit,
        StartDate: data.startDate
          .toISOString()
          .split("T")[0]
          .replaceAll("-", "/"),
        EndDate: data.endDate.toISOString().split("T")[0].replaceAll("-", "/"),
        Status: data.status,
      };
      const result = await UpdatePromotionService(
        fixedData as PromotionUpdateFormData
      );
      console.log(result.data);
      if (!result.success) {
        let errorMessage = "Unknown error";
        if (Array.isArray(result.data) && result.data[0]?.message) {
          errorMessage = result.data[0].message;
        } else if (
          result.data &&
          typeof result.data === "object" &&
          "message" in result.data
        ) {
          errorMessage =
            (result.data as { message?: string }).message || errorMessage;
        }
        toast.error("Promotion created fail with error: " + errorMessage);
      } else {
        if (result.data) onSave(result.data);
        toast.success("Promotion created successfully");
        reset();
        onClose();
      }
    } catch (error) {
      toast.error("create promotion failed with error " + error);
    } finally {
      setLoading(false);
    }
  };
  // function for debug
  const onError = (errors: unknown) => {
    console.log("Validation errors:", errors);
  };
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle className="flex items-center justify-between">
        <Typography
          variant="h6"
          component="div"
          className="flex items-center gap-2"
        >
          <Edit className="w-5 h-5" />
          Edit Promotion
        </Typography>
        <IconButton onClick={onClose} size="small">
          <X className="w-4 h-4" />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box className="flex flex-col gap-4" component="form">
          <Box className="flex flex-col gap-3 pt-4">
            {/* promotion code  */}
            <FormControl>
              <TextField
                label="Code promotion"
                disabled
                variant="outlined"
                fullWidth
                defaultValue={Promotion?.promotionCode}
                size="medium"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Tag size={18} className="text-gray-400" />
                    </InputAdornment>
                  ),
                }}
                className="[&_.MuiOutlinedInput-root]:rounded-xl [&_.MuiOutlinedInput-root]:bg-white [&_.MuiOutlinedInput-root]:shadow-sm"
              />
            </FormControl>

            {/* description */}
            <FormControl>
              <TextField
                label="Description"
                variant="outlined"
                fullWidth
                size="medium"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FileText size={18} className="text-gray-400" />
                    </InputAdornment>
                  ),
                }}
                className="[&_.MuiOutlinedInput-root]:rounded-xl [&_.MuiOutlinedInput-root]:bg-white [&_.MuiOutlinedInput-root]:shadow-sm"
                {...register("description")}
              />
              <Typography variant="body2" className="text-red-500">
                {errors.description?.message}
              </Typography>
            </FormControl>

            {/* discount type */}

            <FormControl fullWidth required>
              <InputLabel id="discount_type">Discount type</InputLabel>

              <Select
                value={Promotion?.discountType == 1 ? "percent" : "fixed"}
                disabled
                labelId="discount_type"
                label="Discount type"
                className="[&_.MuiOutlinedInput-root]:rounded-xl [&_.MuiOutlinedInput-root]:bg-white [&_.MuiOutlinedInput-root]:shadow-sm"
                startAdornment={
                  <InputAdornment position="start">
                    <Percent size={18} className="text-gray-400 " />
                  </InputAdornment>
                }
              >
                <MenuItem value="percent">Percent</MenuItem>
                <MenuItem value="fixed">Fixed</MenuItem>
              </Select>
            </FormControl>

            {/* discount value */}
            <FormControl>
              <TextField
                label="Discount value"
                type="number"
                variant="outlined"
                fullWidth
                required
                size="medium"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DollarSign size={18} className="text-gray-400" />
                    </InputAdornment>
                  ),
                }}
                inputProps={{ min: 0 }}
                className="[&_.MuiOutlinedInput-root]:rounded-xl [&_.MuiOutlinedInput-root]:bg-white [&_.MuiOutlinedInput-root]:shadow-sm"
                {...register("discountValue")}
              />
              <Typography variant="body2" className="text-red-500">
                {errors.discountValue?.message}
              </Typography>
            </FormControl>

            {/* usage limit */}
            <FormControl>
              <TextField
                label="Usage limit"
                variant="outlined"
                fullWidth
                required
                type="number"
                size="medium"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Hash size={18} className="text-gray-400" />
                    </InputAdornment>
                  ),
                }}
                inputProps={{ min: 0 }}
                className="[&_.MuiOutlinedInput-root]:rounded-xl [&_.MuiOutlinedInput-root]:bg-white [&_.MuiOutlinedInput-root]:shadow-sm"
                {...register("usageLimit")}
              />
              <Typography variant="body2" className="text-red-500">
                {errors.usageLimit?.message}
              </Typography>
            </FormControl>
            {/* min order amount  */}
            <FormControl>
              <TextField
                label="Min order amount"
                variant="outlined"
                fullWidth
                required
                type="number"
                size="medium"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarDays size={18} className="text-gray-400" />
                    </InputAdornment>
                  ),
                }}
                inputProps={{ min: 0 }}
                className="[&_.MuiOutlinedInput-root]:rounded-xl [&_.MuiOutlinedInput-root]:bg-white [&_.MuiOutlinedInput-root]:shadow-sm"
                {...register("minOrderAmount")}
              />
              <Typography variant="body2" className="text-red-500">
                {errors.usageLimit?.message}
              </Typography>
            </FormControl>
            {/* start date */}
            <FormControl>
              <TextField
                label="Start date"
                variant="outlined"
                fullWidth
                required
                type="date"
                size="medium"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarDays size={18} className="text-gray-400" />
                    </InputAdornment>
                  ),
                }}
                className="[&_.MuiOutlinedInput-root]:rounded-xl [&_.MuiOutlinedInput-root]:bg-white [&_.MuiOutlinedInput-root]:shadow-sm"
                {...register("startDate")}
              />
              <Typography variant="body2" className="text-red-500">
                {errors.startDate?.message}
              </Typography>
            </FormControl>
            {/* end date */}
            <FormControl>
              <TextField
                label="End date"
                variant="outlined"
                fullWidth
                required
                type="date"
                size="medium"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarX size={18} className="text-gray-400" />
                    </InputAdornment>
                  ),
                }}
                className="[&_.MuiOutlinedInput-root]:rounded-xl [&_.MuiOutlinedInput-root]:bg-white [&_.MuiOutlinedInput-root]:shadow-sm"
                {...register("endDate")}
              />
              <Typography variant="body2" className="text-red-500">
                {errors.endDate?.message}
              </Typography>
            </FormControl>

            {/* status */}
            <Controller
              name="status"
              control={control}
              // giá trị ban đầu (tránh undefined
              render={({ field }) => (
                <FormControl fullWidth required>
                  <InputLabel id="status">Status</InputLabel>
                  <Select
                    {...field}
                    labelId="status"
                    label="Status"
                    className="[&_.MuiOutlinedInput-root]:rounded-xl [&_.MuiOutlinedInput-root]:bg-white [&_.MuiOutlinedInput-root]:shadow-sm"
                    startAdornment={
                      <InputAdornment position="start">
                        <ActivitySquareIcon
                          size={18}
                          className="text-gray-400 "
                        />
                      </InputAdornment>
                    }
                  >
                    <MenuItem value={status.active}>Active</MenuItem>
                    <MenuItem value={status.inactive}>UnActive</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
          </Box>
          <Box className="bg-gray-50 p-3 rounded-md">
            <Typography variant="caption" color="text.secondary">
              Note: Only name and description can be edited. Other fields are
              managed by the system.
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          type="submit"
          onClick={handleSubmit(onSubmit, onError)}
          disabled={isLoading}
          variant="contained"
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};
