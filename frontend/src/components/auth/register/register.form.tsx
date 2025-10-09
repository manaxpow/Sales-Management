import { useState } from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Eye, EyeOff, User, Mail, Phone, Lock, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl rounded-3xl border border-blue-100/50">
        <CardContent className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <User className="text-blue-600" size={28} />
            </div>
            <Typography
              variant="h4"
              className="font-bold text-blue-600 mb-2"
            >
              Đăng ký tài khoản
            </Typography>
            <Typography
              variant="body2"
              className="text-gray-500"
            >
              Tạo tài khoản để bắt đầu trải nghiệm
            </Typography>
          </div>

          <form className="flex flex-col gap-3">
            {/* Họ và tên */}
            <TextField
              label="Họ và tên"
              variant="outlined"
              fullWidth
              required
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <User size={18} className="text-gray-400" />
                  </InputAdornment>
                ),
              }}
              className="[&_.MuiOutlinedInput-root]:rounded-xl [&_.MuiOutlinedInput-root]:bg-white [&_.MuiOutlinedInput-root]:shadow-sm"
            />

            {/* Email */}
            <TextField
              label="Email"
              variant="outlined"
              type="email"
              fullWidth
              required
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Mail size={18} className="text-gray-400" />
                  </InputAdornment>
                ),
              }}
              className="[&_.MuiOutlinedInput-root]:rounded-xl [&_.MuiOutlinedInput-root]:bg-white [&_.MuiOutlinedInput-root]:shadow-sm"
            />

            {/* Số điện thoại */}
            <TextField
              label="Số điện thoại"
              variant="outlined"
              type="tel"
              fullWidth
              required
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone size={18} className="text-gray-400" />
                  </InputAdornment>
                ),
              }}
              className="[&_.MuiOutlinedInput-root]:rounded-xl [&_.MuiOutlinedInput-root]:bg-white [&_.MuiOutlinedInput-root]:shadow-sm"
            />

            {/* Tên đăng nhập */}
            <TextField
              label="Tên đăng nhập"
              variant="outlined"
              fullWidth
              required
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <User size={18} className="text-gray-400" />
                  </InputAdornment>
                ),
              }}
              className="[&_.MuiOutlinedInput-root]:rounded-xl [&_.MuiOutlinedInput-root]:bg-white [&_.MuiOutlinedInput-root]:shadow-sm"
            />

            {/* Password */}
            <TextField
              label="Mật khẩu"
              variant="outlined"
              type={showPassword ? "text" : "password"}
              fullWidth
              required
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock size={18} className="text-gray-400" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                      className="!p-1"
                    >
                      {showPassword ? (
                        <EyeOff size={18} className="text-gray-500" />
                      ) : (
                        <Eye size={18} className="text-gray-500" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              className="[&_.MuiOutlinedInput-root]:rounded-xl [&_.MuiOutlinedInput-root]:bg-white [&_.MuiOutlinedInput-root]:shadow-sm"
            />

            {/* Confirm Password */}
            <TextField
              label="Xác nhận mật khẩu"
              variant="outlined"
              type={showConfirm ? "text" : "password"}
              fullWidth
              required
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock size={18} className="text-gray-400" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirm(!showConfirm)}
                      edge="end"
                      size="small"
                      className="!p-1"
                    >
                      {showConfirm ? (
                        <EyeOff size={18} className="text-gray-500" />
                      ) : (
                        <Eye size={18} className="text-gray-500" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              className="[&_.MuiOutlinedInput-root]:rounded-xl [&_.MuiOutlinedInput-root]:bg-white [&_.MuiOutlinedInput-root]:shadow-sm"
            />

            {/* Địa chỉ */}
            <TextField
              label="Địa chỉ"
              variant="outlined"
              fullWidth
              multiline
              rows={2}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" className="!items-start !mt-2">
                    <MapPin size={18} className="text-gray-400" />
                  </InputAdornment>
                ),
              }}
              className="[&_.MuiOutlinedInput-root]:rounded-xl [&_.MuiOutlinedInput-root]:bg-white [&_.MuiOutlinedInput-root]:shadow-sm"
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              className="mt-2 !bg-gradient-to-r !from-blue-600 !to-blue-700 hover:!from-blue-700 hover:!to-blue-800 !text-white !py-2.5 !text-sm !font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
            >
              Đăng ký
            </Button>

            {/* Footer */}
            <Typography
              variant="body2"
              className="text-center mt-4 text-gray-600"
            >
              Đã có tài khoản?{" "}
              <Link
                to="/auth/login" 
                className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200"
              >
                Đăng nhập
              </Link>
            </Typography>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterForm;