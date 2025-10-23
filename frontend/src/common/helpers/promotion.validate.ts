import z from "zod";
export const createPromotionSchema = z.object({
  code: z
    .string()
    .nonempty("Promotion code is not empty")
    .min(5, "Promotion code must have 5 character")
    .max(20, "Promotion code too long")
    .regex(
      /^[A-Z0-9._]+$/,
      "Code must contain only uppercase letters, numbers, dots, or underscores"
    )
    .trim(),
  description: z.string().max(200, "Description too long").optional(),
  discountType: z.string().nonempty("discount type not empty"),
  discountValue: z.coerce.number().nonnegative("Value must be non-negative"),
  minOrderAmount: z.coerce.number().nonnegative("Value must be non-negative"),
  usageLimit: z.coerce.number().nonnegative("Value must be non-negative"),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
});
export const updatePromotionSchema = createPromotionSchema
  .omit({ code: true, discountType: true })
  .extend({
    promotionId: z.number().int().positive("Invalid promotion ID"),
  });
export type CreatePromotionType = z.infer<typeof createPromotionSchema>;
export type UpdatePromotionSchema = z.infer<typeof updatePromotionSchema>;
