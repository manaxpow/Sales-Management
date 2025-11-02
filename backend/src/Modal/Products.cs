using System.ComponentModel.DataAnnotations;

public class Products
{
    public Products() { }
    [Key]
    public int ProductId { get; set; }
    public int CategoryId { get; set; }
    public int Supplierid { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string Barcode { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string Unit { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}