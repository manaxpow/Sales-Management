import z from "zod";
export const loginSchema = z.object({
  username: z
    .string()
    .nonempty("Tên đăng nhập không được để trống")
    .min(5, "Tên đăng nhập phải từ 5 ký tự")
    // .email("Email không hợp lệ")
    .trim(),
  password: z
    .string()
    .nonempty("Mật khẩu không được để trống")
    .min(6, "Mật khẩu phải từ 6 ký tự"),
  remember: z.boolean().optional(),
});
export type LoginSchemaType = z.infer<typeof loginSchema>;
