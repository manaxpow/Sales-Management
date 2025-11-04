import z from "zod";
export const createProductSchema = z.object({
  productName: z
    .string()
    .nonempty("Product name is not empty")
    .min(6, "Product code must have 6 character")
    .max(100, "Product code too long")
    .trim(),

  categoryId: z
    .number()
    .nonnegative("Category is invalid value ")
    .min(1, "Category is require"),
  supplierId: z
    .number()
    .nonnegative("Supplier is invalid value ")
    .min(1, "Supplier is require"),
  status: z.number().nonnegative("Status is invalid value "),
  unit: z.string("Unit is require").nonempty("Unit is require"),
  price: z.number("Price is require").nonnegative("Price is invalid value"),
});

export const updateProductSchema = createProductSchema.extend({
  status: z.number(),
});

export type CreateProductType = z.infer<typeof createProductSchema>;
export type UpdateProductType = z.infer<typeof updateProductSchema>;
