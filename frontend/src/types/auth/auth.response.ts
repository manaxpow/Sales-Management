// types/auth/response.ts

export interface User {
  id: number;
  username: string;
  fullName: string;
  role: number;
}
export interface LoginResponse {
  user?: User;
  accessToken: string;
}
