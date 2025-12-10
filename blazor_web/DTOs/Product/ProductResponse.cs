public class ProductResponse
{
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public ProductStatus Status { get; set; }
    public string Barcode { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string Unit { get; set; } = Units.Cái.ToString();
    public string CategoryName { get; set; } = string.Empty;
    public string SupplierName { get; set; } = string.Empty;
    public int CategoryId { get; set; }
    public int SupplierId { get; set; }
    public int Quantity { get; set; }
    public string ImageProduct { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class GetProductResponse
{
    public List<ProductResponse> Products { get; set; } = new List<ProductResponse>();
    public int TotalProduct { get; set; }
    public int TotalPage { get; set; }
    public int CurrentPage { get; set; }
}

public enum ProductStatus
{
    Active = 1,
    Inactive = 2,
    Deleted = 3
}

public enum Units
{
    Chiếc,
    Cặp,
    Bộ,
    Cái,
    Hộp,
    Gói,
}