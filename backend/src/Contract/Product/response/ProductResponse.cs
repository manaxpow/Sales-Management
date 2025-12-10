
using System.Text.Json.Serialization;

public class ProductResponse
{
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string Barcode { get; set; } = string.Empty;
    public int Status { get; set; } 
    public string? SupplierName { get; set; } = string.Empty;
    public int SupplierId { get; set; }
    public int CategoryId { get; set; }
    public string? CategoryName { get; set; } = string.Empty;

    [JsonConverter(typeof(JsonRoundedDecimalConverter))]

    public decimal Price { get; set; }
    public string Unit { get; set; } = string.Empty;
    public int? Quantity { get; set; }
    public string ImageProduct {get;set;} = string.Empty;
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