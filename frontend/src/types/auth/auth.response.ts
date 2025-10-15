// types/auth/response.ts

export interface User {
  id: string;
  username: string;
  fullName: string;
  role: number
}
export interface LoginResponse {
  success: boolean;
  message: string;
  user?: User;
  access_token: string;
  refresh_token: string;
  // các field khác nếu có
}
