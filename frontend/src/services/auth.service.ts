import instance from "../config/axios.config";
import type { ApiResponse } from "../types/api.type";
import type { LoginResquest } from "../types/auth/auth.request";
import type { LoginResponse } from "../types/auth/auth.response";
const loginService = async (
  data: LoginResquest
): Promise<ApiResponse<LoginResponse>> => {
  const URL_API = "/auth/login";
  const res = await instance.post(URL_API, data);
  
  return res.data;
};
const logoutService = () => {
  sessionStorage.removeItem("access_token");
};

export { loginService, logoutService };
