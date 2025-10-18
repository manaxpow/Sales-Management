import { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Alert,
  CircularProgress,
  IconButton,
  FormControl,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import {
  ArrowLeft,
  CalendarDays,
  CalendarX,
  DollarSign,
  FileText,
  Hash,
  Percent,
  Tag,
} from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import {
  createPromotionSchema,
  type CreatePromotionType,
} from "../../../../common/helpers/promotion.validate";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

const CreatePromotionForm = () => {
  // Form state
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createPromotionSchema),
    mode: "onBlur",
  });

  const [submitError, setSubmitError] = useState<string>("");
  const [isLoading, setLoading] = useState(false);
  const onSubmit = async (data: CreatePromotionType) => {
    setLoading(true);
    console.log(data);
    reset();
    setLoading(false);
  };
  // function for debug
  const onError = (errors: unknown) => {
    console.log("Validation errors:", errors);
  };
  const navigate = useNavigate();

  return (
    <Box className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card
        className="w-full max-w-md shadow-lg"
        sx={{
          borderRadius: 2,
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
        }}
      >
        <CardContent className="p-8">
          {/* Header */}
          <Box className="mb-6">
            <Box className="flex items-center gap-3 mb-4">
              <IconButton
                onClick={() => navigate(-1)}
                className="text-gray-500 hover:text-gray-700"
                size="small"
              >
                <ArrowLeft className="w-5 h-5" />
              </IconButton>

              <Typography
                variant="h4"
                component="h1"
                className="text-2xl font-bold text-gray-900 text-center flex-1"
              >
                Create New Promotion
              </Typography>
            </Box>
            <Typography
              variant="body2"
              color="text.secondary"
              className="text-center"
            >
              Fill in the information below to create a new Promotion
            </Typography>
          </Box>

          {/* General Error Alert */}
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
            onSubmit={handleSubmit(onSubmit, onError)}
            className="flex flex-col gap-4"
          >
            <Box className="flex flex-col gap-3 pt-4">
              {/* promotion code  */}
              <FormControl>
                <TextField
                  label="Code promotion"
                  variant="outlined"
                  fullWidth
                  required
                  size="medium"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Tag size={18} className="text-gray-400" />
                      </InputAdornment>
                    ),
                  }}
                  className="[&_.MuiOutlinedInput-root]:rounded-xl [&_.MuiOutlinedInput-root]:bg-white [&_.MuiOutlinedInput-root]:shadow-sm"
                  {...register("code")}
                />
                <Typography variant="body2" className="text-red-500">
                  {errors.code?.message}
                </Typography>
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
              <Controller
                name="discountType"
                control={control}
                defaultValue="" // giá trị ban đầu (tránh undefined)
                render={({ field }) => (
                  <FormControl fullWidth required>
                    <InputLabel id="discount_type">Discount type</InputLabel>

                    <Select
                      {...field}
                      labelId="discount_type"
                      label="Discount type"
                      className="[&_.MuiOutlinedInput-root]:rounded-xl [&_.MuiOutlinedInput-root]:bg-white [&_.MuiOutlinedInput-root]:shadow-sm"
                      startAdornment={
                        <InputAdornment position="start">
                          <Percent size={18} className="text-gray-400 " />
                        </InputAdornment>
                      }
                    >
                      {/* <MenuItem value="">
                        <em>None</em>
                      </MenuItem> */}
                      <MenuItem value="percent">Percent</MenuItem>
                      <MenuItem value="fixed">Fixed</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
              <Typography variant="body2" className="text-red-500">
                {errors.discountType?.message}
              </Typography>
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
                  backgroundColor: "#3b82f6",
                  "&:hover": {
                    backgroundColor: "#2563eb",
                  },
                  "&.Mui-disabled": {
                    backgroundColor: "#9ca3af",
                  },
                }}
              >
                {isLoading ? (
                  <Box className="flex items-center justify-center gap-2">
                    <CircularProgress size={20} className="text-white" />
                    <span>Creating Promotion...</span>
                  </Box>
                ) : (
                  "Create Promotion"
                )}
              </Button>

              {/* Cancel Button */}
              <Button
                fullWidth
                variant="outlined"
                disabled={isLoading}
                size="large"
                onClick={() => navigate("/admin/promotions")}
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
                Cancel
              </Button>
            </Box>
          </Box>

          {/* Form Requirements */}
          <Box className="mt-6 p-4 bg-blue-50 rounded-lg">
            <Typography
              variant="caption"
              color="text.secondary"
              className="block mb-2"
            >
              <strong>Requirements:</strong>
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              className="block"
            >
              • Code: 5+ characters and max 20 characters letters, numbers,
              dots, underscores only
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              className="block"
            >
              • Description: max 200 characters
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              className="block"
            >
              • Discount value: Value must be non-negative
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              className="block"
            >
              • Usage limit: Value must be non-negative. Usage limit equal 0 to
              set non limit
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              className="block"
            >
              • Min order amount: Value must be non-negative. Min order amount
              equal 0 to set non limit
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
              className="block"
            >
              • EndDate must be greater than StartDate
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CreatePromotionForm;
