using blazor_web.Models;

public static class ProductMapper
{
    public static Product ToModel(ProductResponse res)
    {
        if (res == null) throw new ArgumentNullException(nameof(res));

        return new Product
        {
            ProductId = res.ProductId,
            ProductName = res.ProductName,
            Barcode = res.Barcode,
            Price = res.Price,                   // decimal OK
            Unit = res.Unit,
            CategoryId = res.CategoryId,
            SupplierId = res.SupplierId,
            Status = res.Status == ProductStatus.Active ? 1 : 0,
            CreatedAt = res.CreatedAt,
            UpdatedAt = res.UpdatedAt
        };
    }
}
